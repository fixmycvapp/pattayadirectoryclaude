"use client";

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('theme');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {theme === 'system' ? t('system') : theme === 'dark' ? t('dark') : t('light')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 w-full"
          >
            <Sun className="w-4 h-4" />
            <span>{t('light')}</span>
            {theme === 'light' && (
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

        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 w-full"
          >
            <Moon className="w-4 h-4" />
            <span>{t('dark')}</span>
            {theme === 'dark' && (
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

        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 w-full"
          >
            <Monitor className="w-4 h-4" />
            <span>{t('system')}</span>
            {theme === 'system' && (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}