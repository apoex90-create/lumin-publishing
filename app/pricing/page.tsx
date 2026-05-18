import { prisma } from '@/lib/db';
import { PLANS } from '@/lib/plans';
import PricingClient from './PricingClient';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const [dbPlans, faqs] = await Promise.all([
    prisma.plan.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }).catch(() => []),
    prisma.faq.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }).catch(() => []),
  ]);

  const plans = dbPlans.length > 0
    ? dbPlans.map(p => ({
        id: p.tier as 'STARTER' | 'PROFESSIONAL' | 'BESTSELLER',
        name: p.name,
        tagline: p.tagline,
        priceINR: p.priceINR,
        priceUSD: p.priceUSD,
        royaltyPercent: p.royaltyPercent,
        popular: p.isPopular,
        features: (() => { try { return JSON.parse(p.features); } catch { return []; } })() as string[],
      }))
    : PLANS;

  return <PricingClient plans={plans} faqs={faqs.map(f => ({ q: f.question, a: f.answer }))} />;
}
