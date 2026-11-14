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
import { AlertTriangle, ArrowUpLeft, BarChart3 } from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';

const GRADE_DISTRIBUTION_DATA = [
  { range: '90% - 100%', students: 18 },
  { range: '80% - 89%', students: 24 },
  { range: '70% - 79%', students: 12 },
  { range: '60% - 69%', students: 5 },
  { range: 'أقل من 60%', students: 2 },
];

const COMMON_PRACTICAL_ERRORS = [
  {
    errorTag: 'قيد دائن مقلوب أو خطأ في توجيه الحساب',
    labName: 'مختبر المحاسبة المالية',
    occurrences: 19,
    percentage: 38,
  },
  {
    errorTag: 'عدم توازن المعادلة المحاسبية (المدين لا يساوي الدائن)',
    labName: 'مختبر المحاسبة المالية',
    occurrences: 14,
    percentage: 28,
  },
  {
    errorTag: 'تجاوز سقف الميزانية الإعلانية المسموحة أو ارتفاع CAC',
    labName: 'مختبر التسويق الرقمي',
    occurrences: 11,
    percentage: 22,
  },
  {
    errorTag: 'فشل في حالة اختبار حافة (Edge Case) لدالة Python',
    labName: 'مختبر البرمجة (Python)',
    occurrences: 9,
    percentage: 18,
  },
];

export default function TeacherAnalyticsPage() {
  const { submissions } = useTeacherStore();

  const atRiskSubmissions = submissions.filter(
    (s) =>
      (s.manualScoreOverride ?? s.autoGrade?.autoScore ?? 100) < 80 ||
      s.status === 'متأخر'
  );

  return (
    <div>
      <PageHeader
        title="تحليلات أداء الطلاب والإنذار الأكاديمي المبكر"
        description="تعرّف على أكثر الأخطاء العملية تكراراً بين طلابك، توزيع الدرجات، والطلاب المتعثرين الذين يحتاجون لتدخل مبكر."
      />

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="توزيع درجات الطلاب في الواجبات العملية"
          subtitle="عدد الطلاب في كل شريحة تقييمية خلال الفصل الدراسي"
          className="lg:col-span-6"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GRADE_DISTRIBUTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
                <XAxis
                  dataKey="range"
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
                  dataKey="students"
                  name="عدد الطلاب"
                  fill="#2F6BFF"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="أكثر الأخطاء العملية تكراراً في المختبرات"
          subtitle="مُستخرجة تلقائياً من محرك فحص قيود المحاسبة وحملات التسويق وأكواد Python"
          className="lg:col-span-6"
        >
          <div className="space-y-3">
            {COMMON_PRACTICAL_ERRORS.map((err, idx) => (
              <div
                key={idx}
                className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {err.errorTag}
                  </span>
                  <span className="font-tabular text-xs font-bold text-[#2F6BFF]">
                    {err.occurrences} حالة ({err.percentage}%)
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  <span>المختبر: {err.labName}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E3E8F0] dark:bg-[#1E325C]">
                  <div
                    className="h-full bg-[#2F6BFF]"
                    style={{ width: `${err.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="نظام الإنذار المبكر للطلاب المتعثرين"
        subtitle="طلاب سجلوا درجات أقل من المستهدف أو واجهوا أخطاء متكررة في المهام العملية ويوصى بمراسلتهم."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {atRiskSubmissions.map((sub) => {
            const finalScore =
              sub.manualScoreOverride ?? sub.autoGrade?.autoScore ?? 0;
            const errorTags = sub.autoGrade?.detectedErrorTags || [];
            return (
              <div
                key={sub.id}
                className="flex flex-col justify-between rounded-[14px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      <AlertTriangle className="h-3.5 w-3.5 stroke-[1.5] text-amber-600" />
                      {sub.studentName}
                    </span>
                    <span className="font-tabular rounded-[6px] bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      الدرجة: {finalScore}%
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                    الواجب: {sub.assignmentTitle}
                  </p>
                  {errorTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {errorTags.map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-[6px] border border-[#E3E8F0] bg-[#FAFBFC] px-2 py-0.5 text-[10px] font-medium text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#94A3B8]"
                        >
                          وسم الخطأ: {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E3E8F0] pt-3 text-xs dark:border-[#1E325C]">
                  <Link
                    href="/teacher/messages"
                    className="font-medium text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8] dark:hover:text-white"
                  >
                    إرسال رسالة توجيه
                  </Link>
                  <Link
                    href={`/teacher/assignments/${sub.assignmentId}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#2F6BFF] hover:underline"
                  >
                    <BarChart3 className="h-3.5 w-3.5 stroke-[1.5]" />
                    <span>فحص المحاولة</span>
                    <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
