'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  hideCloseButton = false,
}: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[80] bg-[#070D1F]/60 backdrop-blur-xs" />
        <Drawer.Content
          dir="rtl"
          className={cn(
            'fixed inset-x-0 bottom-0 z-[81] mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-[28px] border-t border-[#E3E8F0] bg-white text-right outline-none dark:border-[#1E325C] dark:bg-[#0A1630]',
            className
          )}
        >
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1.5 w-11 rounded-full bg-[#E3E8F0] dark:bg-[#1E325C]" />
          </div>

          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E3E8F0] px-5 py-3 dark:border-[#1E325C]">
            <div className="min-w-0 flex-1">
              <Drawer.Title className="truncate text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                {title}
              </Drawer.Title>
              {description ? (
                <Drawer.Description className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                  {description}
                </Drawer.Description>
              ) : (
                <Drawer.Description className="sr-only">{title}</Drawer.Description>
              )}
            </div>
            {!hideCloseButton && (
              <Drawer.Close
                aria-label="إغلاق"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[#526077] hover:bg-[#F1F4F9] hover:text-[#0A1630] dark:text-[#94A3B8] dark:hover:bg-[#070D1F] dark:hover:text-[#FAFBFC]"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </Drawer.Close>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
