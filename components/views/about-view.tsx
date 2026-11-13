'use client';

import Cta from '@/components/cta';
import PageHeader from '@/components/page-header';
import Reveal from '@/components/reveal';
import type { TinaQueryProps } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { AboutConnectionQuery } from '@/tina/__generated__/types';
import Image from 'next/image';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<AboutConnectionQuery>;
  locale: Locale;
};

export function AboutView({ tina, locale }: Props) {
  const { data } = useTina(tina);
  const about = data.aboutConnection.edges?.[0]?.node;

  if (!about) return null;

  const hero = about.hero;

  return (
    <>
      <PageHeader image={hero?.image} eyebrow={hero?.tagline ?? 'About Us'} heading={hero?.heading ?? about.title} locale={locale} />

      <section className='container-x py-12 md:py-16'>
        <div className='grid lg:grid-cols-2 gap-10 lg:gap-14 items-start'>
          <div className='flex flex-col gap-8'>
            {about.intro ? <p className='text-lg md:text-xl text-ink-muted leading-relaxed text-pretty'>{about.intro}</p> : null}

            {about.vision ? (
              <div className='border-t border-line pt-6'>
                <p className='eyebrow mb-2'>{about.vision.title}</p>
                <p className='text-xl md:text-2xl font-semibold text-balance'>{about.vision.text}</p>
              </div>
            ) : null}

            {about.mission ? (
              <div className='border-t border-line pt-6'>
                <p className='eyebrow mb-3'>{about.mission.title}</p>
                <ul className='space-y-3 text-ink-muted'>
                  {(about.mission.items ?? [])
                    .filter((item): item is NonNullable<typeof item> => Boolean(item))
                    .map((item) => (
                      <li key={item.text} className='flex gap-3'>
                        <span className='shrink-0 mt-1 w-5 h-5 rounded-full bg-brand-50 text-brand flex items-center justify-center'>
                          <svg
                            className='w-3 h-3'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='3'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            aria-hidden='true'
                          >
                            <polyline points='20 6 9 17 4 12' />
                          </svg>
                        </span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>

          {hero?.image ? (
            <figure className='rounded-2xl overflow-hidden border border-line bg-white order-first lg:order-none'>
              <div className='relative aspect-[4/3] w-full'>
                <Image src={hero.image} alt={about.heroCaption?.text ?? ''} fill sizes='(min-width: 1024px) 50vw, 100vw' className='object-cover' />
              </div>
              {about.heroCaption?.text ? (
                <figcaption className='px-5 py-3 text-center text-sm text-ink-muted italic border-t border-line'>{about.heroCaption.text}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </section>

      {about.stats?.length ? (
        <section className='bg-brand text-white'>
          <div className='container-x py-12'>
            <ul className='grid grid-cols-2 lg:grid-cols-4 gap-y-8'>
              {(about.stats ?? [])
                .filter((stat): stat is NonNullable<typeof stat> => Boolean(stat))
                .map((stat, index) => (
                  <li key={stat.label} className={`px-4 ${index !== 0 ? 'lg:border-l lg:border-white/20' : ''}`}>
                    <p className='text-3xl md:text-4xl font-bold leading-none'>{stat.value}</p>
                    <p className='text-xs md:text-sm text-brand-100/80 uppercase tracking-wider mt-1'>{stat.label}</p>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      ) : null}

      {about.story?.length ? (
        <section className='container-x py-20'>
          <p className='eyebrow mb-3'>Our journey</p>
          <h2 className='text-3xl md:text-4xl font-bold text-balance max-w-2xl'>From a five-person workshop to a nationwide system integrator.</h2>

          <ol className='mt-12 relative border-l-2 border-line ml-3 space-y-10'>
            {(about.story ?? [])
              .filter((item): item is NonNullable<typeof item> => Boolean(item))
              .map((item) => (
                <li key={`${item.year}-${item.title}`} className='pl-8 relative'>
                  <span className='absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-brand border-4 border-white' />
                  <p className='text-xs uppercase tracking-wider text-brand font-semibold'>{item.year}</p>
                  <h3 className='text-xl font-bold mt-1'>{item.title}</h3>
                  <p className='mt-2 text-ink-muted leading-relaxed'>{item.description}</p>
                </li>
              ))}
          </ol>
        </section>
      ) : null}

      {about.values?.length ? (
        <section className='container-x py-16'>
          <p className='eyebrow mb-3'>Our values</p>
          <h2 className='text-3xl md:text-4xl font-bold mb-10'>What guides our work.</h2>
          <ul className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {(about.values ?? [])
              .filter((value): value is NonNullable<typeof value> => Boolean(value))
              .map((value) => (
                <li key={value.title} className='card p-6'>
                  <h3 className='text-base font-bold mb-2'>{value.title}</h3>
                  <p className='text-sm text-ink-muted leading-relaxed'>{value.description}</p>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <Reveal>
        <Cta cta={about.cta} locale={locale} />
      </Reveal>
    </>
  );
}

export default AboutView;
