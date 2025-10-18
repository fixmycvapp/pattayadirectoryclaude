"use client";

import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messaging: Messaging | null = null;

export function initializeFirebase() {
  if (typeof window === 'undefined') return null;

  const apps = getApps();
  const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];

  if ('Notification' in window && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }

  return messaging;
}

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');

      // Initialize Firebase if not already done
      if (!messaging) {
        initializeFirebase();
      }

      if (!messaging) {
        throw new Error('Firebase Messaging not initialized');
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log('FCM Token:', token);
        
        // Send token to backend
        await saveTokenToBackend(token);
        
        return token;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }

    return null;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
}

async function saveTokenToBackend(token: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    await fetch(`${apiUrl}/notifications/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token }),
    });

    console.log('Token saved to backend');
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

export function onMessageListener() {
  if (!messaging) {
    initializeFirebase();
  }

  return new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Message received:', payload);
        resolve(payload);
      });
    }
  });
}

export function checkNotificationPermission(): NotificationPermission | null {
  if (!('Notification' in window)) {
    return null;
  }
  return Notification.permission;
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}