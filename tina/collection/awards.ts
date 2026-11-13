import type { Collection } from 'tinacms';
import { filenameUi, heroField, languageField, routerFor, translationKeyField } from '../fields/common';

const Awards: Collection = {
  label: 'Penghargaan & Sertifikasi',
  name: 'awards',
  path: 'content/awards',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en/awards' : '/awards')),
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
      label: 'Penghargaan',
      name: 'awards',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.name }) },
      fields: [
        { type: 'string', label: 'Nama penghargaan', name: 'name', required: true },
        { type: 'string', label: 'Deskripsi', name: 'description', ui: { component: 'textarea' } },
        {
          type: 'object',
          label: 'Foto-foto',
          name: 'images',
          list: true,
          fields: [{ type: 'image', label: 'Gambar', name: 'image', required: true }],
        },
      ],
    },
    {
      type: 'object',
      label: 'Sertifikasi',
      name: 'certifications',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.name }) },
      fields: [
        { type: 'string', label: 'Nama', name: 'name', required: true },
        { type: 'string', label: 'Deskripsi', name: 'description', ui: { component: 'textarea' } },
        { type: 'string', label: 'Diterbitkan oleh', name: 'issuedBy' },
        { type: 'image', label: 'Logo / gambar sertifikat', name: 'image' },
      ],
    },
    {
      type: 'string',
      label: 'Judul seksi sertifikasi',
      name: 'certificationsHeading',
    },
  ],
};

export default Awards;
