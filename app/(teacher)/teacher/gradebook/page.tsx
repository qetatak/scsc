'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { useAppStore } from '@/store/use-app-store';
import { PlatformService } from '@/services/platform-service';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TeacherGradebookPage() {
  const { classes, assignments, submissions } = useTeacherStore();
  const { allStudents: students } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  const { assignments: filteredAssignments, rows } =
    PlatformService.buildGradebookMatrix(
      classes,
      selectedClassId,
      assignments,
      submissions,
      students
    );

  const handleExportCsv = () => {
    const headers = [
      'اسم الطالب',
      'اسم المستخدم',
      'الجامعة',
      ...filteredAssignments.map((a) => a.title),
      'المعدل العام (%)',
    ];
    const csvRows = rows.map((r) => [
      r.fullName,
      r.username,
      r.university,
      ...filteredAssignments.map((a) =>
        r.scoresByAssignment[a.id] !== null &&
        r.scoresByAssignment[a.id] !== undefined
          ? String(r.scoresByAssignment[a.id])
          : 'لم يُسلَّم'
      ),
      String(r.average),
    ]);
    PlatformService.exportRowsToCsv(
      `tadreebak-gradebook-${selectedClassId}.csv`,
      headers,
      csvRows
    );
    toast.success('تم تصدير سجل الدرجات بصيغة CSV متوافقة مع أنظمة الجامعة');
  };

  return (
    <div>
      <PageHeader
        title="سجل الدرجات الأكاديمي (Gradebook)"
        description="جدول شامل يربط الطلاب بالواجبات العملية مع حساب المعدل التراكمي وتصدير مباشر بصيغة CSV."
        actions={
          <Button size="sm" onClick={handleExportCsv} className="gap-1.5">
            <Download className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>تصدير لملف CSV للجامعة</span>
          </Button>
        }
      />

      <ChartCard
        title="مصفوفة درجات الطلاب في الواجبات العملية"
        subtitle="انقر على أي درجة للانتقال مباشرة إلى مراجعة خطوات حل الطالب."
        action={
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <FileSpreadsheet className="h-4 w-4 shrink-0 stroke-[1.5] text-[#2F6BFF]" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="h-10 min-w-0 flex-1 max-w-full truncate rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-2.5 text-xs text-[#0A1630] sm:h-9 sm:w-auto dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
            >
              <option value="all">جميع الشُعب الدراسية</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseName} ({c.courseCode})
                </option>
              ))}
            </select>
          </div>
        }
      >
        {/* Mobile Student Gradebook Cards */}
        <div className="space-y-3 md:hidden">
          {rows.map((r) => (
            <div
              key={r.username}
              className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 space-y-3 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/students/${r.username}`}
                    className="text-sm font-semibold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
                  >
                    {r.fullName}
                  </Link>
                  <p className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                    {r.university} · <span className="font-mono">@{r.username}</span>
                  </p>
                </div>
                <span className="shrink-0 rounded-[8px] bg-[#2F6BFF]/10 px-2.5 py-1 font-tabular text-xs font-bold text-[#2F6BFF]">
                  المعدل: {r.average}%
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filteredAssignments.map((asg) => {
                  const val = r.scoresByAssignment[asg.id];
                  return (
                    <Link
                      key={asg.id}
                      href={`/teacher/assignments/${asg.id}`}
                      className="flex items-center justify-between gap-2 rounded-[8px] border border-[#E3E8F0] bg-white px-3 py-2 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]"
                    >
                      <span className="truncate text-[#526077] dark:text-[#94A3B8]">
                        {asg.title}
                      </span>
                      {val !== null && val !== undefined ? (
                        <span
                          className={`shrink-0 font-tabular font-semibold ${
                            val >= 85
                              ? 'text-[#2F6BFF]'
                              : val >= 70
                              ? 'text-[#0A1630] dark:text-[#FAFBFC]'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {val}%
                        </span>
                      ) : (
                        <span className="shrink-0 text-[11px] text-[#94A3B8]">
                          لم يُسلَّم
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-right text-xs">
            <thead>
              <tr className="border-b border-[#E3E8F0] bg-[#FAFBFC] text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#94A3B8]">
                <th className="p-3 font-semibold">الطالب</th>
                <th className="p-3 font-semibold">الجامعة</th>
                {filteredAssignments.map((asg) => (
                  <th key={asg.id} className="p-3 font-semibold">
                    <Link
                      href={`/teacher/assignments/${asg.id}`}
                      className="hover:text-[#2F6BFF]"
                    >
                      {asg.title}
                    </Link>
                    <div className="font-tabular text-[10px] font-normal text-[#526077] dark:text-[#94A3B8]">
                      من {asg.maxScore}
                    </div>
                  </th>
                ))}
                <th className="p-3 font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  المعدل العام
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
              {rows.map((r) => (
                <tr
                  key={r.username}
                  className="hover:bg-[#FAFBFC] dark:hover:bg-[#0A1630]/60"
                >
                  <td className="p-3">
                    <Link
                      href={`/students/${r.username}`}
                      className="font-semibold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
                    >
                      {r.fullName}
                    </Link>
                    <div className="font-mono text-[10px] text-[#526077] dark:text-[#94A3B8]">
                      @{r.username}
                    </div>
                  </td>
                  <td className="p-3 text-[#526077] dark:text-[#94A3B8]">
                    {r.university}
                  </td>
                  {filteredAssignments.map((asg) => {
                    const val = r.scoresByAssignment[asg.id];
                    return (
                      <td key={asg.id} className="p-3 font-tabular">
                        {val !== null && val !== undefined ? (
                          <Link
                            href={`/teacher/assignments/${asg.id}`}
                            className={`inline-flex rounded-[6px] px-2 py-0.5 font-semibold ${
                              val >= 85
                                ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                                : val >= 70
                                ? 'bg-[#F1F4F9] text-[#0A1630] dark:bg-[#1E325C] dark:text-[#FAFBFC]'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {val}%
                          </Link>
                        ) : (
                          <span className="text-[#94A3B8]">لم يُسلَّم</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 font-tabular font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                    {r.average}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
