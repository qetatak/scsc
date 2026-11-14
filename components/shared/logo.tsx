import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="تدريبك - الصفحة الرئيسية"
      className={cn(
        'inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl',
        className
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
        <GraduationCap className="h-5 w-5" />
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          تدريبك
        </span>
        {!compact && (
          <span className="text-xs font-semibold tracking-wide text-blue-600 dark:text-cyan-400">
            Tadreebak
          </span>
        )}
      </span>
    </Link>
  );
}
