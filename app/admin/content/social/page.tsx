import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function SocialAdmin() {
  const items = await prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Social Media Links</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Icons in the footer. Add only the platforms where you have real accounts.</p>
      </div>

      <CrudManager
        resourceName="social"
        resourceLabel="Social Link"
        items={items}
        displayFields={['platform', 'url']}
        fields={[
          { name: 'platform', label: 'Platform', type: 'select', required: true, options: [
            { value: 'twitter', label: 'Twitter / X' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'facebook', label: 'Facebook' },
            { value: 'youtube', label: 'YouTube' },
            { value: 'linkedin', label: 'LinkedIn' },
            { value: 'github', label: 'GitHub' },
            { value: 'email', label: 'Email (mailto:)' },
          ]},
          { name: 'url', label: 'Full URL', type: 'url', required: true, placeholder: 'https://twitter.com/yourhandle' },
          { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
    </div>
  );
}
