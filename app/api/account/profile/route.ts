import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().min(2).max(100),
  bio: z.string().max(2000).optional().nullable(),
  phone: z.string().min(7).max(20),
  country: z.string().max(10).optional().nullable(),
  avatarUrl: z.string().url().optional().or(z.literal('')).nullable(),
});

export async function PATCH(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const updated = await prisma.user.update({
      where: { id: me.id },
      data: {
        fullName: data.fullName,
        bio: data.bio || null,
        phone: data.phone,
        country: data.country || 'IN',
        avatarUrl: data.avatarUrl || null,
        // If phone changed, mark as unverified
        phoneVerified: me.phone === data.phone ? me.phoneVerified : false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
