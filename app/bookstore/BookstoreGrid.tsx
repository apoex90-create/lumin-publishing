'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/lib/currency-context';
import { formatPrice } from '@/lib/plans';

interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  author: string;
  genre: string;
  cover: string;
  priceINR: number;
  priceUSD: number;
}

export default function BookstoreGrid({ books, genres }: { books: Book[]; genres: string[] }) {
  const { currency } = useCurrency();
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (genre !== 'All' && b.genre !== genre) return false;
      if (search) {
        const s = search.toLowerCase();
        return b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s);
      }
      return true;
    });
  }, [books, search, genre]);

  return (
    <>
      <section className="pb-8">
        <div className="container-lumin max-w-5xl">
          <div className="card-premium p-6 flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-900/40" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream-50 border border-royal-100 focus:border-gold-500 outline-none"
              />
            </div>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="px-4 py-3 rounded-xl bg-cream-50 border border-royal-100 focus:border-gold-500 outline-none min-w-[180px]"
            >
              <option value="All">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-lumin">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-900/50">No books match your filters.</p>
              <button onClick={() => { setSearch(''); setGenre('All'); }} className="mt-4 text-gold-700 underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {filtered.map((book) => (
                <Link key={book.id} href={`/bookstore/${book.id}`} className="group cursor-pointer">
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
          )}
        </div>
      </section>
    </>
  );
}
