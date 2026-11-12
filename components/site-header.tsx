'use client';

import type { GlobalDoc } from '@/lib/content';
import { type Locale, localizeHref } from '@/lib/i18n';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LangSwitcher from './lang-switcher';

type Props = {
  global: GlobalDoc | null;
  locale: Locale;
};

export function SiteHeader({ global, locale }: Props) {
  const [open, setOpen] = useState(false);
  const items = global?.nav?.items ?? [];

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navItems = [...items].filter((item): item is NonNullable<typeof item> => Boolean(item)).sort((a, b) => (a.weight ?? 99) - (b.weight ?? 99));

  return (
    <nav data-nav className='sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line'>
      <div className='container-x flex items-center justify-between h-20'>
        <Link href='/' className='flex items-center gap-3 shrink-0'>
          {}
          <img src='/img/lww-logo.jpg' alt={global?.site?.name ?? 'PT Limawira Wisesa'} className='h-12 w-auto' />
        </Link>

        <ul className='hidden lg:flex items-center gap-1 text-sm font-semibold text-ink'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={localizeHref(item.href, locale)} className='px-3 py-2 rounded hover:text-brand transition'>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-2 sm:gap-3'>
          <LangSwitcher locale={locale} />

          <button
            type='button'
            onClick={() => setOpen((v) => !v)}
            className='lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-line text-ink'
            aria-label='Toggle menu'
            aria-expanded={open}
          >
            <svg
              className='mobile-menu-icon w-6 h-6'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <line
                className='menu-icon-top'
                x1='3'
                y1='6'
                x2='21'
                y2='6'
                style={{
                  transform: open ? 'translateY(6px) rotate(45deg)' : undefined,
                }}
              />
              <line className='menu-icon-middle' x1='3' y1='12' x2='21' y2='12' style={{ opacity: open ? 0 : 1 }} />
              <line
                className='menu-icon-bottom'
                x1='3'
                y1='18'
                x2='21'
                y2='18'
                style={{
                  transform: open ? 'translateY(-6px) rotate(-45deg)' : undefined,
                }}
              />
            </svg>
          </button>
        </div>
      </div>

      <div className='mobile-menu-container lg:hidden border-t border-line bg-white' data-open={open ? 'true' : 'false'}>
        <ul className='container-x flex flex-col py-4 text-sm font-semibold text-ink'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={localizeHref(item.href, locale)} onClick={() => setOpen(false)} className='block py-3 border-b border-line'>
                {item.label}
              </Link>
            </li>
          ))}
          <li className='pt-3'>
            <LangSwitcher locale={locale} />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default SiteHeader;
