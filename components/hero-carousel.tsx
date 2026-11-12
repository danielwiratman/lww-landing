'use client';

import { Icon } from '@/components/icon';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export type HeroSlide = {
  image: string;
  caption?: string | null;
  alt?: string | null;
};

type Props = {
  slides: HeroSlide[];
  interval?: number | null;
  label?: string;
  className?: string;
};

const DEFAULT_INTERVAL = 6000;

export function HeroCarousel({ slides, interval, label = 'Galeri hero', className = '' }: Props) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState<number[]>(() => (total > 1 ? [0, 1] : [0]));

  const delay = typeof interval === 'number' && interval >= 0 ? interval : DEFAULT_INTERVAL;
  const autoplay = total > 1 && delay > 0 && !paused && !active && !hidden && !reducedMotion;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    setLoaded((previous) => {
      const next = new Set(previous);
      next.add(index);
      if (total > 1) next.add((index + 1) % total);
      return Array.from(next);
    });
  }, [index, total]);

  const goTo = useCallback((target: number) => setIndex(((target % total) + total) % total), [total]);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % total), delay);
    return () => window.clearTimeout(timer);
  }, [autoplay, delay, index, total]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  if (!total) return null;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-brand-dark shadow-soft ${className}`}
      role='region'
      aria-roledescription='carousel'
      aria-label={label}
      aria-live='off'
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onKeyDown={handleKeyDown}
    >
      <div className='relative w-full aspect-[4/3]'>
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.image}
            className='absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none'
            style={{ opacity: slideIndex === index ? 1 : 0 }}
            role='group'
            aria-roledescription='slide'
            aria-label={`${slideIndex + 1} dari ${total}`}
            aria-hidden={slideIndex !== index}
          >
            {loaded.includes(slideIndex) ? (
              <Image
                src={slide.image}
                alt={slide.alt ?? slide.caption ?? ''}
                fill
                sizes='(max-width: 1024px) 100vw, 600px'
                className='object-cover'
                priority={slideIndex === 0}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
              />
            ) : null}
            {slide.caption ? (
              <div className='absolute inset-x-0 bottom-0 p-5 pb-12 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none'>
                <p className='text-white text-base md:text-lg font-semibold drop-shadow-sm'>{slide.caption}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {total > 1 ? (
        <>
          <button
            type='button'
            onClick={() => goTo(index - 1)}
            aria-label='Gambar sebelumnya'
            className='absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/80 text-ink shadow-soft opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity'
          >
            <Icon name='chevron-left' className='w-5 h-5' />
          </button>

          <button
            type='button'
            onClick={() => goTo(index + 1)}
            aria-label='Gambar berikutnya'
            className='absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/80 text-ink shadow-soft opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity'
          >
            <Icon name='chevron-right' className='w-5 h-5' />
          </button>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2'>
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.image}
                type='button'
                onClick={() => goTo(slideIndex)}
                aria-label={`Ke slide ${slideIndex + 1}`}
                aria-current={slideIndex === index}
                className={`h-2 rounded-full transition-all ${slideIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      ) : null}

      {total > 1 && delay > 0 ? (
        <button
          type='button'
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Lanjutkan slide otomatis' : 'Hentikan slide otomatis'}
          aria-pressed={paused}
          className='absolute bottom-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors'
        >
          <Icon name={paused ? 'play' : 'pause'} className='w-3.5 h-3.5' strokeWidth={2.4} />
        </button>
      ) : null}
    </div>
  );
}

export default HeroCarousel;
