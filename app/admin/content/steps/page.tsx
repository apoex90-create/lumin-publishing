import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function StepsAdmin() {
  const items = await prisma.howItWorksStep.findMany({ orderBy: { stepNumber: 'asc' } }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">How It Works Steps</h2>
        <p className="text-cream-100/50 mt-2 text-sm">The 6 steps shown on the How It Works page.</p>
      </div>

      <CrudManager
        resourceName="steps"
        resourceLabel="Step"
        items={items}
        displayFields={['title']}
        fields={[
          { name: 'stepNumber', label: 'Step Number', type: 'number', required: true, placeholder: '1' },
          { name: 'title', label: 'Step Title', type: 'text', required: true, placeholder: 'Submit Your Manuscript' },
          { name: 'text', label: 'Description', type: 'textarea', rows: 3, required: true },
          { name: 'detail', label: 'Detail Note (italic, smaller text)', type: 'text' },
          { name: 'iconName', label: 'Icon', type: 'select', options: [
            { value: 'Upload', label: '⬆️ Upload' },
            { value: 'Sparkles', label: '✨ Sparkles' },
            { value: 'Palette', label: '🎨 Palette' },
            { value: 'FileCheck', label: '📄 File Check' },
            { value: 'Globe', label: '🌐 Globe' },
            { value: 'Megaphone', label: '📣 Megaphone' },
          ]},
          { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
    </div>
  );
}
