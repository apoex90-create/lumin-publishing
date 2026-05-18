import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function FooterAdmin() {
  const items = await prisma.footerLink.findMany({
    orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
  }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Footer Links</h2>
        <p className="text-cream-100/50 mt-2 text-sm">All four columns of links in your website footer.</p>
      </div>

      <CrudManager
        resourceName="footer"
        resourceLabel="Footer Link"
        items={items}
        displayFields={['label', 'url']}
        fields={[
          { name: 'section', label: 'Footer Column', type: 'select', required: true, options: [
            { value: 'Publish', label: 'Publish' },
            { value: 'Discover', label: 'Discover' },
            { value: 'Company', label: 'Company' },
            { value: 'Legal', label: 'Legal' },
          ]},
          { name: 'label', label: 'Link Text', type: 'text', required: true, placeholder: 'How It Works' },
          { name: 'url', label: 'URL', type: 'text', required: true, placeholder: '/how-it-works or https://...' },
          { name: 'isExternal', label: 'External link (opens in new tab)', type: 'boolean' },
          { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
    </div>
  );
}
