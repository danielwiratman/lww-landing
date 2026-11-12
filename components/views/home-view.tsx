'use client';

import Cta from '@/components/cta';
import HeroCarousel from '@/components/hero-carousel';
import { Icon } from '@/components/icon';
import Reveal from '@/components/reveal';
import type { PartnersDoc, SolutionDoc, TinaQueryProps } from '@/lib/content';
import { type Locale, localizeHref } from '@/lib/i18n';
import type { HomeConnectionQuery } from '@/tina/__generated__/types';
import Link from 'next/link';
import { useTina } from 'tinacms/dist/react';

type Props = {
  tina: TinaQueryProps<HomeConnectionQuery>;
  solutions: SolutionDoc[];
  partners: PartnersDoc | null;
  locale: Locale;
};

const statIcons = ['trophy', 'box', 'users', 'shield'];

export function HomeView({ tina, solutions, partners, locale }: Props) {
  const { data } = useTina(tina);
  const home = data.homeConnection.edges?.[0]?.node;

  if (!home) return null;

  const hero = home.hero;
  const slides = (hero?.carousel?.slides ?? [])
    .filter((slide): slide is NonNullable<typeof slide> => Boolean(slide?.image))
    .map((slide) => ({ image: slide.image, caption: slide.caption, alt: slide.alt }));
  const partnerItems = (partners?.partners ?? []).filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className='relative overflow-hidden bg-white'>
        <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
          <div className='hero-grid absolute inset-0 opacity-[0.04]' />
          <div className='hero-orb hero-orb-1 absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/15 blur-3xl' />
          <div className='hero-orb hero-orb-2 absolute top-1/2 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand/10 blur-3xl' />
          <div className='hero-orb hero-orb-3 absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-brand-200/30 blur-3xl' />
        </div>

        <div className='container-x relative grid lg:grid-cols-2 gap-12 items-center py-20 md:py-28'>
          <Reveal>
            {hero?.eyebrow ? (
              <div className='eyebrow mb-5 inline-flex items-center gap-3'>
                <span className='hero-pulse relative inline-flex w-2.5 h-2.5'>
                  <span className='absolute inset-0 rounded-full bg-brand' />
                  <span className='absolute inset-0 rounded-full bg-brand hero-pulse-ring' />
                </span>
                <span className='hero-eyebrow-text'>{hero.eyebrow}</span>
              </div>
            ) : null}
            {hero?.heading ? <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance'>{hero.heading}</h1> : null}
            {hero?.tagline ? <p className='mt-6 text-lg text-ink-muted max-w-xl text-pretty'>{hero.tagline}</p> : null}

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              {hero?.primaryCta?.label ? (
                <Link href={localizeHref(hero.primaryCta.url, locale)} className='btn-primary'>
                  {hero.primaryCta.label}
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
                </Link>
              ) : null}
              {hero?.secondaryCta?.label ? (
                <Link href={localizeHref(hero.secondaryCta.url, locale)} className='btn-secondary'>
                  <Icon name='play' className='w-4 h-4' />
                  {hero.secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </Reveal>

          <Reveal>
            <div className='relative'>
              <div className='absolute -inset-4 bg-brand/10 rounded-2xl -rotate-3' />
              <div className='hero-image-frame absolute -inset-1 rounded-2xl' />
              {slides.length ? (
                <HeroCarousel slides={slides} interval={hero?.carousel?.interval} />
              ) : hero?.image ? (
                <img
                  src={hero.image}
                  alt='Limawira Wisesa — engineering in action'
                  className='relative rounded-2xl shadow-soft w-full aspect-[4/3] object-cover'
                />
              ) : (
                <div className='relative rounded-2xl shadow-soft w-full aspect-[4/3] bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white/40'>
                  <span className='text-sm uppercase tracking-widest'>Hero image</span>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- QUICK ICONS --------------------------- */}
      {home.quickIcons?.items?.length ? (
        <section className='border-y border-line bg-cream/40'>
          <div className='container-x py-10'>
            <p className='text-xs font-semibold tracking-[0.2em] uppercase text-ink-muted text-center mb-8'>{home.quickIcons.title}</p>
            <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
              {(home.quickIcons.items ?? [])
                .filter((item): item is NonNullable<typeof item> => Boolean(item))
                .map((item) => (
                  <li key={item.url}>
                    <Link
                      href={localizeHref(item.url, locale)}
                      className='group card flex flex-col items-center text-center gap-3 p-6 h-full hover:border-brand hover:-translate-y-1 transition-all'
                    >
                      {item.icon ? (
                        <span className='w-14 h-14 rounded-lg bg-brand-50 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition'>
                          <img src={item.icon} alt='' className='w-8 h-8' />
                        </span>
                      ) : null}
                      <span className='text-sm font-semibold text-ink leading-snug'>{item.label}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ------------------------------ STATS ------------------------------ */}
      {home.stats?.length ? (
        <section className='bg-brand text-white'>
          <div className='container-x py-12 md:py-14'>
            <ul className='grid grid-cols-2 lg:grid-cols-4 gap-y-8'>
              {(home.stats ?? [])
                .filter((stat): stat is NonNullable<typeof stat> => Boolean(stat))
                .map((stat, index) => (
                  <li key={stat.label} className={`flex items-center gap-4 px-4 ${index !== 0 ? 'lg:border-l lg:border-white/20' : ''}`}>
                    <div className='shrink-0 text-brand-200'>
                      <Icon name={statIcons[index] ?? 'badge'} />
                    </div>
                    <div>
                      <p className='text-3xl md:text-4xl font-bold leading-none'>{stat.value}</p>
                      <p className='text-xs md:text-sm text-brand-100/80 uppercase tracking-wider mt-1'>{stat.label}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* -------------------------- SOLUTIONS GRID ------------------------- */}
      {home.solutions ? (
        <Reveal as='section' className='container-x py-20 md:py-24'>
          <div className='text-center max-w-2xl mx-auto mb-12'>
            <p className='eyebrow justify-center mb-3'>{home.solutions.eyebrow}</p>
            <h2 className='text-3xl md:text-4xl font-bold text-balance'>{home.solutions.title}</h2>
            {home.solutions.subtitle ? <p className='mt-3 text-ink-muted'>{home.solutions.subtitle}</p> : null}
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {solutions.map((solution) => (
              <Link
                key={solution.id}
                href={localizeHref(`/solutions/${solution.slug}/`, locale)}
                className='group card p-7 hover:border-brand hover:-translate-y-1 transition-all'
              >
                <div className='w-14 h-14 rounded-lg bg-brand-50 text-brand flex items-center justify-center mb-5 group-hover:bg-brand group-hover:text-white transition'>
                  <Icon name={solution.icon} />
                </div>
                <h3 className='text-lg font-bold mb-2 group-hover:text-brand transition'>{solution.title}</h3>
                <p className='text-sm text-ink-muted leading-relaxed'>{solution.shortDescription}</p>
                <p className='mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand'>
                  Learn more
                  <Icon name='arrow-right' className='w-4 h-4' />
                </p>
              </Link>
            ))}
          </div>
        </Reveal>
      ) : null}

      {/* -------------------------- PARTNERS STRIP ------------------------- */}
      {home.partners ? (
        <Reveal as='section' className='bg-cream/50 border-y border-line'>
          <div className='container-x py-12'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-balance'>{home.partners.title}</h2>
                {home.partners.subtitle ? <p className='text-ink-muted mt-1'>{home.partners.subtitle}</p> : null}
              </div>
              {home.partners.cta?.label ? (
                <Link href={localizeHref(home.partners.cta.url, locale)} className='btn-ghost'>
                  {home.partners.cta.label} →
                </Link>
              ) : null}
            </div>

            <ul className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3'>
              {partnerItems.slice(0, 8).map((partner) => (
                <li
                  key={partner.name}
                  className='flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-white border border-line text-center hover:border-brand transition'
                >
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className='max-h-10 max-w-full object-contain' />
                  ) : (
                    <span className='w-10 h-10 rounded bg-brand-50 text-brand flex items-center justify-center text-xs font-bold'>
                      {partner.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className='text-xs font-semibold text-ink-muted leading-tight'>{partner.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ) : null}

      <Reveal>
        <Cta cta={home.cta} locale={locale} />
      </Reveal>
    </>
  );
}

export default HomeView;
