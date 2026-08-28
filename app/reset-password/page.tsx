'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-burgundy-700">Invalid reset link. Please request a new one.</p>
        <Link href="/forgot-password" className="btn-royal inline-block">Request New Link</Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-ink-900/80">Password reset successfully. Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">
          {error}
          {error.includes('invalid or has expired') && (
            <> <Link href="/forgot-password" className="underline font-semibold">Request a new link.</Link></>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-royal-700 hover:text-royal-900"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
            Confirm New Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
            placeholder="Re-enter your new password"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-royal w-full disabled:opacity-50">
          {loading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting…</>
            : 'Reset Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 relative overflow-hidden">
      <div className="floating-orb top-0 left-0 w-[600px] h-[600px] bg-royal-200/40" />
      <div className="floating-orb bottom-0 right-0 w-[600px] h-[600px] bg-gold-200/30" />

      <div className="container-lumin relative max-w-md">
        <div className="card-premium p-8 lg:p-12">
          <div className="text-center mb-8">
            <Ornament className="w-24 h-6 text-gold-500 mx-auto mb-6" />
            <p className="eyebrow">Account Recovery</p>
            <h2 className="font-display text-4xl text-royal-900">Reset Password</h2>
            <p className="text-sm text-ink-900/60 mt-2">Choose a new secure password.</p>
          </div>

          <Suspense fallback={<div className="text-center text-sm text-ink-900/60">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
