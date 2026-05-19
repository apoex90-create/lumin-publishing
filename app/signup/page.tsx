'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Ornament from '@/components/ui/Ornament';

export default function SignupPage() {
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
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      country: formData.get('country'),
    };

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Signup failed');
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

      <div className="container-lumin relative grid lg:grid-cols-2 gap-16 items-center max-w-6xl">
        {/* Left: branding */}
        <div className="hidden lg:block">
          <Ornament className="w-32 h-6 text-gold-500 mb-8" />
          <p className="eyebrow">Join the Circle</p>
          <h1 className="font-display text-6xl text-royal-900 font-light leading-[1.05]">
            Welcome,
            <br />
            <em className="italic text-gold-gradient">storyteller.</em>
          </h1>
          <p className="mt-8 text-lg text-ink-900/70 font-serif leading-relaxed max-w-md">
            You're moments away from joining a growing community of authors who chose us as the home for their words.
          </p>
          <div className="mt-12 space-y-4">
            {[
              'Publish in as little as 7 days',
              'Premium cover design included',
              'Global distribution to 180+ countries',
              'Dedicated author support',
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-shimmer flex items-center justify-center text-royal-900 text-xs font-bold">✓</div>
                <span className="text-ink-900/80">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="relative">
          <div className="card-premium p-8 lg:p-12">
            <div className="text-center mb-8">
              <p className="eyebrow">Begin Your Journey</p>
              <h2 className="font-display text-3xl text-royal-900">Create your account</h2>
              <p className="text-sm text-ink-900/60 mt-2">It's free — no credit card required.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  placeholder="Aria Mehta"
                />
              </div>

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
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  pattern="[+]?[0-9 \-]{7,20}"
                  className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  placeholder="+91 9876543210"
                />
                <p className="text-[10px] text-ink-900/40 mt-1">Used to verify your identity for ISBN applications</p>
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
                    minLength={6}
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
                  Country
                </label>
                <select
                  name="country"
                  required
                  defaultValue="IN"
                  className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                >
                  <option value="IN">🇮🇳 India</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="OTHER">🌍 Other</option>
                </select>
              </div>

              <label className="flex items-start gap-2 text-xs text-ink-900/70">
                <input type="checkbox" required className="mt-0.5" />
                <span>
                  I agree to LUMIN's{' '}
                  <Link href="/terms" className="text-royal-800 hover:text-gold-600 underline">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-royal-800 hover:text-gold-600 underline">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-royal w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-900/60">
              Already have an account?{' '}
              <Link href="/login" className="text-royal-800 hover:text-gold-600 font-semibold underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
