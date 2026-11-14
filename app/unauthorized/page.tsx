'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldAlert,
  ArrowRight,
  Building2,
  GraduationCap,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';

const IS_DEV = process.env.NODE_ENV === 'development';

const ROLE_LABELS: Record<UserRole, { name: string; home: string }> = {
  student: { name: 'لوحة الطالب', home: '/student' },
  teacher: { name: 'لوحة المعلم', home: '/teacher' },
  company: { name: 'لوحة الشركة', home: '/company' },
  admin: { name: 'لوحة إدارة النظام', home: '/admin' },
};

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, switchRole } = useAppStore();

  const reqParam = searchParams.get('required') as UserRole | null;
  const requiredRole: UserRole =
    reqParam && ['student', 'teacher', 'company', 'admin'].includes(reqParam)
      ? reqParam
      : 'student';

  const currentRole: UserRole = user?.role || 'student';
  const targetPath =
    searchParams.get('from') || ROLE_LABELS[requiredRole].home;

  const handleSwitchAndContinue = () => {
    switchRole(requiredRole);
    router.push(`${targetPath}?role=${requiredRole}`);
  };

  return (
    <div className="flex min-h-[calc(100dvh-140px)] items-center justify-center bg-[#FAFBFC] px-4 py-12 dark:bg-[#070D1F]">
      <div className="w-full max-w-lg rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-8 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] text-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#070D1F]">
          <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
        </div>

        <p className="font-tabular text-xs font-semibold tracking-wider text-[#2F6BFF] uppercase">
          ACCESS RESTRICTED · 403
        </p>
        <h1 className="mt-2 text-xl font-semibold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
          غير مصرح بالوصول إلى هذه اللوحة بالحساب الحالي
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
          هذا المسار مخصص لصلاحيات{' '}
          <strong className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            {ROLE_LABELS[requiredRole].name}
          </strong>{' '}
          فقط، ولا يمكن الدخول إليه بالحساب الحالي ({ROLE_LABELS[currentRole].name}).
        </p>

        {IS_DEV && (
          <div className="mt-5 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
            <p className="text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              وضع التطوير والتجربة السريعة (DEV ONLY):
            </p>
            <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
              يمكنك التبديل الفوري إلى الدور المطلوب لمعاينة اللوحة مباشرة أثناء التطوير.
            </p>
            <Button
              onClick={handleSwitchAndContinue}
              className="mt-3 w-full gap-2"
            >
              {requiredRole === 'company' && (
                <Building2 className="h-4 w-4 stroke-[1.5]" />
              )}
              {requiredRole === 'teacher' && (
                <BookOpen className="h-4 w-4 stroke-[1.5]" />
              )}
              {requiredRole === 'student' && (
                <GraduationCap className="h-4 w-4 stroke-[1.5]" />
              )}
              {requiredRole === 'admin' && (
                <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
              )}
              <span>
                التبديل إلى {ROLE_LABELS[requiredRole].name} والمتابعة
              </span>
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-[#E3E8F0] pt-5 dark:border-[#1E325C]">
          <Link
            href={ROLE_LABELS[currentRole].home}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
          >
            <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>العودة إلى {ROLE_LABELS[currentRole].name}</span>
          </Link>

          <Link
            href="/login"
            className="text-xs text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8] dark:hover:text-[#FAFBFC]"
          >
            تسجيل الدخول بحساب آخر
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#526077]">
          جارٍ التحقق من الصلاحيات...
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
