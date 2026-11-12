import CustomersView from '@/components/views/customers-view';
import { getCustomers, toTinaProps } from '@/lib/content';
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
  const { doc } = await getCustomers(locale);
  const path = '/customers/';
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'Customers',
    description: doc?.description ?? undefined,
    alternates: { canonical: localePath(locale, path), languages },
  };
}

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { doc, res } = await getCustomers(locale);
  if (!doc) notFound();

  return <CustomersView tina={toTinaProps(res)} locale={locale} />;
}
