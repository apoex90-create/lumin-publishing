import Link from 'next/link';
import { FileText, Palette, BookOpen, Megaphone, Award, Globe, Sparkles, PenTool, ArrowRight } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';
import SectionHeading from '@/components/ui/SectionHeading';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const iconMap: Record<string, any> = {
  FileText, Palette, BookOpen, Megaphone, Award, Globe, Sparkles, PenTool,
};

const defaultServices = [
  {
    iconName: 'FileText',
    title: 'Editorial Services',
    description: 'From developmental editing that shapes your story arc, to line editing that polishes every sentence, to copy editing that catches every typo. Our editors are AI-augmented but always human-led.',
    features: JSON.stringify(['Developmental edit', 'Line & copy editing', 'Proofreading', 'Style guide adherence']),
    colorClass: 'from-royal-700 to-royal-900',
  },
  {
    iconName: 'Palette',
    title: 'Cover & Interior Design',
    description: 'Stunning covers that capture your book\'s soul. Interior layouts that make reading a pleasure. AI-assisted for speed, human-refined for art.',
    features: JSON.stringify(['Custom cover design', 'Interior typesetting', 'Multiple format optimization', 'Series consistency']),
    colorClass: 'from-burgundy-500 to-burgundy-700',
  },
  {
    iconName: 'BookOpen',
    title: 'Formatting & Production',
    description: 'EPUB, MOBI, print-ready PDF, hardcover production. We handle every technical detail so your book looks perfect on every device and every shelf.',
    features: JSON.stringify(['EPUB/MOBI conversion', 'Print-ready PDF', 'ISBN registration', 'Hardcover/paperback']),
    colorClass: 'from-gold-500 to-gold-700',
  },
  {
    iconName: 'Globe',
    title: 'Global Distribution',
    description: 'Your book on Amazon, Apple Books, Google Play, Kobo, and 180+ international platforms. Print-on-demand to 40+ countries.',
    features: JSON.stringify(['Amazon KDP', 'Apple Books', 'Google Play', 'IngramSpark print distribution']),
    colorClass: 'from-royal-600 to-royal-800',
  },
  {
    iconName: 'Megaphone',
    title: 'Marketing & Launch',
    description: 'AI-generated ad copy. Social media kits. Launch campaigns. We craft your book\'s message for every platform.',
    features: JSON.stringify(['Social media graphics', 'Ad copy & creative', 'Email campaigns', 'Book trailers']),
    colorClass: 'from-gold-600 to-burgundy-600',
  },
  {
    iconName: 'Award',
    title: 'Author Branding',
    description: 'Your author website, headshots, bio writing, professional presence. We help you become a brand authors trust.',
    features: JSON.stringify(['Author website', 'Bio & headshot guidance', 'Press kit creation', 'Social presence setup']),
    colorClass: 'from-royal-700 to-burgundy-600',
  },
];

export default async function ServicesPage() {
  const dbServices = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  const services = (dbServices.length > 0 ? dbServices : defaultServices).map((s: any) => ({
    ...s,
    parsedFeatures: (() => {
      try { return JSON.parse(s.features || '[]'); } catch { return []; }
    })() as string[],
  }));

  return (
    <>
      <section className="relative section-pad overflow-hidden">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

        <div className="container-lumin relative max-w-4xl text-center">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <p className="eyebrow">Our Services</p>
          <h1 className="h-display text-royal-900">
            Every craft your <em className="italic text-gold-gradient">book deserves.</em>
          </h1>
          <p className="mt-8 text-xl text-ink-900/70 font-serif leading-relaxed">
            We combine the speed of AI with the judgment of human craft to deliver every service a serious author needs.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-lumin">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service: any, i: number) => {
              const Icon = iconMap[service.iconName] || Sparkles;
              return (
                <div key={i} className="card-premium p-8 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.colorClass || 'from-royal-700 to-royal-900'} flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow`}>
                    <Icon className="w-6 h-6 text-cream-50" />
                  </div>
                  <h3 className="font-display text-2xl text-royal-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-ink-900/70 leading-relaxed mb-4">{service.description}</p>
                  {service.parsedFeatures.length > 0 && (
                    <ul className="space-y-1.5 pt-4 border-t border-royal-100">
                      {service.parsedFeatures.map((f: string, j: number) => (
                        <li key={j} className="text-xs text-ink-900/60 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lumin text-center max-w-3xl">
          <h2 className="h-display text-royal-900">
            Ready to <em className="italic text-gold-gradient">begin?</em>
          </h2>
          <p className="mt-6 text-lg text-ink-900/70 font-serif">
            Every service is included in our publishing plans. Choose the plan that fits your ambition.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/pricing" className="btn-royal">
              View Plans <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/signup" className="btn-outline">Start Publishing</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const metadata = {
  title: 'Services — Editing, Design, Distribution, Marketing',
  description: 'Editorial review, cover design, EPUB/PDF formatting, ISBN registration, global distribution, and marketing — every service your book needs.',
};
