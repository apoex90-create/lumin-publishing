'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ImageIcon, Type, BarChart3, Globe, MessageSquare, EyeOff } from 'lucide-react';

const tabs = [
  { id: 'brand', label: 'Brand', icon: ImageIcon },
  { id: 'hero', label: 'Hero Section', icon: Type },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'contact', label: 'Contact', icon: MessageSquare },
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'visibility', label: 'Show / Hide', icon: EyeOff },
  { id: 'about', label: 'About Page', icon: Type },
];

const fieldGroups: Record<string, Array<{ key: string; label: string; type?: 'text' | 'textarea' | 'boolean'; help?: string }>> = {
  brand: [
    { key: 'brand.name', label: 'Platform Name', help: 'Used everywhere — navbar, footer, emails, browser tab' },
    { key: 'brand.tagline', label: 'Tagline', type: 'textarea' },
    { key: 'brand.description', label: 'Short Description (for footer & meta)', type: 'textarea' },
  ],
  hero: [
    { key: 'hero.headline', label: 'Headline (line 1)', help: 'e.g. "Your story."' },
    { key: 'hero.headline.emphasis', label: 'Emphasized word (gold italic)', help: 'e.g. "Beautifully"' },
    { key: 'hero.headline.suffix', label: 'Suffix (line 3)', help: 'e.g. "published."' },
    { key: 'hero.subheading', label: 'Subheading', type: 'textarea' },
    { key: 'hero.cta.primary', label: 'Primary Button Text', help: 'e.g. "Begin Your Journey"' },
    { key: 'hero.cta.secondary', label: 'Secondary Button Text', help: 'e.g. "See How It Works"' },
  ],
  stats: [
    { key: 'stats.1.number', label: 'Stat 1 — Number' },
    { key: 'stats.1.label', label: 'Stat 1 — Label' },
    { key: 'stats.2.number', label: 'Stat 2 — Number' },
    { key: 'stats.2.label', label: 'Stat 2 — Label' },
    { key: 'stats.3.number', label: 'Stat 3 — Number' },
    { key: 'stats.3.label', label: 'Stat 3 — Label' },
    { key: 'stats.4.number', label: 'Stat 4 — Number' },
    { key: 'stats.4.label', label: 'Stat 4 — Label' },
  ],
  contact: [
    { key: 'contact.email', label: 'Public Email', help: 'Shown on contact page and footer' },
    { key: 'contact.phone', label: 'Phone Number (optional)', help: 'Leave blank to hide phone card' },
    { key: 'contact.address', label: 'Location / Address' },
    { key: 'contact.hours', label: 'Business Hours' },
  ],
  seo: [
    { key: 'seo.title', label: 'Default Page Title', help: 'Shown in Google results and browser tabs' },
    { key: 'seo.description', label: 'Meta Description', type: 'textarea', help: '150-160 characters max' },
    { key: 'seo.keywords', label: 'Keywords (comma-separated)' },
  ],
  visibility: [
    { key: 'show.testimonials', label: 'Show testimonials section', type: 'boolean', help: 'Hide if you have no real testimonials yet' },
    { key: 'show.team', label: 'Show team section on About page', type: 'boolean', help: 'Hide until you have real team members added' },
    { key: 'show.bookstore.featured', label: 'Show featured books on homepage', type: 'boolean' },
    { key: 'show.stats', label: 'Show stats section on homepage', type: 'boolean' },
    { key: 'show.social.icons', label: 'Show social media icons in footer', type: 'boolean', help: 'Only enable if you have added real social links' },
  ],
  about: [
    { key: 'about.mission.title', label: 'Mission Title' },
    { key: 'about.mission.text', label: 'Mission Text', type: 'textarea' },
  ],
};

interface Props {
  initial: Record<string, string>;
}

export default function SiteSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('brand');
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');

  function update(key: string, value: string) {
    setValues({ ...values, [key]: value });
  }

  async function saveAll() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Save failed');
      }
      setSavedMsg('✓ Settings saved');
      setTimeout(() => setSavedMsg(''), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const currentFields = fieldGroups[activeTab] || [];

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
                  ? 'bg-gold-shimmer text-royal-900 shadow-lg'
                  : 'text-cream-100/60 hover:bg-cream-100/5 hover:text-cream-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-9">
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-burgundy-500/20 border border-burgundy-400 text-burgundy-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {currentFields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">
                  {field.label}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={values[field.key] ?? ''}
                    onChange={(e) => update(field.key, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none resize-none"
                  />
                ) : field.type === 'boolean' ? (
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-cream-100/5 border border-cream-100/10 hover:border-gold-500/30">
                    <input
                      type="checkbox"
                      checked={values[field.key] === 'true'}
                      onChange={(e) => update(field.key, e.target.checked ? 'true' : 'false')}
                      className="w-5 h-5 rounded accent-gold-500"
                    />
                    <span className="text-cream-100/80 text-sm">{values[field.key] === 'true' ? 'Visible on site' : 'Hidden from site'}</span>
                  </label>
                ) : (
                  <input
                    type="text"
                    value={values[field.key] ?? ''}
                    onChange={(e) => update(field.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-cream-100/5 border border-cream-100/10 text-cream-50 focus:border-gold-500 outline-none"
                  />
                )}

                {field.help && <p className="text-xs text-cream-100/40 mt-1">{field.help}</p>}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-cream-100/10 flex items-center gap-3">
            <button onClick={saveAll} disabled={saving} className="btn-gold disabled:opacity-50">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </button>
            {savedMsg && <span className="text-sm text-green-300 font-medium">{savedMsg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
