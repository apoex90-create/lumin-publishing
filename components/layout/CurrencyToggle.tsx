'use client';

import { useCurrency } from '@/lib/currency-context';

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="inline-flex items-center bg-cream-100/60 border border-royal-200 rounded-full p-0.5 backdrop-blur-sm">
      <button
        onClick={() => setCurrency('INR')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
          currency === 'INR'
            ? 'bg-royal-800 text-cream-50 shadow-md'
            : 'text-royal-800 hover:text-royal-900'
        }`}
        aria-label="Switch to Indian Rupees"
      >
        ₹ INR
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
          currency === 'USD'
            ? 'bg-royal-800 text-cream-50 shadow-md'
            : 'text-royal-800 hover:text-royal-900'
        }`}
        aria-label="Switch to US Dollars"
      >
        $ USD
      </button>
    </div>
  );
}
