'use client';

import React from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  ClipboardCheck,
  TrendingUp,
  Award,
  UserCheck,
  MessageSquare,
  ListOrdered,
  Settings,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useStudentDashboardStore } from '@/store/use-student-dashboard-store';
import { useTeacherStore } from '@/store/use-teacher-store';
import {
  DashboardAppShell,
  SidebarNavItem,
} from '@/components/dashboard/app-shell';

export function StudentShell({ children }: { children: React.ReactNode }) {
  const { currentStudent, companyMessages } = useAppStore();
  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    bannerDismissed,
    dismissBanner,
  } = useStudentDashboardStore();
  const { assignments, submissions } = useTeacherStore();

  const unreadMessagesCount = companyMessages.filter(
    (m) =>
      m.studentUsername === currentStudent.username &&
      m.status === 'قيد الانتظار'
  ).length;

  const pendingAssignmentsCount = assignments.filter((asg) => {
    if (asg.status !== 'منشور') return false;
    const sub = submissions.find(
      (s) =>
        s.assignmentId === asg.id &&
        s.studentUsername === currentStudent.username
    );
    return (
      !sub ||
      sub.status === 'لم يبدأ' ||
      sub.status === 'قيد الحل' ||
      sub.status === 'متأخر'
    );
  }).length;

  const navItems: SidebarNavItem[] = [
    {
      label: 'الرئيسية',
      href: '/student',
      icon: LayoutDashboard,
    },
    {
      label: 'الواجبات العملية',
      href: '/student/assignments',
      icon: ClipboardCheck,
      badgeCount: pendingAssignmentsCount,
    },
    {
      label: 'المختبرات',
      icon: FlaskConical,
      children: [
        { label: 'مختبر المحاسبة المالية', href: '/labs/accounting' },
        { label: 'مختبر التسويق الرقمي', href: '/labs/marketing' },
        { label: 'مختبر إدارة الأعمال', href: '/labs/management' },
        { label: 'مختبر البرمجة (Python)', href: '/labs/python' },
      ],
    },
    {
      label: 'تقدمي',
      href: '/student/progress',
      icon: TrendingUp,
    },
    {
      label: 'الإنجازات والشهادات',
      href: '/student/achievements',
      icon: Award,
    },
    {
      label: 'بروفايلي (المحرر)',
      href: '/student/profile',
      icon: UserCheck,
    },
    {
      label: 'الرسائل',
      href: '/student/messages',
      icon: MessageSquare,
      badgeCount: unreadMessagesCount,
    },
    {
      label: 'المتصدرون',
      href: '/leaderboard',
      icon: ListOrdered,
    },
    {
      label: 'الإعدادات',
      href: '/student/settings',
      icon: Settings,
    },
  ];

  return (
    <DashboardAppShell
      mode="student"
      identityName={currentStudent.fullName}
      identitySubtitle={`${currentStudent.major} · ${currentStudent.university}`}
      publicProfileHref={`/students/${currentStudent.username}`}
      publicProfileLabel="عرض صفحتي العامة"
      navItems={navItems}
      notifications={notifications}
      onMarkAllNotificationsRead={markAllNotificationsRead}
      onMarkNotificationRead={markNotificationRead}
      bannerText="جديد: لديك واجبات عملية نشطة من المعلم في مختبري البرمجة والتسويق الرقمي."
      bannerActionLabel="استعراض الواجبات العملية"
      bannerActionHref="/student/assignments"
      bannerDismissed={bannerDismissed}
      onDismissBanner={dismissBanner}
    >
      {children}
    </DashboardAppShell>
  );
}
