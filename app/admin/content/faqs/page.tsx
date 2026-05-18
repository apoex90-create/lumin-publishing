import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function FaqsAdmin() {
  const items = await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">FAQs</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Frequently asked questions shown on the Pricing page and help sections.</p>
      </div>

      <CrudManager
        resourceName="faqs"
        resourceLabel="FAQ"
        items={items}
        displayFields={['question']}
        fields={[
          { name: 'question', label: 'Question', type: 'text', required: true },
          { name: 'answer', label: 'Answer', type: 'textarea', rows: 4, required: true },
          { name: 'category', label: 'Category', type: 'select', options: [
            { value: 'General', label: 'General' },
            { value: 'Pricing', label: 'Pricing' },
            { value: 'Publishing Process', label: 'Publishing Process' },
            { value: 'Royalties', label: 'Royalties' },
            { value: 'Rights & Legal', label: 'Rights & Legal' },
          ]},
          { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
    </div>
  );
}
