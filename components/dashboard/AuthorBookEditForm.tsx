'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, FileCheck, Upload } from 'lucide-react';
import { PUBLISHERS } from '@/lib/publishers';
import { BOOK_LANGUAGES, ISBN_DECLARATIONS, ISBN_FORMATS } from '@/lib/isbn';

interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  genre: string;
  language: string;
  description: string;
  manuscriptUrl: string | null;
  coverUrl: string | null;
  pageCount: number | null;
  priceINR: number | null;
  priceUSD: number | null;
  planTier: string;
  publisher: string | null;
  publicationYear: number | null;
  coAuthors: string | null;
  editorName: string | null;
  isbnRequested: boolean;
  isbnFormat: string | null;
  isbnDeclarationAccepted: boolean;
}

const GENRES = [
  'Literary Fiction', 'Romance', 'Mystery & Thriller', 'Science Fiction', 'Fantasy',
  'Historical Fiction', 'Memoir', 'Biography', 'Poetry', 'Self-Help', 'Business',
  'Health & Wellness', 'Travel', "Children's", 'Young Adult', 'Other'
];

export default function AuthorBookEditForm({ book }: { book: Book }) {
  const router = useRouter();
  const [data, setData] = useState({
    title: book.title,
    subtitle: book.subtitle || '',
    genre: book.genre,
    language: book.language,
    description: book.description,
    manuscriptUrl: book.manuscriptUrl || '',
    coverUrl: book.coverUrl || '',
    pageCount: book.pageCount || '',
    priceINR: book.priceINR || '',
    priceUSD: book.priceUSD || '',
    publisher: book.publisher || '',
    publicationYear: book.publicationYear || new Date().getFullYear(),
    coAuthors: book.coAuthors || '',
    editorName: book.editorName || '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...data,
        pageCount: data.pageCount ? Number(data.pageCount) : null,
        priceINR: data.priceINR ? Number(data.priceINR) : null,
        priceUSD: data.priceUSD ? Number(data.priceUSD) : null,
        publicationYear: data.publicationYear ? Number(data.publicationYear) : null,
      };
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setMsg('✓ Saved');
      setTimeout(() => setMsg(''), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {error && <div className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">{error}</div>}
      {msg && <div className="p-3 rounded-lg bg-green-50 border border-green-300 text-green-700 text-sm">{msg}</div>}

      <Section title="Book Details">
        <Field label="Title" required>
          <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} required className="input-base" />
        </Field>
        <Field label="Subtitle">
          <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="input-base" />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Genre" required>
            <select value={data.genre} onChange={(e) => setData({ ...data, genre: e.target.value })} className="input-base">
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Language" required>
            <select value={data.language} onChange={(e) => setData({ ...data, language: e.target.value })} className="input-base">
              {BOOK_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description" required hint="Shown on your book's bookstore page">
          <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={5} required className="input-base resize-none" />
        </Field>
      </Section>

      <Section title="Manuscript & Cover">
        <Field label="Manuscript URL" required hint="Upload to Google Drive/Dropbox and share the link. Make it accessible by anyone with the link.">
          <input
            type="url"
            value={data.manuscriptUrl}
            onChange={(e) => setData({ ...data, manuscriptUrl: e.target.value })}
            placeholder="https://drive.google.com/..."
            className="input-base"
            required
          />
          <p className="text-xs text-ink-900/40 mt-2">
            <Upload className="inline w-3 h-3 mr-1" />
            Direct file upload coming soon. For now, please share via Google Drive link.
          </p>
        </Field>
        <Field label="Cover Image URL (optional)">
          <input
            type="url"
            value={data.coverUrl}
            onChange={(e) => setData({ ...data, coverUrl: e.target.value })}
            placeholder="https://..."
            className="input-base"
          />
        </Field>
      </Section>

      <Section title="Publication Information (required for ISBN)">
        <Field label="Publisher Imprint" required hint="Choose the imprint under which your book will be published">
          <select value={data.publisher} onChange={(e) => setData({ ...data, publisher: e.target.value })} required className="input-base">
            <option value="">— Select publisher —</option>
            {PUBLISHERS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Co-Authors (optional)" hint="Comma-separated names">
            <input value={data.coAuthors} onChange={(e) => setData({ ...data, coAuthors: e.target.value })} placeholder="Jane Doe, John Smith" className="input-base" />
          </Field>
          <Field label="Editor Name (optional)">
            <input value={data.editorName} onChange={(e) => setData({ ...data, editorName: e.target.value })} className="input-base" />
          </Field>
        </div>
        <Field label="Publication Year">
          <input type="number" value={data.publicationYear} onChange={(e) => setData({ ...data, publicationYear: e.target.value as any })} className="input-base" />
        </Field>
      </Section>

      <Section title="Pricing & Specs">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Price (INR)">
            <input type="number" value={data.priceINR} onChange={(e) => setData({ ...data, priceINR: e.target.value as any })} placeholder="399" className="input-base" />
          </Field>
          <Field label="Price (USD)">
            <input type="number" step="0.01" value={data.priceUSD} onChange={(e) => setData({ ...data, priceUSD: e.target.value as any })} placeholder="9.99" className="input-base" />
          </Field>
          <Field label="Page Count">
            <input type="number" value={data.pageCount} onChange={(e) => setData({ ...data, pageCount: e.target.value as any })} className="input-base" />
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button type="submit" disabled={saving} className="btn-royal disabled:opacity-50">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Draft</>}
        </button>
      </div>

      <div className="mt-6 p-5 rounded-2xl bg-gold-50 border border-gold-200">
        <h4 className="font-display text-lg text-royal-900 mb-2 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-gold-700" /> Apply for ISBN
        </h4>
        <p className="text-sm text-ink-900/70 mb-3">
          Once you've filled in all details above, you can apply for an ISBN through our ISBN application form.
        </p>
        <a href={`/dashboard/books/${book.id}/isbn`} className="inline-flex items-center text-sm font-semibold text-gold-800 hover:text-gold-900 underline">
          {book.isbnRequested ? 'View ISBN application →' : 'Start ISBN application →'}
        </a>
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
