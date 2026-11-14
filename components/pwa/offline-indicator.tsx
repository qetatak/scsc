'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-pwa-install';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[calc(3.75rem+env(safe-area-inset-top))] inset-x-4 z-50 mx-auto flex max-w-md items-center justify-center gap-2 rounded-[12px] border border-[#1E325C] bg-[#0A1630] px-4 py-2 text-xs font-medium text-[#FAFBFC] shadow-lg"
    >
      <WifiOff className="h-4 w-4 shrink-0 stroke-[1.5] text-[#2F6BFF]" />
      <span>أنت تتصفح حالياً دون اتصال — بيانات المختبرات محفوظة محلياً</span>
    </div>
  );
}
