'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, Upload, Sparkles, Image, DollarSign, Eye, Loader2, BookOpen, Crown, CreditCard } from 'lucide-react';
import { GENRES, LANGUAGES, PLANS, formatPrice } from '@/lib/plans';
import { useCurrency } from '@/lib/currency-context';
import { PUBLISHERS } from '@/lib/publishers';
import FileUpload from '@/components/ui/FileUpload';

const STEPS = [
  { id: 1, title: 'Book Details', icon: BookOpen },
  { id: 2, title: 'Manuscript', icon: Upload },
  { id: 3, title: 'Choose Plan', icon: Crown },
  { id: 4, title: 'Cover Design', icon: Image },
  { id: 5, title: 'Pricing', icon: DollarSign },
  { id: 6, title: 'Review', icon: Eye },
];

const COVER_STYLES = [
  { id: 'cinematic', name: 'Cinematic', desc: 'Dramatic, film-like aesthetic' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean typography, simple elements' },
  { id: 'illustrated', name: 'Illustrated', desc: 'Hand-drawn, painterly style' },
  { id: 'photographic', name: 'Photographic', desc: 'Real-world imagery' },
  { id: 'abstract', name: 'Abstract', desc: 'Artistic, conceptual' },
  { id: 'classic', name: 'Classic', desc: 'Traditional book design' },
];

export default function UploadWizard() {
  const router = useRouter();
  const { currency } = useCurrency();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [data, setData] = useState({
    title: '',
    subtitle: '',
    genre: '',
    language: 'English',
    description: '',
    manuscriptFile: null as File | null,
    manuscriptName: '',
    manuscriptUrl: '' as string,
    publisher: '',
    planTier: 'PROFESSIONAL' as 'STARTER' | 'PROFESSIONAL' | 'BESTSELLER',
    coverStyle: 'cinematic',
    coverPrompt: '',
    priceINR: 399,
    priceUSD: 9.99,
  });

  function next() { if (step < 6) setStep(step + 1); }
  function back() { if (step > 1) setStep(step - 1); }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          subtitle: data.subtitle,
          genre: data.genre,
          language: data.language,
          description: data.description,
          publisher: data.publisher,
          manuscriptUrl: data.manuscriptUrl,
          planTier: data.planTier,
          priceINR: data.priceINR,
          priceUSD: data.priceUSD,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit');
      // Go to payment page for this book
      router.push(`/dashboard/books/${result.bookId}/pay`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  function canProceed() {
    switch (step) {
      case 1: return data.title && data.genre && data.description.length >= 10;
      case 2: return data.manuscriptUrl !== '';
      case 3: return data.planTier !== null;
      case 4: return data.coverStyle !== '';
      case 5: return data.priceINR > 0 && data.priceUSD > 0;
      default: return true;
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Steps sidebar */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-24">
          <ol className="space-y-2">
            {STEPS.map((s) => {
              const isActive = step === s.id;
              const isComplete = step > s.id;
              return (
                <li
                  key={s.id}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-royal-900 text-cream-50 shadow-royal'
                      : isComplete
                      ? 'bg-gold-100 text-gold-800'
                      : 'bg-cream-100/60 text-ink-900/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isActive
                        ? 'bg-gold-shimmer text-royal-900'
                        : isComplete
                        ? 'bg-gold-500 text-cream-50'
                        : 'bg-cream-50 text-ink-900/40'
                    }`}
                  >
                    {isComplete ? <Check size={14} /> : s.id}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[10px] tracking-widest uppercase opacity-70">Step {s.id}</p>
                    <p className="text-sm font-semibold">{s.title}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Form area */}
      <div className="lg:col-span-9">
        <div className="card-premium p-8 lg:p-10">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-400 text-burgundy-700 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: DETAILS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">Step 1 of 6</p>
                <h3 className="font-display text-3xl text-royal-900">Tell us about your book</h3>
                <p className="text-ink-900/60 mt-2">These details will appear on your book's listing page.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                    placeholder="The Lantern Keeper"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Subtitle (optional)
                  </label>
                  <input
                    type="text"
                    value={data.subtitle}
                    onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                    placeholder="A novel of memory and light"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Genre *
                  </label>
                  <select
                    value={data.genre}
                    onChange={(e) => setData({ ...data, genre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none transition-all"
                  >
                    <option value="">Select genre...</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Language
                  </label>
                  <select
                    value={data.language}
                    onChange={(e) => setData({ ...data, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none transition-all"
                  >
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Book Description *
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all resize-none"
                    placeholder="A compelling description that will appear on bookstore listings..."
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <button className="text-xs text-gold-600 hover:text-gold-700 inline-flex items-center gap-1 font-medium">
                      <Sparkles size={12} /> AI: Enhance description
                    </button>
                    <span className="text-xs text-ink-900/40">{data.description.length} / 1000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Preferred Publisher Imprint
                  </label>
                  <select
                    value={data.publisher}
                    onChange={(e) => setData({ ...data, publisher: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none"
                  >
                    <option value="">Select a publisher (optional, can change later)</option>
                    {PUBLISHERS.filter(p => p.isActive).map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-ink-900/40 mt-1">Your book will be published under this imprint. Required for ISBN application.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MANUSCRIPT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">Step 2 of 6</p>
                <h3 className="font-display text-3xl text-royal-900">Upload your manuscript</h3>
                <p className="text-ink-900/60 mt-2">We accept .docx, .pdf, .txt, and .rtf. Maximum 50MB.</p>
              </div>

              <FileUpload
                kind="manuscript"
                currentUrl={data.manuscriptUrl || null}
                onUploaded={(url) => {
                  const fileName = url.split('/').pop() || 'manuscript';
                  setData({ ...data, manuscriptUrl: url, manuscriptName: decodeURIComponent(fileName) });
                }}
                helpText=".docx, .pdf, .txt, .rtf — Max 50MB"
              />

              {data.manuscriptUrl && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <strong>Manuscript uploaded successfully.</strong> You can replace it before submitting.
                  </div>
                </div>
              )}

              <div className="bg-royal-50 border border-royal-100 rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-ink-900/80">
                  <strong className="text-royal-900">What happens next:</strong> Our AI will analyze your manuscript for grammar, structure, and pacing — preserving your unique voice. You'll review suggestions before any changes are made.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PLAN */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">Step 3 of 6</p>
                <h3 className="font-display text-3xl text-royal-900">Choose your publishing plan</h3>
                <p className="text-ink-900/60 mt-2">Select the level of service that fits your goals.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setData({ ...data, planTier: plan.id })}
                    className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
                      data.planTier === plan.id
                        ? 'border-gold-500 bg-gold-50/50 shadow-gold-glow'
                        : 'border-royal-100 hover:border-royal-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 right-4 bg-gold-shimmer text-royal-900 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
                        POPULAR
                      </span>
                    )}
                    <h4 className="font-display text-2xl text-royal-900">{plan.name}</h4>
                    <p className="text-xs italic text-ink-900/60 mt-1">{plan.tagline}</p>
                    <p className="font-display text-3xl text-gold-gradient mt-4">
                      {formatPrice(currency === 'INR' ? plan.priceINR : plan.priceUSD, currency)}
                    </p>
                    <p className="text-xs text-ink-900/60 mt-1">One-time payment</p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="text-xs text-ink-900/70 flex items-start gap-2">
                          <Check className="w-3 h-3 text-gold-600 flex-shrink-0 mt-0.5" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: COVER */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">Step 4 of 6</p>
                <h3 className="font-display text-3xl text-royal-900">Design your cover</h3>
                <p className="text-ink-900/60 mt-2">Choose a style — our AI will generate options based on your book.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {COVER_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setData({ ...data, coverStyle: style.id })}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      data.coverStyle === style.id
                        ? 'border-gold-500 bg-gold-50/50'
                        : 'border-royal-100 hover:border-royal-300'
                    }`}
                  >
                    <div className="aspect-[3/4] mb-3 rounded-lg bg-gradient-to-br from-royal-700 via-royal-900 to-ink-950 relative overflow-hidden">
                      <div className="absolute inset-2 border border-gold-400/30 rounded flex items-center justify-center">
                        <span className="font-display text-gold-300 text-xs italic">{data.title || 'Your Book'}</span>
                      </div>
                    </div>
                    <p className="font-display text-lg text-royal-900">{style.name}</p>
                    <p className="text-xs text-ink-900/60 mt-1">{style.desc}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                  Additional Cover Direction (optional)
                </label>
                <textarea
                  value={data.coverPrompt}
                  onChange={(e) => setData({ ...data, coverPrompt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none resize-none"
                  placeholder="A lighthouse at dusk, golden light, mysterious atmosphere..."
                />
                <p className="text-xs text-ink-900/40 mt-1">Our AI will use this guidance when generating covers.</p>
              </div>
            </div>
          )}

          {/* STEP 5: PRICING */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">Step 5 of 6</p>
                <h3 className="font-display text-3xl text-royal-900">Set your book's price</h3>
                <p className="text-ink-900/60 mt-2">Set prices for both markets. You can change these anytime.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Price in INR (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={data.priceINR}
                    onChange={(e) => setData({ ...data, priceINR: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none"
                  />
                  <p className="text-xs text-ink-900/60 mt-1">Recommended: ₹199 – ₹599 for fiction</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-royal-800 mb-2">
                    Price in USD ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.priceUSD}
                    onChange={(e) => setData({ ...data, priceUSD: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-royal-200 focus:border-gold-500 outline-none"
                  />
                  <p className="text-xs text-ink-900/60 mt-1">Recommended: $4.99 – $14.99 for fiction</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gold-50 to-cream-100 rounded-2xl p-6 border border-gold-200">
                <p className="text-xs tracking-widest uppercase text-gold-700 font-semibold mb-2">Book pricing summary</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-display text-3xl text-royal-900">
                      {formatPrice(data.priceINR, 'INR')}
                    </p>
                    <p className="text-xs text-ink-900/60">India price</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl text-royal-900">
                      {formatPrice(data.priceUSD, 'USD')}
                    </p>
                    <p className="text-xs text-ink-900/60">Global price</p>
                  </div>
                </div>
                <p className="text-xs text-ink-900/60 mt-3">
                  Once published, your book will be available worldwide at these prices.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">Step 6 of 6</p>
                <h3 className="font-display text-3xl text-royal-900">Review & submit</h3>
                <p className="text-ink-900/60 mt-2">Confirm your details. We'll begin work immediately.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-premium p-5">
                  <p className="text-xs tracking-widest uppercase text-gold-700 font-semibold mb-2">Book</p>
                  <p className="font-display text-2xl text-royal-900">{data.title}</p>
                  {data.subtitle && <p className="text-sm italic text-ink-900/60">{data.subtitle}</p>}
                  <p className="text-xs text-ink-900/60 mt-3">{data.genre} • {data.language}</p>
                  <p className="text-sm text-ink-900/70 mt-3 line-clamp-3">{data.description}</p>
                </div>

                <div className="card-premium p-5">
                  <p className="text-xs tracking-widest uppercase text-gold-700 font-semibold mb-2">Files & Services</p>
                  <p className="text-sm text-ink-900/80"><strong>Manuscript:</strong> {data.manuscriptName || '—'}</p>
                  <p className="text-sm text-ink-900/80 mt-1"><strong>Plan:</strong> {data.planTier}</p>
                  <p className="text-sm text-ink-900/80 mt-1"><strong>Cover style:</strong> {data.coverStyle}</p>
                </div>

                <div className="card-premium p-5 md:col-span-2">
                  <p className="text-xs tracking-widest uppercase text-gold-700 font-semibold mb-2">Pricing</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-display text-2xl text-royal-900">{formatPrice(data.priceINR, 'INR')}</p>
                      <p className="text-xs text-ink-900/60">India price</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl text-royal-900">{formatPrice(data.priceUSD, 'USD')}</p>
                      <p className="text-xs text-ink-900/60">Global price</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-royal-50 border border-royal-100 rounded-xl p-4">
                <p className="text-sm text-ink-900/80">
                  <strong className="text-royal-900">By submitting,</strong> you confirm you own all rights to this work and agree to LUMIN's publishing terms. Plan fees are charged upon approval, not submission.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 pt-6 border-t border-royal-100 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-royal-800 hover:bg-royal-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <p className="text-xs text-ink-900/40">Step {step} of {STEPS.length}</p>

            {step < 6 ? (
              <button
                onClick={next}
                disabled={!canProceed()}
                className="btn-royal py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-gold py-2.5"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  'Submit for Publishing'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
