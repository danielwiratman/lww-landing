'use client';

import type { TinaQueryProps } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { PageConnectionQuery } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

type Props = {
  tina: TinaQueryProps<PageConnectionQuery>;
  locale: Locale;
};

export function PageView({ tina, locale }: Props) {
  const { data } = useTina(tina);
  const page = data.pageConnection.edges?.[0]?.node;

  if (!page) return null;

  return (
    <section className='container-x py-16'>
      <div className='prose prose-lg max-w-3xl mx-auto'>
        {page.title ? <h1>{page.title}</h1> : null}
        {page.body ? <TinaMarkdown content={page.body} /> : null}
      </div>
    </section>
  );
}

export default PageView;
