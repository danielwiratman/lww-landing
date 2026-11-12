import type { Collection } from 'tinacms';
import { ctaField, filenameUi, languageField, routerFor, translationKeyField } from '../fields/common';

const Home: Collection = {
  label: 'Beranda',
  name: 'home',
  path: 'content/home',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en' : '/')),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul tab', name: 'title', required: true },
    {
      type: 'object',
      label: 'Hero',
      name: 'hero',
      fields: [
        { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
        { type: 'string', label: 'Heading', name: 'heading' },
        { type: 'string', label: 'Tagline', name: 'tagline', ui: { component: 'textarea' } },
        { type: 'image', label: 'Gambar hero', name: 'image' },
        {
          type: 'object',
          label: 'Tombol CTA utama',
          name: 'primaryCta',
          fields: [
            { type: 'string', label: 'Label', name: 'label' },
            { type: 'string', label: 'URL', name: 'url' },
          ],
        },
        {
          type: 'object',
          label: 'Tombol CTA sekunder',
          name: 'secondaryCta',
          fields: [
            { type: 'string', label: 'Label', name: 'label' },
            { type: 'string', label: 'URL', name: 'url' },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Ikon cepat',
      name: 'quickIcons',
      fields: [
        { type: 'string', label: 'Judul', name: 'title' },
        {
          type: 'object',
          label: 'Item',
          name: 'items',
          list: true,
          ui: { itemProps: (item: any) => ({ label: item?.label }) },
          fields: [
            { type: 'string', label: 'Label', name: 'label', required: true },
            { type: 'string', label: 'URL', name: 'url', required: true },
            {
              type: 'image',
              label: 'Ikon (SVG)',
              name: 'icon',
              ui: { description: 'Upload file .svg ke folder /img/.' },
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Statistik',
      name: 'stats',
      list: true,
      ui: { itemProps: (item: any) => ({ label: `${item?.value} — ${item?.label}` }) },
      fields: [
        { type: 'string', label: 'Nilai', name: 'value', required: true },
        { type: 'string', label: 'Label', name: 'label', required: true },
      ],
    },
    {
      type: 'object',
      label: 'Grid solusi',
      name: 'solutions',
      fields: [
        { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
        { type: 'string', label: 'Judul', name: 'title' },
        { type: 'string', label: 'Subjudul', name: 'subtitle', ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'object',
      label: 'Strip partner',
      name: 'partners',
      fields: [
        { type: 'string', label: 'Judul', name: 'title' },
        { type: 'string', label: 'Subjudul', name: 'subtitle', ui: { component: 'textarea' } },
        {
          type: 'object',
          label: 'CTA',
          name: 'cta',
          fields: [
            { type: 'string', label: 'Label', name: 'label' },
            { type: 'string', label: 'URL', name: 'url' },
          ],
        },
      ],
    },
    ctaField,
  ],
};

export default Home;
