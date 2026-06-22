import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

// Per-resource Zod schemas for fields that carry enum/format constraints
const RESOURCE_SCHEMAS: Record<string, z.ZodTypeAny> = {
  plans: z.object({
    tier: z.enum(['STARTER', 'PROFESSIONAL', 'BESTSELLER']).optional(),
    priceINR: z.number().nonnegative().optional(),
    priceUSD: z.number().nonnegative().optional(),
    royaltyPercent: z.number().int().min(0).max(100).optional().nullable(),
    isPopular: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }).passthrough(),
  faqs: z.object({
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }).passthrough(),
  footer: z.object({
    section: z.enum(['Publish', 'Discover', 'Company', 'Legal']).optional(),
    isExternal: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }).passthrough(),
};

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

function cleanPayload(resource: string, data: any): any {
  const cleaned: any = { ...data };
  delete cleaned.id;
  delete cleaned.createdAt;
  delete cleaned.updatedAt;

  if ('sortOrder' in cleaned && cleaned.sortOrder !== null) cleaned.sortOrder = Number(cleaned.sortOrder) || 0;
  if ('rating' in cleaned && cleaned.rating !== null) cleaned.rating = Number(cleaned.rating) || 5;
  if ('stepNumber' in cleaned && cleaned.stepNumber !== null) cleaned.stepNumber = Number(cleaned.stepNumber);
  if ('priceINR' in cleaned && cleaned.priceINR !== null) cleaned.priceINR = parseFloat(cleaned.priceINR);
  if ('priceUSD' in cleaned && cleaned.priceUSD !== null) cleaned.priceUSD = parseFloat(cleaned.priceUSD);
  if ('royaltyPercent' in cleaned && cleaned.royaltyPercent !== null) cleaned.royaltyPercent = Number(cleaned.royaltyPercent);

  if ((resource === 'plans' || resource === 'services') && typeof cleaned.features === 'string') {
    const arr = cleaned.features.split('\n').map((s: string) => s.trim()).filter(Boolean);
    cleaned.features = JSON.stringify(arr);
  }

  if ('isPublished' in cleaned) cleaned.isPublished = !!cleaned.isPublished;
  if ('isFeatured' in cleaned) cleaned.isFeatured = !!cleaned.isFeatured;
  if ('isPopular' in cleaned) cleaned.isPopular = !!cleaned.isPopular;
  if ('isExternal' in cleaned) cleaned.isExternal = !!cleaned.isExternal;

  for (const k of Object.keys(cleaned)) {
    if (cleaned[k] === '') cleaned[k] = null;
  }
  return cleaned;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { resource, id } = await params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  try {
    const body = await req.json();

    // Validate against resource schema if one exists
    const schema = RESOURCE_SCHEMAS[resource];
    if (schema) {
      const result = schema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
      }
    }

    const item = await model.update({ where: { id }, data: cleanPayload(resource, body) });
    return NextResponse.json({ item });
  } catch (err: any) {
    console.error(`Update ${resource} error:`, err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const { resource, id } = await params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  try {
    await model.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`Delete ${resource} error:`, err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 400 });
  }
}
