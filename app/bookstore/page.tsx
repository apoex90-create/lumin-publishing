import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';
import { prisma } from '@/lib/db';
import BookstoreGrid from './BookstoreGrid';

export const dynamic = 'force-dynamic';

export default async function BookstorePage() {
  const books = await prisma.book.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: { select: { fullName: true } } },
    orderBy: { publishedAt: 'desc' },
  }).catch(() => []);

  const allGenres = Array.from(new Set(books.map((b) => b.genre))).sort();

  return (
    <>
      <section className="relative section-pad overflow-hidden">
        <div className="floating-orb top-20 -left-20 w-[500px] h-[500px] bg-royal-200/30" />
        <div className="floating-orb top-40 -right-20 w-[400px] h-[400px] bg-gold-200/30" />

        <div className="container-lumin relative max-w-4xl text-center">
          <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-6" />
          <p className="eyebrow">Bookstore</p>
          <h1 className="h-display text-royal-900">
            Stories crafted with <em className="italic text-gold-gradient">care</em>
          </h1>
          <p className="mt-8 text-xl text-ink-900/70 font-serif leading-relaxed">
            Discover books from authors published with us. Every book here was shepherded through editing, design, and craft.
          </p>
        </div>
      </section>

      {books.length === 0 ? (
        <section className="pb-32">
          <div className="container-lumin max-w-2xl text-center">
            <div className="card-premium p-12">
              <BookOpen className="w-12 h-12 text-gold-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-royal-900 mb-3">No books published yet</h2>
              <p className="text-ink-900/60 mb-6">Our authors are putting the finishing touches on their first books. Check back soon!</p>
              <Link href="/signup" className="btn-royal">
                Become a Published Author
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <BookstoreGrid
          books={books.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            author: b.author.fullName,
            genre: b.genre,
            cover: b.coverUrl || `https://placehold.co/600x900/1f1547/d4a017?text=${encodeURIComponent(b.title)}`,
            priceINR: b.priceINR || 0,
            priceUSD: b.priceUSD || 0,
          }))}
          genres={allGenres}
        />
      )}
    </>
  );
}
