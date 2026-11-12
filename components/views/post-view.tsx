'use client';

import PageHeader from '@/components/page-header';
import type { TinaQueryProps } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { PostConnectionQuery } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

type Props = {
  tina: TinaQueryProps<PostConnectionQuery>;
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

export function PostView({ tina, locale }: Props) {
  const { data } = useTina(tina);
  const post = data.postConnection.edges?.[0]?.node;

  if (!post) return null;

  return (
    <>
      <PageHeader image={post.image} eyebrow='Insights' heading={post.title} locale={locale} />

      <article className='container-x max-w-3xl py-12'>
        <p className='text-sm text-ink-muted'>
          {formatDate(post.date, locale)}
          {post.author ? ` · ${post.author}` : ''}
        </p>

        {post.description ? <p className='mt-4 text-xl text-ink-muted text-pretty'>{post.description}</p> : null}

        {post.body ? (
          <div className='prose prose-lg mt-10 max-w-none'>
            <TinaMarkdown content={post.body} />
          </div>
        ) : null}
      </article>
    </>
  );
}

export default PostView;
