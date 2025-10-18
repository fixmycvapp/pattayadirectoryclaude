import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Automatically redirect to default locale
  localeDetection: true,

  // Locale prefix strategy
  localePrefix: 'always',
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(th|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};