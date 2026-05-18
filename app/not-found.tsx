import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div className="floating-orb top-0 left-0 w-[500px] h-[500px] bg-royal-200/30" />
      <div className="floating-orb bottom-0 right-0 w-[500px] h-[500px] bg-gold-200/30" />

      <div className="container-lumin relative text-center max-w-2xl py-20">
        <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />

        <p className="eyebrow">Page Not Found</p>

        <h1 className="font-display text-[120px] md:text-[160px] font-light leading-none text-royal-900">
          <span className="text-gold-gradient italic">404</span>
        </h1>

        <h2 className="font-display text-3xl md:text-4xl text-royal-900 italic mt-4">
          This page seems to have wandered off.
        </h2>

        <p className="mt-6 text-lg text-ink-900/60 font-serif max-w-md mx-auto">
          The page you're looking for might have been moved, renamed, or never existed. Let's get you back on track.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-royal">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link href="/bookstore" className="btn-outline">
            <Search className="w-4 h-4 mr-2" />
            Browse Bookstore
          </Link>
        </div>

        <div className="mt-12 pt-12 border-t border-royal-100">
          <p className="text-sm text-ink-900/50 mb-4">Or try one of these popular pages:</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { href: '/how-it-works', label: 'How It Works' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/services', label: 'Services' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-royal-800 hover:text-gold-600 font-medium underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for could not be found.',
};
