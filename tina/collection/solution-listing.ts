import type { Collection } from 'tinacms';
import { filenameUi, heroField, languageField, routerFor, translationKeyField } from '../fields/common';

const SolutionListing: Collection = {
  label: 'Halaman Solusi',
  name: 'solutionListing',
  path: 'content/solution-listing',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en/solutions' : '/solutions')),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul halaman', name: 'title', required: true },
    { type: 'string', label: 'Deskripsi (SEO)', name: 'description', ui: { component: 'textarea' } },
    heroField,
    { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
    { type: 'string', label: 'Judul seksi katalog produk', name: 'catalogHeading' },
    { type: 'string', label: 'Intro katalog produk', name: 'catalogIntro', ui: { component: 'textarea' } },
    {
      type: 'object',
      label: 'CTA',
      name: 'cta',
      fields: [
        { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
        { type: 'string', label: 'Heading', name: 'heading' },
        { type: 'string', label: 'Teks', name: 'text', ui: { component: 'textarea' } },
        {
          type: 'object',
          label: 'Tombol utama',
          name: 'primaryCta',
          fields: [
            { type: 'string', label: 'Label', name: 'label' },
            { type: 'string', label: 'URL', name: 'url' },
          ],
        },
        {
          type: 'object',
          label: 'Tombol sekunder',
          name: 'secondaryCta',
          fields: [
            { type: 'string', label: 'Label', name: 'label' },
            { type: 'string', label: 'URL', name: 'url' },
          ],
        },
      ],
    },
  ],
};

export default SolutionListing;
