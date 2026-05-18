'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Loader2 } from 'lucide-react';

export default function AgentToggle({ agentId, currentStatus }: { agentId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    await fetch(`/api/admin/agents/${agentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setLoading(false);
  }

  const active = currentStatus === 'ACTIVE';

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all ${
        active
          ? 'bg-green-500/20 text-green-300 border border-green-500/40'
          : 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
      } disabled:opacity-50`}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : active ? <Play size={10} /> : <Pause size={10} />}
      {active ? 'ACTIVE' : 'PAUSED'}
    </button>
  );
}
