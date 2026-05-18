// Seeds: admin user, agents, default plans/steps/footer links, default settings
// Run: node prisma/seed.js
// Honest defaults — NO fake testimonials, NO fake team, NO fake stats

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const AGENTS = [
  { type: 'ORCHESTRATOR', name: '🎯 Manager', desc: 'Routes work to all other agents.' },
  { type: 'EDITOR', name: '✏️ Editorial Bot', desc: 'Edits manuscripts. Grammar, style, structure.' },
  { type: 'DESIGNER', name: '🎨 Design Bot', desc: 'Creates book covers via AI image generation.' },
  { type: 'FORMATTER', name: '📚 Format Bot', desc: 'Converts to EPUB, MOBI, PDF.' },
  { type: 'MARKETING', name: '📣 Marketing Bot', desc: 'Writes ads, social posts, launch campaigns.' },
  { type: 'BLOGGER', name: '📰 Blog Bot', desc: 'Writes SEO blog posts daily.' },
  { type: 'SUPPORT', name: '💬 Support Bot', desc: 'Answers inquiries 24/7.' },
  { type: 'MAILER', name: '📧 Mail Bot', desc: 'Composes and sends all outbound emails.' },
  { type: 'ACCOUNTS', name: '💰 Accounts Bot', desc: 'Money flow. All transactions need admin approval.' },
  { type: 'MAINTENANCE', name: '🌐 Maintenance Bot', desc: 'Site health, backups, monitoring.' },
];

const DEFAULT_PLANS = [
  {
    tier: 'STARTER', name: 'Starter', tagline: 'For first-time authors',
    priceINR: 4999, priceUSD: 59, royaltyPercent: 70, isPopular: false, sortOrder: 1,
    features: JSON.stringify([
      'AI-assisted grammar & style edit',
      '3 AI-generated cover options',
      'EPUB + PDF formatting',
      'Listed on our bookstore',
      'Basic author profile page',
      'Sales dashboard & analytics',
      '70% royalty to author',
    ]),
  },
  {
    tier: 'PROFESSIONAL', name: 'Professional', tagline: 'Our most popular plan',
    priceINR: 14999, priceUSD: 179, royaltyPercent: 75, isPopular: true, sortOrder: 2,
    features: JSON.stringify([
      'Everything in Starter, plus:',
      'Advanced AI edit + 1 human proofread',
      '10 AI covers + 1 custom revision',
      'Print-ready PDF (paperback)',
      'ISBN included',
      'Amazon KDP distribution',
      'AI marketing kit (social + ad copy)',
      '75% royalty to author',
    ]),
  },
  {
    tier: 'BESTSELLER', name: 'Bestseller', tagline: 'Full premium publishing',
    priceINR: 39999, priceUSD: 479, royaltyPercent: 80, isPopular: false, sortOrder: 3,
    features: JSON.stringify([
      'Everything in Professional, plus:',
      'Full human edit (multiple rounds)',
      'Custom cover by designer',
      'Hardcover + paperback + ebook',
      'ISBN + barcode + DOI',
      'Global distribution',
      'Book launch campaign',
      '80% royalty to author',
    ]),
  },
];

const DEFAULT_STEPS = [
  { stepNumber: 1, title: 'Submit Your Manuscript', text: 'Upload your work in any common format.', detail: 'Encrypted and secure.', iconName: 'Upload' },
  { stepNumber: 2, title: 'AI-Assisted Editing', text: 'Our AI editor polishes grammar, style, and pacing — preserving your voice.', detail: 'You approve every change.', iconName: 'Sparkles' },
  { stepNumber: 3, title: 'Cover & Interior Design', text: 'Choose from six design directions. AI generates options, refined to perfection.', detail: 'Bestseller plan: fully custom cover by an award-winning designer.', iconName: 'Palette' },
  { stepNumber: 4, title: 'Formatting & ISBN', text: 'EPUB, print-ready PDF, ISBN registration included.', detail: 'Delivered to all major retailers within 48 hours.', iconName: 'FileCheck' },
  { stepNumber: 5, title: 'Global Distribution', text: 'Live on Amazon, Apple Books, Google Play, Kobo, and more.', detail: '180+ countries.', iconName: 'Globe' },
  { stepNumber: 6, title: 'Launch & Marketing', text: 'AI-generated social posts, ad copy, and book trailers.', detail: 'You retain full ownership and 70–80% royalties.', iconName: 'Megaphone' },
];

