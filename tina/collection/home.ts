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
          label: 'Carousel hero',
          name: 'carousel',
          fields: [
            {
              type: 'object',
              label: 'Slide',
              name: 'slides',
              list: true,
              ui: { itemProps: (item: any) => ({ label: item?.caption || item?.image || 'Slide' }) },
              fields: [
                { type: 'image', label: 'Gambar', name: 'image', required: true },
                { type: 'string', label: 'Caption', name: 'caption' },
                { type: 'string', label: 'Teks alternatif', name: 'alt' },
              ],
            },
            {
              type: 'number',
              label: 'Interval slide (ms)',
              name: 'interval',
              ui: { description: 'Jeda antar slide dalam milidetik. Isi 0 untuk menonaktifkan auto slide.' },
            },
          ],
        },
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
    {
      type: 'object',
      label: 'Strip pelanggan (running text)',
      name: 'clients',
      ui: { description: 'Daftar nama pelanggan diambil dari Pengaturan Situs → Daftar klien.' },
      fields: [
        { type: 'string', label: 'Judul', name: 'title' },
        { type: 'string', label: 'Subjudul', name: 'subtitle', ui: { component: 'textarea' } },
      ],
    },
    ctaField,
  ],
};

export default Home;
