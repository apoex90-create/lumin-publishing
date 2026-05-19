import { prisma } from '@/lib/db';
import { PLANS } from '@/lib/plans';
import PricingPreviewClient from './PricingPreviewClient';

export default async function PricingPreview() {
  const dbPlans = await prisma.plan.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  // Use DB plans if available, else fall back to code defaults
  const plans = dbPlans.length > 0
    ? dbPlans.map(p => ({
        id: p.tier as 'STARTER' | 'PROFESSIONAL' | 'BESTSELLER',
        name: p.name,
        tagline: p.tagline,
        priceINR: p.priceINR,
        priceUSD: p.priceUSD,
        royaltyPercent: 0,
        popular: p.isPopular,
        features: (() => { try { return JSON.parse(p.features); } catch { return []; } })() as string[],
      }))
    : PLANS;

  return <PricingPreviewClient plans={plans} />;
}
