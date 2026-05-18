'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import CurrencyToggle from './CurrencyToggle';

const navItems = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/bookstore', label: 'Bookstore' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/85 backdrop-blur-xl border-b border-royal-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-lumin flex items-center justify-between py-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-royal-800 hover:text-gold-600 transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <CurrencyToggle />
          <Link href="/login" className="text-sm font-medium text-royal-800 hover:text-gold-600 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="btn-royal py-2.5 px-6 text-sm">
            Publish Your Book
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-royal-900"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-cream-50 border-t border-royal-100 shadow-lg">
          <div className="container-lumin py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-royal-800 py-2 border-b border-royal-100"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4">
              <CurrencyToggle />
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-royal-800">
                Sign In
              </Link>
            </div>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-royal text-center">
              Publish Your Book
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
