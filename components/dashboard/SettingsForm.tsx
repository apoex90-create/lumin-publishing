'use client';

import { useState } from 'react';
import { User, Bell, CreditCard, Shield, Save, Loader2 } from 'lucide-react';

interface Props {
  user: {
    id: string;
    fullName: string;
    email: string;
    bio?: string | null;
    avatarUrl?: string | null;
    country?: string | null;
  };
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsForm({ user }: Props) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Simulated save — wire to /api/users/me when you build that endpoint
    setTimeout(() => {
      setSaving(false);
      setSavedMsg('✓ Saved successfully');
      setTimeout(() => setSavedMsg(''), 3000);
    }, 800);
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Tabs */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-24 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-royal-900 text-cream-50 shadow-lg'
                  : 'text-royal-800 hover:bg-cream-100/60'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-9">
        <div className="card-premium p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="font-display text-2xl text-royal-900">Profile Information</h3>
                <p className="text-sm text-ink-900/60 mt-1">This appears on your public author page.</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-royal-700 to-burgundy-500 flex items-center justify-center text-cream-50 font-display text-2xl">
                  {user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <button type="button" className="text-sm font-semibold text-royal-800 hover:text-gold-600">
                    Upload new photo
                  </button>
                  <p className="text-xs text-ink-900/40 mt-1">JPG or PNG, max 2MB</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.fullName}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-cream-100 border border-royal-200 text-ink-900/60 cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Author Bio
                  </label>
                  <textarea
                    defaultValue={user.bio || ''}
                    rows={4}
                    placeholder="Tell readers about yourself..."
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Country
                  </label>
                  <select
                    defaultValue={user.country || 'IN'}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none transition-all"
                  >
                    <option value="IN">🇮🇳 India</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="CA">🇨🇦 Canada</option>
                    <option value="AU">🇦🇺 Australia</option>
                    <option value="OTHER">🌍 Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button type="submit" disabled={saving} className="btn-royal py-3 disabled:opacity-50">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </button>
                {savedMsg && <span className="text-sm text-green-700 font-medium">{savedMsg}</span>}
              </div>
            </form>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl text-royal-900">Payout Details</h3>
                <p className="text-sm text-ink-900/60 mt-1">Where should we send your royalties?</p>
              </div>

              <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-sm">
                <strong className="text-gold-800">Note:</strong> <span className="text-ink-900/70">Payment integration (Razorpay for India, Stripe for global) is configured via .env. Add your API keys to enable payouts.</span>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Bank Name
                  </label>
                  <input type="text" placeholder="HDFC Bank" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Account Holder Name
                  </label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Account Number / IBAN
                  </label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    IFSC / SWIFT Code
                  </label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    PAN Number (India)
                  </label>
                  <input type="text" placeholder="ABCDE1234F" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Preferred Currency
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
              </div>

              <button onClick={handleSave} className="btn-royal py-3">
                <Save className="w-4 h-4 mr-2" /> Save Payment Details
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl text-royal-900">Email Notifications</h3>
                <p className="text-sm text-ink-900/60 mt-1">Choose what we email you about.</p>
              </div>

              {[
                { title: 'Book Status Updates', desc: 'When your book moves through editing, design, or publishing.' },
                { title: 'New Sales', desc: 'Daily summary of your book sales.' },
                { title: 'Payouts', desc: 'When royalty payments are processed.' },
                { title: 'Marketing Tips', desc: 'Weekly tips and promotional opportunities.' },
                { title: 'Platform Updates', desc: 'New features and improvements.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4 py-4 border-b border-royal-50 last:border-b-0">
                  <div>
                    <p className="font-semibold text-royal-900">{item.title}</p>
                    <p className="text-sm text-ink-900/60 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-royal-200 peer-checked:bg-gold-shimmer rounded-full peer transition-colors" />
                    <div className="absolute top-0.5 left-0.5 bg-cream-50 w-5 h-5 rounded-full peer-checked:translate-x-5 transition-transform shadow" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl text-royal-900">Security</h3>
                <p className="text-sm text-ink-900/60 mt-1">Manage password and account safety.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">Current Password</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">New Password</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none" />
                </div>
                <button onClick={handleSave} className="btn-royal py-3">
                  <Save className="w-4 h-4 mr-2" /> Update Password
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-royal-100">
                <h4 className="font-display text-xl text-burgundy-700">Danger Zone</h4>
                <p className="text-sm text-ink-900/60 mt-1 mb-4">Permanently delete your account and all data.</p>
                <button className="px-6 py-3 rounded-full border-2 border-burgundy-500 text-burgundy-700 hover:bg-burgundy-500 hover:text-cream-50 transition-all font-semibold">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
