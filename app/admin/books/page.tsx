import Link from 'next/link';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { prisma } from '@/lib/db';

const statusFilters = ['All', 'SUBMITTED', 'IN_REVIEW', 'IN_EDITING', 'PUBLISHED', 'REJECTED'];

export default async function AdminBooksPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const books = await prisma.book.findMany({
    where: status && status !== 'All' ? { status: status as any } : undefined,
    include: { author: true, sales: true },
    orderBy: { createdAt: 'desc' },
  });

  const pendingCount = await prisma.book.count({ where: { status: 'SUBMITTED' } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Content Management</p>
          <h2 className="font-display text-4xl text-cream-50 italic">All Books</h2>
          <p className="text-cream-100/50 mt-2 text-sm">
            {books.length} {status && status !== 'All' ? status.replace('_', ' ').toLowerCase() : 'total'} books
            {pendingCount > 0 && status !== 'SUBMITTED' && (
              <span className="ml-3 inline-flex items-center gap-1 text-gold-300">
                <Clock size={12} /> {pendingCount} awaiting review
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {statusFilters.map((s) => {
          const active = (s === 'All' && !status) || s === status;
          return (
            <Link
              key={s}
              href={s === 'All' ? '/admin/books' : `/admin/books?status=${s}`}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                active ? 'bg-gold-shimmer text-royal-900' : 'bg-cream-100/5 text-cream-100/60 hover:bg-cream-100/10 hover:text-cream-50'
              }`}
            >
              {s.replace('_', ' ')}
            </Link>
          );
        })}
      </div>

      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-cream-100/10 relative">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-100/30" />
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            className="w-full pl-12 pr-4 py-2.5 rounded-full bg-cream-100/5 border border-cream-100/10 text-cream-50 placeholder:text-cream-100/30 focus:border-gold-500 outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-100/5">
              <tr>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Book</th>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Author</th>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Genre</th>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Plan</th>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Status</th>
                <th className="text-right px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Sales</th>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Submitted</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-cream-100/40">No books found.</td></tr>
              ) : books.map((book) => (
                <tr key={book.id} className="border-t border-cream-100/5 hover:bg-cream-100/5">
                  <td className="px-6 py-4">
                    <Link href={`/admin/books/${book.id}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-14 rounded bg-gradient-to-br from-royal-700 to-burgundy-700 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-cream-50 font-medium group-hover:text-gold-300 transition-colors truncate">{book.title}</p>
                        {book.subtitle && <p className="text-xs text-cream-100/40 italic truncate">{book.subtitle}</p>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/authors/${book.author.id}`} className="text-sm text-cream-100/70 hover:text-gold-300">{book.author.fullName}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-cream-100/70">{book.genre}</td>
                  <td className="px-6 py-4 text-xs text-gold-300 font-semibold">{book.planTier}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${
                      book.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' :
                      book.status === 'SUBMITTED' ? 'bg-gold-500/20 text-gold-300' :
                      book.status === 'REJECTED' ? 'bg-burgundy-500/20 text-burgundy-300' :
                      'bg-royal-500/20 text-royal-300'
                    }`}>{book.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-cream-50">{book.sales.length}</td>
                  <td className="px-6 py-4 text-xs text-cream-100/50">{new Date(book.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/books/${book.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-500/10 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold">
                      <Eye size={12} /> Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
