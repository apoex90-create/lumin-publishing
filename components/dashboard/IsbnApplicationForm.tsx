'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, FileCheck, AlertCircle } from 'lucide-react';
import { ISBN_DECLARATIONS, ISBN_FORMATS, BOOK_LANGUAGES } from '@/lib/isbn';
import { PUBLISHERS } from '@/lib/publishers';

interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  language: string;
  publisher: string | null;
  publicationYear: number | null;
  coAuthors: string | null;
  editorName: string | null;
  isbnRequested: boolean;
  isbnFormat: string | null;
  isbnDeclarationAccepted: boolean;
  isbnRequestedAt: string | null;
  isbn: string | null;
}

interface Props {
  book: Book;
  authorName: string;
  authorEmail: string;
  authorPhone: string;
}

export default function IsbnApplicationForm({ book, authorName, authorEmail, authorPhone }: Props) {
  const router = useRouter();
  const [data, setData] = useState({
    title: book.title,
    language: book.language,
    publisher: book.publisher || '',
    publicationYear: book.publicationYear || new Date().getFullYear(),
    coAuthors: book.coAuthors || '',
    editorName: book.editorName || '',
    isbnFormat: book.isbnFormat || 'BOTH',
  });
  const [declarationsAccepted, setDeclarationsAccepted] = useState<boolean[]>(
    book.isbnDeclarationAccepted ? Array(8).fill(true) : Array(8).fill(false)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const allDeclarationsAccepted = declarationsAccepted.every(Boolean);

  // Already requested or assigned
  if (book.isbn) {
    return (
      <div className="card-premium p-12 text-center max-w-2xl mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="font-display text-2xl text-royal-900 mb-2">ISBN Assigned</h3>
        <p className="text-ink-900/60 mb-4">Your book has been assigned an ISBN.</p>
        <p className="font-mono text-lg text-royal-900 bg-cream-100 px-4 py-3 rounded-xl inline-block">{book.isbn}</p>
      </div>
    );
  }

  if (book.isbnRequested) {
    return (
      <div className="card-premium p-12 text-center max-w-2xl mx-auto">
        <FileCheck className="w-12 h-12 text-gold-600 mx-auto mb-4" />
        <h3 className="font-display text-2xl text-royal-900 mb-2">Application Submitted</h3>
        <p className="text-ink-900/60 mb-4">
          Your ISBN application has been received and will be processed within 7-14 business days.
        </p>
        {book.isbnRequestedAt && (
          <p className="text-xs text-ink-900/40">Requested: {new Date(book.isbnRequestedAt).toLocaleDateString()}</p>
        )}
        <Link href={`/dashboard/books/${book.id}`} className="btn-outline mt-6 inline-flex">
          Back to book
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!allDeclarationsAccepted) {
      setError('You must accept all 8 declarations to apply for an ISBN');
      return;
    }

    if (!data.publisher) {
      setError('Please select a publisher imprint');
      return;
    }

    if (!confirm('Submit ISBN application? You cannot edit this once submitted.')) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/books/${book.id}/isbn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          publicationYear: Number(data.publicationYear),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
        </div>
      )}

      <Section title="Book Information">
        <Field label="Book Title" required>
          <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} required className="input-base" />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Language" required>
            <select value={data.language} onChange={(e) => setData({ ...data, language: e.target.value })} required className="input-base">
              {BOOK_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="ISBN Format" required>
            <select value={data.isbnFormat} onChange={(e) => setData({ ...data, isbnFormat: e.target.value })} required className="input-base">
              {ISBN_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Author Information">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Primary Author">
            <input value={authorName} disabled className="input-base bg-ink-100/50 cursor-not-allowed" />
          </Field>
          <Field label="Publication Year" required>
            <input type="number" value={data.publicationYear} onChange={(e) => setData({ ...data, publicationYear: e.target.value as any })} required className="input-base" />
          </Field>
        </div>
        <Field label="Co-Authors" hint="Comma-separated. Leave blank if none.">
          <input value={data.coAuthors} onChange={(e) => setData({ ...data, coAuthors: e.target.value })} placeholder="Jane Doe, John Smith" className="input-base" />
        </Field>
        <Field label="Editor Name" hint="Required if applicable to your book">
          <input value={data.editorName} onChange={(e) => setData({ ...data, editorName: e.target.value })} className="input-base" />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Email">
            <input value={authorEmail} disabled className="input-base bg-ink-100/50 cursor-not-allowed" />
          </Field>
          <Field label="Phone">
            <input value={authorPhone} disabled className="input-base bg-ink-100/50 cursor-not-allowed" />
          </Field>
        </div>
      </Section>

      <Section title="Publisher Information">
        <Field label="Publisher Imprint" required>
          <select value={data.publisher} onChange={(e) => setData({ ...data, publisher: e.target.value })} required className="input-base">
            <option value="">— Select publisher —</option>
            {PUBLISHERS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </Field>
      </Section>

      <div className="card-premium p-6 border-2 border-gold-300">
        <h3 className="font-display text-xl text-royal-900 mb-2 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-gold-700" /> Declaration
        </h3>
        <p className="text-sm text-ink-900/60 mb-5">
          You must read and accept all 8 declarations below. These are required by RRRNA (Raja Rammohun Roy National Agency) for ISBN allocation.
        </p>

        <div className="space-y-3">
          {ISBN_DECLARATIONS.map((decl, i) => (
            <label key={i} className="flex items-start gap-3 p-3 rounded-xl bg-cream-50 hover:bg-cream-100 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationsAccepted[i]}
                onChange={(e) => {
                  const newDecls = [...declarationsAccepted];
                  newDecls[i] = e.target.checked;
                  setDeclarationsAccepted(newDecls);
                }}
                className="mt-1 w-4 h-4 rounded accent-gold-600 flex-shrink-0"
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-gold-700">Declaration {i + 1}</span>
                <p className="text-sm text-ink-900/80 mt-1 leading-relaxed">{decl}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-gold-100 text-xs text-gold-900">
          <strong>I/We accept all {declarationsAccepted.filter(Boolean).length}/8 declarations above.</strong>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={submitting || !allDeclarationsAccepted}
          className="btn-royal disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
          ) : (
            <>Submit ISBN Application <FileCheck className="w-4 h-4 ml-2" /></>
          )}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-premium p-6 space-y-4">
      <h3 className="font-display text-xl text-royal-900">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
        {label}{required && <span className="text-burgundy-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-900/40 mt-1">{hint}</p>}
    </div>
  );
}
