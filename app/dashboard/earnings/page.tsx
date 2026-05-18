'use client';

import { useCurrency } from '@/lib/currency-context';
import { formatPrice } from '@/lib/plans';
import { Download, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const transactions = [
  { date: '2026-05-12', book: 'The Lantern Keeper', type: 'sale', amount: 280, currency: 'INR' },
  { date: '2026-05-10', book: 'Veins of Gold', type: 'sale', amount: 375, currency: 'INR' },
  { date: '2026-05-08', book: 'The Lantern Keeper', type: 'sale', amount: 7.49, currency: 'USD' },
  { date: '2026-05-05', book: '—', type: 'payout', amount: -12500, currency: 'INR' },
  { date: '2026-05-01', book: 'Veins of Gold', type: 'sale', amount: 9.74, currency: 'USD' },
  { date: '2026-04-28', book: 'The Lantern Keeper', type: 'sale', amount: 280, currency: 'INR' },
];

export default function EarningsPage() {
  const { currency } = useCurrency();

  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow">Royalties</p>
        <h2 className="font-display text-4xl text-royal-900">Earnings</h2>
        <p className="text-ink-900/60 mt-2">Track your royalty income and manage payouts.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-800 via-royal-900 to-ink-950 p-8 text-cream-50 shadow-royal">
          <div className="absolute inset-0 bg-noise opacity-[0.04]" />
          <div className="floating-orb top-0 right-0 w-80 h-80 bg-gold-500/20" />

          <div className="relative">
            <p className="eyebrow text-gold-300">Available Balance</p>
            <p className="font-display text-6xl text-gold-gradient mt-2">
              {formatPrice(currency === 'INR' ? 47820 : 574.83, currency)}
            </p>
            <p className="text-cream-100/60 text-sm mt-3">Last payout: ₹12,500 on May 5</p>

            <button className="mt-6 btn-gold inline-flex items-center">
              <Wallet className="w-4 h-4 mr-2" /> Request Payout
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-premium p-5">
            <p className="text-xs tracking-widest uppercase text-gold-700 font-semibold">Lifetime Earnings</p>
            <p className="font-display text-3xl text-royal-900 mt-2">{formatPrice(currency === 'INR' ? 218400 : 2625, currency)}</p>
          </div>
          <div className="card-premium p-5">
            <p className="text-xs tracking-widest uppercase text-gold-700 font-semibold">This Month</p>
            <p className="font-display text-3xl text-royal-900 mt-2">{formatPrice(currency === 'INR' ? 32100 : 386, currency)}</p>
            <p className="text-xs text-green-700 mt-1">↑ +24% from last month</p>
          </div>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-royal-100 flex items-center justify-between">
          <h3 className="font-display text-2xl text-royal-900">Recent Transactions</h3>
          <button className="text-sm text-royal-800 hover:text-gold-600 font-medium inline-flex items-center gap-1">
            <Download size={14} /> Export
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-cream-100/60">
            <tr>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-ink-900/60 font-semibold">Date</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-ink-900/60 font-semibold">Book</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-ink-900/60 font-semibold">Type</th>
              <th className="text-right px-6 py-3 text-xs tracking-widest uppercase text-ink-900/60 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="border-t border-royal-50 hover:bg-cream-100/30 transition-colors">
                <td className="px-6 py-4 text-ink-900/70">{t.date}</td>
                <td className="px-6 py-4 text-royal-900 font-medium">{t.book}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase ${
                    t.type === 'sale' ? 'text-green-700' : 'text-burgundy-700'
                  }`}>
                    {t.type === 'sale' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {t.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  <span className={t.amount > 0 ? 'text-green-700' : 'text-burgundy-700'}>
                    {t.amount > 0 ? '+' : ''}{formatPrice(Math.abs(t.amount), t.currency as 'INR' | 'USD')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
