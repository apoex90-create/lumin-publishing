import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export default async function CareersPage() {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings(['contact.email', 'brand.name']) };

  return (
    <div className="relative section-pad overflow-hidden">
      <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
      <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

      <div className="container-lumin relative max-w-3xl text-center">
        <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
        <p className="eyebrow">Careers</p>
        <h1 className="h-display text-royal-900">
          Help us build the <em className="italic text-gold-gradient">future of publishing.</em>
        </h1>

        <p className="mt-8 text-xl text-ink-900/70 font-serif leading-relaxed">
          We're not actively hiring right now, but we're always interested in hearing from talented people who care deeply about authors, technology, and craft.
        </p>

        <div className="mt-10 p-8 bg-cream-100 rounded-3xl border border-royal-100">
          <h2 className="font-display text-2xl text-royal-900 mb-3">Roles we typically look for</h2>
          <ul className="text-left max-w-md mx-auto space-y-2 text-ink-900/80">
            <li>• Senior Editors (literary, genre-specific)</li>
            <li>• AI / ML Engineers</li>
            <li>• Cover Designers & Illustrators</li>
            <li>• Book Marketing Specialists</li>
            <li>• Customer Success (author support)</li>
          </ul>
        </div>

        {settings['contact.email'] && (
          <div className="mt-10">
            <p className="text-ink-900/60 mb-4">Interested? Send us your story:</p>
            <a href={`mailto:${settings['contact.email']}?subject=Career inquiry`} className="btn-royal">
              <Mail className="w-4 h-4 mr-2" /> Email Us
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Careers — Build the Future of Publishing',
  description: 'Join our team if you care about authors, technology, and craft. View open roles and submit your interest.',
};
