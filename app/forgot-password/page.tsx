'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 relative overflow-hidden">
      <div className="floating-orb top-0 left-0 w-[600px] h-[600px] bg-royal-200/40" />
      <div className="floating-orb bottom-0 right-0 w-[600px] h-[600px] bg-gold-200/30" />

      <div className="container-lumin relative max-w-md">
        <div className="card-premium p-8 lg:p-12">
          <div className="text-center mb-8">
            <Ornament className="w-24 h-6 text-gold-500 mx-auto mb-6" />
            <p className="eyebrow">Account Recovery</p>
            <h2 className="font-display text-4xl text-royal-900">Forgot Password</h2>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-ink-900/80 text-sm leading-relaxed">
                If <strong>{email}</strong> is registered, you will receive a password reset link shortly.
                Check your inbox and spam folder.
              </p>
              <p className="text-xs text-ink-900/50">The link expires in 1 hour.</p>
              <Link href="/login" className="btn-royal inline-block mt-4">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink-900/60 text-center mb-6">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-royal w-full disabled:opacity-50">
                  {loading
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                    : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-900/60">
                Remembered it?{' '}
                <Link href="/login" className="text-royal-800 hover:text-gold-600 font-semibold underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
