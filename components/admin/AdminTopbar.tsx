'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, ChevronDown, LogOut, User, Search, Crown } from 'lucide-react';

interface Props {
  user: { id: string; fullName: string; email: string; role: string };
}

export default function AdminTopbar({ user }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="sticky top-0 z-30 bg-ink-950/95 backdrop-blur-xl border-b border-gold-900/30">
      <div className="flex items-center justify-between px-6 lg:px-10 py-4 gap-6">
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-gold-400" />
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold-500/70 font-bold">Administrator Access</p>
            <h1 className="font-display text-xl text-cream-50 italic">Welcome, {user.fullName.split(' ')[0]}</h1>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-100/30" />
          <input
            type="text"
            placeholder="Search authors, books, transactions..."
            className="w-full pl-12 pr-4 py-2.5 rounded-full bg-cream-100/5 border border-cream-100/10 text-cream-50 placeholder:text-cream-100/30 focus:border-gold-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-cream-100/60 hover:text-gold-400 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-burgundy-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-cream-100/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gold-shimmer flex items-center justify-center text-royal-900 font-bold text-sm">
                {initials}
              </div>
              <ChevronDown size={14} className="text-cream-100/60" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-ink-950 border border-gold-900/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-cream-100/5">
                    <p className="font-semibold text-cream-50 text-sm">{user.fullName}</p>
                    <p className="text-xs text-cream-100/40 truncate">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gold-shimmer text-royal-900 rounded-full text-[10px] font-bold tracking-wider">ADMIN</span>
                  </div>
                  <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-3 text-sm text-cream-100/70 hover:bg-cream-100/5 hover:text-cream-50">
                    <User size={16} /> Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-burgundy-400 hover:bg-burgundy-500/10">
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
