import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, clearSessionCookie } from '@/lib/auth';

export async function DELETE() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  if (me.role === 'ADMIN') {
    return NextResponse.json({ error: 'Admin accounts cannot be deleted from this UI. Contact support.' }, { status: 403 });
  }

  try {
    await prisma.user.delete({ where: { id: me.id } });
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
