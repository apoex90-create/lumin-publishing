'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Crown, Shield } from 'lucide-react';

export default function NewTeamMemberPage() {
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
          role: 'ADMIN',
          bio: formData.get('jobTitle'),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create');
      setSuccess(true);
      setTimeout(() => router.push('/admin/team'), 1500);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/team" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to team
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Grant Access</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Add a team member</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Give a team member access to the admin panel. They'll receive login details by email.</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-8">
          {error && <div className="mb-6 p-3 rounded-lg bg-burgundy-500/20 border border-burgundy-400 text-burgundy-300 text-sm">{error}</div>}
          {success && <div className="mb-6 p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-300 text-sm">✓ Team member added. Redirecting...</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Full Name *</label>
                <input name="fullName" required className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none" placeholder="Priya Sharma" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Email *</label>
                <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none" placeholder="priya@yourcompany.com" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Temporary Password *</label>
                <input name="password" required minLength={6} className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none" placeholder="Min 6 characters" />
                <p className="text-xs text-cream-100/40 mt-1">They will change this on first login.</p>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Job Title</label>
                <input name="jobTitle" className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none" placeholder="Head of Editorial" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">Permission Level</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-gold-500/5 border border-gold-500/30 cursor-pointer hover:bg-gold-500/10">
                    <input type="radio" name="permission" defaultChecked className="mt-1" />
                    <div>
                      <p className="text-cream-50 font-semibold flex items-center gap-2"><Crown size={14} className="text-gold-400" /> Super Admin</p>
                      <p className="text-xs text-cream-100/60 mt-1">Full control. Can do everything you can do — manage authors, books, money, team, settings.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-cream-100/5 border border-cream-100/10 cursor-pointer hover:bg-cream-100/10">
                    <input type="radio" name="permission" className="mt-1" />
                    <div>
                      <p className="text-cream-50 font-semibold flex items-center gap-2"><Shield size={14} className="text-royal-400" /> Editor</p>
                      <p className="text-xs text-cream-100/60 mt-1">Reviews and approves books. Cannot manage team or change site settings.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-cream-100/5 border border-cream-100/10 cursor-pointer hover:bg-cream-100/10">
                    <input type="radio" name="permission" className="mt-1" />
                    <div>
                      <p className="text-cream-50 font-semibold flex items-center gap-2"><Shield size={14} className="text-burgundy-400" /> Support</p>
                      <p className="text-xs text-cream-100/60 mt-1">Read-only access for customer support. Can view authors and books but not edit.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 border-t border-cream-100/10">
              <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : <><Save className="w-4 h-4 mr-2" /> Add Team Member</>}
              </button>
              <Link href="/admin/team" className="px-6 py-3 rounded-full border border-cream-100/30 text-cream-50 hover:bg-cream-100/10 transition-all font-medium">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
