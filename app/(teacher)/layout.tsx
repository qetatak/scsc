import type { Metadata } from 'next';
import React from 'react';
import { TeacherShell } from '@/components/dashboard/teacher-shell';

export const metadata: Metadata = {
  title: 'لوحة المعلم والأكاديمي | Tadreebak - تدريبك',
  description:
    'إدارة الشُعب الدراسية، تصميم الواجبات العملية داخل المختبرات، والتصحيح التلقائي الفوري.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherShell>{children}</TeacherShell>;
}
