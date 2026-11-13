'use client';

import { Icon } from '@/components/icon';
import type { ProductDoc } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  products: ProductDoc[];
  heading?: string | null;
  intro?: string | null;
  locale: Locale;
};

const CATEGORY_ORDER = ['Critical Power', 'Power Quality', 'Solution', 'Service'];

export function ProductCatalog({ products, heading, intro, locale }: Props) {
  const [active, setActive] = useState<ProductDoc | null>(null);

  if (!products.length) return null;

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: products.filter((product) => product.category === category),
  })).filter((group) => group.items.length > 0);

  const others = products.filter((product) => !CATEGORY_ORDER.includes(product.category));
  if (others.length) {
    groups.push({
      category: others[0].category,
      items: others,
    });
  }

  return (
    <section id='product-catalog' className='container-x py-16 md:py-20 border-t border-line'>
      <div className='max-w-2xl mb-10'>
        <p className='eyebrow mb-3'>{locale === 'id' ? 'Katalog' : 'Catalogue'}</p>
        <h2 className='text-3xl md:text-4xl font-bold text-balance'>{heading ?? 'Product Catalog'}</h2>
        {intro ? <p className='mt-3 text-ink-muted leading-relaxed'>{intro}</p> : null}
      </div>

      <div className='space-y-12'>
        {groups.map((group) => (
          <div key={group.category}>
            <h3 className='text-sm font-semibold uppercase tracking-[0.15em] text-brand mb-4'>{group.category}</h3>
            <ul className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3'>
              {group.items.map((product) => (
                <li key={product.id}>
                  <button
                    type='button'
                    onClick={() => setActive(product)}
                    className='group w-full h-full text-left card px-5 py-4 hover:border-brand hover:-translate-y-0.5 transition-all flex flex-col gap-1'
                  >
                    <span className='font-semibold text-ink group-hover:text-brand transition'>{product.title}</span>
                    {product.brand ? <span className='text-xs text-ink-muted'>{product.brand}</span> : null}
                    <span className='mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 group-hover:opacity-100 transition'>
                      {locale === 'id' ? 'Spesifikasi' : 'Specifications'}
                      <Icon name='arrow-right' className='w-3.5 h-3.5' />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {active ? <ProductDialog product={active} locale={locale} onClose={() => setActive(null)} /> : null}
    </section>
  );
}

type DialogProps = {
  product: ProductDoc;
  locale: Locale;
  onClose: () => void;
};

function ProductDialog({ product, locale, onClose }: DialogProps) {
  const images = (product.images ?? []).filter((image): image is NonNullable<typeof image> => Boolean(image?.image));
  const features = (product.features ?? []).filter(Boolean);
  const specs = (product.specs ?? []).filter((spec): spec is NonNullable<typeof spec> => Boolean(spec?.label));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 overflow-y-auto'
      role='dialog'
      aria-modal='true'
      aria-label={product.title}
    >
      <div className='fixed inset-0 bg-ink/70' onClick={onClose} aria-hidden='true' />

      <div className='relative w-full max-w-3xl my-4 md:my-8 bg-white rounded-2xl shadow-soft overflow-hidden'>
        <div className='flex items-start gap-4 px-6 md:px-8 pt-6 md:pt-8 pb-4'>
          <div className='flex-1 min-w-0'>
            <p className='text-xs font-semibold uppercase tracking-[0.15em] text-brand'>{product.category}</p>
            <h3 className='mt-1 text-2xl md:text-3xl font-bold text-balance'>{product.title}</h3>
            {product.brand ? <p className='mt-1 text-sm text-ink-muted'>{product.brand}</p> : null}
          </div>
          <button
            type='button'
            onClick={onClose}
            className='shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border border-line text-ink hover:border-brand hover:text-brand transition'
            aria-label={locale === 'id' ? 'Tutup' : 'Close'}
          >
            <Icon name='x' className='w-5 h-5' />
          </button>
        </div>

        <div className='px-6 md:px-8 pb-6 md:pb-8 space-y-6 max-h-[70vh] overflow-y-auto'>
          {images.length ? (
            <div className='grid sm:grid-cols-2 gap-4'>
              {images.slice(0, 2).map((image) => (
                <figure key={image.image} className='rounded-xl border border-line bg-cream/40 p-3'>
                  <div className='relative aspect-[4/3] w-full'>
                    <Image src={image.image} alt={image.caption ?? product.title} fill sizes='(min-width: 640px) 40vw, 90vw' className='object-contain' />
                  </div>
                  {image.caption ? <figcaption className='mt-2 text-center text-xs text-ink-muted'>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : null}

          {product.description ? <p className='text-ink-muted leading-relaxed'>{product.description}</p> : null}

          {features.length ? (
            <div>
              <h4 className='text-sm font-semibold uppercase tracking-wider text-ink mb-3'>{locale === 'id' ? 'Fitur' : 'Features'}</h4>
              <ul className='grid sm:grid-cols-2 gap-x-6 gap-y-2'>
                {features.map((feature) => (
                  <li key={feature} className='flex gap-2.5 text-sm text-ink-muted'>
                    <span className='shrink-0 mt-0.5 w-5 h-5 rounded-full bg-brand-50 text-brand flex items-center justify-center'>
                      <Icon name='check' className='w-3 h-3' />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {specs.length ? (
            <div>
              <h4 className='text-sm font-semibold uppercase tracking-wider text-ink mb-3'>{locale === 'id' ? 'Spesifikasi' : 'Specifications'}</h4>
              <dl className='divide-y divide-line border-t border-line'>
                {specs.map((spec) => (
                  <div key={spec.label} className='grid sm:grid-cols-[minmax(0,14rem)_1fr] gap-x-6 gap-y-1 py-3'>
                    <dt className='text-sm font-semibold text-ink'>{spec.label}</dt>
                    <dd className='text-sm text-ink-muted leading-relaxed'>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        {product.datasheet ? (
          <div className='px-6 md:px-8 py-4 border-t border-line bg-cream/50 flex items-center justify-between gap-4'>
            <p className='text-sm text-ink-muted'>{locale === 'id' ? 'Dokumentasi produk' : 'Product documentation'}</p>
            <a href={product.datasheet} target='_blank' rel='noopener' className='inline-flex items-center gap-2 btn-primary'>
              <Icon name='arrow-right' className='w-4 h-4' />
              {locale === 'id' ? 'Unduh datasheet' : 'Download datasheet'}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProductCatalog;
