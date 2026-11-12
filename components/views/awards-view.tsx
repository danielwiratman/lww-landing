'use client';

import { Icon } from '@/components/icon';
import Lightbox from '@/components/lightbox';
import PageHeader from '@/components/page-header';
import type { TinaQueryProps } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { AwardsConnectionQuery } from '@/tina/__generated__/types';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<AwardsConnectionQuery>;
  locale: Locale;
};

export function AwardsView({ tina, locale }: Props) {
  const { data } = useTina(tina);
  const page = data.awardsConnection.edges?.[0]?.node;

  if (!page) return null;

  const hero = page.hero;

  return (
    <>
      <PageHeader
        image={hero?.image}
        eyebrow={hero?.tagline ?? 'Awards & Certifications'}
        heading={hero?.heading ?? page.title}
        subheading={page.intro ?? undefined}
        locale={locale}
      />

      {page.awards?.length ? (
        <section className='container-x py-12 md:py-16'>
          <ul className='space-y-10'>
            {(page.awards ?? [])
              .filter((award): award is NonNullable<typeof award> => Boolean(award))
              .map((award) => (
                <li key={award.name} className='rounded-2xl border border-line bg-white p-6 md:p-8'>
                  <div className='max-w-2xl mb-6'>
                    <h2 className='text-2xl md:text-3xl font-bold text-balance'>{award.name}</h2>
                    {award.description ? <p className='mt-2 text-ink-muted leading-relaxed'>{award.description}</p> : null}
                  </div>
                  <Lightbox
                    images={(award.images ?? []).filter((image): image is NonNullable<typeof image> => Boolean(image)).map((image) => image.image)}
                    alt={award.name}
                  />
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {page.certifications?.length ? (
        <section className='container-x py-12'>
          <h2 className='text-2xl md:text-3xl font-bold mb-6'>{page.certificationsHeading ?? 'Standards & Certifications'}</h2>
          <ul className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {(page.certifications ?? [])
              .filter((cert): cert is NonNullable<typeof cert> => Boolean(cert))
              .map((cert) => (
                <li key={cert.name} className='card p-7'>
                  <div className='w-12 h-12 rounded-md bg-brand-50 text-brand flex items-center justify-center mb-4'>
                    <Icon name='badge' className='w-6 h-6' />
                  </div>
                  <h3 className='text-lg font-bold mb-1'>{cert.name}</h3>
                  {cert.description ? <p className='text-sm text-ink-muted mb-3'>{cert.description}</p> : null}
                  {cert.issuedBy ? <p className='text-xs uppercase tracking-wider text-brand font-semibold'>{cert.issuedBy}</p> : null}
                  {cert.file ? (
                    <a
                      href={cert.file}
                      target='_blank'
                      rel='noopener'
                      className='mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline'
                    >
                      View certificate
                      <Icon name='arrow-right' className='w-4 h-4' />
                    </a>
                  ) : null}
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

export default AwardsView;
