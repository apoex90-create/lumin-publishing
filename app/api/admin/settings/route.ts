import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { setSettings } from '@/lib/settings';

// Allowed setting key prefixes — prevents arbitrary key injection
const ALLOWED_SETTING_PREFIXES = [
  'brand.', 'hero.', 'stats.', 'seo.', 'contact.', 'about.',
  'show.', 'currency.', 'footer.', 'social.',
];

function isAllowedSettingKey(key: string): boolean {
  return ALLOWED_SETTING_PREFIXES.some((prefix) => key.startsWith(prefix));
}

export async function GET(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  try {
    const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
    return NextResponse.json({ settings });
  } catch (err: any) {
    console.error('Settings fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  try {
    const body = await req.json();
    if (typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Validate all keys are in the allowed set
    const invalidKeys = Object.keys(body).filter((k) => !isAllowedSettingKey(k));
    if (invalidKeys.length > 0) {
      return NextResponse.json({ error: `Unknown setting key(s): ${invalidKeys.join(', ')}` }, { status: 400 });
    }

    await setSettings(body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Settings save error:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
