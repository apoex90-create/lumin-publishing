import Link from 'next/link';
import { MessageSquare, Users, HelpCircle, Link2, Share2, CreditCard, Briefcase, ListChecks, FileText, Settings, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function AdminContentPage() {
  const [testimonials, team, faqs, footerLinks, social, plans, services, steps] = await Promise.all([
    prisma.testimonial.count().catch(() => 0),
    prisma.teamMember.count().catch(() => 0),
    prisma.faq.count().catch(() => 0),
    prisma.footerLink.count().catch(() => 0),
    prisma.socialLink.count().catch(() => 0),
    prisma.plan.count().catch(() => 0),
    prisma.service.count().catch(() => 0),
    prisma.howItWorksStep.count().catch(() => 0),
  ]);

  const sections = [
    {
      title: 'Site Settings',
      desc: 'Brand, hero, stats, SEO, contact info',
      href: '/admin/settings',
      icon: Settings,
      stat: 'Brand control',
      color: 'from-gold-500 to-gold-700',
    },
    {
      title: 'Testimonials',
      desc: 'Manage quotes shown on homepage and pages',
      href: '/admin/content/testimonials',
      icon: MessageSquare,
      stat: `${testimonials} items`,
      color: 'from-royal-700 to-royal-900',
    },
    {
      title: 'Team Members',
      desc: 'About page team section (hidden by default)',
      href: '/admin/content/team',
      icon: Users,
      stat: `${team} members`,
      color: 'from-burgundy-500 to-burgundy-700',
    },
    {
      title: 'FAQs',
      desc: 'Questions shown on pricing and help pages',
      href: '/admin/content/faqs',
      icon: HelpCircle,
      stat: `${faqs} questions`,
      color: 'from-royal-600 to-royal-800',
    },
    {
      title: 'Footer Links',
      desc: 'Manage all 4 footer columns',
      href: '/admin/content/footer',
      icon: Link2,
      stat: `${footerLinks} links`,
      color: 'from-gold-600 to-gold-800',
    },
    {
      title: 'Social Media',
      desc: 'Footer icons — Twitter, Instagram, etc.',
      href: '/admin/content/social',
      icon: Share2,
      stat: `${social} accounts`,
      color: 'from-burgundy-400 to-burgundy-600',
    },
    {
      title: 'Pricing Plans',
      desc: 'Plan names, prices, features',
      href: '/admin/content/plans',
      icon: CreditCard,
      stat: `${plans} plans`,
      color: 'from-gold-500 to-burgundy-600',
    },
    {
      title: 'Services',
      desc: 'Services page content',
      href: '/admin/content/services',
      icon: Briefcase,
      stat: `${services} services`,
      color: 'from-royal-700 to-royal-900',
    },
    {
      title: 'How It Works Steps',
      desc: 'The 6 steps shown on the How It Works page',
      href: '/admin/content/steps',
      icon: ListChecks,
      stat: `${steps} steps`,
      color: 'from-royal-800 to-burgundy-700',
    },
    {
      title: 'Page Content',
      desc: 'Edit individual page text (About, Contact, etc.)',
      href: '/admin/content/pages',
      icon: FileText,
      stat: 'All pages',
      color: 'from-gold-700 to-royal-800',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Website Content</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Content Manager</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Everything visible on your public website — editable from here. No code needed.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s, i) => (
          <Link key={i} href={s.href} className="group bg-ink-900/60 backdrop-blur-sm border border-cream-100/10 hover:border-gold-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg`}>
              <s.icon className="w-5 h-5 text-cream-50" />
            </div>
            <h3 className="font-display text-xl text-cream-50 mb-1">{s.title}</h3>
            <p className="text-xs text-cream-100/50 mb-4">{s.desc}</p>
            <div className="flex items-center justify-between pt-3 border-t border-cream-100/5">
              <span className="text-xs text-gold-300 font-semibold tracking-wider">{s.stat}</span>
              <ChevronRight className="w-4 h-4 text-cream-100/40 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
