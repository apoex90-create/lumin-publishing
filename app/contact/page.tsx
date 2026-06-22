import { Mail, MapPin, Phone } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings([
    'contact.email', 'contact.phone', 'contact.address', 'contact.hours', 'brand.name',
  ]) };

  const contactCards = [
    settings['contact.email'] && {
      icon: Mail,
      title: 'Email',
      lines: [settings['contact.email'], 'For general inquiries'],
      color: 'from-royal-700 to-royal-900',
      href: `mailto:${settings['contact.email']}`,
    },
    settings['contact.phone'] && {
      icon: Phone,
      title: 'Phone',
      lines: [settings['contact.phone'], settings['contact.hours']],
      color: 'from-burgundy-500 to-burgundy-700',
      href: `tel:${settings['contact.phone'].replace(/\s/g, '')}`,
    },
    settings['contact.address'] && {
      icon: MapPin,
      title: 'Location',
      lines: [settings['contact.address'], 'Remote-first'],
      color: 'from-gold-500 to-gold-700',
      href: null,
    },
  ].filter(Boolean) as Array<{ icon: any; title: string; lines: string[]; color: string; href: string | null }>;

  return (
    <>
      <section className="relative section-pad overflow-hidden">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

        <div className="container-lumin relative max-w-4xl text-center">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <p className="eyebrow">Get in Touch</p>
          <h1 className="h-display text-royal-900">
            We'd love to <em className="italic text-gold-gradient">hear from you.</em>
          </h1>
          <p className="mt-8 text-xl text-ink-900/70 font-serif">
            Questions about your manuscript? Curious about our process? We typically respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-lumin max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              {contactCards.map((card, i) => {
                const Inner = (
                  <div className="card-premium p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                      <card.icon className="w-5 h-5 text-cream-50" />
                    </div>
                    <h3 className="font-display text-xl text-royal-900 mb-2">{card.title}</h3>
                    {card.lines.map((line, j) => (
                      <p key={j} className={j === 0 ? 'text-sm text-ink-900/70' : 'text-xs text-ink-900/50 mt-1'}>{line}</p>
                    ))}
                  </div>
                );
                return card.href ? (
                  <a key={i} href={card.href} className="block hover:scale-[1.02] transition-transform">{Inner}</a>
                ) : (
                  <div key={i}>{Inner}</div>
                );
              })}
            </div>

            <div className="lg:col-span-2 card-premium p-8 lg:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata() {
  const settings = await getSettings(['brand.name']).catch((): Record<string, string> => ({}));
  return {
    title: `Contact ${settings['brand.name'] || 'LUMIN'}`,
    description: 'Get in touch about your manuscript or any questions about publishing.',
  };
}
