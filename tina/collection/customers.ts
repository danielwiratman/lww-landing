import type { Collection } from 'tinacms';
import { ctaField, filenameUi, heroField, languageField, routerFor, translationKeyField } from '../fields/common';

const Customers: Collection = {
  label: 'Pelanggan',
  name: 'customers',
  path: 'content/customers',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en/customers' : '/customers')),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul halaman', name: 'title', required: true },
    { type: 'string', label: 'Deskripsi (SEO)', name: 'description', ui: { component: 'textarea' } },
    heroField,
    {
      type: 'object',
      label: 'Grup pelanggan',
      name: 'groups',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.title }) },
      fields: [
        { type: 'string', label: 'Judul grup', name: 'title', required: true },
        {
          type: 'object',
          label: 'Pelanggan',
          name: 'customers',
          list: true,
          ui: { itemProps: (item: any) => ({ label: item?.name }) },
          fields: [
            { type: 'string', label: 'Nama pelanggan', name: 'name', required: true },
            { type: 'string', label: 'Industri', name: 'industry' },
            { type: 'image', label: 'Logo', name: 'logo' },
          ],
        },
      ],
    },
    ctaField,
  ],
};

export default Customers;
