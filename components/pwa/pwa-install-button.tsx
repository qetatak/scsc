'use client';

import React, { useState } from 'react';
import { Download, Share, PlusSquare, Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { cn } from '@/lib/utils';

export function PWAInstallButton({
  variant = 'menu',
  className,
  onAfterAction,
}: {
  variant?: 'menu' | 'footer' | 'compact';
  className?: string;
  onAfterAction?: () => void;
}) {
  const { isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [iosSheetOpen, setIosSheetOpen] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    const outcome = await triggerInstall();
    if (outcome === 'ios') {
      setIosSheetOpen(true);
      return;
    }
    if (outcome === 'unavailable') {
      setIosSheetOpen(true);
      if (!isIOS) {
        toast.info('يمكنك تثبيت تدريبك من قائمة المتصفح (إضافة إلى الشاشة الرئيسية).');
      }
      return;
    }
    onAfterAction?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'flex items-center justify-center gap-2 rounded-[10px] font-medium transition-transform active:scale-[0.97] cursor-pointer select-none',
          variant === 'menu' &&
            'min-h-[44px] w-full border border-[#2F6BFF]/30 bg-[#2F6BFF]/10 px-4 py-2.5 text-xs text-[#2F6BFF] hover:bg-[#2F6BFF]/15',
          variant === 'footer' &&
            'min-h-[44px] border border-[#1E325C] bg-[#0A1630] px-4 py-2 text-xs text-[#FAFBFC] hover:border-[#2F6BFF]',
          variant === 'compact' &&
            'min-h-[44px] border border-[#E3E8F0] bg-white px-3.5 py-2 text-xs text-[#0A1630] hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]',
          className
        )}
      >
        <Download className="h-4 w-4 shrink-0 stroke-[1.5]" />
        <span>تثبيت تطبيق تدريبك</span>
      </button>

      <InstallGuideSheet
        open={iosSheetOpen}
        onOpenChange={setIosSheetOpen}
        isIOS={isIOS}
      />
    </>
  );
}

export function SmartPWAInstallBanner() {
  const {
    isInstalled,
    canPromptInstall,
    isIOS,
    hasEngaged,
    isBannerDismissed,
    dismissBanner,
    triggerInstall,
  } = usePWAInstall();
  const [iosSheetOpen, setIosSheetOpen] = useState(false);

  if (isInstalled || isBannerDismissed || !hasEngaged) {
    return null;
  }

  if (!canPromptInstall && !isIOS) {
    return null;
  }

  const handleInstall = async () => {
    const outcome = await triggerInstall();
    if (outcome === 'ios' || outcome === 'unavailable') {
      setIosSheetOpen(true);
    }
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md px-3 lg:bottom-6">
        <div className="pointer-events-auto flex items-center gap-3 rounded-[16px] border border-[#E3E8F0] bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-[#1E325C] dark:bg-[#0A1630]/95">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#2F6BFF] text-white">
            <Smartphone className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              ثبّت تطبيق تدريبك
            </p>
            <p className="truncate text-[11px] text-[#526077] dark:text-[#94A3B8]">
              وصول سريع للمختبرات وبلا شريط متصفح
            </p>
          </div>
          <button
            type="button"
            onClick={handleInstall}
            className="min-h-[40px] shrink-0 rounded-[10px] bg-[#2F6BFF] px-3.5 text-xs font-medium text-white active:scale-[0.97]"
          >
            ثبّت التطبيق
          </button>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="إخفاء إشعار التثبيت"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[#526077] hover:bg-[#F1F4F9] dark:text-[#94A3B8] dark:hover:bg-[#070D1F]"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      <InstallGuideSheet
        open={iosSheetOpen}
        onOpenChange={(v) => {
          setIosSheetOpen(v);
          if (!v) dismissBanner();
        }}
        isIOS={isIOS}
      />
    </>
  );
}

function InstallGuideSheet({
  open,
  onOpenChange,
  isIOS,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isIOS: boolean;
}) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="تثبيت تدريبك كتطبيق"
      description="افتح المختبرات ولوحتك بملء الشاشة مباشرة"
    >
      <div className="space-y-3 text-xs text-[#0A1630] dark:text-[#FAFBFC]">
        <div className="flex items-center gap-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#2F6BFF]/10 font-tabular font-semibold text-[#2F6BFF]">
            1
          </span>
          <p className="flex-1 font-medium">
            {isIOS
              ? 'اضغط على أيقونة المشاركة (Share) في شريط Safari'
              : 'افتح قائمة المتصفح الجانبية'}
          </p>
          <Share className="h-4 w-4 shrink-0 stroke-[1.5] text-[#2F6BFF]" />
        </div>

        <div className="flex items-center gap-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#2F6BFF]/10 font-tabular font-semibold text-[#2F6BFF]">
            2
          </span>
          <p className="flex-1 font-medium">
            اختر &laquo;إضافة إلى الشاشة الرئيسية&raquo; (Add to Home Screen)
          </p>
          <PlusSquare className="h-4 w-4 shrink-0 stroke-[1.5] text-[#2F6BFF]" />
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-2 flex min-h-[46px] w-full items-center justify-center rounded-[10px] bg-[#0A1630] text-sm font-medium text-white dark:bg-[#2F6BFF]"
        >
          حسناً
        </button>
      </div>
    </BottomSheet>
  );
}
