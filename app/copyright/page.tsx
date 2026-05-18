import Ornament from '@/components/ui/Ornament';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export default async function CopyrightPage() {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings(['brand.name', 'contact.email']) };
  const brand = settings['brand.name'];

  return (
    <div className="container-lumin py-20 max-w-3xl">
      <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
      <p className="eyebrow text-center">Legal</p>
      <h1 className="h-display text-royal-900 text-center">Copyright & DMCA</h1>

      <div className="mt-12 prose prose-lg max-w-none text-ink-900/80 space-y-6 font-serif">
        <h2 className="font-display text-2xl text-royal-900">Author Copyright</h2>
        <p>Authors retain 100% copyright of their original works. {brand} holds only a non-exclusive distribution license while your book is active on our platform.</p>

        <h2 className="font-display text-2xl text-royal-900">Reporting Infringement</h2>
        <p>If you believe content on {brand} infringes your copyright, send a DMCA-compliant notice including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your contact information</li>
          <li>Description of the copyrighted work</li>
          <li>Location of the infringing material (URL)</li>
          <li>Statement of good-faith belief that use is unauthorized</li>
          <li>Statement, under penalty of perjury, that information is accurate</li>
          <li>Physical or electronic signature</li>
        </ul>

        <h2 className="font-display text-2xl text-royal-900">How to Submit</h2>
        <p>Send to: {settings['contact.email'] || 'Contact us via the Contact page'}</p>

        <h2 className="font-display text-2xl text-royal-900">Counter-Notice</h2>
        <p>If your content was removed and you believe it was a mistake, submit a counter-notice with similar information and we will reinstate the content if appropriate.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Copyright & DMCA',
  description: 'Copyright policies and procedures for reporting infringement.',
};
