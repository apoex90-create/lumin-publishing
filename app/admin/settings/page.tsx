import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

const ALL_KEYS = Object.keys(DEFAULT_SETTINGS);

export default async function SiteSettingsPage() {
  const saved = await getSettings(ALL_KEYS).catch(() => ({}));
  // Merge with defaults so all keys are present
  const values: Record<string, string> = { ...DEFAULT_SETTINGS, ...saved };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Site Configuration</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Site Settings</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Brand, hero, stats, SEO, contact info — saved instantly when you click Save.</p>
      </div>

      <SiteSettingsForm initial={values} />
    </div>
  );
}
