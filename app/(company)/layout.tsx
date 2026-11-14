import type { Metadata } from 'next';
import React from 'react';
import { CompanyShell } from '@/components/dashboard/company-shell';

export const metadata: Metadata = {
  title: 'لوحة تحكم الشركة',
  description: 'إدارة استقطاب المواهب، القوائم المختصرة، الرسائل، والتقارير.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompanyGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CompanyShell>{children}</CompanyShell>;
}
