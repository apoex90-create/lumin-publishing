import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { bookId, amount, currency } = await req.json();

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    if (book.authorId !== me.id) return NextResponse.json({ error: 'Not your book' }, { status: 403 });

    // Check if Razorpay keys are configured
    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKey || !razorpaySecret) {
      // Payment gateway not set up yet — return without Razorpay order
      // The frontend will show a "contact admin" message
      return NextResponse.json({
        ok: true,
        razorpayOrderId: null,
        razorpayKey: null,
        message: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel environment variables.',
      });
    }

    // Create Razorpay order
    const auth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64');
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // paise
        currency: currency || 'INR',
        receipt: `book_${bookId}`,
        notes: { bookId, userId: me.id },
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      throw new Error('Failed to create order: ' + err);
    }

    const order = await orderRes.json();

    return NextResponse.json({
      ok: true,
      razorpayOrderId: order.id,
      razorpayKey: razorpayKey,
      amount,
      currency,
    });
  } catch (err: any) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
