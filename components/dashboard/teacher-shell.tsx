'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Library,
  CheckSquare,
  FileSpreadsheet,
  BarChart3,
  MessageSquare,
  Megaphone,
  Settings,
} from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import {
  DashboardAppShell,
  SidebarNavItem,
} from '@/components/dashboard/app-shell';

export function TeacherShell({ children }: { children: React.ReactNode }) {
  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    announcementDismissed,
    dismissAnnouncement,
    submissions,
  } = useTeacherStore();

  const needsReviewCount = submissions.filter(
    (s) => s.status === 'مُصحَّح آلياً' || s.status === 'مُسلَّم'
  ).length;

  const navItems: SidebarNavItem[] = [
    {
      label: 'الرئيسية',
      href: '/teacher',
      icon: LayoutDashboard,
    },
    {
      label: 'الشعب (Classes)',
      href: '/teacher/classes',
      icon: Users,
    },
    {
      label: 'الواجبات',
      href: '/teacher/assignments',
      icon: ClipboardCheck,
    },
    {
      label: 'مكتبة القوالب',
      href: '/teacher/templates',
      icon: Library,
    },
    {
      label: 'التسليمات والمراجعة',
      href: '/teacher/assignments/asg-acc-1',
      icon: CheckSquare,
      badgeCount: needsReviewCount,
    },
    {
      label: 'سجل العلامات',
      href: '/teacher/gradebook',
      icon: FileSpreadsheet,
    },
    {
      label: 'التحليلات',
      href: '/teacher/analytics',
      icon: BarChart3,
    },
    {
      label: 'الرسائل',
      href: '/teacher/messages',
      icon: MessageSquare,
    },
    {
      label: 'الإعلانات',
      href: '/teacher/announcements',
      icon: Megaphone,
    },
    {
      label: 'الإعدادات',
      href: '/teacher/settings',
      icon: Settings,
    },
  ];

  return (
    <DashboardAppShell
      mode="teacher"
      identityName="د. أحمد خليل العساف"
      identitySubtitle="الجامعة الأردنية · كلية الأعمال وتقنية المعلومات"
      publicProfileHref="/labs"
      publicProfileLabel="عرض المختبرات التعليمية"
      navItems={navItems}
      notifications={notifications}
      onMarkAllNotificationsRead={markAllNotificationsRead}
      onMarkNotificationRead={markNotificationRead}
      bannerText="مكتبة القوالب الأكاديمية: يتوفر الآن 40 قالب واجب تطبيقي جاهز للنسخ والتخصيص في المختبرات الأربعة."
      bannerActionLabel="فتح مكتبة القوالب"
      bannerActionHref="/teacher/templates"
      bannerDismissed={announcementDismissed}
      onDismissBanner={dismissAnnouncement}
    >
      {children}
    </DashboardAppShell>
  );
}
