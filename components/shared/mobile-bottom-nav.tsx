'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FlaskConical,
  Trophy,
  Building2,
  LayoutDashboard,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const { isKeyboardOpen } = useKeyboardOffset(false);

  const isDashboardRoute =
    pathname === '/student' ||
    pathname.startsWith('/student/') ||
    pathname === '/teacher' ||
    pathname.startsWith('/teacher/') ||
    pathname === '/company' ||
    pathname.startsWith('/company/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/~offline';

  if (isDashboardRoute || isAuthRoute || isKeyboardOpen) {
    return null;
  }

  const accountHref =
    user?.role === 'company'
      ? '/company'
      : user?.role === 'teacher'
      ? '/teacher'
      : '/student';

  const tabs = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/labs', label: 'المختبرات', icon: FlaskConical },
    { href: '/leaderboard', label: 'المتصدرون', icon: Trophy },
    { href: '/for-companies', label: 'للشركات', icon: Building2 },
    { href: accountHref, label: 'لوحتي', icon: LayoutDashboard },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 mx-auto max-w-[366px] px-3 md:hidden">
      <nav
        aria-label="التنقل السفلي السريع"
        className="pointer-events-auto flex h-16 items-center justify-around rounded-[28px] border border-[#E3E8F0]/90 bg-white/90 px-2 shadow-[0_12px_32px_rgba(10,22,48,0.12)] backdrop-blur-xl dark:border-[#1E325C] dark:bg-[#0A1630]/92 dark:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-[48px] items-center justify-center gap-1.5 rounded-[20px] transition-all duration-150 active:scale-[0.97]',
                isActive
                  ? 'bg-[#2F6BFF]/12 px-3 text-[#2F6BFF]'
                  : 'min-w-[48px] px-2 text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8] dark:hover:text-[#FAFBFC]'
              )}
            >
              <Icon className="h-[19px] w-[19px] shrink-0 stroke-[1.5]" />
              {isActive && (
                <span className="truncate text-xs font-semibold leading-none">
                  {tab.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
