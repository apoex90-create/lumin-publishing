import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Map URL resource name to Prisma model
const MODEL_MAP: Record<string, any> = {
  testimonials: 'testimonial',
  team: 'teamMember',
  faqs: 'faq',
  footer: 'footerLink',
  social: 'socialLink',
  plans: 'plan',
  services: 'service',
  steps: 'howItWorksStep',
};

function getModel(resource: string) {
  const modelName = MODEL_MAP[resource];
  if (!modelName) return null;
  return (prisma as any)[modelName];
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { resource } = await params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  const items = await model.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { resource } = await params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  try {
    const body = await req.json();
    const cleaned = cleanPayload(resource, body);
    const item = await model.create({ data: cleaned });
    return NextResponse.json({ item });
  } catch (err: any) {
    console.error(`Create ${resource} error:`, err);
    return NextResponse.json({ error: err.message || 'Failed to create' }, { status: 400 });
  }
}

// Convert form data into proper types for each resource
function cleanPayload(resource: string, data: any): any {
  const cleaned: any = { ...data };

  // Remove fields managed by Prisma
  delete cleaned.id;
  delete cleaned.createdAt;
  delete cleaned.updatedAt;

  // Convert numbers
  if ('sortOrder' in cleaned && cleaned.sortOrder !== null) cleaned.sortOrder = Number(cleaned.sortOrder) || 0;
  if ('rating' in cleaned && cleaned.rating !== null) cleaned.rating = Number(cleaned.rating) || 5;
  if ('stepNumber' in cleaned && cleaned.stepNumber !== null) cleaned.stepNumber = Number(cleaned.stepNumber);
  if ('priceINR' in cleaned && cleaned.priceINR !== null) cleaned.priceINR = parseFloat(cleaned.priceINR);
  if ('priceUSD' in cleaned && cleaned.priceUSD !== null) cleaned.priceUSD = parseFloat(cleaned.priceUSD);
  if ('royaltyPercent' in cleaned && cleaned.royaltyPercent !== null) cleaned.royaltyPercent = Number(cleaned.royaltyPercent);

  // Convert plain text "features" or "options" lists into JSON-serialized arrays for plans/services
  if ((resource === 'plans' || resource === 'services') && typeof cleaned.features === 'string') {
    const arr = cleaned.features.split('\n').map((s: string) => s.trim()).filter(Boolean);
    cleaned.features = JSON.stringify(arr);
  }

  // Default booleans
  if ('isPublished' in cleaned) cleaned.isPublished = !!cleaned.isPublished;
  if ('isFeatured' in cleaned) cleaned.isFeatured = !!cleaned.isFeatured;
  if ('isPopular' in cleaned) cleaned.isPopular = !!cleaned.isPopular;
  if ('isExternal' in cleaned) cleaned.isExternal = !!cleaned.isExternal;

  // Convert empty strings to null for optional fields
  for (const k of Object.keys(cleaned)) {
    if (cleaned[k] === '') cleaned[k] = null;
  }

  return cleaned;
}
