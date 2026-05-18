import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function PlansAdmin() {
  const items = await prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Pricing Plans</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Edit plan names, prices, royalty percentages, and features.</p>
      </div>

      <CrudManager
        resourceName="plans"
        resourceLabel="Plan"
        items={items}
        displayFields={['name', 'tagline']}
        fields={[
          { name: 'tier', label: 'Tier ID', type: 'select', required: true, options: [
            { value: 'STARTER', label: 'Starter' },
            { value: 'PROFESSIONAL', label: 'Professional' },
            { value: 'BESTSELLER', label: 'Bestseller' },
          ], help: 'Must be unique. Used internally to reference the plan.' },
          { name: 'name', label: 'Display Name', type: 'text', required: true, placeholder: 'Professional' },
          { name: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Our most popular plan' },
          { name: 'priceINR', label: 'Price (₹ INR)', type: 'number', required: true },
          { name: 'priceUSD', label: 'Price ($ USD)', type: 'number', required: true },
          { name: 'royaltyPercent', label: 'Royalty %', type: 'number', required: true, help: 'What percentage of sales the author keeps (e.g. 75)' },
          { name: 'features', label: 'Features (one per line)', type: 'textarea', rows: 8, help: 'List features the author gets with this plan. One per line.', placeholder: 'AI-assisted grammar & style edit\n3 AI-generated cover options\nEPUB + PDF formatting' },
          { name: 'isPopular', label: 'Mark as Most Popular', type: 'boolean' },
          { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
    </div>
  );
}
