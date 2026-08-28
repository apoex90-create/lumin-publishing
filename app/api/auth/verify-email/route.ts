import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({ token: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = schema.parse(body);

    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or already used verification link.' }, { status: 400 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: 'Email already verified.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('Email verify error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
