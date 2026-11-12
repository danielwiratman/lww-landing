import type { Collection } from 'tinacms';
import { ctaField, filenameUi, heroField, languageField, routerFor, translationKeyField } from '../fields/common';

const About: Collection = {
  label: 'Tentang Kami',
  name: 'about',
  path: 'content/about',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en/about' : '/about')),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul halaman', name: 'title', required: true },
    { type: 'string', label: 'Deskripsi (SEO)', name: 'description', ui: { component: 'textarea' } },
    heroField,
    { type: 'string', label: 'Paragraf intro', name: 'intro', ui: { component: 'textarea' } },
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
      label: 'Timeline cerita',
      name: 'story',
      list: true,
      ui: { itemProps: (item: any) => ({ label: `${item?.year} — ${item?.title}` }) },
      fields: [
        { type: 'string', label: 'Tahun / periode', name: 'year', required: true },
        { type: 'string', label: 'Judul', name: 'title', required: true },
        { type: 'string', label: 'Deskripsi', name: 'description', ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'object',
      label: 'Visi',
      name: 'vision',
      fields: [
        { type: 'string', label: 'Judul', name: 'title' },
        { type: 'string', label: 'Teks', name: 'text', ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'object',
      label: 'Misi',
      name: 'mission',
      fields: [
        { type: 'string', label: 'Judul', name: 'title' },
        {
          type: 'object',
          label: 'Poin misi',
          name: 'items',
          list: true,
          fields: [{ type: 'string', label: 'Pernyataan', name: 'text', required: true }],
        },
      ],
    },
    {
      type: 'object',
      label: 'Nilai',
      name: 'values',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.title }) },
      fields: [
        { type: 'string', label: 'Judul', name: 'title', required: true },
        { type: 'string', label: 'Deskripsi', name: 'description', ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'object',
      label: 'Keterangan foto kantor',
      name: 'heroCaption',
      fields: [{ type: 'string', label: 'Keterangan', name: 'text' }],
    },
    ctaField,
  ],
};

export default About;
