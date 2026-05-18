import Link from 'next/link';
import Logo from './Logo';
import { Instagram, Twitter, Facebook, Youtube, Mail, Linkedin, Github } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

const iconMap: Record<string, any> = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  email: Mail,
  linkedin: Linkedin,
  github: Github,
};

export default async function Footer() {
  const [footerLinks, socialLinks, settings] = await Promise.all([
    prisma.footerLink.findMany({
      where: { isPublished: true },
      orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
    }).catch(() => []),
    prisma.socialLink.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }).catch(() => []),
    getSettings(['brand.name', 'brand.description']).catch(() => ({})),
  ]);

  const brandName = settings['brand.name'] || DEFAULT_SETTINGS['brand.name'];
  const brandDescription = settings['brand.description'] || DEFAULT_SETTINGS['brand.description'];

  // Group footer links by section
  const sections: Record<string, typeof footerLinks> = {};
  for (const link of footerLinks) {
    if (!sections[link.section]) sections[link.section] = [];
    sections[link.section].push(link);
  }

  const orderedSections = ['Publish', 'Discover', 'Company', 'Legal'].filter(s => sections[s]?.length);

  return (
    <footer className="relative bg-royal-900 text-cream-100 mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="floating-orb top-0 right-0 w-96 h-96 bg-royal-500/20" />
      <div className="floating-orb bottom-0 left-0 w-96 h-96 bg-gold-500/10" />

      <div className="relative container-lumin py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <Logo variant="light" size="md" />
            <p className="mt-6 text-cream-100/70 leading-relaxed text-sm max-w-sm">
              {brandDescription}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = iconMap[social.platform.toLowerCase()] || Mail;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-cream-100/20 flex items-center justify-center hover:border-gold-500 hover:bg-gold-500/10 hover:text-gold-400 transition-all"
                      aria-label={social.platform}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {orderedSections.map((sectionName) => (
            <div key={sectionName}>
              <h4 className="font-display text-base text-gold-300 mb-5 tracking-wide">{sectionName}</h4>
              <ul className="space-y-3">
                {sections[sectionName].map((link) => (
                  <li key={link.id}>
                    {link.isExternal ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cream-100/70 hover:text-gold-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.url}
                        className="text-sm text-cream-100/70 hover:text-gold-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-ornate opacity-30" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-100/50">
          <p>© {new Date().getFullYear()} {brandName} Publishing. All rights reserved.</p>
          <p className="font-serif italic">Crafted for storytellers, by storytellers.</p>
        </div>
      </div>
    </footer>
  );
}
