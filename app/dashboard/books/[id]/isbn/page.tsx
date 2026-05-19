import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import IsbnApplicationForm from '@/components/dashboard/IsbnApplicationForm';

export const dynamic = 'force-dynamic';

export default async function IsbnApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) redirect('/login');

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id }, include: { author: true } });
  if (!book) notFound();
  if (book.authorId !== me.id) redirect('/dashboard/books');

  return (
    <div>
      <Link href={`/dashboard/books/${book.id}`} className="inline-flex items-center gap-2 text-ink-900/60 hover:text-gold-700 text-sm mb-6">
        <ArrowLeft size={14} /> Back to book
      </Link>

      <div className="mb-6">
        <p className="eyebrow">ISBN Application</p>
        <h2 className="font-display text-3xl text-royal-900">{book.title}</h2>
        <p className="text-sm text-ink-900/50 mt-1">
          Apply for an ISBN through RRRNA (Raja Rammohun Roy National Agency). We'll submit your application on your behalf.
        </p>
      </div>

      <IsbnApplicationForm book={JSON.parse(JSON.stringify(book))} authorName={me.fullName} authorEmail={me.email} authorPhone={me.phone || ''} />
    </div>
  );
}
