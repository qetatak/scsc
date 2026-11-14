'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  GraduationCap,
  FlaskConical,
  ClipboardCheck,
  Building2,
  BarChart3,
  Megaphone,
  Bell,
  FileClock,
  CreditCard,
  Settings,
} from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import {
  DashboardAppShell,
  SidebarNavItem,
} from '@/components/dashboard/app-shell';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const {
    approvalRequests,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    announcementDismissed,
    dismissAnnouncement,
  } = useAdminStore();

  const pendingApprovals = approvalRequests.filter(
    (r) => r.status === 'قيد المراجعة'
  ).length;

  const navItems: SidebarNavItem[] = [
    {
      label: 'نظرة عامة',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'المستخدمون',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'طلبات الموافقة',
      href: '/admin/approvals',
      icon: ShieldCheck,
      badgeCount: pendingApprovals,
    },
    {
      label: 'الجامعات والشعب',
      href: '/admin/universities',
      icon: GraduationCap,
    },
    {
      label: 'مكتبة المختبرات والسيناريوهات',
      href: '/admin/labs',
      icon: FlaskConical,
    },
    {
      label: 'الواجبات والمحتوى',
      href: '/admin/assignments',
      icon: ClipboardCheck,
    },
    {
      label: 'الشركات',
      href: '/admin/companies',
      icon: Building2,
    },
    {
      label: 'التقارير والتحليلات',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      label: 'الإعلانات',
      href: '/admin/announcements',
      icon: Megaphone,
    },
    {
      label: 'الإشعارات',
      href: '/admin/notifications',
      icon: Bell,
    },
    {
      label: 'سجل التدقيق (Audit Log)',
      href: '/admin/audit-log',
      icon: FileClock,
    },
    {
      label: 'الاشتراكات والفواتير',
      href: '/admin/billing',
      icon: CreditCard,
    },
    {
      label: 'الإعدادات',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <DashboardAppShell
      mode="admin"
      identityName="مدير النظام العام"
      identitySubtitle="إدارة منصة تدريبك · صلاحيات كاملة"
      publicProfileHref="/"
      publicProfileLabel="عرض الموقع العام"
      navItems={navItems}
      notifications={notifications}
      onMarkAllNotificationsRead={markAllNotificationsRead}
      onMarkNotificationRead={markNotificationRead}
      bannerText="تنبيه أمني وإداري: جميع عمليات الموافقة وتغيير الأدوار وحذف المستخدمين تُسجل تلقائياً في سجل التدقيق."
      bannerActionLabel="مراجعة سجل التدقيق"
      bannerActionHref="/admin/audit-log"
      bannerDismissed={announcementDismissed}
      onDismissBanner={dismissAnnouncement}
    >
      {children}
    </DashboardAppShell>
  );
}
