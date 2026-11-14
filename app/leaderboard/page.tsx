'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowUpLeft, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { UNIVERSITIES, MAJORS, LABS_METADATA } from '@/data/mock-data';
import { calculateSkillLevelFromXp } from '@/lib/labs/skill-calculator';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { LabId } from '@/types';

export default function LeaderboardPage() {
  const { allStudents } = useAppStore();

  const [selectedLab, setSelectedLab] = useState<'all' | LabId>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const rankedStudents = useMemo(() => {
    return allStudents
      .filter((s) => s.isPublicToCompanies)
      .filter((s) => {
        if (selectedUniversity !== 'all' && s.university !== selectedUniversity) return false;
        if (selectedMajor !== 'all' && s.major !== selectedMajor) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          return (
            s.fullName.toLowerCase().includes(q) ||
            s.university.toLowerCase().includes(q) ||
            s.major.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .map((s) => {
        const displayXp =
          selectedLab === 'all' ? s.totalXp : s.labXp[selectedLab] || 0;
        return {
          ...s,
          displayXp,
          skillInfo: calculateSkillLevelFromXp(
            selectedLab === 'all' ? Math.round(s.totalXp / 3.5) : displayXp
          ),
        };
      })
      .sort((a, b) => b.displayXp - a.displayXp);
  }, [allStudents, selectedLab, selectedUniversity, selectedMajor, searchQuery]);

  const activeFiltersCount =
    (selectedLab !== 'all' ? 1 : 0) +
    (selectedUniversity !== 'all' ? 1 : 0) +
    (selectedMajor !== 'all' ? 1 : 0);

  const topThree = rankedStudents.slice(0, 3);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'الرئيسية', path: '/' },
    { name: 'جدول المتصدرين', path: '/leaderboard' },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Editorial Header */}
      <header className="mb-8 flex flex-col justify-between gap-4 border-b border-[#E3E8F0] pb-6 sm:mb-10 sm:flex-row sm:items-end sm:pb-8 dark:border-[#1E325C]">
        <div>
          <span className="font-tabular text-xs font-medium tracking-widest text-[#2F6BFF] uppercase">
            VERIFIED PERFORMANCE INDEX
          </span>
          <h1
            className="mt-2 font-medium tracking-tight text-[#0A1630] dark:text-[#FAFBFC]"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.15 }}
          >
            المتصدرون حسب الخبرة العملية.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#526077] sm:text-base dark:text-[#94A3B8]">
            ترتيب مباشر بناءً على نقاط الخبرة الموثقة في المختبرات الأربعة.
          </p>
        </div>

        <Link href="/labs" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <span>انتقل إلى المختبرات</span>
            <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
          </Button>
        </Link>
      </header>

      {/* Mobile Compact Filter Row (< md) + Full Vaul Filter Bottom Sheet */}
      <div className="mb-6 flex items-center gap-2 md:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077] dark:text-[#94A3B8]" />
          <Input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الجامعة..."
            className="pr-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setFilterSheetOpen(true)}
          className="min-h-[46px] shrink-0 gap-2 px-3.5"
        >
          <SlidersHorizontal className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
          <span>تصفية</span>
          {activeFiltersCount > 0 && (
            <span className="font-tabular flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2F6BFF] px-1 text-[11px] font-semibold text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop & Tablet Filter Bar (>= md) */}
      <div className="mb-8 hidden rounded-[16px] border border-[#E3E8F0] bg-white p-4 md:block dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
          <button
            type="button"
            onClick={() => setSelectedLab('all')}
            className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-colors ${
              selectedLab === 'all'
                ? 'bg-[#2F6BFF] text-[#FAFBFC]'
                : 'text-[#526077] hover:bg-[#F1F4F9] dark:text-[#94A3B8] dark:hover:bg-[#070D1F]'
            }`}
          >
            الترتيب العام (الكل)
          </button>
          {LABS_METADATA.map((lab) => (
            <button
              key={lab.id}
              type="button"
              onClick={() => setSelectedLab(lab.id)}
              className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedLab === lab.id
                  ? 'bg-[#2F6BFF] text-[#FAFBFC]'
                  : 'text-[#526077] hover:bg-[#F1F4F9] dark:text-[#94A3B8] dark:hover:bg-[#070D1F]'
              }`}
            >
              {lab.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077] dark:text-[#94A3B8]" />
            <Input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الجامعة..."
              className="pr-10"
            />
          </div>

          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            aria-label="تصفية حسب الجامعة"
            className="min-h-[46px] rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3.5 text-xs font-medium text-[#0A1630] focus:border-[#2F6BFF] focus:outline-none dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
          >
            <option value="all">جميع الجامعات ({UNIVERSITIES.length})</option>
            {UNIVERSITIES.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>

          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            aria-label="تصفية حسب التخصص"
            className="min-h-[46px] rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3.5 text-xs font-medium text-[#0A1630] focus:border-[#2F6BFF] focus:outline-none dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
          >
            <option value="all">جميع التخصصات ({MAJORS.length})</option>
            {MAJORS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vaul Filter Sheet for Mobile */}
      <BottomSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        title="تصفية المتصدرين"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              المختبر
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedLab('all')}
                className={`min-h-[44px] rounded-[10px] border px-3 text-xs font-medium ${
                  selectedLab === 'all'
                    ? 'border-[#2F6BFF] bg-[#2F6BFF] text-white'
                    : 'border-[#E3E8F0] bg-[#FAFBFC] text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]'
                }`}
              >
                الكل
              </button>
              {LABS_METADATA.map((lab) => (
                <button
                  key={lab.id}
                  type="button"
                  onClick={() => setSelectedLab(lab.id)}
                  className={`min-h-[44px] rounded-[10px] border px-3 text-xs font-medium ${
                    selectedLab === lab.id
                      ? 'border-[#2F6BFF] bg-[#2F6BFF] text-white'
                      : 'border-[#E3E8F0] bg-[#FAFBFC] text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]'
                  }`}
                >
                  {lab.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              الجامعة
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="min-h-[46px] w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3.5 text-base font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
            >
              <option value="all">جميع الجامعات</option>
              {UNIVERSITIES.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              التخصص
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="min-h-[46px] w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3.5 text-base font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
            >
              <option value="all">جميع التخصصات</option>
              {MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedLab('all');
                setSelectedUniversity('all');
                setSelectedMajor('all');
                setSearchQuery('');
              }}
            >
              إعادة ضبط
            </Button>
            <Button type="button" onClick={() => setFilterSheetOpen(false)}>
              عرض ({rankedStudents.length})
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Top 3 Highlight Cards */}
      {topThree.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {topThree.map((student, idx) => (
            <div
              key={student.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div
                className={`absolute inset-x-0 top-0 ${
                  idx === 0 ? 'h-[3px] bg-[#2F6BFF]' : 'h-[1.5px] bg-[#2F6BFF]/55'
                }`}
              />

              <div>
                <div className="flex items-baseline justify-between border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
                  <span className="font-tabular text-3xl font-normal tracking-tight text-[#2F6BFF] sm:text-4xl">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    {student.streakDays} يوم متواصل
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#0A1630] text-sm font-semibold text-[#FAFBFC] dark:bg-[#2F6BFF]">
                    {student.initials}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                      {student.fullName}
                    </h2>
                    <p className="truncate text-xs text-[#526077] dark:text-[#94A3B8]">
                      {student.major} · {student.university}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <div>
                  <span className="block text-[11px] text-[#526077] dark:text-[#94A3B8]">
                    {selectedLab === 'all' ? 'إجمالي الخبرة' : 'نقاط المختبر'}
                  </span>
                  <span className="font-tabular text-lg font-semibold text-[#0A1630] sm:text-xl dark:text-[#FAFBFC]">
                    {student.displayXp.toLocaleString('en-US')} XP
                  </span>
                </div>
                <Link href={`/students/${student.username}`}>
                  <Button variant="outline" size="sm">
                    <span>البروفايل</span>
                    <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile App Cards (< md) */}
      <div className="space-y-3 md:hidden">
        {rankedStudents.map((student, index) => (
          <Link
            key={student.id}
            href={`/students/${student.username}`}
            className="block rounded-[16px] border border-[#E3E8F0] bg-white p-4 transition-transform active:scale-[0.98] dark:border-[#1E325C] dark:bg-[#0A1630]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
              <div className="flex min-w-0 items-center gap-3">
                <span className="font-tabular shrink-0 text-xl font-normal text-[#2F6BFF]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E3E8F0] bg-[#F1F4F9] text-xs font-semibold text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]">
                  {student.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {student.fullName}
                  </p>
                  <p className="truncate text-xs text-[#526077] dark:text-[#94A3B8]">
                    {student.major} · {student.university}
                  </p>
                </div>
              </div>
              <span className="font-tabular shrink-0 text-sm font-semibold text-[#2F6BFF]">
                {student.displayXp.toLocaleString('en-US')} XP
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <Badge
                variant={
                  student.skillInfo.level === 'خبير' ||
                  student.skillInfo.level === 'متقدم'
                    ? 'default'
                    : 'secondary'
                }
              >
                {student.skillInfo.level} · {student.skillInfo.score}%
              </Badge>
              <span className="font-tabular text-[#526077] dark:text-[#94A3B8]">
                {student.earnedBadges.length}/5 أوسمة · {student.streakDays} يوم
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet & Desktop Leaderboard Table (>= md) */}
      <div className="hidden overflow-hidden rounded-[16px] border border-[#E3E8F0] bg-white md:block dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-[#E3E8F0] bg-[#FAFBFC] text-xs font-medium text-[#526077] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#94A3B8]">
              <tr>
                <th className="px-5 py-3.5">الترتيب</th>
                <th className="px-5 py-3.5">الطالب</th>
                <th className="px-5 py-3.5">الجامعة والتخصص</th>
                <th className="px-5 py-3.5">المستوى</th>
                <th className="px-5 py-3.5">الأوسمة</th>
                <th className="px-5 py-3.5">الاستمرارية</th>
                <th className="px-5 py-3.5">الخبرة (XP)</th>
                <th className="px-5 py-3.5 text-left">الملف المهني</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
              {rankedStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-[#F1F4F9]/60 dark:hover:bg-[#070D1F]/60"
                >
                  <td className="px-5 py-4 font-tabular text-base font-normal text-[#526077] dark:text-[#94A3B8]">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#E3E8F0] bg-[#F1F4F9] text-xs font-semibold text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]">
                        {student.initials}
                      </div>
                      <div>
                        <Link
                          href={`/students/${student.username}`}
                          className="font-medium text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
                        >
                          {student.fullName}
                        </Link>
                        <span className="block text-xs text-[#526077] dark:text-[#94A3B8]">
                          {student.city}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      {student.major}
                    </p>
                    <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                      {student.university}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        student.skillInfo.level === 'خبير' ||
                        student.skillInfo.level === 'متقدم'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {student.skillInfo.level} · {student.skillInfo.score}%
                    </Badge>
                  </td>

                  <td className="px-5 py-4 font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
                    {student.earnedBadges.length} / 5
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 font-tabular text-xs text-[#0A1630]/80 dark:text-[#94A3B8]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                      {student.streakDays} يوم
                    </span>
                  </td>

                  <td className="px-5 py-4 font-tabular text-sm font-semibold text-[#2F6BFF]">
                    {student.displayXp.toLocaleString('en-US')} XP
                  </td>

                  <td className="px-5 py-4 text-left">
                    <Link href={`/students/${student.username}`}>
                      <Button variant="ghost" size="sm" className="text-[#2F6BFF]">
                        <span>استعراض</span>
                        <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
