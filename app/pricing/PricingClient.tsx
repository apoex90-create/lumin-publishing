'use client';

import Link from 'next/link';
import { Check, X, Crown, ArrowRight, HelpCircle } from 'lucide-react';
import type { Plan } from '@/lib/plans';
import { formatPrice } from '@/lib/plans';
import { useCurrency } from '@/lib/currency-context';
import Ornament from '@/components/ui/Ornament';

const defaultFaqs = [
  { q: 'When am I charged?', a: "You're only charged when your book is approved for publishing. If your manuscript isn't a fit, there are no fees." },
  { q: 'Do I keep the rights to my book?', a: 'Absolutely. You retain 100% of intellectual property rights. We hold only a non-exclusive distribution license.' },
  { q: 'How does payment work?', a: 'Payments are one-time per book. Indian authors pay via Razorpay; global authors via Stripe. No subscriptions, no hidden charges.' },
  { q: 'What if I want to leave?', a: 'You can unpublish any book at any time. Your files remain yours to take elsewhere.' },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold-500/15">
      <Check className="w-4 h-4 text-gold-700" strokeWidth={3} />
    </span>
  );
  if (value === false) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink-100">
      <X className="w-4 h-4 text-ink-900/30" strokeWidth={2.5} />
    </span>
  );
  return <span className="text-xs text-royal-800 font-semibold">{value}</span>;
}

export default function PricingClient({ plans, faqs }: { plans: Plan[]; faqs: { q: string; a: string }[] }) {
  const { currency } = useCurrency();
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <>
      <section className="relative section-pad overflow-hidden">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

        <div className="container-lumin relative max-w-4xl text-center">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <p className="eyebrow">Transparent Pricing</p>
          <h1 className="h-display text-royal-900">
            One fee. <em className="italic text-gold-gradient">No surprises.</em>
          </h1>
          <p className="mt-8 text-xl text-ink-900/70 font-serif leading-relaxed">
            Choose the plan that fits your ambition. Transparent one-time pricing — you only pay when your book is approved for publishing.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-lumin">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 transition-all duration-500 ${
                  plan.popular
                    ? 'bg-royal-900 text-cream-50 border-2 border-gold-500 shadow-gold-glow scale-105'
                    : 'bg-cream-50 border border-royal-100 shadow-lg hover:shadow-2xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-shimmer text-royal-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5">
                    <Crown className="w-3 h-3" /> MOST CHOSEN
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`font-display text-3xl mb-2 ${plan.popular ? 'text-cream-50' : 'text-royal-900'}`}>{plan.name}</h3>
                  <p className={`text-sm italic ${plan.popular ? 'text-cream-100/60' : 'text-ink-900/60'}`}>{plan.tagline}</p>
                </div>

                <div className={`mb-8 pb-8 border-b ${plan.popular ? 'border-cream-100/10' : 'border-royal-100'}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl text-gold-gradient">
                      {formatPrice(currency === 'INR' ? plan.priceINR : plan.priceUSD, currency)}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 tracking-wider uppercase ${plan.popular ? 'text-cream-100/50' : 'text-ink-900/50'}`}>
                    One-time payment
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm ${plan.popular ? 'text-cream-100/80' : 'text-ink-900/80'}`}>
                      <Check className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gold-shimmer text-royal-900 hover:scale-[1.02]'
                      : 'bg-royal-900 text-cream-50 hover:bg-royal-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lumin max-w-3xl">
          <div className="text-center mb-12">
            <p className="eyebrow">Questions</p>
            <h2 className="h-display text-royal-900">
              Frequently <em className="italic text-gold-gradient">asked</em>
            </h2>
          </div>

          <div className="space-y-4">
            {displayFaqs.map((faq, i) => (
              <details key={i} className="card-premium p-6 group">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <h3 className="font-display text-xl text-royal-900">{faq.q}</h3>
                  <HelpCircle className="w-5 h-5 text-gold-600 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-ink-900/70 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-ink-900/60 mb-4">Still have questions?</p>
            <Link href="/contact" className="btn-royal">
              Talk to a Publishing Advisor <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
