'use client';

import Cta from '@/components/cta';
import { Icon } from '@/components/icon';
import PageHeader from '@/components/page-header';
import type { SolutionDoc, TinaQueryProps } from '@/lib/content';
import { type Locale, localizeHref } from '@/lib/i18n';
import type { SolutionConnectionQuery } from '@/tina/__generated__/types';
import Link from 'next/link';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<SolutionConnectionQuery>;
  solutions: SolutionDoc[];
  locale: Locale;
};

export function SolutionView({ tina, solutions, locale }: Props) {
  const { data } = useTina(tina);
  const solution = data.solutionConnection.edges?.[0]?.node;

  if (!solution) return null;

  const hero = solution.hero;
  const isID = locale === 'id';
  const index = solutions.findIndex((item) => item.id === solution.id);
  const prev = index > 0 ? solutions[index - 1] : null;
  const next = index >= 0 && index < solutions.length - 1 ? solutions[index + 1] : null;

  return (
    <>
      <PageHeader
        image={hero?.image}
        eyebrow={hero?.tagline ?? 'Solution'}
        heading={hero?.heading ?? solution.title}
        subheading={solution.shortDescription ?? undefined}
        locale={locale}
      />

      {solution.description ? (
        <section className='container-x py-12 max-w-3xl'>
          <p className='text-lg text-ink-muted leading-relaxed whitespace-pre-line'>{solution.description}</p>
        </section>
      ) : null}

      {solution.features?.length ? (
        <section className='container-x py-8'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {(solution.features ?? [])
              .filter((feature): feature is NonNullable<typeof feature> => Boolean(feature))
              .map((feature) => (
                <div key={feature.title} className='card p-6'>
                  <div className='w-12 h-12 rounded-md bg-brand-50 text-brand flex items-center justify-center mb-4'>
                    <Icon name={feature.icon} className='w-6 h-6' />
                  </div>
                  <h3 className='text-base font-bold mb-1.5'>{feature.title}</h3>
                  <p className='text-sm text-ink-muted leading-relaxed'>{feature.description}</p>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      {solution.specs?.length ? (
        <section className='container-x py-8'>
          <div className='rounded-2xl bg-cream/40 border border-line p-6 md:p-8'>
            <h2 className='text-2xl font-bold mb-6'>{solution.specsHeading ?? (isID ? 'Sekilas' : 'At a glance')}</h2>
            <dl className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {(solution.specs ?? [])
                .filter((spec): spec is NonNullable<typeof spec> => Boolean(spec))
                .map((spec) => (
                  <div key={spec.label}>
                    <dt className='text-xs font-semibold tracking-wider uppercase text-ink-muted mb-1'>{spec.label}</dt>
                    <dd className='text-base font-semibold text-ink'>{spec.value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </section>
      ) : null}

      {solution.customers?.length ? (
        <section className='container-x py-8'>
          <h2 className='text-2xl font-bold mb-6'>{solution.customersHeading ?? (isID ? 'Pelanggan yang Puas' : 'Satisfied Customers')}</h2>
          <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
            {(solution.customers ?? [])
              .filter((customer): customer is NonNullable<typeof customer> => Boolean(customer))
              .map((customer) => (
                <li key={customer.name} className='card p-6 flex flex-col items-center justify-center text-center min-h-40 hover:border-brand transition'>
                  {customer.logo ? <img src={customer.logo} alt='' className='max-h-16 max-w-full object-contain mb-3' /> : null}
                  <p className='text-sm font-semibold'>{customer.name}</p>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {solution.cta?.label ? (
        <Cta
          cta={{
            eyebrow: isID ? 'Hubungi kami' : 'Talk to us',
            heading: solution.cta.label,
            text: '',
            primaryCta: {
              label: isID ? 'Hubungi kami' : 'Contact us',
              url: solution.cta.url ?? '/contact/',
            },
          }}
          locale={locale}
        />
      ) : null}

      {prev || next ? (
        <section className='container-x py-12 border-t border-line'>
          <div className='grid sm:grid-cols-2 gap-4'>
            {prev ? (
              <Link href={localizeHref(`/solutions/${prev.slug}/`, locale)} className='group card p-5 flex items-center gap-4 hover:border-brand'>
                <div className='w-10 h-10 rounded-full bg-brand-50 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition'>
                  <Icon name='chevron-left' className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-xs uppercase tracking-wider text-ink-muted'>Previous</p>
                  <p className='font-semibold'>{prev.title}</p>
                </div>
              </Link>
            ) : null}
            {next ? (
              <Link
                href={localizeHref(`/solutions/${next.slug}/`, locale)}
                className='group card p-5 flex items-center gap-4 hover:border-brand sm:justify-end sm:text-right'
              >
                <div>
                  <p className='text-xs uppercase tracking-wider text-ink-muted'>Next</p>
                  <p className='font-semibold'>{next.title}</p>
                </div>
                <div className='w-10 h-10 rounded-full bg-brand-50 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition'>
                  <Icon name='chevron-right' className='w-5 h-5' />
                </div>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}

export default SolutionView;
