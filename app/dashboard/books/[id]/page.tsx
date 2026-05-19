import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FileText, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import AuthorBookActions from '@/components/dashboard/AuthorBookActions';

export const dynamic = 'force-dynamic';

const STATUS_INFO: Record<string, { label: string; icon: any; color: string; description: string }> = {
  DRAFT: { label: 'Draft', icon: FileText, color: 'bg-ink-200 text-ink-700', description: 'Your book is in progress. Continue to upload and submit when ready.' },
  SUBMITTED: { label: 'Submitted for Review', icon: Clock, color: 'bg-gold-100 text-gold-800', description: 'Our team is reviewing your manuscript. We\'ll get back within 3-5 business days.' },
  IN_REVIEW: { label: 'In Review', icon: Clock, color: 'bg-royal-100 text-royal-800', description: 'Our editorial team is reading your manuscript.' },
  IN_EDITING: { label: 'In Editing', icon: FileText, color: 'bg-royal-100 text-royal-800', description: 'Editors are polishing your manuscript. Watch your email for queries.' },
  COVER_DESIGN: { label: 'Cover Design', icon: BookOpen, color: 'bg-royal-100 text-royal-800', description: 'Cover concepts being prepared.' },
  FORMATTING: { label: 'Formatting', icon: FileText, color: 'bg-royal-100 text-royal-800', description: 'Your book is being formatted for ebook & print.' },
  PUBLISHED: { label: 'Published!', icon: CheckCircle, color: 'bg-green-100 text-green-800', description: 'Congratulations! Your book is live for the world to read.' },
  REJECTED: { label: 'Not Approved', icon: AlertCircle, color: 'bg-burgundy-100 text-burgundy-800', description: 'Unfortunately we couldn\'t move forward with this manuscript. Check editor notes for feedback.' },
};

export default async function DashboardBookPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) redirect('/login');

  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: { sales: true },
  });

  if (!book) notFound();

  // Authors can only see their own books
  if (book.authorId !== me.id && me.role !== 'ADMIN') {
    redirect('/dashboard/books');
  }

  const revenue = book.sales.reduce((s, sale) => s + sale.amount, 0);
  const statusInfo = STATUS_INFO[book.status] || STATUS_INFO.DRAFT;
  const StatusIcon = statusInfo.icon;

  return (
    <div>
      <Link href="/dashboard/books" className="inline-flex items-center gap-2 text-ink-900/60 hover:text-gold-700 text-sm mb-6">
        <ArrowLeft size={14} /> Back to my books
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium p-8">
            <div className="flex items-start gap-6">
              <div className="w-32 h-44 rounded-xl bg-gradient-to-br from-royal-700 via-royal-900 to-ink-950 flex-shrink-0 flex items-center justify-center shadow-lg overflow-hidden">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-12 h-12 text-gold-400/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full mb-3 ${statusInfo.color}`}>
                  <StatusIcon size={12} /> {statusInfo.label}
                </span>
                <h1 className="font-display text-3xl text-royal-900 leading-tight">{book.title}</h1>
                {book.subtitle && <p className="text-lg italic text-ink-900/60 mt-1">{book.subtitle}</p>}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 bg-royal-50 rounded-full text-royal-800">{book.genre}</span>
                  <span className="px-3 py-1 bg-royal-50 rounded-full text-royal-800">{book.language}</span>
                  <span className="px-3 py-1 bg-gold-100 rounded-full text-gold-800 font-semibold">{book.planTier}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-royal-50">
              <p className="text-sm text-ink-900/70 leading-relaxed">{statusInfo.description}</p>
            </div>

            {book.editorNotes && (
              <div className="mt-4 p-4 rounded-xl bg-gold-50 border border-gold-200">
                <h4 className="text-xs font-bold tracking-widest uppercase text-gold-800 mb-2">Editor Notes</h4>
                <p className="text-sm text-ink-900/80 leading-relaxed">{book.editorNotes}</p>
              </div>
            )}
          </div>

          <div className="card-premium p-8">
            <h3 className="font-display text-xl text-royal-900 mb-4">Description</h3>
            <p className="text-ink-900/70 leading-relaxed">{book.description}</p>
          </div>

          {book.status === 'PUBLISHED' && (
            <div className="card-premium p-8">
              <h3 className="font-display text-xl text-royal-900 mb-4">Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-display text-3xl text-royal-900">{book.sales.length}</p>
                  <p className="text-xs tracking-widest uppercase text-ink-900/50 mt-1">Total Sales</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-royal-900">₹{revenue.toLocaleString('en-IN')}</p>
                  <p className="text-xs tracking-widest uppercase text-ink-900/50 mt-1">Gross Revenue</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-gold-gradient">₹{(revenue * 0.75).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs tracking-widest uppercase text-ink-900/50 mt-1">Your Share</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <AuthorBookActions book={JSON.parse(JSON.stringify({ id: book.id, status: book.status, manuscriptUrl: book.manuscriptUrl }))} />

          <div className="card-premium p-5">
            <h3 className="text-xs tracking-widest uppercase text-ink-900/60 font-bold mb-3">Book Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-900/60">Status</dt>
                <dd className="text-royal-900 font-medium">{statusInfo.label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/60">Plan</dt>
                <dd className="text-royal-900 font-medium">{book.planTier}</dd>
              </div>
              {book.publisher && (
                <div className="flex justify-between">
                  <dt className="text-ink-900/60">Publisher</dt>
                  <dd className="text-royal-900 font-medium text-right">{book.publisher}</dd>
                </div>
              )}
              {book.publicationYear && (
                <div className="flex justify-between">
                  <dt className="text-ink-900/60">Year</dt>
                  <dd className="text-royal-900 font-medium">{book.publicationYear}</dd>
                </div>
              )}
              {book.isbn && (
                <div className="flex justify-between">
                  <dt className="text-ink-900/60">ISBN</dt>
                  <dd className="text-royal-900 font-mono text-xs">{book.isbn}</dd>
                </div>
              )}
              {book.pageCount && (
                <div className="flex justify-between">
                  <dt className="text-ink-900/60">Pages</dt>
                  <dd className="text-royal-900 font-medium">{book.pageCount}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-900/60">Price</dt>
                <dd className="text-royal-900 font-medium">₹{book.priceINR?.toFixed(0) || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="card-premium p-5">
            <h3 className="text-xs tracking-widest uppercase text-ink-900/60 font-bold mb-3">Files</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-ink-900/60">Original manuscript: </span>
                {book.manuscriptUrl ? (
                  <a href={book.manuscriptUrl} target="_blank" rel="noopener noreferrer" className="text-royal-800 underline">View</a>
                ) : (
                  <span className="text-ink-900/40">Not uploaded</span>
                )}
              </div>
              <div>
                <span className="text-ink-900/60">Edited version: </span>
                {book.editedManuscriptUrl ? (
                  <a href={book.editedManuscriptUrl} target="_blank" rel="noopener noreferrer" className="text-royal-800 underline">View</a>
                ) : (
                  <span className="text-ink-900/40">Not ready</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
