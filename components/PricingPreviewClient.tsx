'use client';

import Link from 'next/link';
import { Check, ArrowRight, Crown } from 'lucide-react';
import type { Plan } from '@/lib/plans';
import { formatPrice } from '@/lib/plans';
import { useCurrency } from '@/lib/currency-context';
import SectionHeading from '@/components/ui/SectionHeading';

export default function PricingPreviewClient({ plans }: { plans: Plan[] }) {
  const { currency } = useCurrency();

  return (
    <section className="section-pad bg-royal-900 text-cream-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.04]" />
      <div className="floating-orb top-0 right-0 w-[500px] h-[500px] bg-gold-500/15" />
      <div className="floating-orb bottom-0 left-0 w-[500px] h-[500px] bg-royal-400/20" />

      <div className="container-lumin relative">
        <SectionHeading
          eyebrow="Publishing Plans"
          title={<>Choose your <em className="italic text-gold-gradient">path to print</em></>}
          description="Transparent pricing. No hidden fees. Authors keep the majority of royalties — always."
          light
        />

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-500 ${
                plan.popular
                  ? 'bg-gradient-to-br from-gold-500/10 to-gold-600/5 border-2 border-gold-500 scale-105 shadow-gold-glow'
                  : 'bg-cream-50/5 border border-cream-100/10 hover:border-gold-500/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-shimmer text-royal-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5">
                  <Crown className="w-3 h-3" /> MOST CHOSEN
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-3xl mb-2">{plan.name}</h3>
                <p className="text-cream-100/60 text-sm italic">{plan.tagline}</p>
              </div>

              <div className="mb-8 pb-8 border-b border-cream-100/10">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl text-gold-gradient">
                    {formatPrice(currency === 'INR' ? plan.priceINR : plan.priceUSD, currency)}
                  </span>
                </div>
                <p className="text-xs text-cream-100/50 mt-2 tracking-wider uppercase">
                  One-time • {plan.royaltyPercent}% royalty
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-cream-100/80">
                    <Check className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`block text-center py-3 rounded-full font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gold-shimmer text-royal-900 hover:scale-[1.02]'
                    : 'border border-cream-100/30 text-cream-50 hover:bg-cream-50/10'
                }`}
              >
                {plan.popular ? 'Begin Publishing' : 'View Details'}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 font-medium group">
            Compare all plans in detail
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
