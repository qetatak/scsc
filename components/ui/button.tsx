import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-[#2F6BFF] text-[#FAFBFC] hover:bg-[#1E56E8]',
        turquoise:
          'bg-[#0A1630] text-[#FAFBFC] hover:bg-[#142752] dark:bg-[#2F6BFF] dark:text-[#FAFBFC]',
        secondary:
          'bg-[#F1F4F9] text-[#0A1630] border border-[#E3E8F0] hover:bg-[#E3E8F0]/70 dark:bg-[#0A1630] dark:text-[#FAFBFC] dark:border-[#1E325C] dark:hover:bg-[#13254D]',
        outline:
          'border border-[#E3E8F0] bg-white text-[#0A1630] hover:border-[#2F6BFF] hover:text-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC] dark:hover:border-[#2F6BFF]',
        ghost:
          'text-[#0A1630] hover:bg-[#F1F4F9] dark:text-[#FAFBFC] dark:hover:bg-[#0A1630]',
        danger:
          'border border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/15 dark:text-red-300',
      },
      size: {
        default: 'min-h-[44px] px-5 py-2.5',
        sm: 'min-h-[40px] px-3.5 text-xs sm:min-h-[38px]',
        lg: 'min-h-[48px] px-6 text-base',
        pill: 'min-h-[44px] px-6 rounded-[10px]',
        icon: 'h-11 w-11 rounded-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
