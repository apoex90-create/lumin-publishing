import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function ServicesAdmin() {
  const items = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Services</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Services shown on the public Services page.</p>
      </div>

      <CrudManager
        resourceName="services"
        resourceLabel="Service"
        items={items}
        displayFields={['title']}
        fields={[
          { name: 'title', label: 'Service Name', type: 'text', required: true, placeholder: 'Editorial Services' },
          { name: 'description', label: 'Description', type: 'textarea', rows: 4, required: true },
          { name: 'features', label: 'Features (one per line)', type: 'textarea', rows: 6, placeholder: 'Developmental editing\nLine & copy editing\nProofreading' },
          { name: 'iconName', label: 'Icon', type: 'select', options: [
            { value: 'FileText', label: '📄 Document' },
            { value: 'Palette', label: '🎨 Palette' },
            { value: 'BookOpen', label: '📖 Book' },
            { value: 'Megaphone', label: '📣 Megaphone' },
            { value: 'Globe', label: '🌐 Globe' },
            { value: 'Award', label: '🏆 Award' },
            { value: 'PenTool', label: '✏️ Pen' },
            { value: 'Sparkles', label: '✨ Sparkles' },
          ]},
          { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        ]}
      />
    </div>
  );
}
