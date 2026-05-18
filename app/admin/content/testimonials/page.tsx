import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import CrudManager from '@/components/admin/CrudManager';

export default async function TestimonialsAdmin() {
  const items = await prisma.testimonial.findMany({
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  return (
    <div>
      <Link href="/admin/content" className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to Content Manager
      </Link>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Manage</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Testimonials</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Real quotes from authors. Featured testimonials appear on the homepage.</p>
      </div>

      <CrudManager
        resourceName="testimonials"
        resourceLabel="Testimonial"
        items={items}
        displayFields={['authorName', 'quote']}
        fields={[
          { name: 'quote', label: 'Quote', type: 'textarea', rows: 4, required: true, placeholder: 'The exact words the author said...' },
          { name: 'authorName', label: 'Author Name', type: 'text', required: true, placeholder: 'Priya Sharma' },
          { name: 'authorRole', label: 'Author Role / Book Title', type: 'text', placeholder: 'Author, "The Lantern Keeper"' },
          { name: 'imageUrl', label: 'Photo URL (optional)', type: 'url', placeholder: 'https://...', help: 'Square photo recommended, 200x200px+' },
          { name: 'rating', label: 'Rating (1-5)', type: 'number', placeholder: '5' },
          { name: 'isFeatured', label: 'Featured on homepage', type: 'boolean', placeholder: 'Show this testimonial prominently' },
          { name: 'sortOrder', label: 'Sort Order', type: 'number', help: 'Lower numbers appear first' },
        ]}
      />
    </div>
  );
}
