import Link from 'next/link';
import { ArrowRight, Sparkles, Globe, Star, Award, Feather, Palette, FileText, BookOpen, Megaphone } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Ornament from '@/components/ui/Ornament';
import PricingPreview from '@/components/PricingPreview';
import FeaturedBooks from '@/components/FeaturedBooks';
import { prisma } from '@/lib/db';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Pull everything from DB, fall back to defaults
  const [settings, testimonials, steps] = await Promise.all([
    getSettings([
      'hero.headline', 'hero.headline.emphasis', 'hero.headline.suffix',
      'hero.subheading', 'hero.cta.primary', 'hero.cta.secondary',
      'stats.1.number', 'stats.1.label',
      'stats.2.number', 'stats.2.label',
      'stats.3.number', 'stats.3.label',
      'stats.4.number', 'stats.4.label',
      'show.stats', 'show.testimonials', 'show.bookstore.featured',
    ]).catch(() => ({})),
    prisma.testimonial.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
      take: 1,
    }).catch(() => []),
    prisma.howItWorksStep.findMany({
      where: { isPublished: true },
      orderBy: { stepNumber: 'asc' },
      take: 4,
    }).catch(() => []),
  ]);

  const s = { ...DEFAULT_SETTINGS, ...settings };
  const showStats = s['show.stats'] !== 'false';
  const showTestimonials = s['show.testimonials'] !== 'false' && testimonials.length > 0;
  const showBookstore = s['show.bookstore.featured'] !== 'false';

  // Default steps if none in DB
  const defaultSteps = [
    { iconName: 'Feather', stepNumber: 1, title: 'Submit', text: 'Upload your manuscript through our secure dashboard. Any format welcome.' },
    { iconName: 'Sparkles', stepNumber: 2, title: 'Refine', text: 'AI editors polish your prose while preserving your unique voice.' },
    { iconName: 'Palette', stepNumber: 3, title: 'Design', text: 'Choose from AI-crafted covers or commission a custom design.' },
    { iconName: 'Globe', stepNumber: 4, title: 'Launch', text: 'Distributed to Amazon, Apple, Google & our premium bookstore worldwide.' },
  ];
  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  const iconMap: Record<string, any> = { Feather, Sparkles, Palette, Globe, BookOpen, FileText, Megaphone, Award };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-32">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-300/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-300/30" />

        <div className="container-lumin relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 stagger-children">
              <div className="eyebrow">
                <span className="inline-flex items-center gap-3">
                  <span className="w-8 h-px bg-current" />
                  Premium Publishing, Reimagined
                </span>
              </div>

              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] text-royal-900 tracking-tight">
                {s['hero.headline']}
                <br />
                <span className="italic font-medium text-gold-gradient">{s['hero.headline.emphasis']}</span>
                <br />
                {s['hero.headline.suffix']}
              </h1>

              <p className="mt-8 text-xl text-ink-900/70 leading-relaxed max-w-xl font-serif">
                {s['hero.subheading']}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/signup" className="btn-royal group">
                  {s['hero.cta.primary']}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/how-it-works" className="btn-outline">
                  {s['hero.cta.secondary']}
                </Link>
              </div>
            </div>

            {/* Decorative book stack */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
                <div className="absolute inset-0 rotate-[-8deg] translate-x-8 translate-y-4 rounded-2xl bg-gradient-to-br from-burgundy-500 to-burgundy-700 shadow-2xl">
                  <div className="absolute inset-4 border border-gold-400/30 rounded-xl" />
                </div>
                <div className="absolute inset-0 rotate-[4deg] -translate-x-4 translate-y-2 rounded-2xl bg-gradient-to-br from-royal-700 to-royal-900 shadow-2xl">
                  <div className="absolute inset-4 border border-gold-400/30 rounded-xl" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-royal-800 via-royal-900 to-ink-950 shadow-royal overflow-hidden">
                  <div className="absolute inset-0 bg-noise opacity-5" />
                  <div className="absolute inset-6 border border-gold-400/40 rounded-xl p-8 flex flex-col justify-between">
                    <div>
                      <Ornament className="w-24 h-6 text-gold-400 mx-auto" />
                      <p className="mt-8 text-center text-gold-300 text-xs tracking-[0.4em] uppercase">A Novel</p>
                    </div>
                    <div className="text-center">
                      <h3 className="font-display text-4xl text-gold-gradient italic font-medium leading-tight">
                        Your Story
                        <br />
                        Here
                      </h3>
                      <Ornament className="mt-6 w-16 h-4 text-gold-400 mx-auto" />
                      <p className="mt-6 text-cream-100/80 text-xs tracking-[0.3em] uppercase">Your Name</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gold-shimmer flex items-center justify-center">
                        <Award className="w-6 h-6 text-royal-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      {showStats && (
        <section className="section-pad bg-cream-100/40 relative">
          <div className="container-lumin">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center border-l border-royal-200 first:border-l-0 px-4">
                  <div className="font-display text-5xl lg:text-6xl text-royal-900 font-light">
                    {(s as Record<string, string>)[`stats.${i}.number`]}
                  </div>
                  <div className="mt-2 text-sm tracking-widest uppercase text-ink-900/60 font-sans">
                    {(s as Record<string, string>)[`stats.${i}.label`]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="section-pad relative overflow-hidden">
        <div className="floating-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-royal-100/40" />

        <div className="container-lumin relative">
          <SectionHeading
            eyebrow="The Journey"
            title={<>From manuscript <em className="italic text-gold-gradient">to masterpiece</em></>}
            description="A four-step path crafted to honor your work. Each stage combines AI precision with human artistry."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {displaySteps.slice(0, 4).map((step: any, i) => {
              const Icon = iconMap[step.iconName] || Sparkles;
              const num = String(step.stepNumber || i + 1).padStart(2, '0');
              return (
                <div key={i} className="card-premium p-8 group relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-7xl font-display font-light text-royal-100 group-hover:text-gold-100 transition-colors">
                    {num}
                  </div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-royal-700 to-royal-900 flex items-center justify-center mb-6 group-hover:shadow-gold-glow transition-shadow">
                      <Icon className="w-6 h-6 text-gold-300" />
                    </div>
                    <h3 className="font-display text-2xl text-royal-900 mb-3">{step.title}</h3>
                    <p className="text-sm text-ink-900/70 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 text-royal-800 hover:text-gold-600 font-medium group">
              Explore the full process
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {showBookstore && <FeaturedBooks />}

      <PricingPreview />

      {/* TESTIMONIAL */}
      {showTestimonials && (
        <section className="section-pad relative overflow-hidden">
          <div className="container-lumin">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 font-display text-[200px] leading-none text-gold-200/50 select-none pointer-events-none">
                "
              </div>
              <div className="relative text-center">
                <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-8" />
                <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl text-royal-900 font-light italic leading-tight">
                  "{testimonials[0].quote}"
                </blockquote>
                <div className="mt-12 flex items-center justify-center gap-4">
                  {testimonials[0].imageUrl ? (
                    <img src={testimonials[0].imageUrl} alt={testimonials[0].authorName} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-burgundy-500 to-royal-800" />
                  )}
                  <div className="text-left">
                    <p className="font-display text-xl text-royal-900">{testimonials[0].authorName}</p>
                    {testimonials[0].authorRole && (
                      <p className="text-xs tracking-widest uppercase text-ink-900/60 mt-1">
                        {testimonials[0].authorRole}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="section-pad relative">
        <div className="container-lumin">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-royal-800 via-royal-900 to-ink-950 p-12 lg:p-20 text-center shadow-royal">
            <div className="absolute inset-0 bg-noise opacity-[0.03]" />
            <div className="floating-orb top-0 left-1/4 w-80 h-80 bg-gold-500/20" />
            <div className="floating-orb bottom-0 right-1/4 w-80 h-80 bg-burgundy-500/20" />

            <div className="relative max-w-3xl mx-auto">
              <div className="eyebrow text-gold-300">
                <span className="inline-flex items-center gap-3">
                  <span className="w-8 h-px bg-current" />
                  Your Story Awaits
                  <span className="w-8 h-px bg-current" />
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream-50 font-light leading-tight">
                The world is waiting
                <br />
                <em className="italic text-gold-gradient">for your words.</em>
              </h2>
              <p className="mt-8 text-cream-100/70 text-lg leading-relaxed font-serif">
                Join authors who chose to publish without compromise.
                <br />
                Begin your journey today — no upfront commitment required.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/signup" className="btn-gold">
                  Start Publishing Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link href="/contact" className="text-cream-100/80 hover:text-gold-300 font-medium px-6 py-4">
                  Talk to a Publishing Advisor →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
