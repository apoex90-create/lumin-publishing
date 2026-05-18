'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ApprovalActions({ approvalId }: { approvalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState('');

  async function decide(action: 'approve' | 'reject') {
    setLoading(action);
    await fetch(`/api/admin/approvals/${approvalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason }),
    });
    router.refresh();
    setLoading('');
    setRejectMode(false);
    setReason('');
  }

  if (rejectMode) {
    return (
      <div className="space-y-2 w-72">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why are you rejecting this?"
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-cream-100/5 border border-cream-100/10 text-cream-50 text-sm focus:border-gold-500 outline-none resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => decide('reject')}
            disabled={!reason || loading !== ''}
            className="flex-1 px-3 py-2 rounded-full bg-burgundy-500/20 border border-burgundy-400 text-burgundy-200 hover:bg-burgundy-500/30 text-xs font-bold disabled:opacity-50"
          >
            {loading === 'reject' ? <Loader2 className="w-3 h-3 animate-spin inline" /> : 'Confirm Reject'}
          </button>
          <button onClick={() => { setRejectMode(false); setReason(''); }} className="px-3 py-2 rounded-full border border-cream-100/20 text-cream-100/70 hover:bg-cream-100/5 text-xs">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 flex-shrink-0">
      <button
        onClick={() => decide('approve')}
        disabled={loading !== ''}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-cream-50 font-bold text-sm disabled:opacity-50"
      >
        {loading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={14} />}
        Approve
      </button>
      <button
        onClick={() => setRejectMode(true)}
        disabled={loading !== ''}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-burgundy-500/50 text-burgundy-300 hover:bg-burgundy-500/10 font-bold text-sm disabled:opacity-50"
      >
        <XCircle size={14} /> Reject
      </button>
    </div>
  );
}
