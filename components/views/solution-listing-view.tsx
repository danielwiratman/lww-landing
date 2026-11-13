'use client';

import Cta from '@/components/cta';
import PageHeader from '@/components/page-header';
import SolutionCard from '@/components/solution-card';
import type { SolutionDoc, TinaQueryProps } from '@/lib/content';
import { type Locale, localizeHref } from '@/lib/i18n';
import type { SolutionListingConnectionQuery } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<SolutionListingConnectionQuery>;
  solutions: SolutionDoc[];
  locale: Locale;
};

export function SolutionListingView({ tina, solutions, locale }: Props) {
  const { data } = useTina(tina);
  const page = data.solutionListingConnection.edges?.[0]?.node;

  if (!page) return null;

  const hero = page.hero;
  const isID = locale === 'id';

  return (
    <>
      <PageHeader
        image={hero?.image}
        eyebrow={hero?.tagline ?? 'Solutions & Services'}
        heading={hero?.heading ?? page.title}
        subheading={page.intro ?? undefined}
        locale={locale}
      />

      {page.intro ? (
        <section className='container-x py-12'>
          <div className='text-center max-w-2xl mx-auto mb-12'>
            <p className='text-ink-muted text-lg'>{page.intro}</p>
          </div>

          <ul className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {solutions.map((solution) => (
              <li key={solution.id}>
                <SolutionCard
                  solution={solution}
                  href={localizeHref(`/solutions/${solution.slug}/`, locale)}
                  learnMoreLabel={isID ? 'Pelajari lebih lanjut' : 'Learn more'}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Cta cta={page.cta} locale={locale} />
    </>
  );
}

export default SolutionListingView;
