import Ornament from '@/components/ui/Ornament';

export default async function RefundPage() {
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container-lumin py-20 max-w-3xl">
      <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
      <p className="eyebrow text-center">Legal</p>
      <h1 className="h-display text-royal-900 text-center">Refund Policy</h1>
      <p className="text-sm text-ink-900/50 text-center mt-4">Last updated: {today}</p>

      <div className="mt-12 prose prose-lg max-w-none text-ink-900/80 space-y-6 font-serif">
        <p><strong>Important:</strong> This is a template. Customize before launch.</p>

        <h2 className="font-display text-2xl text-royal-900">When You Can Get a Refund</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Within 7 days of plan purchase</strong> if work has not begun on your book</li>
          <li>If we cannot deliver the services in your selected plan</li>
          <li>If your book is rejected by our editorial team before any work begins</li>
        </ul>

        <h2 className="font-display text-2xl text-royal-900">When Refunds Don't Apply</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>After editing has begun on your manuscript</li>
          <li>After a cover design has been delivered</li>
          <li>After your book has been published or distributed</li>
        </ul>

        <h2 className="font-display text-2xl text-royal-900">How to Request</h2>
        <p>Email us through the Contact page with your account email and reason. Refunds are processed within 7-14 business days to the original payment method.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Refund Policy',
  description: 'Our refund terms for publishing plans and services.',
};
