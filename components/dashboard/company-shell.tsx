'use client';

import React from 'react';
import {
  LayoutDashboard,
  Search,
  BookmarkCheck,
  MessageSquare,
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Settings,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import {
  DashboardAppShell,
  SidebarNavItem,
} from '@/components/dashboard/app-shell';

export function CompanyShell({ children }: { children: React.ReactNode }) {
  const { companyMessages } = useAppStore();
  const {
    companyProfile,
    shortlistCandidates,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    bannerDismissed,
    dismissBanner,
  } = useCompanyDashboardStore();

  const repliedMessagesCount = companyMessages.filter(
    (m) => m.status === 'تم القبول والرد'
  ).length;

  const navItems: SidebarNavItem[] = [
    {
      label: 'الرئيسية',
      href: '/company',
      icon: LayoutDashboard,
    },
    {
      label: 'البحث عن المواهب',
      href: '/company/talent',
      icon: Search,
    },
    {
      label: 'القائمة المختصرة (Shortlist)',
      href: '/company/shortlist',
      icon: BookmarkCheck,
      badgeCount: shortlistCandidates.length,
    },
    {
      label: 'الرسائل',
      href: '/company/messages',
      icon: MessageSquare,
      badgeCount: repliedMessagesCount,
    },
    {
      label: 'التقارير',
      href: '/company/reports',
      icon: BarChart3,
    },
    {
      label: 'ملف الشركة',
      href: '/company/profile',
      icon: Building2,
    },
    {
      label: 'الفريق',
      href: '/company/team',
      icon: Users,
    },
    {
      label: 'الاشتراك والفواتير',
      href: '/company/billing',
      icon: CreditCard,
    },
    {
      label: 'الإعدادات',
      href: '/company/settings',
      icon: Settings,
    },
  ];

  return (
    <DashboardAppShell
      mode="company"
      identityName={companyProfile.companyName}
      identitySubtitle={`${companyProfile.industry} · ${companyProfile.city}`}
      publicProfileHref="/for-companies"
      publicProfileLabel="عرض صفحتي العامة"
      navItems={navItems}
      notifications={notifications}
      onMarkAllNotificationsRead={markAllNotificationsRead}
      onMarkNotificationRead={markNotificationRead}
      bannerText="تحديث بوابة التوظيف: انضم 12 خريجاً جديداً لمستوى الخبير في مختبري المحاسبة المالية وبرمجة Python هذا الأسبوع."
      bannerActionLabel="استعراض جدول المواهب"
      bannerActionHref="/company/talent"
      bannerDismissed={bannerDismissed}
      onDismissBanner={dismissBanner}
    >
      {children}
    </DashboardAppShell>
  );
}
