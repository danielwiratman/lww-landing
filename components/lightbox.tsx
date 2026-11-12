'use client';

import { useEffect, useState } from 'react';

type Props = {
  images: string[];
  alt?: string;
};

/**
 * Minimal, dependency-free lightbox for award/certificate imagery.
 */
export function Lightbox({ images, alt }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIndex(null);
      if (event.key === 'ArrowRight') {
        setIndex((i) => (i === null ? null : (i + 1) % images.length));
      }
      if (event.key === 'ArrowLeft') {
        setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, images.length]);

  if (!images.length) return null;

  return (
    <>
      <ul className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {images.map((src, i) => (
          <li key={src} className='rounded-lg border border-line bg-cream/40 p-3'>
            <button type='button' onClick={() => setIndex(i)} className='block w-full group' aria-label={`View larger image ${i + 1}`}>
              <img
                src={src}
                alt={alt ?? ''}
                decoding='async'
                className='w-full h-auto max-h-72 object-contain mx-auto transition duration-300 group-hover:scale-[1.02]'
              />
            </button>
          </li>
        ))}
      </ul>

      {index !== null ? (
        <div className='fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4' role='dialog' aria-modal='true' onClick={() => setIndex(null)}>
          <img src={images[index]} alt={alt ?? ''} className='max-h-[90vh] max-w-full object-contain' />
          <button
            type='button'
            onClick={() => setIndex(null)}
            className='absolute top-5 right-5 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition'
            aria-label='Close'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}

export default Lightbox;
