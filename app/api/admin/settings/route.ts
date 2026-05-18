import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { setSettings, getSettings } from '@/lib/settings';

export async function GET() {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  // Get all settings (caller can request specific keys via query string)
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  try {
    const body = await req.json();
    // body is { key: value, key: value, ... }
    await setSettings(body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Settings save error:', err);
    return NextResponse.json({ error: err.message || 'Failed to save' }, { status: 500 });
  }
}
