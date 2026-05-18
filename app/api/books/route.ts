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
  planTier: z.enum(['STARTER', 'PROFESSIONAL', 'BESTSELLER']).default('STARTER'),
  priceINR: z.number().optional(),
  priceUSD: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = createBookSchema.parse(body);

    const book = await prisma.book.create({
      data: {
        ...data,
        authorId: user.id,
        status: 'SUBMITTED',
      },
    });

    return NextResponse.json({ book });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('Create book error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
