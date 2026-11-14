import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: string;
  icon: LucideIcon;
  tone?: 'blue' | 'turquoise' | 'emerald' | 'amber';
  className?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  trend,
  icon: Icon,
  className,
}: StatCardProps) {
  const note = sublabel || trend;
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-[20px] border border-[#E3E8F0] bg-white p-6 transition-colors hover:border-[#2F6BFF]/50 dark:border-[#1E325C] dark:bg-[#0F1E3E]',
        className
      )}
    >
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-[#0A1630]/60 dark:text-[#94A3B8]">
          {label}
        </p>
        <p className="font-tabular text-2xl font-semibold tracking-tight text-[#0A1630] dark:text-[#FAFBFC]">
          {value}
        </p>
        {note && (
          <p className="text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
            {note}
          </p>
        )}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] text-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]">
        <Icon className="h-4 w-4 stroke-[1.5]" />
      </div>
    </div>
  );
}
