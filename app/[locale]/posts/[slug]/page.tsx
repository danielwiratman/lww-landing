import PostView from '@/components/views/post-view';
import { getPost, toTinaProps } from '@/lib/content';
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
  const { doc } = await getPost(locale, slug);
  const path = `/posts/${slug}/`;
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'Insights',
    description: doc?.description ?? undefined,
    alternates: { canonical: localePath(locale, path), languages },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const { doc, res } = await getPost(locale, slug);
  if (!doc) notFound();

  return <PostView tina={toTinaProps(res)} locale={locale} />;
}
