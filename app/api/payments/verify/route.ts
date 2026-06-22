import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

function safeEqualHex(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 });
    }

    // Bind verification to the order we created server-side — never trust a
    // client-supplied bookId/amount. This also prevents replaying a valid
    // signature from one paid order against a different book.
    const order = await prisma.paymentOrder.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.userId !== me.id) return NextResponse.json({ error: 'Not your order' }, { status: 403 });
    if (order.status !== 'CREATED') {
      return NextResponse.json({ error: 'This order has already been processed' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (!safeEqualHex(expectedSignature, razorpay_signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const book = await prisma.book.findUnique({ where: { id: order.bookId } });
    if (!book || book.authorId !== me.id) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.paymentOrder.update({
        where: { id: order.id },
        data: { status: 'PAID', paidAt: new Date() },
      }),
      ...(book.status === 'DRAFT'
        ? [prisma.book.update({ where: { id: book.id }, data: { status: 'SUBMITTED' as const } })]
        : []),
      prisma.transaction.create({
        data: {
          userId: me.id,
          type: 'plan_payment',
          amount: order.amount,
          currency: order.currency,
          status: 'completed',
          reference: razorpay_payment_id,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Payment verify error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
