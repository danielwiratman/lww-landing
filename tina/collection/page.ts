import type { Collection } from 'tinacms';
import { filenameUi, languageField, routerFor, translationKeyField } from '../fields/common';

const Page: Collection = {
  label: 'Halaman Tunggal',
  name: 'page',
  path: 'content/pages',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language, translationKey) => `${language === 'en' ? '/en' : ''}/${translationKey}`),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul', name: 'title', required: true, isTitle: true },
    { type: 'string', label: 'Deskripsi (SEO)', name: 'description', ui: { component: 'textarea' } },
    {
      type: 'rich-text',
      label: 'Isi halaman',
      name: 'body',
      isBody: true,
    },
  ],
};

export default Page;
