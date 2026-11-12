import PostListingView from '@/components/views/post-listing-view';
import { getPostListing, getPosts, toTinaProps } from '@/lib/content';
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
  const { doc } = await getPostListing(locale);
  const path = '/posts/';
  const languages = Object.fromEntries(locales.map((code) => [code === 'id' ? 'id-ID' : 'en', localePath(code, path)]));
  return {
    title: doc?.title ?? 'Insights',
    description: doc?.description ?? undefined,
    alternates: { canonical: localePath(locale, path), languages },
  };
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [{ doc, res }, posts] = await Promise.all([getPostListing(locale), getPosts(locale)]);
  if (!doc) notFound();

  return <PostListingView tina={toTinaProps(res)} posts={posts.docs} locale={locale} />;
}
