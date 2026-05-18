import Link from 'next/link';
import { ArrowLeft, Home, BookOpen, MessageSquare, DollarSign, Briefcase, Info, ExternalLink, Edit3 } from 'lucide-react';

const pageMap = [
  {
    name: 'Homepage',
    url: '/',
    icon: Home,
    editPoints: [
      { label: 'Hero headline, subheading, buttons', where: '/admin/settings', tab: 'Hero Section' },
      { label: 'Stats numbers', where: '/admin/settings', tab: 'Stats' },
      { label: 'Featured testimonial', where: '/admin/content/testimonials', tab: null },
      { label: 'How-it-works steps shown', where: '/admin/content/steps', tab: null },
      { label: 'Featured books (auto from published books)', where: '/admin/books', tab: null },
      { label: 'Pricing preview cards', where: '/admin/content/plans', tab: null },
      { label: 'Show/hide stats, testimonials, books', where: '/admin/settings', tab: 'Show / Hide' },
    ],
  },
  {
    name: 'How It Works',
    url: '/how-it-works',
    icon: Info,
    editPoints: [
      { label: 'All 6 steps (title, text, icon)', where: '/admin/content/steps', tab: null },
    ],
  },
  {
    name: 'Pricing',
    url: '/pricing',
    icon: DollarSign,
    editPoints: [
      { label: 'Plans (name, price, royalty, features)', where: '/admin/content/plans', tab: null },
      { label: 'FAQs at bottom', where: '/admin/content/faqs', tab: null },
    ],
  },
  {
    name: 'Services',
    url: '/services',
    icon: Briefcase,
    editPoints: [
      { label: 'All service entries', where: '/admin/content/services', tab: null },
    ],
  },
  {
    name: 'About',
    url: '/about',
    icon: Info,
    editPoints: [
      { label: 'Mission title and text', where: '/admin/settings', tab: 'About Page' },
      { label: 'Team members (if enabled)', where: '/admin/content/team', tab: null },
      { label: 'Show/hide team section', where: '/admin/settings', tab: 'Show / Hide' },
    ],
  },
  {
    name: 'Contact',
    url: '/contact',
    icon: MessageSquare,
    editPoints: [
      { label: 'Email, phone, address, hours', where: '/admin/settings', tab: 'Contact' },
      { label: 'Form submissions arrive in Support', where: '/admin', tab: null },
    ],
  },
  {
    name: 'Bookstore',
    url: '/bookstore',
    icon: BookOpen,
    editPoints: [
      { label: 'Books (managed individually)', where: '/admin/books', tab: null },
    ],
  },
  {
    name: 'Footer (all pages)',
    url: null,
    icon: ExternalLink,
    editPoints: [
      { label: 'Link sections (Publish, Discover, Company, Legal)', where: '/admin/content/footer', tab: null },
      { label: 'Social media icons', where: '/admin/content/social', tab: null },
      { label: 'Brand name & description', where: '/admin/settings', tab: 'Brand' },
    ],
  },
  {
    name: 'SEO (all pages)',
    url: null,
    icon: ExternalLink,
    editPoints: [
      { label: 'Default site title, description, keywords', where: '/admin/settings', tab: 'SEO' },
    ],
  },
];

export default function PageContentAdmin() {
  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Page Content</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Where to edit each page</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Every public page on your site and where its content lives in admin.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {pageMap.map((page, i) => (
          <div key={i} className="bg-ink-900/60 backdrop-blur-sm border border-cream-100/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-700 to-royal-900 flex items-center justify-center">
                  <page.icon className="w-5 h-5 text-gold-300" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-cream-50">{page.name}</h3>
                  {page.url && (
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
                    >
                      {page.url} <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              {page.editPoints.map((point, j) => (
                <li key={j} className="flex items-start gap-2 py-2 border-t border-cream-100/5 first:border-t-0">
                  <Edit3 className="w-3.5 h-3.5 text-gold-400/60 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-cream-100/80 mb-1">{point.label}</p>
                    <Link
                      href={point.where}
                      className="text-xs text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
                    >
                      Edit at {point.where}
                      {point.tab && <span className="text-cream-100/40">→ {point.tab}</span>}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-gold-500/5 border border-gold-500/20">
        <p className="text-sm text-cream-100/70">
          💡 <strong className="text-gold-300">Pro tip:</strong> Most text changes go through <Link href="/admin/settings" className="text-gold-300 underline">Site Settings</Link>. Lists of items (testimonials, plans, FAQs, etc.) go through their dedicated content managers.
        </p>
      </div>
    </div>
  );
}
