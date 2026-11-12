export const locales = ['id', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'id';

export const localeMeta: Record<Locale, { name: string; short: string; flag: 'id' | 'us'; htmlLang: string }> = {
  id: { name: 'Bahasa Indonesia', short: 'Bahasa', flag: 'id', htmlLang: 'id-ID' },
  en: { name: 'English', short: 'English', flag: 'us', htmlLang: 'en' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Builds a public URL for a locale.
 *
 * Indonesian is served from the site root, English from `/en`.
 * `path` is always the locale-less, root-relative path (e.g. "/about/").
 */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) {
    return clean === '/' ? '/' : clean;
  }
  return clean === '/' ? '/en' : `/en${clean}`;
}

/**
 * Rewrites a content-authored href so it points at the right language.
 *
 * Only root-relative links are rewritten; external links, anchors, and
 * `tel:`/`mailto:` targets are left untouched.
 */
export function localizeHref(href: string | undefined | null, locale: Locale): string {
  if (!href) return '';
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return href;
  if (!href.startsWith('/')) return href;
  return localePath(locale, href);
}

/**
 * Maps a public URL back to its locale-less path.
 * "/en/about/" -> "/about/", "/about/" -> "/about/"
 */
export function stripLocale(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalized.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = `/${segments.slice(1).join('/')}`;
    return rest === '/' ? '/' : rest;
  }
  return normalized;
}

/**
 * Returns the locale encoded in a public URL, falling back to the default.
 */
export function localeFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) return segments[0];
  return defaultLocale;
}
