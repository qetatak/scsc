import React from 'react';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-3xl flex-col items-start justify-center px-4 py-20 sm:px-6">
      <div className="w-full rounded-[20px] border border-[#E3E8F0] bg-white p-8 sm:p-12 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
        <span className="font-tabular text-xs font-medium tracking-widest text-[#2F6BFF] uppercase">
          ERROR 404
        </span>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#0A1630] sm:text-5xl dark:text-[#FAFBFC]">
          الصفحة المطلوبة غير موجودة.
        </h1>
        <p className="mt-4 max-w-lg text-base text-[#0A1630]/70 dark:text-[#94A3B8]">
          ربما تم نقل هذا المسار أو حذفه أثناء تحديث المنصة. يمكنك العودة إلى الصفحة الرئيسية أو الدخول مباشرة إلى المختبرات العملية.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/">
            <Button size="lg">
              <span>العودة إلى الرئيسية</span>
              <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
            </Button>
          </Link>
          <Link href="/labs">
            <Button variant="outline" size="lg">
              استعراض المختبرات الأربعة
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
