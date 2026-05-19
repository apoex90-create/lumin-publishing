import Ornament from '@/components/ui/Ornament';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export default async function TermsPage() {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings(['brand.name']) };
  const brand = settings['brand.name'];
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container-lumin py-20 max-w-3xl">
      <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
      <p className="eyebrow text-center">Legal</p>
      <h1 className="h-display text-royal-900 text-center">Terms of Service</h1>
      <p className="text-sm text-ink-900/50 text-center mt-4">Last updated: {today}</p>

      <div className="mt-12 prose prose-lg max-w-none text-ink-900/80 space-y-6 font-serif">
        <p><strong>Important:</strong> This is a template. Replace with your own legally-reviewed terms before launch. Consult a lawyer in your jurisdiction.</p>

        <h2 className="font-display text-2xl text-royal-900">1. Acceptance of Terms</h2>
        <p>By creating an account or using {brand}, you agree to these Terms of Service.</p>

        <h2 className="font-display text-2xl text-royal-900">2. Author Rights</h2>
        <p>You retain 100% of intellectual property rights to your work. {brand} holds a non-exclusive distribution license for the duration of your active publishing agreement.</p>

        <h2 className="font-display text-2xl text-royal-900">3. Payment Terms</h2>
        <p>Publishing fees are one-time per book and defined per plan. Payment is collected only after manuscript approval. Refunds are subject to the Refund Policy.</p>

        <h2 className="font-display text-2xl text-royal-900">4. Content Standards</h2>
        <p>You warrant that your submitted work is original, does not infringe third-party rights, and complies with applicable laws.</p>

        <h2 className="font-display text-2xl text-royal-900">5. Limitation of Liability</h2>
        <p>{brand} provides services "as is" without warranties. We are not liable for indirect or consequential damages.</p>

        <h2 className="font-display text-2xl text-royal-900">6. Termination</h2>
        <p>Either party may terminate the agreement with 30 days' notice. Published books remain available unless explicitly unpublished.</p>

        <h2 className="font-display text-2xl text-royal-900">7. Contact</h2>
        <p>For questions about these terms, contact us via the Contact page.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms governing the use of our publishing platform.',
};
