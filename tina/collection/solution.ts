import type { Collection } from 'tinacms';
import { filenameUi, iconField, languageField, routerFor, translationKeyField } from '../fields/common';

const Solution: Collection = {
  label: 'Solusi',
  name: 'solution',
  path: 'content/solutions',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language, translationKey, document) => {
      const slug = document?.slug || translationKey;
      return `${language === 'en' ? '/en' : ''}/solutions/${slug}`;
    }),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul', name: 'title', required: true, isTitle: true },
    {
      type: 'string',
      label: 'URL slug',
      name: 'slug',
      required: true,
      ui: {
        description: 'Lowercase, hyphenated. Harus sama antara versi Bahasa Indonesia dan English.',
      },
    },
    {
      type: 'number',
      label: 'Urutan',
      name: 'order',
      required: true,
      ui: { description: 'Angka lebih kecil tampil lebih dulu' },
    },
    iconField(),
    { type: 'string', label: 'Deskripsi singkat (untuk kartu)', name: 'shortDescription', ui: { component: 'textarea' } },
    {
      type: 'object',
      label: 'Hero',
      name: 'hero',
      fields: [
        { type: 'string', label: 'Tagline / Eyebrow', name: 'tagline' },
        { type: 'string', label: 'Heading', name: 'heading' },
        { type: 'image', label: 'Gambar', name: 'image' },
      ],
    },
    { type: 'string', label: 'Deskripsi panjang', name: 'description', ui: { component: 'textarea' } },
    {
      type: 'object',
      label: 'Fitur',
      name: 'features',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.title }) },
      fields: [
        { type: 'string', label: 'Judul', name: 'title', required: true },
        { type: 'string', label: 'Deskripsi', name: 'description', ui: { component: 'textarea' } },
        iconField(),
      ],
    },
    {
      type: 'object',
      label: 'Spesifikasi',
      name: 'specs',
      list: true,
      ui: { itemProps: (item: any) => ({ label: `${item?.label}: ${item?.value}` }) },
      fields: [
        { type: 'string', label: 'Label', name: 'label', required: true },
        { type: 'string', label: 'Nilai', name: 'value', required: true },
      ],
    },
    {
      type: 'object',
      label: 'Pelanggan terpilih',
      name: 'customers',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.name }) },
      fields: [
        { type: 'string', label: 'Nama pelanggan', name: 'name', required: true },
        { type: 'image', label: 'Logo', name: 'logo' },
      ],
    },
    {
      type: 'object',
      label: 'CTA',
      name: 'cta',
      fields: [
        { type: 'string', label: 'Label tombol', name: 'label' },
        { type: 'string', label: 'URL', name: 'url' },
      ],
    },
    {
      type: 'string',
      label: 'Judul seksi spesifikasi',
      name: 'specsHeading',
    },
    {
      type: 'string',
      label: 'Judul seksi pelanggan',
      name: 'customersHeading',
    },
  ],
};

export default Solution;
