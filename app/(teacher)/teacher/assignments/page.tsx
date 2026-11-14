'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpLeft,
  BookOpen,
  CalendarClock,
  FlaskConical,
  Plus,
} from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { LabAssignment, LabId } from '@/types';
import {
  ChartCard,
  DataTable,
  DataTableColumn,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

const LAB_LABELS: Record<LabId, string> = {
  accounting: 'مختبر المحاسبة المالية',
  marketing: 'مختبر التسويق الرقمي',
  management: 'مختبر إدارة الأعمال',
  python: 'مختبر البرمجة (Python)',
};

export default function TeacherAssignmentsListPage() {
  const { assignments, submissions, classes } = useTeacherStore();
  const [labFilter, setLabFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = assignments.filter((a) => {
    if (labFilter !== 'all' && a.labId !== labFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const columns: DataTableColumn<LabAssignment>[] = [
    {
      key: 'title',
      header: 'عنوان الواجب العملي',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => {
        const cls = classes.find((c) => c.id === r.targetClassId);
        return (
          <div>
            <Link
              href={`/teacher/assignments/${r.id}`}
              className="font-semibold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
            >
              {r.title}
            </Link>
            <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
              {cls?.courseName || 'شعبة دراسية'}
            </p>
          </div>
        );
      },
    },
    {
      key: 'labId',
      header: 'المختبر التفاعلي',
      sortable: true,
      sortValue: (r) => r.labId,
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
          <FlaskConical className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
          {LAB_LABELS[r.labId]}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'موعد التسليم',
      sortable: true,
      sortValue: (r) => r.dueDate,
      render: (r) => (
        <span className="inline-flex items-center gap-1 font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
          <CalendarClock className="h-3.5 w-3.5 stroke-[1.5]" />
          {r.dueDate}
        </span>
      ),
    },
    {
      key: 'submissionsCount',
      header: 'التسليمات',
      render: (r) => {
        const subCount = submissions.filter((s) => s.assignmentId === r.id).length;
        const cls = classes.find((c) => c.id === r.targetClassId);
        const total = cls ? cls.studentUsernames.length : 4;
        return (
          <span className="font-tabular text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            {subCount} / {total} طالب
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (r) => (
        <span
          className={`inline-flex rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${
            r.status === 'منشور'
              ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
              : 'bg-[#E3E8F0] text-[#526077] dark:bg-[#1E325C] dark:text-[#94A3B8]'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'إجراءات',
      render: (r) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/teacher/assignments/${r.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6BFF] hover:underline"
          >
            <span>التسليمات والتصحيح</span>
            <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
          </Link>
          <Link
            href={`/labs/${r.labId}?assignmentId=${r.id}`}
            className="text-xs text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8] dark:hover:text-white"
          >
            معاينة كطالب
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الواجبات العملية والتسليمات"
        description="أدر جميع المهام العملية المرتبطة بالمختبرات الأربعة وراجع تقارير التصحيح التلقائي."
        actions={
          <>
            <Link href="/teacher/templates">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <BookOpen className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>الاستيراد من القوالب</span>
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

      <ChartCard
        title="قائمة الواجبات العملية"
        subtitle="يمكنك تصفية الواجبات حسب المختبر أو حالة النشر، والانتقال مباشرة لفحص خطوات حل كل طالب."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={labFilter}
              onChange={(e) => setLabFilter(e.target.value)}
              className="h-8 rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-2.5 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
            >
              <option value="all">جميع المختبرات</option>
              <option value="accounting">مختبر المحاسبة</option>
              <option value="marketing">مختبر التسويق</option>
              <option value="management">مختبر الإدارة</option>
              <option value="python">مختبر Python</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-2.5 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
            >
              <option value="all">جميع الحالات</option>
              <option value="منشور">منشور</option>
              <option value="مسودة">مسودة</option>
            </select>
          </div>
        }
      >
        <DataTable
          data={filtered}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="ابحث بعنوان الواجب..."
          searchMatcher={(r, q) => r.title.toLowerCase().includes(q)}
          pageSize={8}
        />
      </ChartCard>
    </div>
  );
}
