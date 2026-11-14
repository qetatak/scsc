'use client';

import React from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  ArrowUpLeft,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Plus,
  Users,
} from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import {
  ChartCard,
  ChecklistCard,
  DashboardStatCard,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

const WEEKLY_SUBMISSIONS_CHART = [
  { day: 'السبت', submitted: 14, late: 2 },
  { day: 'الأحد', submitted: 22, late: 3 },
  { day: 'الإثنين', submitted: 19, late: 1 },
  { day: 'الثلاثاء', submitted: 28, late: 4 },
  { day: 'الأربعاء', submitted: 31, late: 2 },
  { day: 'الخميس', submitted: 36, late: 3 },
  { day: 'الجمعة', submitted: 18, late: 1 },
];

export default function TeacherOverviewPage() {
  const {
    checklist,
    toggleChecklistStep,
    classes,
    assignments,
    submissions,
  } = useTeacherStore();

  const totalStudents = classes.reduce(
    (sum, c) => sum + c.studentUsernames.length,
    0
  );
  const activeAssignments = assignments.filter((a) => a.status === 'منشور');

  const completedSubs = submissions.filter(
    (s) =>
      s.status === 'مُصحَّح آلياً' ||
      s.status === 'تمت المراجعة' ||
      s.status === 'متأخر'
  );

  const completionPct =
    activeAssignments.length > 0 && totalStudents > 0
      ? Math.min(
          100,
          Math.round(
            (completedSubs.length / Math.max(1, activeAssignments.length * 2)) *
              100
          )
        )
      : 84;

  const avgScore =
    completedSubs.length > 0
      ? Math.round(
          completedSubs.reduce(
            (acc, s) =>
              acc + (s.manualScoreOverride ?? s.autoGrade?.autoScore ?? 0),
            0
          ) / completedSubs.length
        )
      : 85;

  const needsReviewQueue = submissions.filter(
    (s) =>
      s.status === 'مُصحَّح آلياً' ||
      (s.autoGrade && s.autoGrade.percentage < 75)
  );

  return (
    <div>
      <PageHeader
        title="مرحباً، د. أحمد خليل العساف"
        description="قسم المحاسبة ونظم معلومات الأعمال — الجامعة الأردنية. تابع إنجاز طلابك في المختبرات العملية وراجع تسليمات الواجبات التفاعلية."
        actions={
          <>
            <Link href="/teacher/templates">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <BookOpen className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>مكتبة القوالب (40 قالب)</span>
              </Button>
            </Link>
            <Link href="/teacher/assignments/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>إنشاء واجب عملي جديد</span>
              </Button>
            </Link>
          </>
        }
      />

      <ChecklistCard
        title="إعداد حساب المعلم والشُعب الدراسية"
        subtitle="اتبع الخطوات الأربع لإطلاق أول واجب عملي تفاعلي لطلاب مساقك الجامعي."
        items={checklist}
        onToggleStep={toggleChecklistStep}
      />

      <section aria-label="مؤشرات الأداء الأكاديمي" className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            ملخص الفصل الدراسي الحالي
          </h2>
          <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
            مقارنة بالشهر السابق
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            label="إجمالي الطلاب في الشُعب"
            value={totalStudents}
            changeText="+14.2% عن الشهر السابق"
            subtitle={`موزعين على ${classes.length} شُعب دراسية`}
            icon={Users}
          />
          <DashboardStatCard
            label="الواجبات العملية النشطة"
            value={activeAssignments.length}
            changeText="+25.0% عن الشهر السابق"
            subtitle="في 4 مختبرات محاكاة"
            icon={ClipboardList}
          />
          <DashboardStatCard
            label="متوسط نسبة التسليم"
            value={`${completionPct}%`}
            changeText="+9.5% عن الشهر السابق"
            subtitle="تسليمات موثقة بتصحيح فوري"
            icon={CheckCircle2}
          />
          <DashboardStatCard
            label="متوسط درجات الطلاب"
            value={`${avgScore}/100`}
            changeText="+6.4% عن الشهر السابق"
            subtitle="بناءً على محرك التقييم التلقائي"
            icon={BookOpen}
          />
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="تسليمات الواجبات الأسبوعية"
          subtitle="عدد التسليمات في الموعد مقابل التسليمات المتأخرة خلال الأسبوع"
          className="lg:col-span-7"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_SUBMISSIONS_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#526077' }}
                  axisLine={{ stroke: '#E3E8F0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#526077' }}
                  axisLine={{ stroke: '#E3E8F0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1630',
                    border: '1px solid #1E325C',
                    borderRadius: '10px',
                    color: '#FAFBFC',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="submitted"
                  name="تسليم في الموعد"
                  fill="#2F6BFF"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="late"
                  name="تسليم متأخر"
                  fill="#94A3B8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="بحاجة لمراجعتك الأكاديمية"
          subtitle="تسليمات مصححة آلياً بانتظار اعتمادك أو توجيهك"
          className="lg:col-span-5"
          action={
            <Link
              href="/teacher/assignments"
              className="text-xs font-medium text-[#2F6BFF] hover:underline"
            >
              كل التسليمات
            </Link>
          }
        >
          <div className="space-y-3">
            {needsReviewQueue.slice(0, 4).map((sub) => (
              <div
                key={sub.id}
                className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {sub.studentName}
                  </span>
                  <span className="font-tabular rounded-[6px] border border-[#E3E8F0] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0F1E3E] dark:text-[#FAFBFC]">
                    الدرجة التلقائية: {sub.autoGrade?.autoScore ?? 0}/
                    {sub.autoGrade?.maxScore ?? 100}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                  {sub.assignmentTitle}
                </p>
                <div className="mt-2.5 flex items-center justify-between border-t border-[#E3E8F0] pt-2 text-[11px] dark:border-[#1E325C]">
                  <span className="font-tabular text-[#526077] dark:text-[#94A3B8]">
                    الوقت المستغرق: {sub.timeSpentMinutes} دقيقة
                  </span>
                  <Link
                    href={`/teacher/assignments/${sub.assignmentId}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#2F6BFF] hover:underline"
                  >
                    <span>فحص خطوات الحل</span>
                    <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="مواعيد التسليم القادمة"
        subtitle="الواجبات العملية المنشورة للشُعب الدراسية ومعدلات إنجازها حتى اللحظة"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {activeAssignments.map((assignment) => {
            const subCount = submissions.filter(
              (s) => s.assignmentId === assignment.id
            ).length;
            const cls = classes.find((c) => c.id === assignment.targetClassId);
            const totalInClass = cls ? cls.studentUsernames.length : 4;
            const pct =
              totalInClass > 0
                ? Math.min(100, Math.round((subCount / totalInClass) * 100))
                : 0;

            return (
              <div
                key={assignment.id}
                className="flex flex-col justify-between rounded-[14px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#2F6BFF]">
                      {cls?.courseName || 'مساق جامعي'}
                    </span>
                    <span className="font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      {subCount}/{totalInClass} طالب
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {assignment.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                    <CalendarClock className="h-3.5 w-3.5 stroke-[1.5]" />
                    <span className="font-tabular">
                      الموعد النهائي: {assignment.dueDate}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-[#526077] dark:text-[#94A3B8]">
                      نسبة التسليم
                    </span>
                    <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F4F9] dark:bg-[#0A1630]">
                    <div
                      className="h-full bg-[#2F6BFF]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link
                      href={`/teacher/assignments/${assignment.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6BFF] hover:underline"
                    >
                      <span>مراجعة التسليمات</span>
                      <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
