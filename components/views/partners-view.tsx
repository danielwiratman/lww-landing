'use client';

import ClientMarquee from '@/components/client-marquee';
import Cta from '@/components/cta';
import PageHeader from '@/components/page-header';
import type { TinaQueryProps } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { PartnersConnectionQuery } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<PartnersConnectionQuery>;
  clientNames: string[];
  locale: Locale;
};

export function PartnersView({ tina, clientNames, locale }: Props) {
  const { data } = useTina(tina);
  const page = data.partnersConnection.edges?.[0]?.node;

  if (!page) return null;

  const hero = page.hero;
  const isID = locale === 'id';

  return (
    <>
      <PageHeader
        image={hero?.image}
        eyebrow={hero?.tagline ?? 'Partners'}
        heading={hero?.heading ?? page.title}
        subheading={page.intro ?? undefined}
        locale={locale}
      />

      <section className='container-x py-16'>
        <div className='max-w-2xl mb-10'>
          <p className='eyebrow mb-3'>{isID ? 'Mitra' : 'Partners'}</p>
          <h2 className='text-3xl md:text-4xl font-bold text-balance'>{isID ? 'Mitra Teknologi Kami' : 'Our Technology Partners'}</h2>
        </div>
        <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {(page.partners ?? [])
            .filter((partner): partner is NonNullable<typeof partner> => Boolean(partner))
            .map((partner) => (
              <li key={partner.name} className='card p-6 flex flex-col items-center justify-center text-center h-40 hover:border-brand transition'>
                {partner.logo ? <img src={partner.logo} alt='' className='max-h-16 max-w-full object-contain mb-2' /> : null}
                <p className='text-base font-bold'>{partner.name}</p>
                {partner.category ? <p className='text-xs text-ink-muted mt-1'>{partner.category}</p> : null}
              </li>
            ))}
        </ul>
      </section>

      {page.clients ? (
        <section className='bg-brand text-white overflow-hidden'>
          <div className='container-x py-16 md:py-20'>
            <div className='max-w-2xl'>
              <p className='text-sm font-semibold tracking-[0.2em] uppercase text-brand-200 mb-3'>{page.clients.heading ?? (isID ? 'Pelanggan' : 'Clients')}</p>
              <h2 className='text-3xl md:text-4xl font-bold text-balance'>
                {isID ? `Di dipercaya oleh ${page.clients.count} pelanggan di seluruh Indonesia` : `Trusted by ${page.clients.count} clients across Indonesia`}
              </h2>
              {page.clients.blurb ? <p className='mt-4 text-brand-100/90 max-w-2xl'>{page.clients.blurb}</p> : null}
            </div>
          </div>
          <div className='pb-16 md:pb-20'>
            <ClientMarquee items={clientNames} />
          </div>
        </section>
      ) : null}

      <Cta cta={page.cta} locale={locale} />
    </>
  );
}

export default PartnersView;
