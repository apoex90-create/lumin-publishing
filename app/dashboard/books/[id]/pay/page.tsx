import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { PLANS } from '@/lib/plans';
import PayButton from '@/components/dashboard/PayButton';

export const dynamic = 'force-dynamic';

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) redirect('/login');

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();
  if (book.authorId !== me.id) redirect('/dashboard/books');

  const plan = PLANS.find((p) => p.id === book.planTier) || PLANS[0];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/dashboard/books/${book.id}`} className="inline-flex items-center gap-2 text-ink-900/60 hover:text-gold-700 text-sm mb-6">
        <ArrowLeft size={14} /> Back to book
      </Link>

      <div className="mb-8">
        <p className="eyebrow">Complete Payment</p>
        <h1 className="font-display text-4xl text-royal-900">Confirm your plan</h1>
        <p className="text-ink-900/60 mt-2">Pay the one-time publishing fee to send your book into the editorial pipeline.</p>
      </div>

      <div className="card-premium p-8 mb-6">
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-royal-100">
          <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-royal-700 to-royal-900 flex-shrink-0 flex items-center justify-center">
            <span className="text-cream-50 text-xs">Book</span>
          </div>
          <div className="flex-1">
            <p className="font-display text-xl text-royal-900">{book.title}</p>
            {book.subtitle && <p className="text-sm text-ink-900/60 italic">{book.subtitle}</p>}
            <p className="text-xs text-ink-900/50 mt-1">Genre: {book.genre} · {book.language}</p>
            {book.publisher && <p className="text-xs text-ink-900/50">Publisher: {book.publisher}</p>}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-900/70">Plan</span>
            <span className="font-display text-lg text-royal-900">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-900/70">Tagline</span>
            <span className="text-sm text-ink-900/70 italic">{plan.tagline}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-royal-100">
            <span className="font-display text-lg text-royal-900">Total (one-time)</span>
            <span className="font-display text-3xl text-gold-gradient">₹{plan.priceINR.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cream-100 border border-royal-100 mb-6 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-ink-900/70">
            Your payment will be processed securely via Razorpay (for India) or Stripe (for international cards). We do not store your card details.
          </div>
        </div>

        <PayButton bookId={book.id} amount={plan.priceINR} currency="INR" />
      </div>

      <div className="text-center">
        <p className="text-xs text-ink-900/50">
          Need help? <Link href="/contact" className="text-gold-700 hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  );
}
