import AboutView from '@/components/views/about-view';
import { getAbout, toTinaProps } from '@/lib/content';
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
  const { doc } = await getAbout(locale);
  const path = '/about/';
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'About Us',
    description: doc?.description ?? undefined,
    alternates: {
      canonical: localePath(locale, path),
      languages,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { doc, res } = await getAbout(locale);
  if (!doc) notFound();

  return <AboutView tina={toTinaProps(res)} locale={locale} />;
}
