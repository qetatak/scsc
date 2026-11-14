'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Drawer } from 'vaul';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const IsMobileDialogContext = React.createContext(false);

type DialogRootProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

function Dialog({ children, ...props }: DialogRootProps) {
  const isMobile = useIsMobile();

  return (
    <IsMobileDialogContext.Provider value={isMobile}>
      {isMobile ? (
        <Drawer.Root
          open={props.open}
          defaultOpen={props.defaultOpen}
          onOpenChange={props.onOpenChange}
          shouldScaleBackground={false}
        >
          {children}
        </Drawer.Root>
      ) : (
        <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
      )}
    </IsMobileDialogContext.Provider>
  );
}

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ ...props }, ref) => {
  const isMobile = React.useContext(IsMobileDialogContext);
  if (isMobile) {
    return <Drawer.Trigger ref={ref} {...props} />;
  }
  return <DialogPrimitive.Trigger ref={ref} {...props} />;
});
DialogTrigger.displayName = 'DialogTrigger';

const DialogPortal = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => {
  const isMobile = React.useContext(IsMobileDialogContext);
  if (isMobile) {
    return <Drawer.Portal>{children}</Drawer.Portal>;
  }
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>;
};

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ ...props }, ref) => {
  const isMobile = React.useContext(IsMobileDialogContext);
  if (isMobile) {
    return <Drawer.Close ref={ref} {...props} />;
  }
  return <DialogPrimitive.Close ref={ref} {...props} />;
});
DialogClose.displayName = 'DialogClose';

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const isMobile = React.useContext(IsMobileDialogContext);
  if (isMobile) {
    return (
      <Drawer.Overlay
        ref={ref}
        className={cn(
          'fixed inset-0 z-[80] bg-[#070D1F]/60 backdrop-blur-xs',
          className
        )}
        {...props}
      />
    );
  }
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-[80] bg-[#070D1F]/60 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const isMobile = React.useContext(IsMobileDialogContext);

  if (isMobile) {
    return (
      <Drawer.Portal>
        <DialogOverlay />
        <Drawer.Content
          ref={ref}
          dir="rtl"
          className={cn(
            'fixed inset-x-0 bottom-0 z-[81] flex max-h-[88dvh] w-full flex-col rounded-t-[28px] border-t border-[#E3E8F0] bg-white px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 text-right shadow-2xl outline-none dark:border-[#1E325C] dark:bg-[#0A1630]',
            className
          )}
          {...props}
        >
          <div className="mx-auto mb-3 h-1.5 w-11 shrink-0 rounded-full bg-[#E3E8F0] dark:bg-[#1E325C]" />
          <Drawer.Close
            aria-label="إغلاق النافذة"
            className="absolute left-4 top-3.5 flex h-10 w-10 items-center justify-center rounded-[10px] text-[#526077] hover:bg-[#F1F4F9] hover:text-[#0A1630] dark:text-[#94A3B8] dark:hover:bg-[#070D1F] dark:hover:text-[#FAFBFC]"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </Drawer.Close>
          <div className="min-h-0 flex-1 overflow-y-auto pt-1">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    );
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        dir="rtl"
        className={cn(
          'fixed left-[50%] top-[50%] z-[81] grid max-h-[90dvh] w-[95vw] max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-[16px] border border-[#E3E8F0] bg-white p-6 text-right shadow-2xl duration-200 dark:border-[#1E325C] dark:bg-[#0A1630]',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="إغلاق النافذة"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-[10px] text-[#526077] transition-colors hover:bg-[#F1F4F9] hover:text-[#0A1630] focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] dark:text-[#94A3B8] dark:hover:bg-[#070D1F] dark:hover:text-[#FAFBFC] cursor-pointer"
        >
          <X className="h-4 w-4 stroke-[1.5]" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-right', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  const isMobile = React.useContext(IsMobileDialogContext);
  if (isMobile) {
    return (
      <Drawer.Title
        ref={ref}
        className={cn(
          'pl-10 text-base font-semibold leading-snug tracking-tight text-[#0A1630] dark:text-[#FAFBFC]',
          className
        )}
        {...props}
      />
    );
  }
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        'pl-10 text-lg font-semibold leading-snug tracking-tight text-[#0A1630] dark:text-[#FAFBFC]',
        className
      )}
      {...props}
    />
  );
});
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  const isMobile = React.useContext(IsMobileDialogContext);
  if (isMobile) {
    return (
      <Drawer.Description
        ref={ref}
        className={cn('text-sm text-[#526077] dark:text-[#94A3B8]', className)}
        {...props}
      />
    );
  }
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-[#526077] dark:text-[#94A3B8]', className)}
      {...props}
    />
  );
});
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
