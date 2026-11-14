'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = 'tadreebak_pwa_banner_dismissed_v1';
const noopSubscribe = () => () => {};

function getStandaloneSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getIOSSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) &&
    !(window as Window & { MSStream?: unknown }).MSStream
  );
}

function getDismissedSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot(): boolean {
  return typeof window === 'undefined' ? true : window.navigator.onLine;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installedDuringSession, setInstalledDuringSession] = useState(false);
  const [hasEngaged, setHasEngaged] = useState(false);
  const [dismissedSession, setDismissedSession] = useState(false);

  const isStandalone = useSyncExternalStore(
    noopSubscribe,
    getStandaloneSnapshot,
    () => false
  );
  const isIOS = useSyncExternalStore(noopSubscribe, getIOSSnapshot, () => false);
  const dismissedStored = useSyncExternalStore(
    noopSubscribe,
    getDismissedSnapshot,
    () => true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalledDuringSession(true);
      setDeferredPrompt(null);
    };

    const handleEngagement = () => {
      setHasEngaged(true);
    };

    const timer = window.setTimeout(() => setHasEngaged(true), 12000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('scroll', handleEngagement, { once: true, passive: true });
    window.addEventListener('pointerdown', handleEngagement, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('scroll', handleEngagement);
      window.removeEventListener('pointerdown', handleEngagement);
    };
  }, []);

  const dismissBanner = useCallback(() => {
    setDismissedSession(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore storage errors
    }
  }, []);

  const triggerInstall = async (): Promise<'prompted' | 'ios' | 'unavailable'> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledDuringSession(true);
      }
      setDeferredPrompt(null);
      dismissBanner();
      return 'prompted';
    }
    if (isIOS) {
      return 'ios';
    }
    return 'unavailable';
  };

  return {
    canPromptInstall: Boolean(deferredPrompt),
    isInstalled: isStandalone || installedDuringSession,
    isIOS,
    hasEngaged,
    isBannerDismissed: dismissedStored || dismissedSession,
    dismissBanner,
    triggerInstall,
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribeOnline, getOnlineSnapshot, () => true);
}
