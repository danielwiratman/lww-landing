'use client';

import Cta from '@/components/cta';
import PageHeader from '@/components/page-header';
import Reveal from '@/components/reveal';
import type { TinaQueryProps } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { CustomersConnectionQuery } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<CustomersConnectionQuery>;
  locale: Locale;
};

export function CustomersView({ tina, locale }: Props) {
  const { data } = useTina(tina);
  const page = data.customersConnection.edges?.[0]?.node;

  if (!page) return null;

  const hero = page.hero;

  return (
    <>
      <PageHeader
        image={hero?.image}
        eyebrow={hero?.tagline ?? 'Customers'}
        heading={hero?.heading ?? page.title}
        subheading={page.description ?? undefined}
        locale={locale}
      />

      <section className='container-x py-16 space-y-16'>
        {(page.groups ?? [])
          .filter((group): group is NonNullable<typeof group> => Boolean(group))
          .map((group) => {
            const customers = (group.customers ?? []).filter((customer): customer is NonNullable<typeof customer> => Boolean(customer));
            return (
              <div key={group.title}>
                <div className='flex items-center gap-3 mb-6'>
                  <h2 className='text-2xl font-bold'>{group.title}</h2>
                  <span className='text-sm text-ink-muted'>({customers.length} customers)</span>
                </div>
                <ul className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {customers.map((customer) => (
                    <li key={customer.name} className='card p-5 hover:border-brand transition flex flex-col items-center justify-center text-center min-h-32'>
                      {customer.logo ? <img src={customer.logo} alt='' className='max-h-16 max-w-full object-contain mb-3' /> : null}
                      <p className='text-sm font-semibold'>{customer.name}</p>
                      {customer.industry ? <p className='text-xs text-ink-muted mt-1'>{customer.industry}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
      </section>

      <Reveal>
        <Cta cta={page.cta} locale={locale} />
      </Reveal>
    </>
  );
}

export default CustomersView;
