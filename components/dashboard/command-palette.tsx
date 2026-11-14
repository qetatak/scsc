'use client';

import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  FlaskConical,
  Award,
  UserCircle,
  MessageSquare,
  Settings,
  Users,
  BookmarkCheck,
  BarChart3,
  Building2,
  CreditCard,
  ArrowUpLeft,
  Moon,
  Sun,
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  ShieldCheck,
  FileText,
  Megaphone,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { UserRole } from '@/types';

interface CommandPaletteProps {
  role?: UserRole;
  mode?: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardCommandPalette({
  role: roleProp,
  mode,
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const role: UserRole = roleProp || mode || 'student';
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const navigate = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#0A1630]/60 px-4 pt-20 backdrop-blur-xs"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-[16px] border border-[#E3E8F0] bg-white shadow-2xl dark:border-[#1E325C] dark:bg-[#0F1E3E]"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="لوحة الأوامر السريعة" className="w-full">
          <div className="flex items-center border-b border-[#E3E8F0] px-4 dark:border-[#1E325C]">
            <Search className="ml-2.5 h-4 w-4 shrink-0 stroke-[1.5] text-[#526077]" />
            <Command.Input
              autoFocus
              placeholder="ابحث عن صفحة، مختبر، واجب، أو إجراء سريع..."
              className="h-12 w-full bg-transparent text-sm text-[#0A1630] outline-none placeholder:text-[#526077] dark:text-[#FAFBFC] dark:placeholder:text-[#94A3B8]"
            />
            <kbd className="rounded border border-[#E3E8F0] bg-[#F5F6F8] px-1.5 py-0.5 font-tabular text-[10px] text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630]">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 text-xs">
            <Command.Empty className="py-8 text-center text-[#526077] dark:text-[#94A3B8]">
              لا توجد نتائج مطابقة لبحثك.
            </Command.Empty>

            {role === 'student' && (
              <>
                <Command.Group
                  heading="صفحات لوحة الطالب"
                  className="px-2 py-1.5 font-semibold text-[#526077] dark:text-[#94A3B8]"
                >
                  {[
                    { label: 'الرئيسية — ملخص الأداء الشهري', href: '/student', icon: LayoutDashboard },
                    { label: 'الواجبات العملية والانضمام لشعبة', href: '/student/assignments', icon: ClipboardCheck },
                    { label: 'تقدمي في المختبرات وسجل XP', href: '/student/progress', icon: FlaskConical },
                    { label: 'الإنجازات والشهادات الموثقة', href: '/student/achievements', icon: Award },
                    { label: 'محرر البروفايل المهني وإعدادات الخصوصية', href: '/student/profile', icon: UserCircle },
                    { label: 'صندوق رسائل الشركات والعروض', href: '/student/messages', icon: MessageSquare },
                    { label: 'إعدادات حساب الطالب', href: '/student/settings', icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.href}
                        onSelect={() => navigate(item.href)}
                        className="flex cursor-pointer items-center justify-between rounded-[10px] px-3 py-2.5 text-[#0A1630] aria-selected:bg-[#EBF1FF] aria-selected:text-[#2F6BFF] dark:text-[#FAFBFC] dark:aria-selected:bg-[#2F6BFF]/20"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 stroke-[1.5]" />
                          <span>{item.label}</span>
                        </span>
                        <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              </>
            )}

            {role === 'teacher' && (
              <Command.Group
                heading="صفحات لوحة المعلم"
                className="px-2 py-1.5 font-semibold text-[#526077] dark:text-[#94A3B8]"
              >
                {[
                  { label: 'الرئيسية — ملخص الشعب والتسليمات', href: '/teacher', icon: LayoutDashboard },
                  { label: 'إدارة الشعب وكود الانضمام', href: '/teacher/classes', icon: Users },
                  { label: 'الواجبات العملية المنشورة', href: '/teacher/assignments', icon: ClipboardCheck },
                  { label: 'إنشاء واجب عملي جديد (المعالج)', href: '/teacher/assignments/new', icon: BookOpen },
                  { label: 'مكتبة القوالب الجاهزة (40 قالب)', href: '/teacher/templates', icon: FileText },
                  { label: 'سجل العلامات (Gradebook) وتصدير CSV', href: '/teacher/gradebook', icon: FileSpreadsheet },
                  { label: 'تحليلات الأداء والإنذار المبكر', href: '/teacher/analytics', icon: BarChart3 },
                  { label: 'الإعلانات والرسائل الأكاديمية', href: '/teacher/announcements', icon: Megaphone },
                  { label: 'إعدادات المعلم', href: '/teacher/settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.href}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer items-center justify-between rounded-[10px] px-3 py-2.5 text-[#0A1630] aria-selected:bg-[#EBF1FF] aria-selected:text-[#2F6BFF] dark:text-[#FAFBFC]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 stroke-[1.5]" />
                        <span>{item.label}</span>
                      </span>
                      <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}

            {role === 'company' && (
              <Command.Group
                heading="صفحات لوحة الشركة"
                className="px-2 py-1.5 font-semibold text-[#526077] dark:text-[#94A3B8]"
              >
                {[
                  { label: 'الرئيسية — قمع التوظيف وملخص المواهب', href: '/company', icon: LayoutDashboard },
                  { label: 'البحث عن المواهب وفرز المرشحين', href: '/company/talent', icon: Users },
                  { label: 'القائمة المختصرة (Shortlist) وتصدير CSV', href: '/company/shortlist', icon: BookmarkCheck },
                  { label: 'الرسائل المرسلة وقوالب التواصل', href: '/company/messages', icon: MessageSquare },
                  { label: 'تقارير التوظيف ومعدلات الاستجابة', href: '/company/reports', icon: BarChart3 },
                  { label: 'ملف الشركة وتوثيق السجل التجاري', href: '/company/profile', icon: Building2 },
                  { label: 'إدارة الفريق والصلاحيات', href: '/company/team', icon: Users },
                  { label: 'الاشتراك والفواتير', href: '/company/billing', icon: CreditCard },
                  { label: 'إعدادات الشركة', href: '/company/settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.href}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer items-center justify-between rounded-[10px] px-3 py-2.5 text-[#0A1630] aria-selected:bg-[#EBF1FF] aria-selected:text-[#2F6BFF] dark:text-[#FAFBFC]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 stroke-[1.5]" />
                        <span>{item.label}</span>
                      </span>
                      <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}

            {role === 'admin' && (
              <Command.Group
                heading="صفحات إدارة المنصة (Admin)"
                className="px-2 py-1.5 font-semibold text-[#526077] dark:text-[#94A3B8]"
              >
                {[
                  { label: 'نظرة عامة ومؤشرات المنصة', href: '/admin', icon: LayoutDashboard },
                  { label: 'إدارة المستخدمين والصلاحيات', href: '/admin/users', icon: Users },
                  { label: 'طلبات موافقة المعلمين وتوثيق الشركات', href: '/admin/approvals', icon: ShieldCheck },
                  { label: 'إدارة الجامعات والشعب', href: '/admin/universities', icon: Building2 },
                  { label: 'مكتبة المختبرات والسيناريوهات', href: '/admin/labs', icon: FlaskConical },
                  { label: 'سجل التدقيق الأمني (Audit Log)', href: '/admin/audit-log', icon: FileText },
                  { label: 'إعدادات المنصة ومفاتيح الميزات (Feature Flags)', href: '/admin/settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.href}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer items-center justify-between rounded-[10px] px-3 py-2.5 text-[#0A1630] aria-selected:bg-[#EBF1FF] aria-selected:text-[#2F6BFF] dark:text-[#FAFBFC]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 stroke-[1.5]" />
                        <span>{item.label}</span>
                      </span>
                      <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}

            <Command.Group
              heading="إجراءات سريعة"
              className="mt-2 px-2 py-1.5 font-semibold text-[#526077] dark:text-[#94A3B8]"
            >
              <Command.Item
                onSelect={() => {
                  toggleDarkMode();
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center justify-between rounded-[10px] px-3 py-2 text-[#0A1630] aria-selected:bg-[#EBF1FF] aria-selected:text-[#2F6BFF] dark:text-[#FAFBFC]"
              >
                <span className="flex items-center gap-2.5">
                  {darkMode ? (
                    <Sun className="h-4 w-4 stroke-[1.5]" />
                  ) : (
                    <Moon className="h-4 w-4 stroke-[1.5]" />
                  )}
                  <span>
                    {darkMode
                      ? 'التبديل إلى الوضع النهاري'
                      : 'التبديل إلى الوضع الليلي'}
                  </span>
                </span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
