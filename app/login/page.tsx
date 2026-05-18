'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Login failed');
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
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
            <p className="eyebrow">Welcome Back</p>
            <h2 className="font-display text-4xl text-royal-900">Sign in</h2>
            <p className="text-sm text-ink-900/60 mt-2">Continue your publishing journey.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-900/70">
                <input type="checkbox" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-royal-800 hover:text-gold-600 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-royal w-full disabled:opacity-50"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-cream-100 rounded-xl text-xs text-ink-900/70 font-mono">
            <p className="font-semibold mb-2 text-royal-800">Demo credentials (after seeding):</p>
            <p>Author: author@lumin.demo / demo1234</p>
            <p>Admin: admin@lumin.demo / demo1234</p>
          </div>

          <p className="mt-6 text-center text-sm text-ink-900/60">
            New to LUMIN?{' '}
            <Link href="/signup" className="text-royal-800 hover:text-gold-600 font-semibold underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
