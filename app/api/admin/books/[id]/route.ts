import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// All editable book fields
const ALLOWED_FIELDS = [
  'title', 'subtitle', 'genre', 'language', 'description',
  'coverUrl', 'isbn', 'pageCount', 'priceINR', 'priceUSD',
  'status', 'planTier',
  'publisher', 'publicationYear', 'coAuthors', 'editorName',
  'editedManuscriptUrl', 'editorNotes', 'marketingCopy', 'socialPosts',
];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access only' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  // Build update data with only allowed fields, converting empty strings to null
  const data: any = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      let v = body[field];
      if (v === '' || v === undefined) v = null;
      data[field] = v;
    }
  }

  // If status changed to PUBLISHED, set publishedAt
  if (data.status === 'PUBLISHED') {
    const existing = await prisma.book.findUnique({ where: { id }, select: { publishedAt: true } });
    if (existing && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  try {
    const updated = await prisma.book.update({ where: { id }, data });
    return NextResponse.json({ book: updated });
  } catch (err: any) {
    console.error('Update book error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update' }, { status: 500 });
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 });
  }
}
