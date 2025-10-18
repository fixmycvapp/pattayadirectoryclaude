"use client";

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import {
  requestNotificationPermission,
  checkNotificationPermission,
  isNotificationSupported,
} from '@/lib/notifications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function NotificationToggle() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations('notifications');

  useEffect(() => {
    setPermission(checkNotificationPermission());
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);

    try {
      const token = await requestNotificationPermission();

      if (token) {
        setPermission('granted');
        toast({
          title: t('success'),
          description: t('permission'),
        });
      } else {
        toast({
          title: t('error'),
          description: 'Please enable notifications in your browser settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast({
        title: t('error'),
        description: 'An error occurred while enabling notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isNotificationSupported()) {
    return null; // Don't show on unsupported browsers
  }

  if (permission === 'granted') {
    return (
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <Bell className="w-4 h-4 text-green-600" />
        <span className="hidden sm:inline text-green-600">{t('enabled')}</span>
      </Button>
    );
  }

  if (permission === 'denied') {
    return (
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <BellOff className="w-4 h-4 text-red-600" />
        <span className="hidden sm:inline text-red-600">{t('disabled')}</span>
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">{t('enable')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('enable')}</DialogTitle>
          <DialogDescription>{t('permission')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Bell className="w-8 h-8 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Get instant updates about:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>• Events happening near you</li>
                <li>• Breaking news and alerts</li>
                <li>• Special offers from venues</li>
                <li>• Weather warnings</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleEnableNotifications}
            disabled={loading}
            className="w-full bg-gradient-tropical"
          >
            {loading ? 'Enabling...' : t('enable')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}