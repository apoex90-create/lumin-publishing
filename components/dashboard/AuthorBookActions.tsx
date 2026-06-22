'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, FileText, Trash2 } from 'lucide-react';

interface Book {
  id: string;
  status: string;
  manuscriptUrl: string | null;
}

export default function AuthorBookActions({ book }: { book: Book }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteBook() {
    if (!confirm('Delete this book? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/dashboard/books');
    } catch (err: any) {
      alert(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="card-premium p-5">
      <h3 className="text-xs tracking-widest uppercase text-ink-900/60 font-bold mb-3">Actions</h3>
      <div className="space-y-2">
        {book.status === 'DRAFT' && (
          <>
            <Link href={`/dashboard/books/${book.id}/edit`} className="block w-full text-center py-2.5 rounded-full bg-royal-50 text-royal-800 hover:bg-royal-100 text-sm font-medium">
              <FileText size={14} className="inline mr-1" /> Edit Book Details
            </Link>
            {book.manuscriptUrl ? (
              <Link
                href={`/dashboard/books/${book.id}/pay`}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-gold-shimmer text-royal-900 font-semibold hover:scale-[1.02] text-sm"
              >
                <CreditCard size={14} className="mr-1" /> Proceed to Payment
              </Link>
            ) : (
              <p className="text-xs text-ink-900/50 italic text-center py-2">Upload your manuscript to proceed to payment.</p>
            )}
            <button
              onClick={deleteBook}
              disabled={deleting}
              className="w-full inline-flex items-center justify-center py-2 rounded-full border border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50 text-xs font-medium"
            >
              <Trash2 size={12} className="mr-1" /> Delete Draft
            </button>
          </>
        )}

        {book.status === 'PUBLISHED' && (
          <Link href={`/bookstore/${book.id}`} target="_blank" className="block w-full text-center py-2.5 rounded-full bg-gold-shimmer text-royal-900 font-semibold text-sm">
            View on Bookstore →
          </Link>
        )}

        {book.status !== 'DRAFT' && book.status !== 'PUBLISHED' && (
          <p className="text-xs text-ink-900/50 italic text-center py-4">
            Your book is being processed. We'll email you with any questions.
          </p>
        )}
      </div>
    </div>
  );
}
