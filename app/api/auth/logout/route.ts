import { NextResponse } from 'next/server';
import { getCurrentUser, clearSessionCookie } from '@/lib/auth';

export async function POST() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ success: true }); // Already logged out
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
