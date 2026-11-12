import SolutionView from '@/components/views/solution-view';
import { getSolution, getSolutions, toTinaProps } from '@/lib/content';
import { isLocale, localePath, locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { doc } = await getSolution(locale, slug);
  const path = `/solutions/${slug}/`;
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'Solution',
    description: doc?.shortDescription ?? undefined,
    alternates: { canonical: localePath(locale, path), languages },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [{ doc, res }, solutions] = await Promise.all([getSolution(locale, slug), getSolutions(locale)]);
  if (!doc) notFound();

  return <SolutionView tina={toTinaProps(res)} solutions={solutions.docs} locale={locale} />;
}
