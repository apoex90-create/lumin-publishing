import Link from 'next/link';
import { ArrowRight, Upload, Sparkles, Palette, FileCheck, Megaphone, Globe } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Ornament from '@/components/ui/Ornament';

const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Submit Your Manuscript',
    text: 'Upload your work in any common format — .docx, .pdf, .txt, or .rtf. Our system accepts files up to 50MB and analyzes word count, structure, and genre fit automatically.',
    detail: 'Your manuscript is encrypted at rest and never shared outside our editorial team.',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'AI-Assisted Editorial Review',
    text: 'Within 24 hours, our AI editor identifies grammar issues, pacing problems, and style inconsistencies — while preserving your unique voice. A human editor reviews every suggestion.',
    detail: 'You approve every change before it goes into the final manuscript.',
  },
  {
    num: '03',
    icon: Palette,
    title: 'Cover & Interior Design',
    text: 'Choose from six design directions: cinematic, minimal, illustrated, photographic, abstract, or classic. Our AI generates options, and our designers refine them to perfection.',
    detail: 'Bestseller plan includes a fully custom cover by an award-winning designer.',
  },
  {
    num: '04',
    icon: FileCheck,
    title: 'Formatting & ISBN',
    text: 'We format your book for every reading format — EPUB for ebooks, print-ready PDF for paperback and hardcover. ISBN registration is included from the Professional plan up.',
    detail: 'Files are delivered to all major retailers within 48 hours of approval.',
  },
  {
    num: '05',
    icon: Globe,
    title: 'Global Distribution',
    text: 'Your book goes live on the LUMIN bookstore, Amazon KDP, Apple Books, Google Play, Kobo, and Barnes & Noble — reaching readers in over 180 countries.',
    detail: 'IngramSpark distribution adds your paperback to physical bookstores worldwide.',
  },
  {
    num: '06',
    icon: Megaphone,
    title: 'Launch & Marketing',
    text: 'AI-generated social posts, ad copy, and book trailers. Professional and Bestseller plans include paid ad campaigns and outreach to book bloggers, podcasts, and press.',
    detail: 'You retain full ownership of your work — always.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative section-pad overflow-hidden">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

        <div className="container-lumin relative max-w-4xl text-center">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <p className="eyebrow">The Process</p>
          <h1 className="h-display text-royal-900">
            From manuscript to <em className="italic text-gold-gradient">masterpiece</em>
          </h1>
          <p className="mt-8 text-xl text-ink-900/70 font-serif leading-relaxed">
            Six carefully orchestrated steps. Seven days from start to published book. Every detail handled with the precision your story deserves.
          </p>
        </div>
      </section>

      <section className="section-pad bg-cream-100/40">
        <div className="container-lumin max-w-5xl">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
              >
                <div className="[direction:ltr]">
                  <p className="font-display text-7xl text-royal-100 font-light leading-none">{step.num}</p>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-700 to-royal-900 flex items-center justify-center mt-6 shadow-lg">
                    <step.icon className="w-7 h-7 text-gold-300" />
                  </div>
                  <h3 className="font-display text-4xl text-royal-900 mt-6">{step.title}</h3>
                  <p className="mt-4 text-lg text-ink-900/70 leading-relaxed">{step.text}</p>
                  <p className="mt-4 text-sm italic text-gold-700">{step.detail}</p>
                </div>

                <div className="[direction:ltr] relative">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-royal-800 via-royal-900 to-ink-950 p-12 flex items-center justify-center relative overflow-hidden shadow-royal">
                    <div className="absolute inset-0 bg-noise opacity-[0.04]" />
                    <step.icon className="w-32 h-32 text-gold-400/60" strokeWidth={1} />
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gold-shimmer flex items-center justify-center text-royal-900 font-bold">
                      {step.num}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lumin text-center max-w-3xl">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <h2 className="h-display text-royal-900">
            Ready to <em className="italic text-gold-gradient">begin?</em>
          </h2>
          <p className="mt-6 text-lg text-ink-900/70 font-serif">
            Create your free account and submit your manuscript today. No commitment, no upfront fees.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn-royal">
              Start Publishing <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/pricing" className="btn-outline">View Plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const metadata = {
  title: 'How It Works — From Manuscript to Published Book',
  description: 'A clear, six-step process: submit your manuscript, AI editing, cover design, formatting, and global distribution in as little as 7 days.',
};
