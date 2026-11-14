'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ArrowUpLeft, Calendar, Check, FlaskConical } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { STUDENT_XP_HISTORY } from '@/data/dashboard-mock-data';
import { LABS_METADATA } from '@/data/mock-data';
import { calculateSkillLevelFromXp } from '@/lib/labs/skill-calculator';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

const STREAK_DAYS_MATRIX = [
  { dayLabel: '01 نوفمبر', completed: true, xp: 80 },
  { dayLabel: '02 نوفمبر', completed: true, xp: 90 },
  { dayLabel: '03 نوفمبر', completed: true, xp: 110 },
  { dayLabel: '04 نوفمبر', completed: true, xp: 70 },
  { dayLabel: '05 نوفمبر', completed: true, xp: 120 },
  { dayLabel: '06 نوفمبر', completed: true, xp: 85 },
  { dayLabel: '07 نوفمبر', completed: true, xp: 60 },
  { dayLabel: '08 نوفمبر', completed: true, xp: 90 },
  { dayLabel: '09 نوفمبر', completed: true, xp: 100 },
  { dayLabel: '10 نوفمبر', completed: true, xp: 80 },
  { dayLabel: '11 نوفمبر', completed: true, xp: 110 },
  { dayLabel: '12 نوفمبر', completed: true, xp: 95 },
  { dayLabel: '13 نوفمبر', completed: false, xp: 0 },
  { dayLabel: '14 نوفمبر', completed: false, xp: 0 },
];

export default function StudentProgressPage() {
  const { currentStudent } = useAppStore();
  const [selectedMetric, setSelectedMetric] = useState<
    'total' | 'accounting' | 'marketing' | 'management' | 'python'
  >('total');

  return (
    <div>
      <PageHeader
        title="تقدمي في المختبرات والمهارات"
        description="متابعة تفصيلية لمستوى إتقانك في كل مختبر، تاريخ نمو نقاط الخبرة، وسجل الاستمرارية اليومي."
        actions={
          <Link href="/labs">
            <Button size="sm" className="gap-1.5">
              <FlaskConical className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>استعراض كتالوج المختبرات</span>
            </Button>
          </Link>
        }
      />

      {/* 1. Clean Streak Indicator (Zero Fire Emojis) */}
      <div className="mb-6 rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E3E8F0] pb-4 sm:flex-row sm:items-center dark:border-[#1E325C]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E3E8F0] bg-[#F5F6F8] text-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]">
              <Calendar className="h-4 w-4 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                مؤشر انتظام التدريب اليومي
              </h2>
              <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                سلسلة التدريب المتواصلة تُظهر التزامك العملي أمام مسؤولي التوظيف.
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-tabular text-3xl font-semibold text-[#2F6BFF]">
              {currentStudent.streakDays}
            </span>
            <span className="text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
              يوماً متواصلاً من التدريب الموثق
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-7 lg:grid-cols-14">
          {STREAK_DAYS_MATRIX.map((d) => (
            <div
              key={d.dayLabel}
              className={`flex flex-col items-center justify-between rounded-[10px] border p-2.5 text-center ${
                d.completed
                  ? 'border-[#2F6BFF]/40 bg-[#EBF1FF]/40 dark:border-[#2F6BFF]/50 dark:bg-[#2F6BFF]/10'
                  : 'border-[#E3E8F0] bg-[#F5F6F8] opacity-60 dark:border-[#1E325C] dark:bg-[#0A1630]'
              }`}
            >
              <span className="font-tabular text-[10px] text-[#526077] dark:text-[#94A3B8]">
                {d.dayLabel}
              </span>
              <div className="my-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#E3E8F0] bg-white dark:border-[#1E325C] dark:bg-[#0F1E3E]">
                {d.completed ? (
                  <Check className="h-3.5 w-3.5 stroke-[2] text-[#2F6BFF]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#526077]/40" />
                )}
              </div>
              <span className="font-tabular text-[11px] font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                {d.completed ? `+${d.xp} XP` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. XP History Chart */}
      <ChartCard
        title="تاريخ نمو نقاط الخبرة (XP)"
        subtitle="التطور التراكمي لنقاط الخبرة عبر الأشهر الستة الماضية"
        className="mb-6"
        action={
          <div className="flex flex-wrap gap-1 rounded-[10px] bg-[#F5F6F8] p-1 dark:bg-[#0A1630]">
            {[
              { key: 'total', label: 'الإجمالي' },
              { key: 'python', label: 'Python' },
              { key: 'accounting', label: 'المحاسبة' },
              { key: 'management', label: 'الإدارة' },
              { key: 'marketing', label: 'التسويق' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  setSelectedMetric(
                    tab.key as
                      | 'total'
                      | 'accounting'
                      | 'marketing'
                      | 'management'
                      | 'python'
                  )
                }
                className={`rounded-[8px] px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedMetric === tab.key
                    ? 'bg-white text-[#0A1630] dark:bg-[#0F1E3E] dark:text-[#FAFBFC]'
                    : 'text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-[220px] sm:h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={STUDENT_XP_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#526077' }}
                axisLine={{ stroke: '#E3E8F0' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#526077' }}
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
              <Area
                type="monotone"
                dataKey={selectedMetric}
                name="نقاط الخبرة (XP)"
                stroke="#2F6BFF"
                strokeWidth={2.25}
                fill="#2F6BFF"
                fillOpacity={0.14}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* 3. Progress per Lab with Levels and Skills */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {LABS_METADATA.map((lab, index) => {
          const xp = currentStudent.labXp[lab.id] || 0;
          const skillMeta = calculateSkillLevelFromXp(xp);
          return (
            <div
              key={lab.id}
              className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
                  <div>
                    <span className="font-tabular text-xs font-semibold text-[#2F6BFF]">
                      0{index + 1} · {lab.subtitle}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {lab.title}
                    </h3>
                  </div>
                  <div className="text-left">
                    <span className="font-tabular block text-lg font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {xp} XP
                    </span>
                    <span className="text-xs font-medium text-[#2F6BFF]">
                      المستوى: {skillMeta.level}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526077] dark:text-[#94A3B8]">
                      نسبة إتمام المسار العملي
                    </span>
                    <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {skillMeta.score}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F4F9] dark:bg-[#0A1630]">
                    <div
                      className="h-full bg-[#2F6BFF]"
                      style={{ width: `${skillMeta.score}%` }}
                    />
                  </div>
                  <p className="mt-2 font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
                    المرحلة التالية ({skillMeta.nextLevelXp} XP): يتبقى{' '}
                    {Math.max(0, skillMeta.nextLevelXp - xp)} XP
                  </p>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    المهارات العملية المكتسبة في هذا المختبر:
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                    {lab.skillsLearned.map((skill, sIdx) => (
                      <React.Fragment key={skill}>
                        <span>{skill}</span>
                        {sIdx < lab.skillsLearned.length - 1 && (
                          <span aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
                  {lab.skillsLearned.length} مهارات وسيناريوهات موثقة
                </span>
                <Link href={lab.slug}>
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                    <span>دخول المختبر</span>
                    <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
