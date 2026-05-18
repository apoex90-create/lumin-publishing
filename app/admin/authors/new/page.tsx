'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function NewAuthorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          password: formData.get('password'),
          country: formData.get('country'),
          bio: formData.get('bio'),
          role: formData.get('role'),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create');
      setSuccess(true);
      setTimeout(() => router.push('/admin/authors'), 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/authors" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to all authors
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manual Creation</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Add a new author</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Create an account on behalf of an author. They'll receive login credentials by email.</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-burgundy-500/20 border border-burgundy-400 text-burgundy-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-300 text-sm">
              ✓ Author created successfully. Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Full Name *</label>
                <input name="fullName" required className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none transition-all" placeholder="Aria Mehta" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Email *</label>
                <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none transition-all" placeholder="author@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Temporary Password *</label>
                <input name="password" required minLength={6} className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none transition-all" placeholder="Min 6 characters" />
                <p className="text-xs text-cream-100/40 mt-1">Author will be asked to change on first login.</p>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Country</label>
                <select name="country" defaultValue="IN" className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none">
                  <option value="IN">🇮🇳 India</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="OTHER">🌍 Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Role</label>
                <select name="role" defaultValue="AUTHOR" className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none">
                  <option value="AUTHOR">Author (default)</option>
                  <option value="ADMIN">Admin (full platform control)</option>
                  <option value="READER">Reader (browse-only)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Bio (optional)</label>
                <textarea name="bio" rows={3} className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none resize-none" placeholder="Short author bio for the public profile..." />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 border-t border-cream-100/10">
              <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : <><Save className="w-4 h-4 mr-2" /> Create Author</>}
              </button>
              <Link href="/admin/authors" className="px-6 py-3 rounded-full border border-cream-100/30 text-cream-50 hover:bg-cream-100/10 transition-all font-medium">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
