import type { Collection } from 'tinacms';
import { languageField, translationKeyField } from '../fields/common';

const Global: Collection = {
  label: 'Pengaturan Situs',
  name: 'global',
  path: 'content/global',
  format: 'json',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    filename: {
      readonly: true,
    },
  },
  fields: [
    languageField,
    translationKeyField,
    {
      type: 'object',
      label: 'Brand',
      name: 'site',
      fields: [
        { type: 'string', label: 'Nama perusahaan', name: 'name', required: true },
        { type: 'string', label: 'Tagline', name: 'tagline' },
        { type: 'string', label: 'Deskripsi singkat (SEO)', name: 'shortDescription', ui: { component: 'textarea' } },
        { type: 'string', label: 'Tahun berdiri', name: 'since' },
        { type: 'string', label: 'Telepon (tampil)', name: 'phone' },
        {
          type: 'string',
          label: 'Telepon tanpa spasi (untuk tel:)',
          name: 'phoneRaw',
          ui: { description: 'Contoh: +622147882000' },
        },
        {
          type: 'string',
          label: 'Nomor WhatsApp (tanpa +)',
          name: 'whatsapp',
          ui: { description: 'Contoh: 6281234567890 — dipakai untuk wa.me link' },
        },
        { type: 'string', label: 'Tampilan WhatsApp', name: 'whatsappDisplay' },
        { type: 'string', label: 'Email', name: 'email' },
        { type: 'string', label: 'Alamat', name: 'address' },
      ],
    },
    {
      type: 'object',
      label: 'Menu navigasi',
      name: 'nav',
      fields: [
        {
          type: 'object',
          label: 'Tautan menu',
          name: 'items',
          list: true,
          ui: { itemProps: (item: any) => ({ label: item?.label }) },
          fields: [
            { type: 'string', label: 'Label', name: 'label', required: true },
            {
              type: 'string',
              label: 'URL',
              name: 'href',
              required: true,
              ui: {
                description: 'Path internal tanpa prefix bahasa, contoh: /about/. Prefix /en otomatis ditambahkan untuk English.',
              },
            },
            {
              type: 'number',
              label: 'Urutan',
              name: 'weight',
              ui: { description: 'Angka lebih kecil tampil lebih dulu' },
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Social links',
      name: 'social',
      fields: [
        { type: 'string', label: 'LinkedIn URL', name: 'linkedin' },
        { type: 'string', label: 'Instagram URL', name: 'instagram' },
        { type: 'string', label: 'Facebook URL', name: 'facebook' },
        { type: 'string', label: 'YouTube URL', name: 'youtube' },
      ],
    },
    {
      type: 'object',
      label: 'Footer',
      name: 'footer',
      fields: [
        { type: 'string', label: 'Deskripsi singkat', name: 'blurb', ui: { component: 'textarea' } },
        {
          type: 'object',
          label: 'Kolom footer',
          name: 'columns',
          list: true,
          ui: { itemProps: (item: any) => ({ label: item?.heading }) },
          fields: [
            { type: 'string', label: 'Judul kolom', name: 'heading', required: true },
            {
              type: 'object',
              label: 'Tautan',
              name: 'links',
              list: true,
              ui: { itemProps: (item: any) => ({ label: item?.label }) },
              fields: [
                { type: 'string', label: 'Label', name: 'label', required: true },
                { type: 'string', label: 'URL', name: 'url', required: true },
              ],
            },
          ],
        },
        {
          type: 'object',
          label: 'Sertifikasi (footer)',
          name: 'certifications',
          list: true,
          ui: { itemProps: (item: any) => ({ label: item?.label }) },
          fields: [{ type: 'string', label: 'Label', name: 'label', required: true }],
        },
      ],
    },
    {
      type: 'object',
      label: 'Daftar klien (marquee)',
      name: 'clients',
      fields: [
        {
          type: 'object',
          label: 'Klien',
          name: 'items',
          list: true,
          ui: { itemProps: (item: any) => ({ label: item?.name }) },
          fields: [{ type: 'string', label: 'Nama', name: 'name', required: true }],
        },
      ],
    },
  ],
};

export default Global;
