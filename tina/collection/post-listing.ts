import type { Collection } from 'tinacms';
import { filenameUi, languageField, routerFor, translationKeyField } from '../fields/common';

const PostListing: Collection = {
  label: 'Halaman Blog',
  name: 'postListing',
  path: 'content/post-listing',
  format: 'md',
  ui: {
    ...filenameUi,
    router: routerFor((language) => (language === 'en' ? '/en/posts' : '/posts')),
  },
  fields: [
    languageField,
    translationKeyField,
    { type: 'string', label: 'Judul halaman', name: 'title', required: true },
    { type: 'string', label: 'Deskripsi (SEO)', name: 'description', ui: { component: 'textarea' } },
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
  ],
};

export default PostListing;
