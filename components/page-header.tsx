import { type Locale } from '@/lib/i18n';

type Props = {
  image?: string | null;
  eyebrow?: string | null;
  heading?: string | null;
  subheading?: string | null;
  locale: Locale;
};

/**
 * Reusable page header — green gradient hero with an optional background image.
 */
export function PageHeader({ image, eyebrow, heading, subheading, locale: _locale }: Props) {
  return (
    <section className='relative overflow-hidden bg-brand-dark text-white'>
      {image ? (
        <div className='absolute inset-0'>
          <img src={image} alt='' className='w-full h-full object-cover opacity-25' />
        </div>
      ) : null}
      <div className='absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand/80' />
      <div className='absolute inset-0 dot-grid opacity-30' />

      <div className='relative container-x py-20 md:py-28'>
        {eyebrow ? (
          <p className='eyebrow !text-brand-200 mb-4'>
            <span className='!bg-brand-200' />
            {eyebrow}
          </p>
        ) : null}
        {heading ? <h1 className='text-4xl md:text-5xl font-bold text-balance max-w-3xl'>{heading}</h1> : null}
        {subheading ? <p className='mt-4 text-lg text-brand-100/90 max-w-2xl'>{subheading}</p> : null}
      </div>
    </section>
  );
}

export default PageHeader;
