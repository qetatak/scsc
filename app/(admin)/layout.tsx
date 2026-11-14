import type { Metadata } from 'next';
import React from 'react';
import { AdminShell } from '@/components/dashboard/admin-shell';

export const metadata: Metadata = {
  title: 'إدارة النظام العليا | Tadreebak - تدريبك',
  description: 'لوحة تحكم الإدارة العليا والمراجعات الأمنية لمنصة تدريبك.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
