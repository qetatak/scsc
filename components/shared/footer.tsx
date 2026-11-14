'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpLeft } from 'lucide-react';
import { PWAInstallButton } from '@/components/pwa/pwa-install-button';

export function Footer() {
  const pathname = usePathname();
  if (
    pathname === '/student' ||
    pathname.startsWith('/student/') ||
    pathname === '/teacher' ||
    pathname.startsWith('/teacher/') ||
    pathname === '/company' ||
    pathname.startsWith('/company/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  ) {
    return null;
  }

  return (
    <footer className="border-t border-[#E3E8F0] bg-[#0A1630] text-[#FAFBFC] dark:border-[#1E325C]">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              aria-label="تدريبك - الصفحة الرئيسية"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2F6BFF] text-[#FAFBFC]">
                <ArrowUpLeft className="h-4 w-4 stroke-[1.75]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tracking-tight text-[#FAFBFC]">
                  تدريبك
                </span>
                <span className="font-tabular text-xs font-medium tracking-wider text-[#94A3B8] uppercase">
                  Tadreebak
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-base leading-[1.7] text-[#CBD5E1]">
              مختبرات محاكاة عملية في المحاسبة والتسويق وإدارة الأعمال وبرمجة بايثون. أداؤك الفعلي يبني بروفايلك المهني لتجدك الشركات مباشرة.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <PWAInstallButton variant="footer" />
            </div>

            <div className="mt-6 flex flex-wrap gap-6 font-tabular text-xs text-[#94A3B8]">
              <span>مجمع الملك حسين للأعمال، عمّان</span>
              <span>hello@tadreebak.com</span>
            </div>
          </div>

          {/* Labs Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">
              المختبرات التفاعلية
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/labs/accounting"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  مختبر المحاسبة المالية
                </Link>
              </li>
              <li>
                <Link
                  href="/labs/marketing"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  مختبر التسويق الرقمي
                </Link>
              </li>
              <li>
                <Link
                  href="/labs/management"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  مختبر إدارة الأعمال
                </Link>
              </li>
              <li>
                <Link
                  href="/labs/python"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/85 transition-colors hover:text-[#2F6BFF]"
                >
                  مختبر البرمجة (بايثون)
                </Link>
              </li>
            </ul>
          </div>

          {/* Students Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">
              للطلاب
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/labs"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  كتالوج المختبرات
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  جدول المتصدرين
                </Link>
              </li>
              <li>
                <Link
                  href="/students/yazan-nabulsi"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  البروفايل المهني العام
                </Link>
              </li>
              <li>
                <Link
                  href="/student"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  لوحة الطالب
                </Link>
              </li>
            </ul>
          </div>

          {/* Companies Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">
              للشركات
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/for-companies"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  بوابة الشركات
                </Link>
              </li>
              <li>
                <Link
                  href="/company"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  لوحة تحكم الشركة
                </Link>
              </li>
              <li>
                <Link
                  href="/company/talent"
                  className="inline-flex min-h-[36px] items-center text-[#FAFBFC]/80 transition-colors hover:text-[#2F6BFF]"
                >
                  جدول البحث عن المواهب
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#1E325C] pt-8 text-xs text-[#94A3B8] sm:flex-row sm:items-center">
          <p className="font-tabular">© 2027 Tadreebak. جميع الحقوق محفوظة.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/labs" className="hover:text-[#FAFBFC]">
              المختبرات
            </Link>
            <Link href="/leaderboard" className="hover:text-[#FAFBFC]">
              المتصدرون
            </Link>
            <Link href="/for-companies" className="hover:text-[#FAFBFC]">
              بوابة الشركات
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
