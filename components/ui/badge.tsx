import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 font-tabular',
  {
    variants: {
      variant: {
        default:
          'bg-[#2F6BFF]/10 text-[#2F6BFF] border border-[#2F6BFF]/25 dark:bg-[#2F6BFF]/20 dark:text-[#FAFBFC]',
        turquoise:
          'bg-[#F1F4F9] text-[#0A1630] border border-[#E3E8F0] dark:bg-[#0F1E3E] dark:text-[#FAFBFC] dark:border-[#1E325C]',
        success:
          'bg-[#0A1630] text-[#FAFBFC] border border-[#0A1630] dark:bg-[#2F6BFF] dark:text-[#FAFBFC] dark:border-[#2F6BFF]',
        warning:
          'bg-[#F1F4F9] text-[#0A1630] border border-[#E3E8F0] dark:bg-[#0F1E3E] dark:text-[#FAFBFC] dark:border-[#1E325C]',
        danger:
          'bg-[#F1F4F9] text-[#0A1630] border border-[#E3E8F0] dark:bg-[#0F1E3E] dark:text-[#FAFBFC] dark:border-[#1E325C]',
        neutral:
          'bg-[#F1F4F9] text-[#0A1630]/80 border border-[#E3E8F0] dark:bg-[#0F1E3E] dark:text-[#94A3B8] dark:border-[#1E325C]',
        secondary:
          'bg-[#F1F4F9] text-[#0A1630]/80 border border-[#E3E8F0] dark:bg-[#0F1E3E] dark:text-[#94A3B8] dark:border-[#1E325C]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
