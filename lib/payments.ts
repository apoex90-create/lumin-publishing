import { prisma } from '@/lib/db';
import { PLANS } from '@/lib/plans';
import type { PlanTier } from '@prisma/client';

// Server-only: derives the publishing fee for a book's plan tier from the
// admin-editable Plan table, falling back to the static defaults in
// lib/plans.ts. Never trust a client-supplied amount for payments.
export async function getPlanPriceForBook(planTier: PlanTier): Promise<{ priceINR: number; priceUSD: number }> {
  const dbPlan = await prisma.plan.findUnique({ where: { tier: planTier } });
  if (dbPlan) return { priceINR: dbPlan.priceINR, priceUSD: dbPlan.priceUSD };

  const staticPlan = PLANS.find((p) => p.id === planTier) ?? PLANS[0];
  return { priceINR: staticPlan.priceINR, priceUSD: staticPlan.priceUSD };
}

export function isBookReadyForSubmission(book: { manuscriptUrl: string | null; title: string; description: string }): boolean {
  return Boolean(book.manuscriptUrl && book.title && book.description);
}
