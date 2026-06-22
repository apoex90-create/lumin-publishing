import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (book.authorId !== me.id) return NextResponse.json({ error: 'Not your book' }, { status: 403 });

  if (book.status !== 'DRAFT') {
    return NextResponse.json({ error: 'Book is already submitted' }, { status: 400 });
  }
  if (!book.manuscriptUrl) {
    return NextResponse.json({ error: 'Please upload your manuscript before submitting' }, { status: 400 });
  }
  if (!book.title || !book.description) {
    return NextResponse.json({ error: 'Please complete title and description before submitting' }, { status: 400 });
  }

  const paidOrder = await prisma.paymentOrder.findFirst({
    where: { bookId: id, userId: me.id, status: 'PAID' },
  });
  if (!paidOrder) {
    return NextResponse.json({ error: 'Payment required before submission. Please complete payment first.' }, { status: 402 });
  }

  try {
    await prisma.book.update({
      where: { id },
      data: { status: 'SUBMITTED' },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
