import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const createUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(['AUTHOR', 'ADMIN', 'READER']).default('AUTHOR'),
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access only' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createUserSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: await hashPassword(data.password),
        fullName: data.fullName,
        country: data.country || 'IN',
        bio: data.bio || null,
        role: data.role,
      },
    });

    return NextResponse.json({ user });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('Admin create user error:', err);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
