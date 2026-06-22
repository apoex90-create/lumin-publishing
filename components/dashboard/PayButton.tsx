'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  bookId: string;
  amount: number;
  currency: 'INR' | 'USD';
}

export default function PayButton({ bookId, amount, currency }: Props) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  async function startPayment() {
    setProcessing(true);
    setError('');

    try {
      // Create payment order on backend — the amount/currency are derived
      // server-side from the book's plan tier, never trusted from the client.
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, currency }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment setup failed');

      // If Razorpay is configured, redirect to gateway
      if (data.razorpayOrderId && data.razorpayKey) {
        // @ts-ignore - Razorpay loaded from script tag
        const Razorpay = (window as any).Razorpay;
        if (!Razorpay) {
          // Load Razorpay script dynamically
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load payment gateway'));
            document.body.appendChild(s);
          });
        }

        const options = {
          key: data.razorpayKey,
          amount: Math.round(data.amount * 100), // paise, server-derived
          currency: data.currency,
          name: 'LUMIN Publishing',
          description: 'Book Publishing Fee',
          order_id: data.razorpayOrderId,
          handler: async (response: any) => {
            // Verify payment on backend — bookId is derived server-side from
            // the stored order, so we only forward the gateway response.
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            if (verifyRes.ok) {
              router.push(`/dashboard/books/${bookId}?paid=true`);
              router.refresh();
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: () => setProcessing(false),
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Payment gateway not configured yet — leave the book untouched as a
        // draft. The author must not be auto-submitted without payment.
        setError('Payment system is being configured. Please contact support to complete your publishing fee payment — your book remains saved as a draft until then.');
        setProcessing(false);
      }
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={startPayment}
        disabled={processing}
        className="w-full btn-gold disabled:opacity-50 justify-center"
      >
        {processing ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
        ) : (
          <><CreditCard className="w-5 h-5 mr-2" /> Pay ₹{amount.toLocaleString('en-IN')} & Submit Book</>
        )}
      </button>

      <p className="text-xs text-ink-900/40 text-center mt-3">
        By proceeding, you agree to our <a href="/terms" className="underline">Terms of Service</a>.
      </p>
    </>
  );
}