const DEFAULT_FOOTER_LINKS = [
  { section: 'Publish', label: 'How It Works', url: '/how-it-works', sortOrder: 1 },
  { section: 'Publish', label: 'Pricing', url: '/pricing', sortOrder: 2 },
  { section: 'Publish', label: 'Services', url: '/services', sortOrder: 3 },
  { section: 'Publish', label: 'Get Started', url: '/signup', sortOrder: 4 },
  { section: 'Discover', label: 'Bookstore', url: '/bookstore', sortOrder: 1 },
  { section: 'Company', label: 'About', url: '/about', sortOrder: 1 },
  { section: 'Company', label: 'Contact', url: '/contact', sortOrder: 2 },
  { section: 'Company', label: 'Careers', url: '/careers', sortOrder: 3 },
  { section: 'Company', label: 'Press', url: '/press', sortOrder: 4 },
  { section: 'Legal', label: 'Terms of Service', url: '/terms', sortOrder: 1 },
  { section: 'Legal', label: 'Privacy Policy', url: '/privacy', sortOrder: 2 },
  { section: 'Legal', label: 'Refund Policy', url: '/refund', sortOrder: 3 },
  { section: 'Legal', label: 'Copyright / DMCA', url: '/copyright', sortOrder: 4 },
];

const DEFAULT_SETTINGS_RECORDS = [
  ['brand.name', 'LUMIN'],
  ['brand.tagline', 'Where extraordinary stories become beautifully published books'],
  ['brand.description', 'AI-powered tools, human craft, and global reach for serious authors.'],
  ['contact.email', 'hello@lumin.publishing'],
  ['contact.phone', ''],
  ['contact.address', 'India'],
  ['contact.hours', 'Mon–Fri, 10am–7pm IST'],
  ['hero.headline', 'Your story.'],
  ['hero.headline.emphasis', 'Beautifully'],
  ['hero.headline.suffix', 'published.'],
  ['hero.subheading', 'From manuscript to published book in 7 days. AI-assisted editing, premium covers, and global distribution — all crafted with the care your story deserves.'],
  ['hero.cta.primary', 'Begin Your Journey'],
  ['hero.cta.secondary', 'See How It Works'],
  ['stats.1.number', '0'],
  ['stats.1.label', 'Authors Joined'],
  ['stats.2.number', '180+'],
  ['stats.2.label', 'Countries Reached'],
  ['stats.3.number', '7 days'],
  ['stats.3.label', 'Average Time to Publish'],
  ['stats.4.number', '80%'],
  ['stats.4.label', 'Royalty to Authors'],
  ['seo.title', 'LUMIN — Premium AI-Powered Book Publishing'],
  ['seo.description', 'Publish your book in days, not years. AI-assisted editing, premium design, and global distribution.'],
  ['seo.keywords', 'book publishing, AI publishing, self publishing, ebook, ISBN, author platform'],
  ['show.testimonials', 'false'],
  ['show.team', 'false'],
  ['show.bookstore.featured', 'true'],
  ['show.stats', 'false'],
  ['show.social.icons', 'false'],
  ['about.mission.title', 'Every author deserves a beautiful book.'],
  ['about.mission.text', 'We believe the gatekeeping era of publishing is over. LUMIN blends the precision of AI with the judgment of craft.'],
];

async function main() {
  console.log('🌱 Seeding LUMIN...');

  const passwordHash = await bcrypt.hash('demo1234', 10);

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@lumin.demo' },
    update: {},
    create: { email: 'admin@lumin.demo', passwordHash, fullName: 'Platform Admin', role: 'ADMIN', country: 'IN' },
  });

  // Agents
  for (const a of AGENTS) {
    await prisma.agent.upsert({
      where: { type: a.type },
      update: {},
      create: { type: a.type, name: a.name, description: a.desc, status: 'ACTIVE', config: '{}' },
    });
  }

  // Plans
  for (const p of DEFAULT_PLANS) {
    await prisma.plan.upsert({ where: { tier: p.tier }, update: p, create: p });
  }

  // Steps
  for (const s of DEFAULT_STEPS) {
    const existing = await prisma.howItWorksStep.findFirst({ where: { stepNumber: s.stepNumber } });
    if (!existing) await prisma.howItWorksStep.create({ data: s });
  }

  // Footer links
  for (const f of DEFAULT_FOOTER_LINKS) {
    const existing = await prisma.footerLink.findFirst({ where: { section: f.section, label: f.label } });
    if (!existing) await prisma.footerLink.create({ data: f });
  }

  // Settings
  for (const [key, value] of DEFAULT_SETTINGS_RECORDS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log('✅ Seed complete!');
  console.log('   Admin: admin@lumin.demo / demo1234');
  console.log('   → /admin to start configuring');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
