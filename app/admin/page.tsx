import Link from 'next/link';
import { Users, BookOpen, DollarSign, TrendingUp, AlertCircle, Eye, ArrowRight, Plus, Activity, Crown } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function AdminCommandCenter() {
  // Real-time platform stats
  const [totalAuthors, totalBooks, pendingReview, publishedBooks, totalSales, recentBooks, recentAuthors] = await Promise.all([
    prisma.user.count({ where: { role: 'AUTHOR' } }),
    prisma.book.count(),
    prisma.book.count({ where: { status: 'SUBMITTED' } }),
    prisma.book.count({ where: { status: 'PUBLISHED' } }),
    prisma.sale.findMany(),
    prisma.book.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { fullName: true, email: true } } },
    }),
    prisma.user.findMany({
      where: { role: 'AUTHOR' },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalRevenue = totalSales.reduce((sum, s) => sum + s.amount, 0);
  const platformCut = totalRevenue * 0.25;

  const stats = [
    { label: 'Total Authors', value: totalAuthors, icon: Users, color: 'from-royal-600 to-royal-800', href: '/admin/authors' },
    { label: 'Total Books', value: totalBooks, icon: BookOpen, color: 'from-burgundy-500 to-burgundy-700', href: '/admin/books' },
    { label: 'Pending Review', value: pendingReview, icon: AlertCircle, color: 'from-gold-500 to-gold-700', href: '/admin/books?status=SUBMITTED', urgent: pendingReview > 0 },
    { label: 'Published Live', value: publishedBooks, icon: TrendingUp, color: 'from-green-600 to-green-800', href: '/admin/books?status=PUBLISHED' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'from-royal-700 to-burgundy-700', href: '/admin/earnings' },
    { label: 'Platform Cut', value: `₹${platformCut.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: Crown, color: 'from-gold-600 to-gold-800', href: '/admin/earnings' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-800 via-royal-900 to-ink-950 p-8 lg:p-10 text-cream-50 shadow-2xl border border-gold-900/30">
        <div className="absolute inset-0 bg-noise opacity-[0.04]" />
        <div className="floating-orb top-0 right-0 w-80 h-80 bg-gold-500/20" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Command Center</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light mt-2">
              Everything in your <em className="italic text-gold-gradient">kingdom.</em>
            </h2>
            <p className="text-cream-100/60 mt-3 max-w-xl">Real-time control over your entire publishing platform. Authors, books, money, team — all from one place.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/authors/new" className="btn-gold">
              <Plus className="w-4 h-4 mr-2" /> Add Author
            </Link>
            <Link href="/admin/team" className="px-6 py-3 rounded-full border border-cream-100/30 text-cream-50 hover:bg-cream-100/10 transition-all font-medium">
              Manage Team
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="relative group bg-ink-900/60 backdrop-blur-sm border border-cream-100/10 hover:border-gold-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1">
            {stat.urgent && (
              <span className="absolute top-3 right-3 w-3 h-3 bg-burgundy-500 rounded-full animate-pulse" />
            )}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="w-5 h-5 text-cream-50" />
            </div>
            <p className="font-display text-4xl text-cream-50">{stat.value}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs tracking-widest uppercase text-cream-100/50">{stat.label}</p>
              <ArrowRight className="w-4 h-4 text-cream-100/30 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column: Recent books + Recent authors */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-cream-100/10 flex items-center justify-between">
            <h3 className="font-display text-xl text-cream-50">Recent Submissions</h3>
            <Link href="/admin/books" className="text-xs text-gold-400 hover:text-gold-300 font-semibold tracking-widest uppercase">View all →</Link>
          </div>
          <div className="divide-y divide-cream-100/5">
            {recentBooks.length === 0 ? (
              <p className="p-6 text-cream-100/40 text-sm text-center">No books submitted yet.</p>
            ) : recentBooks.map((book) => (
              <Link key={book.id} href={`/admin/books/${book.id}`} className="flex items-center gap-4 p-4 hover:bg-cream-100/5 transition-colors">
                <div className="w-12 h-16 rounded bg-gradient-to-br from-royal-700 to-burgundy-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-cream-50 text-base truncate">{book.title}</p>
                  <p className="text-xs text-cream-100/50 mt-0.5">by {book.author.fullName} • {book.genre}</p>
                </div>
                <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${
                  book.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' :
                  book.status === 'SUBMITTED' ? 'bg-gold-500/20 text-gold-300' :
                  'bg-royal-500/20 text-royal-300'
                }`}>{book.status.replace('_', ' ')}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-cream-100/10 flex items-center justify-between">
            <h3 className="font-display text-xl text-cream-50">New Authors</h3>
            <Link href="/admin/authors" className="text-xs text-gold-400 hover:text-gold-300 font-semibold tracking-widest uppercase">View all →</Link>
          </div>
          <div className="divide-y divide-cream-100/5">
            {recentAuthors.length === 0 ? (
              <p className="p-6 text-cream-100/40 text-sm text-center">No authors yet.</p>
            ) : recentAuthors.map((author) => {
              const initials = author.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <Link key={author.id} href={`/admin/authors/${author.id}`} className="flex items-center gap-4 p-4 hover:bg-cream-100/5 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-burgundy-500 flex items-center justify-center text-cream-50 font-bold text-sm">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-cream-50 font-medium truncate">{author.fullName}</p>
                    <p className="text-xs text-cream-100/50 truncate">{author.email}</p>
                  </div>
                  <span className="text-xs text-cream-100/40">{author.country}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
        <h3 className="font-display text-xl text-cream-50 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Edit Homepage', href: '/admin/settings', icon: Eye },
            { label: 'Manage Pricing', href: '/admin/settings/pricing', icon: DollarSign },
            { label: 'Review Books', href: '/admin/books?status=SUBMITTED', icon: BookOpen },
            { label: 'View Reports', href: '/admin/platform', icon: Activity },
          ].map((a, i) => (
            <Link key={i} href={a.href} className="flex items-center gap-3 p-4 bg-cream-100/5 hover:bg-gold-500/10 rounded-xl text-cream-100/70 hover:text-gold-300 transition-all border border-transparent hover:border-gold-500/30">
              <a.icon size={18} />
              <span className="text-sm font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
