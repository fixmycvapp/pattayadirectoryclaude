"use client";

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
            {localeFlags[locale]} {localeNames[locale]}
          </span>
          <span className="sm:hidden text-lg">
            {localeFlags[locale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 w-full"
            >
              <span className="text-lg">{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
              {loc === locale && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-green-600"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}