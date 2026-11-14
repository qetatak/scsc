import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[12px] bg-[#E3E8F0]/75 dark:bg-[#1E325C]/70',
        className
      )}
      {...props}
    />
  );
}
