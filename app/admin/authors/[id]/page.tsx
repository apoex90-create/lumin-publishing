import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Calendar, BookOpen, TrendingUp, DollarSign, Edit, Ban, Crown } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function AdminAuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await prisma.user.findUnique({
    where: { id },
    include: {
      books: {
        include: { sales: true },
        orderBy: { createdAt: 'desc' },
      },
      transactions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  if (!author) notFound();

  const initials = author.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const totalSales = author.books.reduce((sum, b) => sum + b.sales.length, 0);
  const totalRevenue = author.books.reduce((sum, b) => sum + b.sales.reduce((s, sale) => s + sale.amount, 0), 0);
  const published = author.books.filter(b => b.status === 'PUBLISHED').length;

  return (
    <div>
      <Link href="/admin/authors" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to all authors
      </Link>

      {/* Profile header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-800 via-royal-900 to-ink-950 p-8 mb-6 border border-gold-900/30">
        <div className="absolute inset-0 bg-noise opacity-[0.04]" />
        <div className="floating-orb top-0 right-0 w-80 h-80 bg-gold-500/20" />

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-burgundy-500 flex items-center justify-center text-cream-50 font-display text-3xl font-bold shadow-2xl">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-4xl text-cream-50">{author.fullName}</h1>
                {author.role === 'ADMIN' && (
                  <span className="inline-flex items-center gap-1 bg-gold-shimmer text-royal-900 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider">
                    <Crown size={10} /> ADMIN
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-cream-100/70">
                <span className="inline-flex items-center gap-1.5"><Mail size={14} /> {author.email}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {author.country || '—'}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(author.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {author.bio && <p className="mt-3 text-cream-100/60 italic max-w-2xl">{author.bio}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/admin/authors/${author.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-shimmer text-royal-900 font-semibold text-sm">
              <Edit size={14} /> Edit Profile
            </Link>
            <a href={`mailto:${author.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-100/30 text-cream-50 hover:bg-cream-100/10 text-sm font-medium">
              <Mail size={14} /> Message
            </a>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-burgundy-500/50 text-burgundy-300 hover:bg-burgundy-500/10 text-sm font-medium">
              <Ban size={14} /> Suspend
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Books', value: author.books.length, icon: BookOpen, color: 'from-royal-600 to-royal-800' },
          { label: 'Published', value: published, icon: TrendingUp, color: 'from-green-600 to-green-800' },
          { label: 'Total Sales', value: totalSales, icon: TrendingUp, color: 'from-burgundy-500 to-burgundy-700' },
          { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'from-gold-500 to-gold-700' },
        ].map((s, i) => (
          <div key={i} className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-cream-50" />
            </div>
            <p className="font-display text-3xl text-cream-50">{s.value}</p>
            <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Books table */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-b border-cream-100/10">
          <h3 className="font-display text-xl text-cream-50">All Books by this Author</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-100/5">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Title</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Genre</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Plan</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Status</th>
                <th className="text-right px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Sales</th>
                <th className="text-right px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {author.books.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-cream-100/40">No books yet.</td></tr>
              ) : author.books.map((book) => {
                const revenue = book.sales.reduce((s, sale) => s + sale.amount, 0);
                return (
                  <tr key={book.id} className="border-t border-cream-100/5 hover:bg-cream-100/5">
                    <td className="px-6 py-4">
                      <Link href={`/admin/books/${book.id}`} className="text-cream-50 font-medium hover:text-gold-300">{book.title}</Link>
                      {book.subtitle && <p className="text-xs text-cream-100/40 italic">{book.subtitle}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-cream-100/70">{book.genre}</td>
                    <td className="px-6 py-4 text-xs text-gold-300 font-semibold">{book.planTier}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-full ${
                        book.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' :
                        book.status === 'SUBMITTED' ? 'bg-gold-500/20 text-gold-300' :
                        'bg-royal-500/20 text-royal-300'
                      }`}>{book.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-cream-50">{book.sales.length}</td>
                    <td className="px-6 py-4 text-right text-gold-300 font-mono">₹{revenue.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-cream-100/10">
          <h3 className="font-display text-xl text-cream-50">Recent Transactions</h3>
        </div>
        {author.transactions.length === 0 ? (
          <p className="p-8 text-center text-cream-100/40 text-sm">No transactions yet.</p>
        ) : (
          <table className="w-full">
            <tbody>
              {author.transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-cream-100/5">
                  <td className="px-6 py-3 text-xs text-cream-100/50">{new Date(tx.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-3 text-sm text-cream-50 capitalize">{tx.type.replace('_', ' ')}</td>
                  <td className="px-6 py-3 text-sm text-cream-100/70">{tx.reference || '—'}</td>
                  <td className="px-6 py-3 text-right font-mono text-gold-300">
                    {tx.amount > 0 ? '+' : ''}₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
