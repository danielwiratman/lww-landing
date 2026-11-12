import { type Locale, localizeHref } from '@/lib/i18n';
import Link from 'next/link';

export type CtaData = {
  eyebrow?: string | null;
  heading?: string | null;
  text?: string | null;
  primaryCta?: { label?: string | null; url?: string | null } | null;
  secondaryCta?: { label?: string | null; url?: string | null } | null;
} | null;

type Props = {
  cta?: CtaData;
  locale: Locale;
};

/**
 * Reusable bottom CTA strip.
 */
export function Cta({ cta, locale }: Props) {
  if (!cta) return null;

  return (
    <section className='container-x my-24'>
      <div className='relative overflow-hidden rounded-2xl bg-brand text-white px-6 py-14 md:px-12 md:py-20'>
        <div className='absolute inset-0 dot-grid opacity-30' />
        <div className='absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl' />
        <div className='relative max-w-2xl'>
          {cta.eyebrow ? <p className='text-sm font-semibold tracking-[0.2em] uppercase text-brand-200 mb-3'>{cta.eyebrow}</p> : null}
          {cta.heading ? <h2 className='text-3xl md:text-4xl font-bold text-balance'>{cta.heading}</h2> : null}
          {cta.text ? <p className='mt-4 text-brand-100/90 max-w-xl'>{cta.text}</p> : null}

          <div className='mt-8 flex flex-wrap gap-3'>
            {cta.primaryCta?.label ? (
              <Link href={localizeHref(cta.primaryCta.url, locale)} className='btn bg-white text-brand hover:bg-cream'>
                {cta.primaryCta.label} →
              </Link>
            ) : null}
            {cta.secondaryCta?.label ? (
              <Link href={localizeHref(cta.secondaryCta.url, locale)} className='btn border border-white/30 text-white hover:bg-white/10'>
                {cta.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
