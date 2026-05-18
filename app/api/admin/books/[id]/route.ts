import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access only' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const updated = await prisma.book.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.status === 'PUBLISHED' && { publishedAt: new Date() }),
      },
    });
    return NextResponse.json({ book: updated });
  } catch (err) {
    console.error('Update book error:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access only' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
