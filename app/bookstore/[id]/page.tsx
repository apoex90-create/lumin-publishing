import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Globe, FileText, Award, ShoppingCart } from 'lucide-react';
import { prisma } from '@/lib/db';
import Ornament from '@/components/ui/Ornament';
import BookPriceBlock from '@/components/BookPriceBlock';

export const dynamic = 'force-dynamic';

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id, status: 'PUBLISHED' },
    include: {
      author: { select: { fullName: true, bio: true, avatarUrl: true, country: true } },
    },
  }).catch(() => null);

  if (!book) notFound();

  // Get other books by same author
  const otherBooks = await prisma.book.findMany({
    where: {
      authorId: book.authorId,
      status: 'PUBLISHED',
      id: { not: book.id },
    },
    take: 3,
  }).catch(() => []);

  const coverUrl = book.coverUrl || `https://placehold.co/600x900/1f1547/d4a017?text=${encodeURIComponent(book.title)}`;

  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

        <div className="container-lumin relative">
          <Link href="/bookstore" className="inline-flex items-center gap-2 text-ink-900/60 hover:text-gold-700 mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Bookstore
          </Link>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-royal">
                  <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="card-premium p-3">
                    <Globe className="w-5 h-5 text-gold-600 mx-auto mb-1" />
                    <p className="text-[10px] tracking-widest uppercase text-ink-900/50">Language</p>
                    <p className="text-sm font-semibold text-royal-900">{book.language}</p>
                  </div>
                  <div className="card-premium p-3">
                    <FileText className="w-5 h-5 text-gold-600 mx-auto mb-1" />
                    <p className="text-[10px] tracking-widest uppercase text-ink-900/50">Pages</p>
                    <p className="text-sm font-semibold text-royal-900">{book.pageCount || '—'}</p>
                  </div>
                  <div className="card-premium p-3">
                    <Award className="w-5 h-5 text-gold-600 mx-auto mb-1" />
                    <p className="text-[10px] tracking-widest uppercase text-ink-900/50">Genre</p>
                    <p className="text-xs font-semibold text-royal-900 truncate">{book.genre}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="eyebrow">{book.genre}</p>
              <h1 className="font-display text-5xl md:text-6xl text-royal-900 font-light leading-tight mt-2">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="font-display text-2xl text-royal-700 italic mt-3">{book.subtitle}</p>
              )}

              <div className="mt-6 flex items-center gap-3">
                {book.author.avatarUrl ? (
                  <img src={book.author.avatarUrl} alt={book.author.fullName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-burgundy-500 to-royal-800 flex items-center justify-center text-cream-50 font-display text-lg">
                    {book.author.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs tracking-widest uppercase text-ink-900/50">Author</p>
                  <p className="font-display text-xl text-royal-900">{book.author.fullName}</p>
                </div>
              </div>

              <div className="mt-10 prose prose-lg max-w-none">
                <p className="text-ink-900/80 leading-relaxed font-serif">{book.description}</p>
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-royal-900 to-ink-950 text-cream-50">
                <BookPriceBlock priceINR={book.priceINR || 0} priceUSD={book.priceUSD || 0} />
              </div>

              {book.isbn && (
                <div className="mt-6 text-xs tracking-widest uppercase text-ink-900/40">
                  ISBN: {book.isbn}
                </div>
              )}

              {book.author.bio && (
                <div className="mt-12 pt-8 border-t border-royal-100">
                  <p className="eyebrow">About the Author</p>
                  <h3 className="font-display text-2xl text-royal-900 mt-2">{book.author.fullName}</h3>
                  <p className="text-ink-900/70 mt-3 leading-relaxed">{book.author.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {otherBooks.length > 0 && (
        <section className="section-pad bg-cream-100/40">
          <div className="container-lumin">
            <div className="text-center mb-12">
              <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
              <p className="eyebrow">More from this author</p>
              <h2 className="font-display text-4xl text-royal-900 italic">Other works</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {otherBooks.map((b) => (
                <Link key={b.id} href={`/bookstore/${b.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all">
                    <img
                      src={b.coverUrl || `https://placehold.co/600x900/1f1547/d4a017?text=${encodeURIComponent(b.title)}`}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="mt-3 font-display text-lg text-royal-900 group-hover:text-gold-700">{b.title}</p>
                  <p className="text-xs text-ink-900/50 italic">{b.genre}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: { select: { fullName: true } } },
  }).catch(() => null);

  if (!book) return { title: 'Book not found' };

  return {
    title: `${book.title} — ${book.author.fullName}`,
    description: book.description.slice(0, 160),
  };
}
