import PartnersView from '@/components/views/partners-view';
import { getGlobal, getPartners, toTinaProps } from '@/lib/content';
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
  const { doc } = await getPartners(locale);
  const path = '/partners/';
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'Partners & Clients',
    description: doc?.description ?? undefined,
    alternates: { canonical: localePath(locale, path), languages },
  };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [{ doc, res }, global] = await Promise.all([getPartners(locale), getGlobal(locale)]);
  if (!doc) notFound();

  const clientNames = (global.doc?.clients?.items ?? []).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => item.name);

  return <PartnersView tina={toTinaProps(res)} clientNames={clientNames} locale={locale} />;
}
