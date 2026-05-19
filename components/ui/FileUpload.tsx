'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle, X } from 'lucide-react';

interface Props {
  kind: 'manuscript' | 'cover' | 'avatar';
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
  accept?: string;
  label?: string;
  helpText?: string;
}

export default function FileUpload({ kind, currentUrl, onUploaded, accept, label, helpText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const defaultAccept = {
    manuscript: '.pdf,.doc,.docx,.txt,.rtf',
    cover: 'image/jpeg,image/png,image/webp',
    avatar: 'image/jpeg,image/png,image/webp',
  }[kind];

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', kind);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onUploaded(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept || defaultAccept}
        onChange={handleFile}
        disabled={uploading}
        className="hidden"
      />

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full p-6 rounded-2xl border-2 border-dashed border-royal-200 hover:border-gold-500 hover:bg-gold-500/5 transition-all flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-gold-600 animate-spin" />
              <span className="text-sm text-ink-900/60">Uploading...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Uploaded successfully</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-royal-800" />
              <span className="text-sm text-royal-800 font-medium">
                {currentUrl ? 'Replace file' : 'Click to upload'}
              </span>
              {helpText && <span className="text-xs text-ink-900/40">{helpText}</span>}
            </>
          )}
        </button>

        {currentUrl && !uploading && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-cream-100 border border-royal-100">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-royal-800 hover:text-gold-700 truncate flex-1"
            >
              📄 {currentUrl.split('/').pop() || 'View uploaded file'}
            </a>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">
            <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
