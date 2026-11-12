import PageView from '@/components/views/page-view';
import { getPage, toTinaProps } from '@/lib/content';
import { isLocale, localePath, locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { doc } = await getPage(locale, slug);
  const path = `/${slug}/`;
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? undefined,
    description: doc?.description ?? undefined,
    alternates: { canonical: localePath(locale, path), languages },
  };
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const { doc, res } = await getPage(locale, slug);
  if (!doc) notFound();

  return <PageView tina={toTinaProps(res)} locale={locale} />;
}
