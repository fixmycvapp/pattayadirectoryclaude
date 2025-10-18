import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  th: 'ไทย',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  th: '🇹🇭',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`@/locales/${locale}/common.json`)).default,
  };
});

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }

  return defaultLocale;
}

export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  return pathname.replace(`/${locale}`, '') || '/';
}