'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, FileText, Trash2, Loader2 } from 'lucide-react';

interface Book {
  id: string;
  status: string;
  manuscriptUrl: string | null;
}

export default function AuthorBookActions({ book }: { book: Book }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function submitForReview() {
    if (!book.manuscriptUrl) {
      alert('Please upload your manuscript URL first by editing the book.');
      return;
    }
    if (!confirm('Submit for review? You will not be able to edit the manuscript after submission until our editorial team has reviewed it.')) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/books/${book.id}/submit`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      router.refresh();
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

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
            <button
              onClick={submitForReview}
              disabled={submitting}
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-gold-shimmer text-royal-900 font-semibold hover:scale-[1.02] disabled:opacity-50 text-sm"
            >
              {submitting ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Submitting...</> : <><Send size={14} className="mr-1" /> Submit for Review</>}
            </button>
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
