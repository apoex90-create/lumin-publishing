'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCurrency } from '@/lib/currency-context';
import { formatPrice } from '@/lib/plans';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  cover: string;
  priceINR: number;
  priceUSD: number;
}

export default function FeaturedBooksGrid({ books }: { books: Book[] }) {
  const { currency } = useCurrency();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {books.map((book) => (
        <Link href={`/bookstore/${book.id}`} key={book.id} className="group cursor-pointer">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl group-hover:shadow-royal transition-all duration-500 group-hover:-translate-y-2">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-royal-900/80 via-transparent to-transparent" />
          </div>

          <div className="mt-4">
            <p className="text-[10px] tracking-widest uppercase text-gold-700 font-semibold">{book.genre}</p>
            <h3 className="font-display text-xl text-royal-900 mt-1 group-hover:text-gold-700 transition-colors leading-tight">
              {book.title}
            </h3>
            <p className="text-sm text-ink-900/60 italic mt-1">by {book.author}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display text-lg text-royal-900">
                {formatPrice(currency === 'INR' ? book.priceINR : book.priceUSD, currency)}
              </span>
              <ArrowRight className="w-4 h-4 text-royal-800 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
