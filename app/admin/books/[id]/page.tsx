import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Edit, Eye, BookOpen, User } from 'lucide-react';
import { prisma } from '@/lib/db';
import BookStatusActions from '@/components/admin/BookStatusActions';

export default async function AdminBookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: true, sales: true },
  });

  if (!book) notFound();

  const revenue = book.sales.reduce((s, sale) => s + sale.amount, 0);

  return (
    <div>
      <Link href="/admin/books" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to all books
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-32 h-44 rounded-xl bg-gradient-to-br from-royal-700 via-royal-900 to-ink-950 flex-shrink-0 flex items-center justify-center shadow-2xl">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <BookOpen className="w-12 h-12 text-gold-400/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`inline-block text-[10px] font-bold tracking-wider px-2 py-1 rounded-full mb-3 ${
                  book.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300' :
                  book.status === 'SUBMITTED' ? 'bg-gold-500/20 text-gold-300' :
                  book.status === 'REJECTED' ? 'bg-burgundy-500/20 text-burgundy-300' :
                  'bg-royal-500/20 text-royal-300'
                }`}>{book.status.replace('_', ' ')}</span>
                <h1 className="font-display text-4xl text-cream-50 leading-tight">{book.title}</h1>
                {book.subtitle && <p className="text-xl italic text-cream-100/60 mt-2">{book.subtitle}</p>}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1 bg-cream-100/5 rounded-full text-cream-100/70">{book.genre}</span>
                  <span className="px-3 py-1 bg-cream-100/5 rounded-full text-cream-100/70">{book.language}</span>
                  <span className="px-3 py-1 bg-gold-500/10 rounded-full text-gold-300 font-semibold">{book.planTier}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-cream-100/10">
              <h3 className="text-xs tracking-widest uppercase text-gold-400 font-bold mb-2">Description</h3>
              <p className="text-cream-100/70 leading-relaxed">{book.description}</p>
            </div>
          </div>

          {/* Sales data */}
          <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
            <h3 className="font-display text-xl text-cream-50 mb-4">Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-display text-3xl text-gold-gradient">{book.sales.length}</p>
                <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-1">Total Sales</p>
              </div>
              <div>
                <p className="font-display text-3xl text-cream-50">₹{revenue.toLocaleString('en-IN')}</p>
                <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-1">Revenue</p>
              </div>
              <div>
                <p className="font-display text-3xl text-cream-50">₹{(revenue * 0.25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-1">Platform Cut</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with actions */}
        <div className="space-y-4">
          {/* Status actions */}
          <BookStatusActions bookId={book.id} currentStatus={book.status} />

          {/* Author info */}
          <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-5">
            <h3 className="text-xs tracking-widest uppercase text-gold-400 font-bold mb-3">Author</h3>
            <Link href={`/admin/authors/${book.author.id}`} className="block group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-burgundy-500 flex items-center justify-center text-cream-50 font-bold">
                  {book.author.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-cream-50 group-hover:text-gold-300 font-medium">{book.author.fullName}</p>
                  <p className="text-xs text-cream-100/50">{book.author.email}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Pricing */}
          <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-5">
            <h3 className="text-xs tracking-widest uppercase text-gold-400 font-bold mb-3">Pricing</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-cream-100/60">INR:</span><span className="text-cream-50 font-mono">₹{book.priceINR?.toFixed(0) || '—'}</span></div>
              <div className="flex justify-between"><span className="text-cream-100/60">USD:</span><span className="text-cream-50 font-mono">${book.priceUSD?.toFixed(2) || '—'}</span></div>
            </div>
          </div>

          {/* Files */}
          <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-5">
            <h3 className="text-xs tracking-widest uppercase text-gold-400 font-bold mb-3">Files</h3>
            <div className="space-y-2 text-sm">
              <p className="text-cream-100/60">Manuscript: {book.manuscriptUrl ? <a className="text-gold-300 underline">Download</a> : '—'}</p>
              <p className="text-cream-100/60">Cover: {book.coverUrl ? <a className="text-gold-300 underline">View</a> : '—'}</p>
              <p className="text-cream-100/60">ISBN: <span className="text-cream-50 font-mono">{book.isbn || '—'}</span></p>
            </div>
          </div>

          {/* Edit button */}
          <Link href={`/admin/books/${book.id}/edit`} className="block w-full text-center px-4 py-3 rounded-full bg-cream-100/5 border border-cream-100/20 text-cream-50 hover:bg-cream-100/10 transition-all font-medium">
            <Edit size={14} className="inline mr-2" /> Edit All Details
          </Link>
        </div>
      </div>
    </div>
  );
}
