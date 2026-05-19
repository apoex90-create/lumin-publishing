'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';

export default function CompleteOnboardingButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function complete() {
    setLoading(true);
    try {
      await fetch('/api/account/onboarding', { method: 'POST' });
      router.push('/dashboard');
      router.refresh();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={complete} disabled={loading} className="btn-gold disabled:opacity-50">
      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...</> : <>Got it, go to Dashboard <ArrowRight className="w-4 h-4 ml-2" /></>}
    </button>
  );
}
