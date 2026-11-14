'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowUpDown,
  ArrowUpLeft,
  Bookmark,
  BookmarkCheck,
  Filter,
  Mail,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { triggerHaptic } from '@/lib/haptics';
import { UNIVERSITIES, MAJORS } from '@/data/mock-data';
import {
  calculateOverallCompetency,
  generateRadarChartAxes,
} from '@/lib/labs/skill-calculator';
import { LabId, StudentTalent } from '@/types';
import { RadarChart } from '@/components/shared/radar-chart';
import { EmptyState, PageHeader } from '@/components/dashboard/ui-kit';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CompanyTalentSearchPage() {
  const { allStudents, sendCompanyMessage } = useAppStore();
  const {
    shortlistFolders,
    shortlistCandidates,
    addCandidateToShortlist,
    removeCandidateFromShortlist,
    savedSearches,
    saveTalentSearch,
    deleteSavedSearch,
    companyProfile,
    completeChecklistStep,
  } = useCompanyDashboardStore();

  const isMobile = useIsMobile();

  const [query, setQuery] = useState('');
  const [labFilter, setLabFilter] = useState<'all' | LabId>('all');
  const [minLevel, setMinLevel] = useState<string>('all');
  const [minXp, setMinXp] = useState<number>(0);
  const [universityFilter, setUniversityFilter] = useState<string>('all');
  const [majorFilter, setMajorFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<'total' | LabId>('total');

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const [saveSearchName, setSaveSearchName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    shortlistFolders[0]?.id || 'folder-fintech'
  );

  const [contactTarget, setContactTarget] = useState<StudentTalent | null>(null);
  const [msgSubject, setMsgSubject] = useState(
    'دعوة لمقابلة عمل — فريق التقنية المالية والبرمجيات'
  );
  const [msgRoleType, setMsgRoleType] = useState(
    'وظيفة دوام كامل لحديثي التخرج'
  );
  const [msgBody, setMsgBody] = useState(
    'مرحباً، اطلعنا على نتائجك الموثقة في مختبرات تدريبك ونود دعوتك لمقابلة تقنية قصيرة هذا الأسبوع.'
  );

  const filteredStudents = useMemo(() => {
    const publicPool = allStudents.filter((s) => s.isPublicToCompanies);

    const filtered = publicPool.filter((student) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        student.fullName.toLowerCase().includes(q) ||
        student.university.toLowerCase().includes(q) ||
        student.major.toLowerCase().includes(q) ||
        student.city.toLowerCase().includes(q);

      const overall = calculateOverallCompetency(student.labXp);
      const levelRank: Record<string, number> = {
        مبتدئ: 1,
        متوسط: 2,
        متقدم: 3,
        خبير: 4,
      };
      const matchesLevel =
        minLevel === 'all' ||
        levelRank[overall.overallLevel] >= (levelRank[minLevel] || 1);

      const matchesXp = student.totalXp >= minXp;
      const matchesUni =
        universityFilter === 'all' || student.university === universityFilter;
      const matchesMajor =
        majorFilter === 'all' || student.major === majorFilter;
      const matchesCity =
        cityFilter === 'all' || student.city === cityFilter;
      const matchesLab =
        labFilter === 'all' || (student.labXp[labFilter] || 0) >= 300;

      return (
        matchesQ &&
        matchesLevel &&
        matchesXp &&
        matchesUni &&
        matchesMajor &&
        matchesCity &&
        matchesLab
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortColumn === 'total') return b.totalXp - a.totalXp;
      return (b.labXp[sortColumn] || 0) - (a.labXp[sortColumn] || 0);
    });
  }, [
    allStudents,
    query,
    minLevel,
    minXp,
    universityFilter,
    majorFilter,
    cityFilter,
    labFilter,
    sortColumn,
  ]);

  const [selectedUsername, setSelectedUsername] = useState<string>(
    allStudents[0]?.username || 'yazan-nabulsi'
  );

  const previewStudent = useMemo(() => {
    return (
      filteredStudents.find((s) => s.username === selectedUsername) ||
      filteredStudents[0] ||
      null
    );
  }, [filteredStudents, selectedUsername]);

  const resetAllFilters = () => {
    setQuery('');
    setLabFilter('all');
    setMinLevel('all');
    setMinXp(0);
    setUniversityFilter('all');
    setMajorFilter('all');
    setCityFilter('all');
  };

  const activeFiltersCount =
    (labFilter !== 'all' ? 1 : 0) +
    (minLevel !== 'all' ? 1 : 0) +
    (minXp > 0 ? 1 : 0) +
    (universityFilter !== 'all' ? 1 : 0) +
    (majorFilter !== 'all' ? 1 : 0) +
    (cityFilter !== 'all' ? 1 : 0);

  const handleSaveCurrentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const title =
      saveSearchName.trim() ||
      `بحث مخصص (${labFilter === 'all' ? 'عام' : labFilter})`;
    saveTalentSearch({
      name: title,
      labFilter,
      minLevel,
      minXp,
      university: universityFilter,
      city: cityFilter,
    });
    completeChecklistStep('c-step-search');
    setSaveSearchName('');
    triggerHaptic('success');
    toast.success(`تم حفظ عملية البحث "${title}"`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTarget) return;
    sendCompanyMessage({
      companyName: companyProfile.companyName,
      companyInitials: 'تم',
      companyGradient: 'from-[#0A1630] to-[#2F6BFF]',
      senderRole: 'فريق استقطاب المواهب',
      studentUsername: contactTarget.username,
      studentName: contactTarget.fullName,
      subject: msgSubject,
      offeredRoleType: msgRoleType,
      message: msgBody,
    });
    completeChecklistStep('c-step-msg');
    triggerHaptic('success');
    toast.success(`تم إرسال دعوة المقابلة إلى ${contactTarget.fullName}`);
    setContactTarget(null);
  };

  const isShortlisted = (username: string) =>
    shortlistCandidates.some((c) => c.username === username);

  const filtersForm = (
    <div className="space-y-4 text-xs">
      <div>
        <label className="mb-1.5 block font-medium">بحث بالاسم</label>
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077]" />
          <Input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اسم المرشح..."
            className="pr-9"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-medium">المختبر الأساسي</label>
        <select
          value={labFilter}
          onChange={(e) => setLabFilter(e.target.value as 'all' | LabId)}
          className="min-h-[44px] w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-base sm:text-xs dark:border-[#1E325C] dark:bg-[#070D1F]"
        >
          <option value="all">جميع المختبرات</option>
          <option value="python">مختبر البرمجة (Python &gt;= 300 XP)</option>
          <option value="accounting">مختبر المحاسبة (&gt;= 300 XP)</option>
          <option value="management">مختبر الإدارة (&gt;= 300 XP)</option>
          <option value="marketing">مختبر التسويق (&gt;= 300 XP)</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block font-medium">الحد الأدنى للمستوى</label>
        <select
          value={minLevel}
          onChange={(e) => setMinLevel(e.target.value)}
          className="min-h-[44px] w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-base sm:text-xs dark:border-[#1E325C] dark:bg-[#070D1F]"
        >
          <option value="all">جميع المستويات</option>
          <option value="خبير">خبير فقط</option>
          <option value="متقدم">متقدم فأعلى</option>
          <option value="متوسط">متوسط فأعلى</option>
        </select>
      </div>

      <div>
        <div className="mb-2 flex justify-between font-medium">
          <span>الحد الأدنى للنقاط</span>
          <span className="font-tabular text-[#2F6BFF]">{minXp} XP</span>
        </div>
        <input
          type="range"
          min={0}
          max={1600}
          step={100}
          value={minXp}
          onChange={(e) => setMinXp(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-medium">الجامعة</label>
        <select
          value={universityFilter}
          onChange={(e) => setUniversityFilter(e.target.value)}
          className="min-h-[44px] w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-base sm:text-xs dark:border-[#1E325C] dark:bg-[#070D1F]"
        >
          <option value="all">جميع الجامعات</option>
          {UNIVERSITIES.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block font-medium">التخصص الجامعي</label>
        <select
          value={majorFilter}
          onChange={(e) => setMajorFilter(e.target.value)}
          className="min-h-[44px] w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-base sm:text-xs dark:border-[#1E325C] dark:bg-[#070D1F]"
        >
          <option value="all">جميع التخصصات</option>
          {MAJORS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block font-medium">المدينة</label>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="min-h-[44px] w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-base sm:text-xs dark:border-[#1E325C] dark:bg-[#070D1F]"
        >
          <option value="all">جميع المدن</option>
          <option value="عمّان">عمّان</option>
          <option value="إربد">إربد</option>
          <option value="الزرقاء">الزرقاء</option>
          <option value="الرياض">الرياض</option>
          <option value="القاهرة">القاهرة</option>
        </select>
      </div>
    </div>
  );

  const renderPreviewPanel = (student: StudentTalent) => (
    <div>
      <div className="flex items-start justify-between gap-3 border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#0A1630] text-sm font-semibold text-white dark:bg-[#2F6BFF]">
            {student.initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              {student.fullName}
            </h2>
            <p className="truncate text-xs text-[#526077] dark:text-[#94A3B8]">
              {student.major} · {student.university}
            </p>
          </div>
        </div>
        <span className="shrink-0 font-tabular text-xs font-semibold text-[#2F6BFF]">
          {calculateOverallCompetency(student.labXp).overallLevel}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
        {student.bio}
      </p>

      <div className="my-4 flex justify-center rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] py-3 dark:border-[#1E325C] dark:bg-[#070D1F]">
        <RadarChart axes={generateRadarChartAxes(student.labXp)} size={200} />
      </div>

      <div className="mb-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 dark:border-[#1E325C] dark:bg-[#070D1F]">
        <label className="mb-1.5 block text-[11px] font-medium text-[#526077]">
          اختر القائمة المختصرة للإضافة:
        </label>
        <div className="flex items-center gap-2">
          <select
            value={selectedFolderId}
            onChange={(e) => setSelectedFolderId(e.target.value)}
            className="min-h-[40px] flex-1 rounded-[10px] border border-[#E3E8F0] bg-white px-2.5 text-base sm:text-xs dark:border-[#1E325C] dark:bg-[#0A1630]"
          >
            {shortlistFolders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {isShortlisted(student.username) ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                removeCandidateFromShortlist(student.username);
                toast.info('تمت إزالة المرشح من القائمة المختصرة');
              }}
              className="gap-1 text-xs text-[#2F6BFF]"
            >
              <BookmarkCheck className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>مضاف</span>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                addCandidateToShortlist(student.username, selectedFolderId);
                triggerHaptic('success');
                toast.success(`تمت إضافة ${student.fullName} إلى القائمة المختصرة`);
              }}
              className="gap-1 text-xs"
            >
              <Bookmark className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>أضف</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setMobilePreviewOpen(false);
            setContactTarget(student);
          }}
          className="min-h-[44px] flex-1 gap-1.5 text-xs"
        >
          <Mail className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>تواصل مباشر</span>
        </Button>
        <Link href={`/students/${student.username}`}>
          <Button variant="secondary" size="sm" className="min-h-[44px] gap-1 text-xs">
            <span>الملف الكامل</span>
            <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="البحث عن المواهب والفرز بالمهارات"
        description="تصفية المرشحين بحسب نقاط الخبرة الفعلية في المختبرات والجامعة والمدينة."
      />

      {/* Saved Searches Bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#E3E8F0] bg-white p-4 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            عمليات البحث المحفوظة:
          </span>
          {savedSearches.map((sv) => (
            <div
              key={sv.id}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-2.5 py-1 text-xs dark:border-[#1E325C] dark:bg-[#070D1F]"
            >
              <button
                type="button"
                onClick={() => {
                  setLabFilter(sv.labFilter);
                  setMinLevel(sv.minLevel);
                  setMinXp(sv.minXp);
                  setUniversityFilter(sv.university);
                  setCityFilter(sv.city);
                  toast.info(`تم تطبيق فلتر: ${sv.name}`);
                }}
                className="font-medium text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
              >
                {sv.name}
              </button>
              <button
                type="button"
                onClick={() => deleteSavedSearch(sv.id)}
                aria-label={`حذف البحث المحفوظ ${sv.name}`}
                className="p-1 text-[#526077] hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSaveCurrentSearch}
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Input
            value={saveSearchName}
            onChange={(e) => setSaveSearchName(e.target.value)}
            placeholder="اسم الفلتر..."
            className="min-h-[42px] flex-1 sm:w-44 text-xs"
          />
          <Button type="submit" variant="secondary" size="sm" className="min-h-[42px] shrink-0 gap-1 text-xs">
            <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>حفظ البحث</span>
          </Button>
        </form>
      </div>

      {/* Mobile Compact Search + Filter Trigger (< lg) */}
      <div className="mb-4 flex items-center gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-[#526077]" />
          <Input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          <span>فلاتر</span>
          {activeFiltersCount > 0 && (
            <span className="font-tabular flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2F6BFF] px-1 text-[11px] font-semibold text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Main 12-Col Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden rounded-[16px] border border-[#E3E8F0] bg-white p-5 lg:block lg:col-span-3 dark:border-[#1E325C] dark:bg-[#0A1630]">
          <div className="mb-4 flex items-center justify-between border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              <Filter className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
              <span>فلاتر الفرز الدقيقة</span>
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-medium text-[#2F6BFF] hover:underline"
            >
              إعادة ضبط
            </button>
          </div>
          {filtersForm}
        </aside>

        {/* Center Column */}
        <div className="lg:col-span-5">
          {filteredStudents.length === 0 ? (
            <EmptyState
              title="لا يوجد مرشحون يطابقون هذه المعايير"
              description="جرب تقليل الحد الأدنى لنقاط الخبرة أو اختيار جميع الجامعات."
            />
          ) : (
            <>
              {/* Mobile/Tablet Candidate Cards (< md) */}
              <div className="space-y-2.5 md:hidden">
                {filteredStudents.map((student) => {
                  const isSelected =
                    previewStudent?.username === student.username;
                  return (
                    <button
                      key={student.username}
                      type="button"
                      onClick={() => {
                        setSelectedUsername(student.username);
                        if (isMobile) setMobilePreviewOpen(true);
                      }}
                      className={`w-full rounded-[16px] border p-4 text-right transition-transform active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#2F6BFF] bg-[#2F6BFF]/5 dark:bg-[#2F6BFF]/10'
                          : 'border-[#E3E8F0] bg-white dark:border-[#1E325C] dark:bg-[#0A1630]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#0A1630] text-xs font-semibold text-white dark:bg-[#2F6BFF]">
                            {student.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                              {student.fullName}
                            </p>
                            <p className="truncate text-xs text-[#526077] dark:text-[#94A3B8]">
                              {student.university} · {student.city}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 font-tabular text-xs font-bold text-[#2F6BFF]">
                          {student.totalXp} XP
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 rounded-[10px] bg-[#FAFBFC] p-2.5 font-tabular text-[11px] dark:bg-[#070D1F]">
                        <div>
                          <span className="text-[#526077] dark:text-[#94A3B8]">محاسبة: </span>
                          <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                            {student.labXp.accounting} XP
                          </span>
                        </div>
                        <div>
                          <span className="text-[#526077] dark:text-[#94A3B8]">Python: </span>
                          <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                            {student.labXp.python} XP
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tablet & Desktop Table (>= md) */}
              <div className="hidden overflow-x-auto rounded-[16px] border border-[#E3E8F0] bg-white md:block dark:border-[#1E325C] dark:bg-[#0A1630]">
                <table className="w-full border-collapse text-right text-xs">
                  <thead>
                    <tr className="border-b border-[#E3E8F0] bg-[#FAFBFC] text-[#526077] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#94A3B8]">
                      <th className="px-3.5 py-3 font-medium">المرشح</th>
                      <th className="px-2.5 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() => setSortColumn('accounting')}
                          className="inline-flex items-center gap-1 hover:text-[#2F6BFF]"
                        >
                          <span>محاسبة</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-2.5 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() => setSortColumn('python')}
                          className="inline-flex items-center gap-1 hover:text-[#2F6BFF]"
                        >
                          <span>Python</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-3 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() => setSortColumn('total')}
                          className="inline-flex items-center gap-1 hover:text-[#2F6BFF]"
                        >
                          <span>الإجمالي</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
                    {filteredStudents.map((student) => {
                      const isSelected =
                        previewStudent?.username === student.username;
                      return (
                        <tr
                          key={student.username}
                          onClick={() => setSelectedUsername(student.username)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#2F6BFF]/8 dark:bg-[#2F6BFF]/15'
                              : 'hover:bg-[#F1F4F9] dark:hover:bg-[#070D1F]/60'
                          }`}
                        >
                          <td className="px-3.5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#0A1630] text-[11px] font-semibold text-white dark:bg-[#2F6BFF]">
                                {student.initials}
                              </div>
                              <div>
                                <p className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                                  {student.fullName}
                                </p>
                                <p className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                                  {student.university} · {student.city}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2.5 py-3 font-tabular">
                            {student.labXp.accounting}
                          </td>
                          <td className="px-2.5 py-3 font-tabular">
                            {student.labXp.python}
                          </td>
                          <td className="px-3 py-3 font-tabular font-semibold text-[#2F6BFF]">
                            {student.totalXp} XP
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Desktop & Tablet Side Preview Panel */}
        <aside className="hidden rounded-[16px] border border-[#E3E8F0] bg-white p-5 md:block lg:sticky lg:top-20 lg:col-span-4 dark:border-[#1E325C] dark:bg-[#0A1630]">
          {previewStudent ? (
            renderPreviewPanel(previewStudent)
          ) : (
            <p className="py-12 text-center text-xs text-[#526077]">
              اختر مرشحاً من الجدول لمعاينة ملفه الموثق.
            </p>
          )}
        </aside>
      </div>

      {/* Vaul Filter Sheet (< lg) */}
      <BottomSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        title="فلاتر فرز المواهب"
      >
        <div className="space-y-4">
          {filtersForm}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={resetAllFilters}>
              إعادة ضبط
            </Button>
            <Button type="button" onClick={() => setFilterSheetOpen(false)}>
              عرض ({filteredStudents.length})
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Vaul Candidate Quick Preview Sheet (< md) */}
      <BottomSheet
        open={mobilePreviewOpen && Boolean(previewStudent)}
        onOpenChange={setMobilePreviewOpen}
        title={previewStudent?.fullName || 'معاينة المرشح'}
      >
        {previewStudent && renderPreviewPanel(previewStudent)}
      </BottomSheet>

      {/* Contact Candidate Dialog (Automatically Vaul BottomSheet on Mobile, Modal on Desktop) */}
      <Dialog
        open={Boolean(contactTarget)}
        onOpenChange={(open) => {
          if (!open) setContactTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إرسال دعوة إلى {contactTarget?.fullName}</DialogTitle>
            <DialogDescription>
              ستصل الرسالة مباشرة إلى صندوق وارد الطالب.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendMessage} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-medium">نوع الفرصة</label>
              <Input
                value={msgRoleType}
                onChange={(e) => setMsgRoleType(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">عنوان الرسالة</label>
              <Input
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">نص الدعوة</label>
              <textarea
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                rows={4}
                className="w-full rounded-[10px] border border-[#E3E8F0] bg-white p-3 text-base sm:text-xs outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#070D1F]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setContactTarget(null)}
              >
                إلغاء
              </Button>
              <Button type="submit" className="gap-1.5">
                <Send className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>إرسال الدعوة</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
