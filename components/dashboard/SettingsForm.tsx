'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, CreditCard, Shield, Save, Loader2, AlertTriangle, Phone } from 'lucide-react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
  country?: string | null;
  phone?: string | null;
  phoneVerified?: boolean;
  payoutMethod?: string | null;
  payoutUpi?: string | null;
  payoutBankName?: string | null;
  payoutBankAccount?: string | null;
  payoutBankIfsc?: string | null;
  payoutPanNumber?: string | null;
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'payments', label: 'Payout', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

export default function SettingsForm({ user }: { user: UserData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-24 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-royal-900 text-cream-50 shadow-lg'
                  : 'text-ink-900/60 hover:bg-cream-100 hover:text-royal-900'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-9">
        {activeTab === 'profile' && <ProfileSection user={user} />}
        {activeTab === 'payments' && <PayoutSection user={user} />}
        {activeTab === 'security' && <SecuritySection />}
        {activeTab === 'danger' && <DangerSection />}
      </div>
    </div>
  );
}

function ProfileSection({ user }: { user: UserData }) {
  const router = useRouter();
  const [data, setData] = useState({
    fullName: user.fullName,
    bio: user.bio || '',
    phone: user.phone || '',
    country: user.country || 'IN',
    avatarUrl: user.avatarUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data.fullName.trim()) {
      setError('Name is required');
      return;
    }
    if (!data.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      setMsg('✓ Profile updated');
      setTimeout(() => setMsg(''), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card-premium p-8 space-y-5">
      <h3 className="font-display text-2xl text-royal-900 mb-4">Your Profile</h3>

      {error && <div className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">{error}</div>}
      {msg && <div className="p-3 rounded-lg bg-green-500/10 border border-green-400 text-green-700 text-sm">{msg}</div>}

      <Field label="Full Name" required>
        <input
          type="text"
          required
          value={data.fullName}
          onChange={(e) => setData({ ...data, fullName: e.target.value })}
          className="input-base"
        />
      </Field>

      <Field label="Email Address" hint="Email cannot be changed. Contact support if needed.">
        <input
          type="email"
          value={user.email}
          disabled
          className="input-base bg-ink-100/50 cursor-not-allowed"
        />
      </Field>

      <Field label="Phone Number" required hint="We may use this to verify your identity for ISBN applications and important communications.">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-900/40" />
          <input
            type="tel"
            required
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="+91 9876543210"
            className="input-base pl-10"
          />
        </div>
        {user.phoneVerified ? (
          <p className="text-xs text-green-700 mt-1">✓ Verified</p>
        ) : (
          data.phone && <p className="text-xs text-ink-900/40 mt-1">OTP verification coming soon</p>
        )}
      </Field>

      <Field label="Author Bio" hint="Shown on your published book pages. 200-500 characters recommended.">
        <textarea
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          rows={4}
          placeholder="Tell readers a bit about yourself..."
          className="input-base resize-none"
        />
      </Field>

      <Field label="Country">
        <select value={data.country} onChange={(e) => setData({ ...data, country: e.target.value })} className="input-base">
          <option value="IN">India</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="OTHER">Other</option>
        </select>
      </Field>

      <Field label="Avatar URL (optional)">
        <input
          type="url"
          value={data.avatarUrl}
          onChange={(e) => setData({ ...data, avatarUrl: e.target.value })}
          placeholder="https://..."
          className="input-base"
        />
      </Field>

      <button type="submit" disabled={saving} className="btn-royal disabled:opacity-50">
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
      </button>
    </form>
  );
}

function PayoutSection({ user }: { user: UserData }) {
  const router = useRouter();
  const [data, setData] = useState({
    payoutMethod: user.payoutMethod || 'UPI',
    payoutUpi: user.payoutUpi || '',
    payoutBankName: user.payoutBankName || '',
    payoutBankAccount: user.payoutBankAccount || '',
    payoutBankIfsc: user.payoutBankIfsc || '',
    payoutPanNumber: user.payoutPanNumber || '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/account/payout', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      setMsg('✓ Payout details saved');
      setTimeout(() => setMsg(''), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card-premium p-8 space-y-5">
      <h3 className="font-display text-2xl text-royal-900 mb-2">Payout Details</h3>
      <p className="text-sm text-ink-900/60 mb-4">Where you'd like to receive payments from book sales.</p>

      {error && <div className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">{error}</div>}
      {msg && <div className="p-3 rounded-lg bg-green-500/10 border border-green-400 text-green-700 text-sm">{msg}</div>}

      <Field label="Payout Method">
        <select value={data.payoutMethod} onChange={(e) => setData({ ...data, payoutMethod: e.target.value })} className="input-base">
          <option value="UPI">UPI (recommended for India)</option>
          <option value="BANK">Bank Transfer (NEFT/IMPS)</option>
        </select>
      </Field>

      {data.payoutMethod === 'UPI' && (
        <Field label="UPI ID" hint="e.g. yourname@oksbi, 9876543210@paytm">
          <input
            type="text"
            value={data.payoutUpi}
            onChange={(e) => setData({ ...data, payoutUpi: e.target.value })}
            placeholder="yourname@upi"
            className="input-base"
          />
        </Field>
      )}

      {data.payoutMethod === 'BANK' && (
        <>
          <Field label="Bank Name">
            <input
              type="text"
              value={data.payoutBankName}
              onChange={(e) => setData({ ...data, payoutBankName: e.target.value })}
              placeholder="HDFC Bank"
              className="input-base"
            />
          </Field>
          <Field label="Account Number">
            <input
              type="text"
              value={data.payoutBankAccount}
              onChange={(e) => setData({ ...data, payoutBankAccount: e.target.value })}
              className="input-base"
            />
          </Field>
          <Field label="IFSC Code">
            <input
              type="text"
              value={data.payoutBankIfsc}
              onChange={(e) => setData({ ...data, payoutBankIfsc: e.target.value.toUpperCase() })}
              placeholder="HDFC0001234"
              className="input-base"
            />
          </Field>
        </>
      )}

      <Field label="PAN Number" hint="Required for tax compliance">
        <input
          type="text"
          value={data.payoutPanNumber}
          onChange={(e) => setData({ ...data, payoutPanNumber: e.target.value.toUpperCase() })}
          placeholder="ABCDE1234F"
          maxLength={10}
          className="input-base"
        />
      </Field>

      <button type="submit" disabled={saving} className="btn-royal disabled:opacity-50">
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Payout Details</>}
      </button>
    </form>
  );
}

function SecuritySection() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update password');
      }
      setMsg('✓ Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card-premium p-8 space-y-5">
      <h3 className="font-display text-2xl text-royal-900 mb-2">Change Password</h3>
      <p className="text-sm text-ink-900/60 mb-4">Choose a strong password with at least 6 characters.</p>

      {error && <div className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">{error}</div>}
      {msg && <div className="p-3 rounded-lg bg-green-500/10 border border-green-400 text-green-700 text-sm">{msg}</div>}

      <Field label="Current Password" required>
        <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="input-base" />
      </Field>

      <Field label="New Password" required>
        <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-base" />
      </Field>

      <Field label="Confirm New Password" required>
        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-base" />
      </Field>

      <button type="submit" disabled={saving} className="btn-royal disabled:opacity-50">
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : <><Save className="w-4 h-4 mr-2" /> Update Password</>}
      </button>
    </form>
  );
}

function DangerSection() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function deleteAccount() {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" exactly to confirm');
      return;
    }
    if (!confirm('This will permanently delete your account, books, and all data. Continue?')) return;

    setDeleting(true);
    setError('');
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete account');
      }
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="card-premium p-8 border-2 border-burgundy-300 space-y-5">
      <div>
        <h3 className="font-display text-2xl text-burgundy-700 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" /> Delete Account
        </h3>
        <p className="text-sm text-ink-900/70 leading-relaxed">
          This will permanently delete your account, all your books, sales data, and uploaded files. This action <strong>cannot be undone</strong>.
        </p>
      </div>

      {error && <div className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">{error}</div>}

      <Field label='Type "DELETE MY ACCOUNT" to confirm' required>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE MY ACCOUNT"
          className="input-base"
        />
      </Field>

      <button
        onClick={deleteAccount}
        disabled={deleting || confirmText !== 'DELETE MY ACCOUNT'}
        className="px-6 py-3 rounded-full bg-burgundy-600 text-cream-50 font-medium hover:bg-burgundy-700 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center"
      >
        {deleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'Permanently Delete My Account'}
      </button>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
        {label}
        {required && <span className="text-burgundy-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-900/40 mt-1">{hint}</p>}
    </div>
  );
}
