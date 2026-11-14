import Link from 'next/link';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#E3E8F0] bg-white px-5 py-12 text-center sm:px-6 sm:py-16 dark:border-[#1E325C] dark:bg-[#0A1630]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#2F6BFF]/10 text-[#2F6BFF]">
        <SearchX className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-[#0A1630] sm:text-xl dark:text-[#FAFBFC]">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="secondary"
          size="pill"
          onClick={onAction}
          className="mt-6"
        >
          <RotateCcw className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
      {actionLabel && actionHref && !onAction && (
        <Button asChild variant="default" size="pill" className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
