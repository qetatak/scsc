import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex min-h-[46px] w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#0A1630] placeholder:text-[#526077]/65 transition-colors focus-visible:outline-none focus-visible:border-[#2F6BFF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC] dark:placeholder:text-[#94A3B8]/70',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
