"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, MapPin, LayoutDashboard, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: t('home'),
    },
    {
      href: '/events',
      icon: Calendar,
      label: t('events'),
    },
    {
      href: '/tourist-dashboard',
      icon: LayoutDashboard,
      label: t('dashboard'),
    },
    {
      href: '/nightlife',
      icon: MapPin,
      label: t('nightlife'),
    },
    {
      href: '/profile',
      icon: User,
      label: t('profile'),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/en' || pathname === '/th';
    }
    return pathname.includes(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5', active && 'scale-110')} />
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={cn('font-medium', active && 'font-semibold')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}