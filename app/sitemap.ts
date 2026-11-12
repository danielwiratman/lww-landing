import { getPosts, getSolutions } from '@/lib/content';
import { localePath, locales } from '@/lib/i18n';
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dev-lww-landing.netlify.app';

const STATIC_PATHS = ['/', '/about/', '/solutions/', '/partners/', '/awards/', '/customers/', '/contact/', '/posts/', '/thank-you/'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}${localePath(locale, path)}`,
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.7,
      });
    }

    const solutions = await getSolutions(locale);
    for (const solution of solutions.docs) {
      entries.push({
        url: `${SITE_URL}${localePath(locale, `/solutions/${solution.slug}/`)}`,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    const posts = await getPosts(locale);
    for (const post of posts.docs) {
      entries.push({
        url: `${SITE_URL}${localePath(locale, `/posts/${post.slug}/`)}`,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
