import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-cream-100/40">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-64">
          <DashboardTopbar user={user} />
          <div className="p-6 lg:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
