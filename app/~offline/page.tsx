'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, FlaskConical, Home } from 'lucide-react';

export default function OfflineFallbackPage() {
  return (
    <div className="mx-auto flex min-h-[75dvh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-[#E3E8F0] bg-white text-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]">
        <WifiOff className="h-7 w-7 stroke-[1.5]" />
      </div>

      <h1 className="mt-6 text-xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
        أنت غير متصل بالإنترنت حالياً
      </h1>
      <p className="mt-2.5 text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
        يبدو أن الاتصال انقطع مؤقتاً. يمكنك إعادة المحاولة أو فتح الصفحات التي تم
        تخزينها مسبقاً على جهازك.
      </p>

      <div className="mt-6 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#2F6BFF] px-5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4 stroke-[1.5]" />
          <span>إعادة المحاولة</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/"
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[#E3E8F0] bg-white px-4 text-xs font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
          >
            <Home className="h-4 w-4 stroke-[1.5]" />
            <span>الرئيسية</span>
          </Link>
          <Link
            href="/labs"
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[#E3E8F0] bg-white px-4 text-xs font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
          >
            <FlaskConical className="h-4 w-4 stroke-[1.5]" />
            <span>المختبرات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
