'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCurrency } from '@/lib/currency-context';
import { formatPrice } from '@/lib/plans';

export default function BookPriceBlock({ priceINR, priceUSD }: { priceINR: number; priceUSD: number }) {
  const { currency } = useCurrency();
  const [buying, setBuying] = useState(false);

  const price = currency === 'INR' ? priceINR : priceUSD;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-xs tracking-widest uppercase text-gold-300 mb-1">Price</p>
        <p className="font-display text-4xl text-gold-gradient">{formatPrice(price, currency)}</p>
      </div>
      <button
        onClick={() => {
          setBuying(true);
          // TODO: integrate Razorpay/Stripe checkout
          setTimeout(() => {
            alert('Checkout will be enabled once payment provider (Razorpay/Stripe) is configured.');
            setBuying(false);
          }, 500);
        }}
        disabled={buying}
        className="btn-gold disabled:opacity-50"
      >
        {buying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
        Buy Now
      </button>
    </div>
  );
}
