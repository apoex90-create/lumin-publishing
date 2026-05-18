export type Currency = 'INR' | 'USD';

export interface Plan {
  id: 'STARTER' | 'PROFESSIONAL' | 'BESTSELLER';
  name: string;
  tagline: string;
  priceINR: number;
  priceUSD: number;
  popular?: boolean;
  features: string[];
  royaltyPercent: number;
}

export const PLANS: Plan[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    tagline: 'For first-time authors',
    priceINR: 4999,
    priceUSD: 59,
    royaltyPercent: 70,
    features: [
      'AI-assisted grammar & style edit',
      '3 AI-generated cover options',
      'EPUB + PDF formatting',
      'Listed on LUMIN bookstore',
      'Basic author profile page',
      'Sales dashboard & analytics',
      '70% royalty to author',
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    tagline: 'Our most popular plan',
    priceINR: 14999,
    priceUSD: 179,
    popular: true,
    royaltyPercent: 75,
    features: [
      'Everything in Starter, plus:',
      'Advanced AI edit + 1 human proofread',
      '10 AI covers + 1 custom revision',
      'Print-ready PDF (paperback)',
      'ISBN included',
      'Amazon KDP distribution',
      'AI marketing kit (social + ad copy)',
      '75% royalty to author',
    ],
  },
  {
    id: 'BESTSELLER',
    name: 'Bestseller',
    tagline: 'Full premium publishing',
    priceINR: 39999,
    priceUSD: 479,
    royaltyPercent: 80,
    features: [
      'Everything in Professional, plus:',
      'Full human edit (multiple rounds)',
      'Custom cover by designer',
      'Hardcover + paperback + ebook',
      'ISBN + barcode + DOI',
      'Global distribution (Amazon, Apple, Google, IngramSpark)',
      'Book launch campaign',
      'Dedicated author website page',
      '80% royalty to author',
    ],
  },
];

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount < 100 ? 2 : 0,
  }).format(amount);
}

export const GENRES = [
  'Literary Fiction',
  'Romance',
  'Mystery & Thriller',
  'Science Fiction',
  'Fantasy',
  'Historical Fiction',
  'Young Adult',
  "Children's",
  'Poetry',
  'Biography & Memoir',
  'Self-Help',
  'Business',
  'Spirituality',
  'Academic',
  'Other',
];

export const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Punjabi',
  'Urdu',
  'Other',
];
