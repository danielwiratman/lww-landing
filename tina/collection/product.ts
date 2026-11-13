import type { Collection } from 'tinacms';
import { filenameUi, languageField, routerFor, translationKeyField } from '../fields/common';

const Product: Collection = {
  label: 'Katalog Produk',
  name: 'product',
  path: 'content/products',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => `${language === 'en' ? '/en' : ''}/solutions/`),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Nama produk', name: 'title', required: true, isTitle: true },
    { type: 'string', label: 'URL slug', name: 'slug', required: true },
    { type: 'number', label: 'Urutan', name: 'order', required: true, ui: { description: 'Angka lebih kecil tampil lebih dulu' } },
    {
      type: 'string',
      label: 'Kategori',
      name: 'category',
      required: true,
      options: [
        { label: 'Critical Power Systems', value: 'Critical Power Systems' },
        { label: 'Power Quality & Conditioning', value: 'Power Quality & Conditioning' },
        { label: 'Monitoring & Management', value: 'Monitoring & Management' },
        { label: 'Data Center Infrastructure', value: 'Data Center Infrastructure' },
        { label: 'Services', value: 'Services' },
      ],
    },
    { type: 'string', label: 'Merek', name: 'brand' },
    { type: 'string', label: 'Deskripsi', name: 'description', ui: { component: 'textarea' } },
    { type: 'string', label: 'Fitur', name: 'features', list: true },
    {
      type: 'object',
      label: 'Spesifikasi',
      name: 'specs',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.label }) },
      fields: [
        { type: 'string', label: 'Label', name: 'label', required: true },
        { type: 'string', label: 'Nilai', name: 'value', required: true },
      ],
    },
    {
      type: 'object',
      label: 'Gambar produk',
      name: 'images',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.caption }) },
      fields: [
        { type: 'image', label: 'Gambar', name: 'image', required: true },
        { type: 'string', label: 'Keterangan', name: 'caption' },
      ],
    },
    { type: 'image', label: 'Datasheet (PDF)', name: 'datasheet', accept: 'pdf' },
  ],
};

export default Product;
