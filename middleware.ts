import { type Locale, defaultLocale, locales } from '@/lib/i18n';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Indonesian is served from the site root, English from `/en`.
 *
 * Internal routes always carry an explicit locale segment (`/id/about/`,
 * `/en/about/`) so that a single set of route handlers can serve both
 * languages. This middleware maps public URLs onto those internal routes.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split('/')[1];

  const hasLocale = (locales as readonly string[]).includes(segment);
  const locale: Locale = hasLocale ? (segment as Locale) : defaultLocale;
  const rest = hasLocale ? pathname.slice(segment.length + 1) || '/' : pathname;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${rest === '/' ? '' : rest}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|admin|uploads|.*\\..*).*)'],
};
