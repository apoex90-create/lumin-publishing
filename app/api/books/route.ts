import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const books = await prisma.book.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ books });
}

const createBookSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  genre: z.string().min(1),
  language: z.string().default('English'),
  description: z.string().min(10),
  manuscriptUrl: z.string().optional().nullable(),
  planTier: z.enum(['STARTER', 'PROFESSIONAL', 'BESTSELLER']).default('STARTER'),
  // Note: priceINR/priceUSD are intentionally omitted — set server-side from the Plan.
  // Note: publisher is omitted — admin-only field set after book review.
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = createBookSchema.parse(body);

    const book = await prisma.book.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        genre: data.genre,
        language: data.language,
        description: data.description,
        manuscriptUrl: data.manuscriptUrl || null,
        planTier: data.planTier,
        authorId: user.id,
        status: 'DRAFT',
      },
    });

    return NextResponse.json({ book, bookId: book.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('Create book error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
