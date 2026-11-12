import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import WhatsAppButton from '@/components/whatsapp-button';
import { getGlobal } from '@/lib/content';
import { isLocale, localeMeta, locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import '@/styles.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dev-lww-landing.netlify.app'),
  title: {
    default: 'PT Limawira Wisesa',
    template: '%s | PT Limawira Wisesa',
  },
  description: 'PT Limawira Wisesa — Enterprise digital infrastructure and critical power solutions since 1985.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/img/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/img/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'PT Limawira Wisesa',
    images: ['/img/home-hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { doc } = await getGlobal(locale);

  return (
    <html lang={localeMeta[locale].htmlLang} className={`scroll-smooth ${fontSans.variable} ${fontDisplay.variable}`}>
      <body className='font-sans text-ink bg-white antialiased'>
        <SiteHeader global={doc} locale={locale} />
        <main id='main'>{children}</main>
        <SiteFooter global={doc} locale={locale} />
        <WhatsAppButton number={doc?.site?.whatsapp} />
      </body>
    </html>
  );
}
