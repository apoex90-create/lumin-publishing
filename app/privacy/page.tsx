import Ornament from '@/components/ui/Ornament';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export default async function PrivacyPage() {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings(['brand.name']) };
  const brand = settings['brand.name'];
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container-lumin py-20 max-w-3xl">
      <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
      <p className="eyebrow text-center">Legal</p>
      <h1 className="h-display text-royal-900 text-center">Privacy Policy</h1>
      <p className="text-sm text-ink-900/50 text-center mt-4">Last updated: {today}</p>

      <div className="mt-12 prose prose-lg max-w-none text-ink-900/80 space-y-6 font-serif">
        <p><strong>Important:</strong> This is a template. Replace with your own legally-reviewed policy before launch.</p>

        <h2 className="font-display text-2xl text-royal-900">1. Information We Collect</h2>
        <p>We collect: account information (name, email, password), manuscript content, payment information (handled by Razorpay/Stripe), and usage data.</p>

        <h2 className="font-display text-2xl text-royal-900">2. How We Use Your Information</h2>
        <p>To provide publishing services, process payments, communicate with you, improve our platform, and comply with legal requirements.</p>

        <h2 className="font-display text-2xl text-royal-900">3. AI Processing</h2>
        <p>Your manuscripts may be processed by our AI systems for editing, formatting, and metadata generation. We do not use your content to train external AI models.</p>

        <h2 className="font-display text-2xl text-royal-900">4. Data Sharing</h2>
        <p>We share data only with: payment processors, distribution partners (when you publish), and as required by law. We never sell your data.</p>

        <h2 className="font-display text-2xl text-royal-900">5. Your Rights</h2>
        <p>You can access, correct, export, or delete your data anytime through your dashboard or by contacting us.</p>

        <h2 className="font-display text-2xl text-royal-900">6. Cookies</h2>
        <p>We use essential cookies for authentication. We do not use third-party tracking cookies.</p>

        <h2 className="font-display text-2xl text-royal-900">7. Contact</h2>
        <p>For privacy questions, contact us via the Contact page.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your information.',
};
