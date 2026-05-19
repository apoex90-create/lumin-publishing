'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Trash2 } from 'lucide-react';
import { PUBLISHERS } from '@/lib/publishers';
import { BOOK_LANGUAGES } from '@/lib/isbn';

interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  genre: string;
  language: string;
  description: string;
  manuscriptUrl: string | null;
  coverUrl: string | null;
  isbn: string | null;
  pageCount: number | null;
  priceINR: number | null;
  priceUSD: number | null;
  status: string;
  planTier: string;
  publisher: string | null;
  publicationYear: number | null;
  coAuthors: string | null;
  editorName: string | null;
  editedManuscriptUrl: string | null;
  editorNotes: string | null;
}

const GENRES = [
  'Literary Fiction', 'Romance', 'Mystery & Thriller', 'Science Fiction', 'Fantasy',
  'Historical Fiction', 'Memoir', 'Biography', 'Poetry', 'Self-Help', 'Business',
  'Health & Wellness', 'Travel', 'Children\'s', 'Young Adult', 'Other'
];

const STATUSES = ['DRAFT', 'SUBMITTED', 'IN_REVIEW', 'IN_EDITING', 'COVER_DESIGN', 'FORMATTING', 'PUBLISHED', 'REJECTED'];

export default function AdminBookEditForm({ book }: { book: Book }) {
  const router = useRouter();
  const [data, setData] = useState({
    title: book.title,
    subtitle: book.subtitle || '',
    genre: book.genre,
    language: book.language,
    description: book.description,
    coverUrl: book.coverUrl || '',
    isbn: book.isbn || '',
    pageCount: book.pageCount || '',
    priceINR: book.priceINR || '',
    priceUSD: book.priceUSD || '',
    status: book.status,
    publisher: book.publisher || '',
    publicationYear: book.publicationYear || new Date().getFullYear(),
    coAuthors: book.coAuthors || '',
    editorName: book.editorName || '',
    editedManuscriptUrl: book.editedManuscriptUrl || '',
    editorNotes: book.editorNotes || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

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
      const res = await fetch(`/api/admin/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      setMsg('✓ Saved successfully');
      setTimeout(() => setMsg(''), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteBook() {
    if (!confirm('Permanently delete this book and all its data? This cannot be undone.')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/books/${book.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin/books');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {error && <div className="p-3 rounded-lg bg-burgundy-500/20 border border-burgundy-400 text-burgundy-300 text-sm">{error}</div>}
      {msg && <div className="p-3 rounded-lg bg-green-500/20 border border-green-400 text-green-300 text-sm">{msg}</div>}

      {/* Basics */}
      <Section title="Basics">
        <Field label="Title" required>
          <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} required className="dark-input" />
        </Field>
        <Field label="Subtitle">
          <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="dark-input" />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Genre" required>
            <select value={data.genre} onChange={(e) => setData({ ...data, genre: e.target.value })} className="dark-input">
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Language" required>
            <select value={data.language} onChange={(e) => setData({ ...data, language: e.target.value })} className="dark-input">
              {BOOK_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description" required>
          <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={5} required className="dark-input resize-none" />
        </Field>
      </Section>

      {/* Status */}
      <Section title="Publishing Status">
        <Field label="Current Status">
          <select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })} className="dark-input">
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </Field>
      </Section>

      {/* Publisher & ISBN */}
      <Section title="Publisher & ISBN">
        <Field label="Publisher Imprint">
          <select value={data.publisher} onChange={(e) => setData({ ...data, publisher: e.target.value })} className="dark-input">
            <option value="">— Select publisher —</option>
            {PUBLISHERS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="ISBN" hint="Leave blank if not yet assigned">
            <input value={data.isbn} onChange={(e) => setData({ ...data, isbn: e.target.value })} placeholder="978-XX-XXXX-XXX-X" className="dark-input" />
          </Field>
          <Field label="Publication Year">
            <input type="number" value={data.publicationYear} onChange={(e) => setData({ ...data, publicationYear: e.target.value as any })} className="dark-input" />
          </Field>
        </div>
        <Field label="Co-Authors (comma separated)">
          <input value={data.coAuthors} onChange={(e) => setData({ ...data, coAuthors: e.target.value })} className="dark-input" />
        </Field>
        <Field label="Editor Name">
          <input value={data.editorName} onChange={(e) => setData({ ...data, editorName: e.target.value })} className="dark-input" />
        </Field>
      </Section>

      {/* Pricing & specs */}
      <Section title="Pricing & Specs">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Price (INR)">
            <input type="number" value={data.priceINR} onChange={(e) => setData({ ...data, priceINR: e.target.value as any })} className="dark-input" />
          </Field>
          <Field label="Price (USD)">
            <input type="number" step="0.01" value={data.priceUSD} onChange={(e) => setData({ ...data, priceUSD: e.target.value as any })} className="dark-input" />
          </Field>
          <Field label="Page Count">
            <input type="number" value={data.pageCount} onChange={(e) => setData({ ...data, pageCount: e.target.value as any })} className="dark-input" />
          </Field>
        </div>
      </Section>

      {/* Files */}
      <Section title="Files">
        <Field label="Cover Image URL">
          <input value={data.coverUrl} onChange={(e) => setData({ ...data, coverUrl: e.target.value })} placeholder="https://..." className="dark-input" />
        </Field>
        <Field label="Edited Manuscript URL" hint="Link to the edited version (uploaded by editor bot or manually)">
          <input value={data.editedManuscriptUrl} onChange={(e) => setData({ ...data, editedManuscriptUrl: e.target.value })} placeholder="https://..." className="dark-input" />
        </Field>
        <Field label="Editor Notes">
          <textarea value={data.editorNotes} onChange={(e) => setData({ ...data, editorNotes: e.target.value })} rows={4} className="dark-input resize-none" />
        </Field>
      </Section>

      {/* Save */}
      <div className="flex items-center justify-between pt-4 border-t border-cream-100/10">
        <button type="button" onClick={deleteBook} disabled={saving} className="px-4 py-2 rounded-full border border-burgundy-400/30 text-burgundy-300 hover:bg-burgundy-500/10 text-sm inline-flex items-center gap-2">
          <Trash2 size={14} /> Delete Book
        </button>
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </button>
      </div>

      <style jsx>{`
        .dark-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255, 248, 232, 0.05);
          border: 1px solid rgba(255, 248, 232, 0.1);
          color: #fff8e8;
          outline: none;
        }
        .dark-input:focus {
          border-color: #d4a017;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6 space-y-4">
      <h3 className="font-display text-xl text-cream-50">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-gold-400 mb-2">
        {label}{required && <span className="text-burgundy-300 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-cream-100/40 mt-1">{hint}</p>}
    </div>
  );
}
