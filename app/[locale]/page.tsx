import HomeView from '@/components/views/home-view';
import { getHome, getPartners, getSolutions, toTinaProps } from '@/lib/content';
import { isLocale, localePath, locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { doc } = await getHome(locale);
  const title = doc?.title ?? 'PT Limawira Wisesa';
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, '/')]));
  return {
    title,
    alternates: {
      canonical: localePath(locale, '/'),
      languages,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [home, solutions, partners] = await Promise.all([getHome(locale), getSolutions(locale), getPartners(locale)]);

  if (!home.doc) notFound();

  return <HomeView tina={toTinaProps(home.res)} solutions={solutions.docs} partners={partners.doc} locale={locale} />;
}
