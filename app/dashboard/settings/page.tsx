import { getCurrentUser } from '@/lib/auth';
import SettingsForm from '@/components/dashboard/SettingsForm';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow">Account</p>
        <h2 className="font-display text-4xl text-royal-900">Settings</h2>
        <p className="text-ink-900/60 mt-2">Manage your profile, payment details, and preferences.</p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
