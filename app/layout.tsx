import type { Metadata } from 'next';
import './globals.css';
import { CurrencyProvider } from '@/lib/currency-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = { ...DEFAULT_SETTINGS, ...await getSettings([
    'seo.title', 'seo.description', 'seo.keywords', 'brand.name',
  ]) };

  return {
    title: {
      default: settings['seo.title'],
      template: `%s | ${settings['brand.name']}`,
    },
    description: settings['seo.description'],
    keywords: settings['seo.keywords'],
    openGraph: {
      title: settings['seo.title'],
      description: settings['seo.description'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings['seo.title'],
      description: settings['seo.description'],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
