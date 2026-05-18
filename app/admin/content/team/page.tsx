import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function TeamAdmin() {
  const items = await prisma.teamMember.findMany({
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Team Members</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Real people who work at your company. Shown on the About page when enabled in Site Settings.</p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-sm text-gold-200">
        💡 Team section is <strong>hidden by default</strong>. Enable it in <Link href="/admin/settings" className="underline">Site Settings</Link> after adding real team members.
      </div>

      <CrudManager
        resourceName="team"
        resourceLabel="Team Member"
        items={items}
        displayFields={['name', 'role']}
        fields={[
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'role', label: 'Role / Title', type: 'text', required: true, placeholder: 'Founder & CEO' },
          { name: 'bio', label: 'Short Bio', type: 'textarea', rows: 3 },
          { name: 'imageUrl', label: 'Photo URL', type: 'url', help: 'Square photo recommended' },
          { name: 'email', label: 'Public Email', type: 'email' },
          { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
          { name: 'twitterUrl', label: 'Twitter/X URL', type: 'url' },
          { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
    </div>
  );
}
