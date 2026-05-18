'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, DollarSign,
  Settings, Users2, Globe, BarChart3,
  AlertCircle, Crown, Shield, FileText
} from 'lucide-react';
import Logo from '@/components/layout/Logo';

const navSections = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Command Center', icon: LayoutDashboard },
      { href: '/admin/platform', label: 'Platform Stats', icon: BarChart3 },
    ],
  },
  {
    title: 'Autonomous Ops',
    items: [
      { href: '/admin/agents', label: 'Agent Control', icon: Crown },
      { href: '/admin/approvals', label: 'Approvals (King)', icon: AlertCircle },
    ],
  },
  {
    title: 'People',
    items: [
      { href: '/admin/authors', label: 'All Authors', icon: Users },
      { href: '/admin/team', label: 'Team & Roles', icon: Users2 },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/books', label: 'All Books', icon: BookOpen },
      { href: '/admin/books?status=SUBMITTED', label: 'Pending Review', icon: AlertCircle },
      { href: '/admin/content', label: 'Website Content', icon: FileText },
    ],
  },
  {
    title: 'Money',
    items: [
      { href: '/admin/earnings', label: 'Revenue & Payouts', icon: DollarSign },
    ],
  },
  {
    title: 'Website',
    items: [
      { href: '/admin/settings', label: 'Site Settings', icon: Globe },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-72 bg-ink-950 border-r border-gold-900/30 z-40 overflow-hidden">
      <div className="h-1 bg-gold-shimmer w-full" />

      <div className="p-6 border-b border-cream-100/5">
        <Logo variant="light" size="sm" />
        <div className="mt-3 inline-flex items-center gap-2 bg-gold-shimmer text-royal-900 px-3 py-1 rounded-full">
          <Crown size={12} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-4 mb-2 text-[10px] font-bold tracking-[0.25em] uppercase text-gold-600/70">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href.split('?')[0] && !pathname.includes('?');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-gold-shimmer text-royal-900 shadow-lg'
                        : 'text-cream-100/60 hover:bg-cream-100/5 hover:text-cream-50'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-cream-100/5">
        <Link href="/dashboard" className="block text-xs text-cream-100/40 hover:text-gold-300 text-center">
          ← Back to Author Dashboard
        </Link>
      </div>
    </aside>
  );
}
