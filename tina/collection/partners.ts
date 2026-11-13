import type { Collection } from 'tinacms';
import { ctaField, filenameUi, heroField, languageField, routerFor, translationKeyField } from '../fields/common';

const Partners: Collection = {
  label: 'Mitra & Pelanggan',
  name: 'partners',
  path: 'content/partners',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en/partners' : '/partners')),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul halaman', name: 'title', required: true },
    { type: 'string', label: 'Deskripsi (SEO)', name: 'description', ui: { component: 'textarea' } },
    heroField,
    { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
    {
      type: 'object',
      label: 'Mitra',
      name: 'partners',
      list: true,
      ui: { itemProps: (item: any) => ({ label: `${item?.name} — ${item?.category}` }) },
      fields: [
        { type: 'string', label: 'Nama', name: 'name', required: true },
        { type: 'string', label: 'Kategori', name: 'category' },
        { type: 'image', label: 'Logo', name: 'logo' },
        { type: 'string', label: 'URL website', name: 'url' },
        { type: 'boolean', label: 'Mitra utama (display besar di beranda)', name: 'featured' },
      ],
    },
    {
      type: 'object',
      label: 'Klien',
      name: 'clients',
      fields: [
        { type: 'string', label: 'Jumlah pelanggan', name: 'count' },
        { type: 'string', label: 'Deskripsi', name: 'blurb', ui: { component: 'textarea' } },
        { type: 'string', label: 'Judul seksi', name: 'heading' },
      ],
    },
    ctaField,
  ],
};

export default Partners;
