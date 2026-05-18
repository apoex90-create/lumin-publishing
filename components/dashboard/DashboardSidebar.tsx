'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Upload, BarChart3, DollarSign, Settings, HelpCircle } from 'lucide-react';
import Logo from '@/components/layout/Logo';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/books', label: 'My Books', icon: BookOpen },
  { href: '/dashboard/upload', label: 'Publish New', icon: Upload },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-royal-900 text-cream-100 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.04]" />
      <div className="floating-orb -top-20 -right-20 w-60 h-60 bg-gold-500/10" />

      <div className="relative h-full flex flex-col">
        <div className="p-6 border-b border-cream-100/10">
          <Logo variant="light" size="sm" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gold-shimmer text-royal-900 shadow-lg'
                    : 'text-cream-100/70 hover:bg-cream-100/5 hover:text-cream-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream-100/10">
          <Link
            href="/contact"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream-100/70 hover:text-gold-300 transition-colors"
          >
            <HelpCircle size={18} />
            Need help?
          </Link>
        </div>
      </div>
    </aside>
  );
}
