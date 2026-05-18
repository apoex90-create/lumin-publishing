import Link from 'next/link';
import { Download, Mail } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export default async function PressPage() {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings(['contact.email', 'brand.name']) };
  const brandName = settings['brand.name'];

  return (
    <div className="relative section-pad overflow-hidden">
      <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
      <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

      <div className="container-lumin relative max-w-3xl">
        <div className="text-center">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <p className="eyebrow">Press & Media</p>
          <h1 className="h-display text-royal-900">
            For <em className="italic text-gold-gradient">journalists</em> & partners.
          </h1>
          <p className="mt-8 text-xl text-ink-900/70 font-serif leading-relaxed">
            {brandName} is reimagining book publishing with AI-assisted craft and global distribution.
          </p>
        </div>

        <div className="mt-16 grid gap-6">
          <div className="card-premium p-8">
            <h2 className="font-display text-2xl text-royal-900 mb-3">About {brandName}</h2>
            <p className="text-ink-900/70 leading-relaxed">
              {brandName} is a publishing platform that combines AI-assisted editing, professional cover design, and global distribution — making high-quality publishing accessible to authors worldwide.
            </p>
          </div>

          <div className="card-premium p-8">
            <h2 className="font-display text-2xl text-royal-900 mb-3">Media Inquiries</h2>
            <p className="text-ink-900/70 mb-4">
              For interviews, partnership opportunities, or press materials, please reach out directly.
            </p>
            {settings['contact.email'] && (
              <a href={`mailto:${settings['contact.email']}?subject=Press inquiry`} className="btn-royal">
                <Mail className="w-4 h-4 mr-2" /> Contact Press Team
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Press & Media',
  description: 'Press inquiries, media kit, and partnership opportunities.',
};
