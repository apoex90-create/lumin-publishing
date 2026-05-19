import Link from 'next/link';
import { Heart, Users, Globe, Award, ArrowRight } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';
import { prisma } from '@/lib/db';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export const dynamic = 'force-dynamic';

const values = [
  { icon: Heart, title: 'Author-First', text: "We exist to serve writers. Every product decision is filtered through one question: does this help authors succeed?" },
  { icon: Award, title: 'Craft over Speed', text: "AI makes us fast, but craft makes us proud. We refuse to publish anything that doesn't honor the work behind it." },
  { icon: Users, title: 'Radical Transparency', text: "Open pricing. Open royalties. Open rights. No hidden clauses, no fine print, no surprises." },
  { icon: Globe, title: 'Global Reach, Local Care', text: "We publish for the world but understand each author's context — especially writers in India and emerging markets often overlooked." },
];

export default async function AboutPage() {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings(['about.mission.title', 'about.mission.text', 'show.team']) };
  const showTeam = settings['show.team'] === 'true';

  const team = showTeam
    ? await prisma.teamMember.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      }).catch(() => [])
    : [];

  return (
    <>
      <section className="relative section-pad overflow-hidden">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

        <div className="container-lumin relative max-w-4xl text-center">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <p className="eyebrow">Our Story</p>
          <h1 className="h-display text-royal-900">
            Built for <em className="italic text-gold-gradient">storytellers</em>, by storytellers.
          </h1>
          <p className="mt-8 text-xl text-ink-900/70 font-serif leading-relaxed">
            LUMIN began with a frustration: too many beautiful manuscripts were dying in slush piles or being mangled by services that prioritized scale over craft. We built the publishing house we wished existed.
          </p>
        </div>
      </section>

      <section className="section-pad bg-cream-100/40">
        <div className="container-lumin max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow">The Mission</p>
              <h2 className="h-display text-royal-900 text-5xl">
                {settings['about.mission.title']}
              </h2>
            </div>
            <div className="space-y-6 text-ink-900/80 leading-relaxed font-serif text-lg">
              <p>{settings['about.mission.text']}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lumin">
          <div className="text-center mb-16">
            <p className="eyebrow">What We Stand For</p>
            <h2 className="h-display text-royal-900">
              Our <em className="italic text-gold-gradient">values</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card-premium p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-700 to-royal-900 flex items-center justify-center mb-6 shadow-lg">
                  <v.icon className="w-6 h-6 text-gold-300" />
                </div>
                <h3 className="font-display text-2xl text-royal-900 mb-3">{v.title}</h3>
                <p className="text-sm text-ink-900/70 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showTeam && team.length > 0 && (
        <section className="section-pad bg-royal-900 text-cream-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-[0.04]" />
          <div className="floating-orb top-0 left-0 w-[400px] h-[400px] bg-gold-500/15" />

          <div className="relative container-lumin">
            <div className="text-center mb-16">
              <p className="eyebrow text-gold-300">The Team</p>
              <h2 className="h-display text-cream-50">
                People who <em className="italic text-gold-gradient">love books</em>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {team.map((member) => (
                <div key={member.id} className="text-center">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-xl" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold-400 to-burgundy-500 mx-auto flex items-center justify-center font-display text-5xl text-royal-900 mb-4 shadow-xl">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-display text-xl text-cream-50">{member.name}</p>
                  <p className="text-xs text-cream-100/60 mt-1 italic">{member.role}</p>
                  {member.bio && <p className="text-xs text-cream-100/50 mt-2 px-4">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!showTeam && (
        <section className="section-pad bg-royal-900 text-cream-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-[0.04]" />
          <div className="floating-orb top-0 left-0 w-[400px] h-[400px] bg-gold-500/15" />

          <div className="relative container-lumin max-w-4xl">
            <div className="text-center mb-12">
              <p className="eyebrow text-gold-300">Our Approach</p>
              <h2 className="h-display text-cream-50">
                AI-powered, <em className="italic text-gold-gradient">author-led</em>
              </h2>
            </div>

            <div className="space-y-6 text-cream-100/80 leading-relaxed text-lg font-serif">
              <p>LUMIN is a new kind of publishing house — one where intelligent automation handles the mechanical work of editing, formatting, cover design, and distribution, freeing authors to focus on what only they can do: write.</p>
              <p>Behind every book is a coordinated system of AI specialists working in concert: an editor that polishes prose, a designer that interprets your genre into striking cover art, a marketing engine that crafts the message for each platform, and an accounts system that keeps every transaction transparent.</p>
              <p>We believe the role of a publisher in 2026 is not to gatekeep, but to amplify.</p>
            </div>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container-lumin text-center max-w-3xl">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <h2 className="h-display text-royal-900">
            Join our <em className="italic text-gold-gradient">community</em>
          </h2>
          <p className="mt-6 text-lg text-ink-900/70 font-serif">
            Whether you're a first-time author or a seasoned writer with shelves full of work, LUMIN is built for you.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn-royal">
              Become a LUMIN Author <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata() {
  const settings = await getSettings(['brand.name', 'seo.title']).catch(() => ({} as Record<string, string>));
  const brand = settings['brand.name'] || 'LUMIN';
  return {
    title: `About ${brand} — Built for Storytellers`,
    description: `Learn about ${brand}'s mission to make professional publishing accessible to every author.`,
  };
}
