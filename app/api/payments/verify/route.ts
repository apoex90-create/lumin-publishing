import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookId,
    } = await req.json();

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 });
    }

    // Verify the signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update book status to SUBMITTED
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.authorId !== me.id) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    await prisma.book.update({
      where: { id: bookId },
      data: { status: 'SUBMITTED' },
    });

    // Record transaction
    await prisma.transaction.create({
      data: {
        userId: me.id,
        type: 'plan_payment',
        amount: book.priceINR || 0,
        currency: 'INR',
        status: 'completed',
        reference: razorpay_payment_id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Payment verify error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
