import { prisma } from './db';

// Get a single setting with a fallback default
export async function getSetting(key: string, defaultValue: string = ''): Promise<string> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return setting?.value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

// Get many settings at once - returns Record<string, string>
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return map;
  } catch {
    return {};
  }
}

// Set a single setting
export async function setSetting(key: string, value: string, type: string = 'string') {
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value, type },
    update: { value, type },
  });
}

// Set many settings at once
export async function setSettings(data: Record<string, string>) {
  const ops = Object.entries(data).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
  );
  return Promise.all(ops);
}

// Default site values - used when DB hasn't been set up yet
export const DEFAULT_SETTINGS = {
  // Brand
  'brand.name': 'LUMIN',
  'brand.tagline': 'Where extraordinary stories become beautifully published books',
  'brand.description': 'AI-powered tools, human craft, and global reach for serious authors.',

  // Contact
  'contact.email': 'hello@lumin.publishing',
  'contact.phone': '',
  'contact.address': 'India',
  'contact.hours': 'Mon–Fri, 10am–7pm IST',

  // Homepage hero
  'hero.headline': 'Your story.',
  'hero.headline.emphasis': 'Beautifully',
  'hero.headline.suffix': 'published.',
  'hero.subheading': 'From manuscript to published book in 7 days. AI-assisted editing, premium covers, and global distribution — all crafted with the care your story deserves.',
  'hero.cta.primary': 'Begin Your Journey',
  'hero.cta.secondary': 'See How It Works',

  // Stats (homepage)
  'stats.1.number': '2,400+',
  'stats.1.label': 'Authors Published',
  'stats.2.number': '180+',
  'stats.2.label': 'Countries Reached',
  'stats.3.number': '7 days',
  'stats.3.label': 'Average Time to Publish',
  'stats.4.number': '80%',
  'stats.4.label': 'Royalty to Authors',

  // SEO
  'seo.title': 'LUMIN — Premium AI-Powered Book Publishing',
  'seo.description': 'Publish your book in days, not years. AI-assisted editing, premium design, and global distribution for serious authors.',
  'seo.keywords': 'book publishing, AI publishing, self publishing, ebook, ISBN, author platform',

  // Currency
  'currency.default': 'INR',

  // About page
  'about.mission.title': 'Every author deserves a beautiful book.',
  'about.mission.text': 'We believe the gatekeeping era of publishing is over — but we also believe most "self-publishing" tools have failed authors by giving them software when they needed partnership. LUMIN blends the precision of AI with the judgment of veteran editors.',

  // Toggle visibility of optional sections
  'show.testimonials': 'true',
  'show.team': 'false',         // Hidden by default since no real team yet
  'show.bookstore.featured': 'true',
  'show.stats': 'true',
  'show.social.icons': 'false', // Hidden by default — only show when real links added
};
