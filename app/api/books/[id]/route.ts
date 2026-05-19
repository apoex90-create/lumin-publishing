import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const AUTHOR_EDITABLE_FIELDS = [
  'title', 'subtitle', 'genre', 'language', 'description',
  'coverUrl', 'pageCount', 'priceINR', 'priceUSD',
  'publisher', 'publicationYear', 'coAuthors', 'editorName',
  'manuscriptUrl',
];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id }, select: { authorId: true, status: true } });
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (book.authorId !== me.id) return NextResponse.json({ error: 'Not your book' }, { status: 403 });

  // Authors can only edit DRAFT books
  if (book.status !== 'DRAFT') {
    return NextResponse.json({ error: 'Cannot edit a submitted book. Contact support.' }, { status: 400 });
  }

  const body = await req.json();
  const data: any = {};
  for (const field of AUTHOR_EDITABLE_FIELDS) {
    if (field in body) data[field] = body[field] === '' ? null : body[field];
  }

  try {
    const updated = await prisma.book.update({ where: { id }, data });
    return NextResponse.json({ book: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id }, select: { authorId: true, status: true } });
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (book.authorId !== me.id) return NextResponse.json({ error: 'Not your book' }, { status: 403 });

  // Only DRAFT books can be deleted by authors
  if (book.status !== 'DRAFT') {
    return NextResponse.json({ error: 'Cannot delete a submitted book. Contact support.' }, { status: 400 });
  }

  try {
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
