import Link from 'next/link';
import { BookOpen, TrendingUp, DollarSign, Eye, Plus, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-ink-100 text-ink-900',
  SUBMITTED: 'bg-royal-100 text-royal-800',
  IN_REVIEW: 'bg-royal-100 text-royal-800',
  IN_EDITING: 'bg-gold-100 text-gold-700',
  COVER_DESIGN: 'bg-gold-100 text-gold-700',
  FORMATTING: 'bg-gold-100 text-gold-700',
  PUBLISHED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-burgundy-100 text-burgundy-700',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const books = await prisma.book.findMany({
    where: { authorId: user.id },
    include: { sales: true },
    orderBy: { createdAt: 'desc' },
  });

  const totalBooks = books.length;
  const published = books.filter((b) => b.status === 'PUBLISHED').length;
  const totalSales = books.reduce((sum, b) => sum + b.sales.length, 0);
  const totalEarnings = books.reduce(
    (sum, b) => sum + b.sales.reduce((s, sale) => s + sale.amount, 0),
    0
  );

  const stats = [
    { label: 'Total Books', value: totalBooks, icon: BookOpen, color: 'from-royal-700 to-royal-900' },
    { label: 'Published', value: published, icon: TrendingUp, color: 'from-gold-500 to-gold-700' },
    { label: 'Total Sales', value: totalSales, icon: Eye, color: 'from-burgundy-500 to-burgundy-700' },
    { label: 'Earnings (₹)', value: totalEarnings.toFixed(0), icon: DollarSign, color: 'from-royal-800 to-burgundy-600' },
  ];

  return (
    <div className="space-y-10">
      {/* Hero CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-800 via-royal-900 to-ink-950 p-8 lg:p-12 text-cream-50 shadow-royal">
        <div className="absolute inset-0 bg-noise opacity-[0.04]" />
        <div className="floating-orb top-0 right-0 w-80 h-80 bg-gold-500/20" />

        <div className="relative max-w-2xl">
          <p className="eyebrow text-gold-300">Ready to publish?</p>
          <h2 className="font-display text-4xl lg:text-5xl font-light leading-tight mb-4">
            Begin your <em className="italic text-gold-gradient">next chapter.</em>
          </h2>
          <p className="text-cream-100/70 mb-6 max-w-lg">
            Upload a new manuscript, choose a plan, and we'll guide it through editing, design, and global distribution.
          </p>
          <Link href="/dashboard/upload" className="btn-gold inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Start New Book
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card-premium p-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="w-5 h-5 text-cream-50" />
            </div>
            <p className="font-display text-4xl text-royal-900">{stat.value}</p>
            <p className="text-xs tracking-widest uppercase text-ink-900/60 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent books */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-royal-900">Recent Books</h3>
          <Link href="/dashboard/books" className="text-sm text-royal-800 hover:text-gold-600 font-medium inline-flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <BookOpen className="w-16 h-16 text-royal-200 mx-auto mb-4" />
            <h4 className="font-display text-2xl text-royal-900 mb-2">No books yet</h4>
            <p className="text-ink-900/60 mb-6">Upload your first manuscript to begin.</p>
            <Link href="/dashboard/upload" className="btn-royal">
              Upload Manuscript
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {books.slice(0, 5).map((book) => (
              <div key={book.id} className="card-premium p-5 flex items-center gap-5">
                <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-royal-700 to-burgundy-600 flex-shrink-0 overflow-hidden">
                  {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-display text-xl text-royal-900 truncate">{book.title}</h4>
                      <p className="text-xs text-ink-900/60 mt-1">{book.genre} • {book.language}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider whitespace-nowrap ${statusColors[book.status]}`}>
                      {book.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-ink-900/70 mt-2 line-clamp-1">{book.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
