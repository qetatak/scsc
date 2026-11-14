import type { Metadata } from 'next';
import React from 'react';
import { StudentShell } from '@/components/dashboard/student-shell';

export const metadata: Metadata = {
  title: 'لوحة تحكم الطالب',
  description: 'إدارة تقدمك في المختبرات العملية، البروفايل المهني، ورسائل الشركات.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
