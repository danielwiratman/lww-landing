'use client';

import { type Locale, localeMeta, localePath, locales, stripLocale } from '@/lib/i18n';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Flag } from './flag';

export function LangSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || '/';

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = localeMeta[locale];
  // The current page path without a locale prefix, so the counterpart page
  // in the other language can be linked directly.
  const basePath = stripLocale(pathname);

  return (
    <div className='relative' ref={rootRef} data-lang-switcher>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-label='Select language'
        className='lang-switcher-btn group inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-line bg-white hover:border-brand hover:bg-brand-50 transition text-sm font-semibold text-ink'
      >
        <span className='lang-flag-frame'>
          <Flag code={current.flag} />
        </span>
        <span className='hidden sm:inline leading-none'>{current.name}</span>
        <svg
          className='w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition lang-chevron'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <polyline points='6 9 12 15 18 9' />
        </svg>
      </button>

      <div
        role='listbox'
        aria-label='Available languages'
        data-open={open ? 'true' : 'false'}
        className='lang-menu absolute right-0 mt-2 min-w-[200px] rounded-xl bg-white border border-line shadow-soft p-1.5 origin-top-right transition-all duration-150 z-50'
      >
        {locales.map((code) => {
          const meta = localeMeta[code];
          const isCurrent = code === locale;
          return (
            <Link
              key={code}
              href={localePath(code, basePath)}
              role='option'
              aria-selected={isCurrent}
              aria-current={isCurrent ? 'true' : undefined}
              onClick={() => setOpen(false)}
              className={`lang-option flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                isCurrent ? 'bg-brand-50 text-brand font-semibold cursor-default' : 'text-ink hover:bg-cream/60 transition'
              }`}
            >
              <span className='lang-flag-frame'>
                <Flag code={meta.flag} />
              </span>
              <span className='flex-1 leading-tight'>
                <span className='block font-semibold'>{meta.name}</span>
                <span className='block text-xs text-ink-muted'>{meta.short}</span>
              </span>
              {isCurrent ? (
                <svg
                  className='w-4 h-4 text-brand shrink-0'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  aria-hidden='true'
                >
                  <polyline points='20 6 9 17 4 12' />
                </svg>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default LangSwitcher;
