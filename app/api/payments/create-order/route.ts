import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getPlanPriceForBook, isBookReadyForSubmission } from '@/lib/payments';

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { bookId, currency } = await req.json();
    const safeCurrency: 'INR' | 'USD' = currency === 'USD' ? 'USD' : 'INR';

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    if (book.authorId !== me.id) return NextResponse.json({ error: 'Not your book' }, { status: 403 });
    if (book.status !== 'DRAFT') {
      return NextResponse.json({ error: 'This book has already been submitted' }, { status: 400 });
    }
    if (!isBookReadyForSubmission(book)) {
      return NextResponse.json({ error: 'Please complete your manuscript, title and description before paying' }, { status: 400 });
    }

    // The amount is always derived server-side from the book's plan tier —
    // a client-supplied amount is never trusted here.
    const { priceINR, priceUSD } = await getPlanPriceForBook(book.planTier);
    const amount = safeCurrency === 'USD' ? priceUSD : priceINR;

    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKey || !razorpaySecret) {
      // Payment gateway not set up yet — return without creating an order.
      // No book/payment state is mutated; the frontend shows a "contact admin" message.
      return NextResponse.json({
        ok: true,
        razorpayOrderId: null,
        razorpayKey: null,
        amount,
        currency: safeCurrency,
        message: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel environment variables.',
      });
    }

    const auth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64');
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // paise / cents
        currency: safeCurrency,
        receipt: `book_${bookId}`,
        notes: { bookId, userId: me.id },
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      throw new Error('Failed to create order: ' + err);
    }

    const order = await orderRes.json();

    await prisma.paymentOrder.create({
      data: {
        bookId: book.id,
        userId: me.id,
        razorpayOrderId: order.id,
        amount,
        currency: safeCurrency,
        status: 'CREATED',
      },
    });

    return NextResponse.json({
      ok: true,
      razorpayOrderId: order.id,
      razorpayKey,
      amount,
      currency: safeCurrency,
    });
  } catch (err: any) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
