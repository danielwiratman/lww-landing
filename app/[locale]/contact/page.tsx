import ContactView from '@/components/views/contact-view';
import { getContact, getGlobal, toTinaProps } from '@/lib/content';
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
  const { doc } = await getContact(locale);
  const path = '/contact/';
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'Contact',
    description: doc?.description ?? undefined,
    alternates: {
      canonical: localePath(locale, path),
      languages,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [{ doc, res }, global] = await Promise.all([getContact(locale), getGlobal(locale)]);
  if (!doc) notFound();

  return <ContactView tina={toTinaProps(res)} locale={locale} phone={global.doc?.site?.phone} />;
}
