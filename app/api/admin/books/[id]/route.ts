import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  genre: z.string().optional(),
  language: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().nullable().optional(),
  isbn: z.string().regex(/^(\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits').nullable().optional(),
  pageCount: z.number().int().positive().nullable().optional(),
  priceINR: z.number().nonnegative().nullable().optional(),
  priceUSD: z.number().nonnegative().nullable().optional(),
  status: z.enum(['DRAFT','SUBMITTED','IN_REVIEW','IN_EDITING','COVER_DESIGN','FORMATTING','PUBLISHED','REJECTED']).optional(),
  planTier: z.enum(['STARTER','PROFESSIONAL','BESTSELLER']).optional(),
  publisher: z.string().nullable().optional(),
  publicationYear: z.number().int().nullable().optional(),
  coAuthors: z.string().nullable().optional(),
  editorName: z.string().nullable().optional(),
  editedManuscriptUrl: z.string().nullable().optional(),
  editorNotes: z.string().nullable().optional(),
  marketingCopy: z.string().nullable().optional(),
  socialPosts: z.string().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access only' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const data = updateBookSchema.parse(body);

    // If status changes to PUBLISHED, set publishedAt on first publish
    const extraFields: Record<string, unknown> = {};
    if (data.status === 'PUBLISHED') {
      const existing = await prisma.book.findUnique({ where: { id }, select: { publishedAt: true } });
      if (existing && !existing.publishedAt) extraFields.publishedAt = new Date();
    }

    const updated = await prisma.book.update({ where: { id }, data: { ...data, ...extraFields } });
    return NextResponse.json({ book: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('Admin update book error:', err);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
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
    console.error('Admin delete book error:', err);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
