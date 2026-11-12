import type { Collection } from 'tinacms';
import { filenameUi, languageField, routerFor, translationKeyField } from '../fields/common';

const Post: Collection = {
  label: 'Blog',
  name: 'post',
  path: 'content/posts',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language, translationKey, document) => {
      const slug = document?.slug || translationKey;
      return `${language === 'en' ? '/en' : ''}/posts/${slug}`;
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
      type: 'datetime',
      label: 'Tanggal publikasi',
      name: 'date',
      ui: { dateFormat: 'YYYY-MM-DD' },
    },
    { type: 'string', label: 'Penulis', name: 'author' },
    { type: 'string', label: 'Intro / deskripsi', name: 'description', ui: { component: 'textarea' } },
    { type: 'image', label: 'Gambar utama', name: 'image' },
    {
      type: 'object',
      label: 'Tags',
      name: 'tags',
      list: true,
      fields: [{ type: 'string', label: 'Tag', name: 'text', required: true }],
    },
    {
      type: 'rich-text',
      label: 'Isi artikel',
      name: 'body',
      isBody: true,
    },
  ],
};

export default Post;
