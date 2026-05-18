import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';
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

export default async function MyBooksPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const books = await prisma.book.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <p className="eyebrow">Library</p>
          <h2 className="font-display text-4xl text-royal-900">My Books</h2>
        </div>
        <Link href="/dashboard/upload" className="btn-royal">
          <Plus className="w-4 h-4 mr-2" /> New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="card-premium p-16 text-center">
          <BookOpen className="w-16 h-16 text-royal-200 mx-auto mb-4" />
          <h4 className="font-display text-2xl text-royal-900 mb-2">Your library awaits</h4>
          <p className="text-ink-900/60 mb-6">Upload your first manuscript to begin publishing.</p>
          <Link href="/dashboard/upload" className="btn-royal">Upload Manuscript</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="card-premium overflow-hidden">
              <div className="aspect-[3/4] bg-gradient-to-br from-royal-700 to-burgundy-700 relative overflow-hidden">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <div>
                      <BookOpen className="w-12 h-12 text-gold-300 mx-auto mb-3 opacity-50" />
                      <p className="font-display text-cream-50 italic text-lg">{book.title}</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${statusColors[book.status]}`}>
                    {book.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-[10px] tracking-widest uppercase text-gold-700 font-semibold">{book.genre}</p>
                <h3 className="font-display text-xl text-royal-900 mt-1">{book.title}</h3>
                {book.subtitle && <p className="text-sm italic text-ink-900/60 mt-1">{book.subtitle}</p>}
                <p className="text-xs text-ink-900/60 mt-3 line-clamp-2">{book.description}</p>

                <div className="mt-4 pt-4 border-t border-royal-100 flex items-center justify-between">
                  <span className="text-xs text-ink-900/60">
                    {book.planTier} plan
                  </span>
                  <Link href={`/dashboard/books/${book.id}`} className="text-xs font-semibold text-royal-800 hover:text-gold-600">
                    Manage →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
