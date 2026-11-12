import SolutionListingView from '@/components/views/solution-listing-view';
import { getSolutionListing, getSolutions, toTinaProps } from '@/lib/content';
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
  const { doc } = await getSolutionListing(locale);
  const path = '/solutions/';
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'Solutions & Services',
    description: doc?.description ?? undefined,
    alternates: { canonical: localePath(locale, path), languages },
  };
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [{ doc, res }, solutions] = await Promise.all([getSolutionListing(locale), getSolutions(locale)]);
  if (!doc) notFound();

  return <SolutionListingView tina={toTinaProps(res)} solutions={solutions.docs} locale={locale} />;
}
