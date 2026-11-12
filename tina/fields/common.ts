import type { TinaField } from 'tinacms';

export const languageField: TinaField = {
  type: 'string',
  label: 'Bahasa / Language',
  name: 'language',
  required: true,
  options: [
    { label: 'Bahasa Indonesia', value: 'id' },
    { label: 'English', value: 'en' },
  ],
  ui: {
    description: 'Menentukan versi bahasa dokumen ini. Indonesia tampil di root (/), English di /en/.',
  },
};

export const translationKeyField: TinaField = {
  type: 'string',
  label: 'Kunci translasi / Translation key',
  name: 'translationKey',
  required: true,
  ui: {
    description: 'Menghubungkan versi Bahasa Indonesia dengan versi English dari halaman yang sama. Harus sama di kedua bahasa.',
  },
};

/**
 * Icon names available in `components/icon.tsx`.
 */
export const iconNames = [
  'server',
  'battery',
  'network',
  'bolt',
  'wrench',
  'building',
  'phone',
  'whatsapp',
  'mail',
  'pin',
  'arrow-right',
  'play',
  'leaf',
  'shield',
  'monitor',
  'calculator',
  'plug',
  'blueprint',
  'hammer',
  'router',
  'cable',
  'transformer',
  'generator',
  'beaker',
  'clipboard',
  'box',
  'dashboard',
  'landmark',
  'bank',
  'broadcast',
  'heart',
  'factory',
  'graduation',
  'lightning',
  'badge',
  'quote',
  'users',
  'trophy',
  'calendar',
  'check',
  'x',
  'chevron-left',
  'chevron-right',
  'pause',
] as const;

export type IconName = (typeof iconNames)[number];

export const iconField = (label = 'Ikon'): TinaField => ({
  type: 'string',
  label,
  name: 'icon',
  required: true,
  options: [...iconNames],
});

export const ctaField: TinaField = {
  type: 'object',
  label: 'Bottom CTA',
  name: 'cta',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Heading', name: 'heading' },
    {
      type: 'string',
      label: 'Teks',
      name: 'text',
      ui: { component: 'textarea' },
    },
    {
      type: 'object',
      label: 'Tombol utama',
      name: 'primaryCta',
      fields: [
        { type: 'string', label: 'Label', name: 'label' },
        { type: 'string', label: 'URL', name: 'url' },
      ],
    },
    {
      type: 'object',
      label: 'Tombol sekunder',
      name: 'secondaryCta',
      fields: [
        { type: 'string', label: 'Label', name: 'label' },
        { type: 'string', label: 'URL', name: 'url' },
      ],
    },
  ],
};

export const heroField: TinaField = {
  type: 'object',
  label: 'Hero',
  name: 'hero',
  fields: [
    { type: 'string', label: 'Tagline / Eyebrow', name: 'tagline' },
    { type: 'string', label: 'Heading', name: 'heading' },
    { type: 'image', label: 'Gambar', name: 'image' },
  ],
};

export const statsListField: TinaField = {
  type: 'object',
  label: 'Statistik',
  name: 'stats',
  list: true,
  ui: {
    itemProps: (item: any) => ({ label: `${item?.value} — ${item?.label}` }),
  },
  fields: [
    { type: 'string', label: 'Nilai', name: 'value', required: true },
    { type: 'string', label: 'Label', name: 'label', required: true },
  ],
};

/**
 * Filenames are derived from the translation key and the language so that the
 * two versions of a page never collide on disk. Routing never depends on the
 * filename — it is resolved from the `language` field — so a mismatch here is
 * cosmetic only.
 */
export function filenameFor(values: Record<string, any>): string {
  const raw = String(values?.translationKey || values?.title || 'page');
  const slug = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = values?.language === 'en' ? '.en' : '';
  return `${slug || 'page'}${suffix}`;
}

export const filenameUi = {
  filename: {
    slugify: filenameFor,
    readonly: false,
    description: 'Nama file dibuat otomatis dari Kunci translasi + Bahasa. English mendapat akhiran .en.',
  },
};

/**
 * Builds the "view page" link shown in the Tina editor.
 */
export function routerFor(build: (language: string, translationKey: string, document: any) => string) {
  return ({ document }: { document: any }) => {
    const language = document?.language || 'id';
    const translationKey = document?.translationKey || document?._sys?.breadcrumbs?.join('/') || '';
    return build(language, translationKey, document);
  };
}
