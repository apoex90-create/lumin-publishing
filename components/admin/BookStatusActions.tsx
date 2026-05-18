'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const statusFlow = ['SUBMITTED', 'IN_REVIEW', 'IN_EDITING', 'COVER_DESIGN', 'FORMATTING', 'PUBLISHED'];

export default function BookStatusActions({ bookId, currentStatus }: { bookId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState('');

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    try {
      await fetch(`/api/admin/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
    setLoading('');
  }

  const currentIdx = statusFlow.indexOf(currentStatus);
  const nextStatus = currentIdx >= 0 && currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  return (
    <div className="bg-gradient-to-br from-gold-500/10 to-gold-700/5 border border-gold-500/30 rounded-2xl p-5">
      <h3 className="text-xs tracking-widest uppercase text-gold-400 font-bold mb-3">Admin Actions</h3>
      <div className="space-y-2">
        {nextStatus && (
          <button
            onClick={() => updateStatus(nextStatus)}
            disabled={loading !== ''}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gold-shimmer text-royal-900 font-semibold text-sm disabled:opacity-50"
          >
            {loading === nextStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={14} />}
            Move to: {nextStatus.replace('_', ' ')}
          </button>
        )}
        {currentStatus !== 'PUBLISHED' && (
          <button
            onClick={() => updateStatus('PUBLISHED')}
            disabled={loading !== ''}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-green-600 text-cream-50 hover:bg-green-700 font-semibold text-sm disabled:opacity-50"
          >
            {loading === 'PUBLISHED' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={14} />}
            Publish Now
          </button>
        )}
        {currentStatus !== 'REJECTED' && (
          <button
            onClick={() => updateStatus('REJECTED')}
            disabled={loading !== ''}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-burgundy-500/50 text-burgundy-300 hover:bg-burgundy-500/10 font-semibold text-sm disabled:opacity-50"
          >
            {loading === 'REJECTED' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle size={14} />}
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
