'use client';

import PageHeader from '@/components/page-header';
import type { PostDoc, TinaQueryProps } from '@/lib/content';
import { type Locale, localizeHref } from '@/lib/i18n';
import type { PostListingConnectionQuery } from '@/tina/__generated__/types';
import Link from 'next/link';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<PostListingConnectionQuery>;
  posts: PostDoc[];
  locale: Locale;
};

function formatDate(value: string | null | undefined, locale: Locale) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function PostListingView({ tina, posts, locale }: Props) {
  const { data } = useTina(tina);
  const page = data.postListingConnection.edges?.[0]?.node;

  if (!page) return null;

  const hero = page.hero;

  return (
    <>
      <PageHeader
        image={hero?.image}
        eyebrow={hero?.tagline ?? 'Insights'}
        heading={hero?.heading ?? page.title}
        subheading={page.description ?? undefined}
        locale={locale}
      />

      <section className='container-x py-16'>
        {posts.length ? (
          <ul className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={localizeHref(`/posts/${post.slug}/`, locale)}
                  className='group card overflow-hidden h-full flex flex-col hover:border-brand transition'
                >
                  {post.image ? (
                    <div className='aspect-[16/9] overflow-hidden bg-line'>
                      <img src={post.image} alt={post.title} className='w-full h-full object-cover group-hover:scale-105 transition duration-500' />
                    </div>
                  ) : null}
                  <div className='p-6 flex flex-col flex-1'>
                    <p className='text-xs uppercase tracking-wider text-ink-muted mb-2'>{formatDate(post.date, locale)}</p>
                    <h2 className='text-lg font-bold group-hover:text-brand transition'>{post.title}</h2>
                    <p className='mt-2 text-sm text-ink-muted line-clamp-3 flex-1'>{post.description}</p>
                    <p className='mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand'>
                      Read more{' '}
                      <svg
                        className='w-4 h-4'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden='true'
                      >
                        <line x1='5' y1='12' x2='19' y2='12' />
                        <polyline points='12 5 19 12 12 19' />
                      </svg>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center text-ink-muted'>Belum ada artikel.</p>
        )}
      </section>
    </>
  );
}

export default PostListingView;
