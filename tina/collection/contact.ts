import type { Collection } from 'tinacms';
import { filenameUi, heroField, languageField, routerFor, translationKeyField } from '../fields/common';

const Contact: Collection = {
  label: 'Kontak',
  name: 'contact',
  path: 'content/contact',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en/contact' : '/contact')),
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
      label: 'Saluran kontak',
      name: 'channels',
      list: true,
      ui: { itemProps: (item: any) => ({ label: `${item?.label} — ${item?.value}` }) },
      fields: [
        {
          type: 'string',
          label: 'Ikon',
          name: 'icon',
          required: true,
          options: ['phone', 'whatsapp', 'mail', 'pin'],
        },
        { type: 'string', label: 'Label', name: 'label', required: true },
        { type: 'string', label: 'Nilai tampilan', name: 'value', required: true },
        { type: 'string', label: 'URL', name: 'url' },
      ],
    },
    {
      type: 'object',
      label: 'Jam operasional',
      name: 'hours',
      list: true,
      ui: { itemProps: (item: any) => ({ label: `${item?.day} — ${item?.time}` }) },
      fields: [
        { type: 'string', label: 'Hari / periode', name: 'day', required: true },
        { type: 'string', label: 'Waktu', name: 'time', required: true },
      ],
    },
    {
      type: 'object',
      label: 'Formulir',
      name: 'form',
      fields: [
        { type: 'string', label: 'Judul form', name: 'heading' },
        { type: 'string', label: 'Deskripsi form', name: 'intro', ui: { component: 'textarea' } },
        { type: 'string', label: 'Label tombol kirim', name: 'submitLabel' },
        { type: 'string', label: 'Pesan sukses', name: 'successMessage' },
        {
          type: 'object',
          label: 'Field formulir',
          name: 'fields',
          list: true,
          ui: { itemProps: (item: any) => ({ label: `${item?.label} (${item?.type})` }) },
          fields: [
            {
              type: 'string',
              label: 'Nama field (atribut name HTML)',
              name: 'name',
              required: true,
            },
            { type: 'string', label: 'Label untuk pengguna', name: 'label', required: true },
            {
              type: 'string',
              label: 'Tipe',
              name: 'type',
              required: true,
              options: ['text', 'email', 'tel', 'textarea', 'select'],
            },
            { type: 'boolean', label: 'Wajib?', name: 'required' },
            {
              type: 'object',
              label: 'Opsi (hanya untuk type=select)',
              name: 'options',
              list: true,
              fields: [{ type: 'string', label: 'Opsi', name: 'text', required: true }],
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Peta',
      name: 'map',
      fields: [
        {
          type: 'string',
          label: 'URL embed Google Maps',
          name: 'embedUrl',
          ui: {
            description: 'Salin URL embed dari Google Maps (bagian src= pada iframe).',
          },
        },
        { type: 'string', label: 'Judul peta (aksesibilitas)', name: 'title' },
      ],
    },
    {
      type: 'object',
      label: 'Kartu bantuan darurat',
      name: 'urgentHelp',
      fields: [
        { type: 'string', label: 'Judul', name: 'heading' },
        { type: 'string', label: 'Teks', name: 'text', ui: { component: 'textarea' } },
        { type: 'string', label: 'Label tombol', name: 'buttonLabel' },
      ],
    },
  ],
};

export default Contact;
