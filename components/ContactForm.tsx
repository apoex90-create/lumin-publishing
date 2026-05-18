'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to send');
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-gold-shimmer mx-auto flex items-center justify-center text-royal-900 text-3xl mb-6">✓</div>
        <h3 className="font-display text-3xl text-royal-900">Message received</h3>
        <p className="text-ink-900/60 mt-3">We'll be in touch within 24 hours. Thank you for reaching out.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-royal-900">Send us a message</h2>
        <p className="text-sm text-ink-900/60 mt-1">Fill in the form below and we'll respond as soon as we can.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">Your Name</label>
          <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">Email</label>
          <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">Subject</label>
        <select name="subject" required className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none">
          <option>I want to publish my book</option>
          <option>Pricing and plans</option>
          <option>Question about an existing book</option>
          <option>Partnership or press inquiry</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">Message</label>
        <textarea name="message" required rows={6} className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all resize-none" placeholder="Tell us about your book or question..." />
      </div>

      <button type="submit" disabled={sending} className="btn-royal disabled:opacity-50">
        {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
      </button>
    </form>
  );
}
