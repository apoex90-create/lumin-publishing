import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import SectionHeading from '@/components/ui/SectionHeading';
import FeaturedBooksGrid from './FeaturedBooksGrid';

export default async function FeaturedBooks() {
  const books = await prisma.book.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: { select: { fullName: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 4,
  }).catch(() => []);

  // Don't render section at all if no published books
  if (books.length === 0) return null;

  return (
    <section className="section-pad relative">
      <div className="container-lumin">
        <SectionHeading
          eyebrow="From Our Bookstore"
          title={<>Recently <em className="italic text-gold-gradient">published</em></>}
          description="Each book here was born from a manuscript, polished by our craft, and now reaches readers worldwide."
        />

        <FeaturedBooksGrid books={books.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author.fullName,
          genre: b.genre,
          cover: b.coverUrl || `https://placehold.co/600x900/1f1547/d4a017?text=${encodeURIComponent(b.title)}`,
          priceINR: b.priceINR || 0,
          priceUSD: b.priceUSD || 0,
        }))} />

        <div className="text-center mt-16">
          <Link href="/bookstore" className="btn-outline">
            Explore the Bookstore
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
