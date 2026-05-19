import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import SettingsForm from '@/components/dashboard/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const me = await getCurrentUser();
  if (!me) redirect('/login');

  // Fetch full user including payout details
  const user = await prisma.user.findUnique({
    where: { id: me.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      bio: true,
      avatarUrl: true,
      country: true,
      phone: true,
      phoneVerified: true,
      payoutMethod: true,
      payoutUpi: true,
      payoutBankName: true,
      payoutBankAccount: true,
      payoutBankIfsc: true,
      payoutPanNumber: true,
    },
  });
  if (!user) redirect('/login');

  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow">Account</p>
        <h2 className="font-display text-4xl text-royal-900">Settings</h2>
        <p className="text-ink-900/60 mt-2">Manage your profile, payout details, and security.</p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
