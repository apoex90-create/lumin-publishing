'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import CurrencyToggle from '@/components/layout/CurrencyToggle';

interface Props {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export default function DashboardTopbar({ user }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="sticky top-0 z-30 bg-cream-50/80 backdrop-blur-xl border-b border-royal-100">
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-gold-600 font-semibold">Welcome back</p>
          <h1 className="font-display text-2xl text-royal-900 italic">{user.fullName.split(' ')[0]}</h1>
        </div>

        <div className="flex items-center gap-4">
          <CurrencyToggle />

          <button className="relative p-2 text-royal-800 hover:text-gold-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-burgundy-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-royal-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-royal-700 to-burgundy-500 flex items-center justify-center text-cream-50 font-semibold text-sm">
                {initials}
              </div>
              <ChevronDown size={16} className="text-royal-800" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-cream-50 border border-royal-100 rounded-2xl shadow-royal z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-royal-100">
                    <p className="font-semibold text-royal-900 text-sm">{user.fullName}</p>
                    <p className="text-xs text-ink-900/60 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-royal-800 hover:bg-royal-100 transition-colors"
                  >
                    <User size={16} /> Profile Settings
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-sm bg-gold-50 text-gold-800 font-semibold hover:bg-gold-100 transition-colors border-y border-gold-200"
                    >
                      👑 Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-burgundy-600 hover:bg-burgundy-50 transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
