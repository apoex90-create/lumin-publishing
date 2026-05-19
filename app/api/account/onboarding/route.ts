import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  await prisma.user.update({
    where: { id: me.id },
    data: { onboardingCompleted: true },
  });

  return NextResponse.json({ ok: true });
}
