import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import AdminBookEditForm from '@/components/admin/AdminBookEditForm';

export const dynamic = 'force-dynamic';

export default async function AdminBookEditPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') redirect('/');

  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: { select: { fullName: true, email: true } } },
  });
  if (!book) notFound();

  return (
    <div>
      <Link href={`/admin/books/${book.id}`} className="inline-flex items-center gap-2 text-cream-100/50 hover:text-gold-300 text-sm mb-6">
        <ArrowLeft size={14} /> Back to book details
      </Link>

      <div className="mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Edit Book</p>
        <h2 className="font-display text-4xl text-cream-50 italic">{book.title}</h2>
        <p className="text-cream-100/50 mt-1 text-sm">by {book.author.fullName} ({book.author.email})</p>
      </div>

      <AdminBookEditForm book={JSON.parse(JSON.stringify(book))} />
    </div>
  );
}
