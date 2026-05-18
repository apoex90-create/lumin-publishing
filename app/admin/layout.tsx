import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard'); // Authors cannot enter

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-72">
          <AdminTopbar user={user} />
          <div className="p-6 lg:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
