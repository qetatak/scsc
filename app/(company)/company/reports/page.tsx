'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { toast } from 'sonner';
import { Calendar, Download } from 'lucide-react';
import { COMPANY_MONTHLY_ACTIVITY } from '@/data/dashboard-mock-data';
import {
  ChartCard,
  DashboardStatCard,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

const UNIVERSITY_PERFORMANCE_REPORT = [
  { university: 'الجامعة الأردنية', candidates: 42, avgXp: 1490, hired: 6 },
  { university: 'الأميرة سمية للتكنولوجيا', candidates: 35, avgXp: 1510, hired: 5 },
  { university: 'العلوم والتكنولوجيا', candidates: 31, avgXp: 1440, hired: 4 },
  { university: 'الألمانية الأردنية', candidates: 24, avgXp: 1380, hired: 3 },
  { university: 'اليرموك والهاشمية', candidates: 29, avgXp: 1310, hired: 3 },
];

export default function CompanyReportsPage() {
  const [dateRange, setDateRange] = useState<'30d' | 'q4' | 'year'>('q4');

  const multiplier = dateRange === '30d' ? 1 : dateRange === 'q4' ? 3 : 6;

  const filteredMonthly =
    dateRange === '30d'
      ? COMPANY_MONTHLY_ACTIVITY.slice(-2)
      : dateRange === 'q4'
        ? COMPANY_MONTHLY_ACTIVITY.slice(-3)
        : COMPANY_MONTHLY_ACTIVITY;

  const handleExportReport = () => {
    const headers = ['الجامعة', 'عدد المرشحين', 'متوسط الخبرة XP', 'المقبولون'];
    const rows = UNIVERSITY_PERFORMANCE_REPORT.map((r) =>
      [r.university, r.candidates, r.avgXp, r.hired].join(',')
    );
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tadreebak-recruitment-report-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير تقرير التوظيف بصيغة CSV');
  };

  return (
    <div>
      <PageHeader
        title="تقارير الأداء واستقطاب المواهب"
        description="تحليل إحصائي لمصادر المواهب، نسب الاستجابة، ومتوسط الدرجات العملية حسب النطاق الزمني."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-[10px] border border-[#E3E8F0] bg-white p-1 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]">
              <Calendar className="mr-2 h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
              {[
                { key: '30d', label: 'آخر 30 يوماً' },
                { key: 'q4', label: 'الربع الحالي (Q4)' },
                { key: 'year', label: 'آخر 6 أشهر' },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setDateRange(r.key as '30d' | 'q4' | 'year')}
                  className={`rounded-[8px] px-2.5 py-1 font-medium ${
                    dateRange === r.key
                      ? 'bg-[#0A1630] text-white dark:bg-[#2F6BFF]'
                      : 'text-[#526077]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleExportReport}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>تصدير التقرير (CSV)</span>
            </Button>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="إجمالي البروفايلات المفحوصة"
          value={148 * multiplier}
          changeText="+19.2% نمو"
          subtitle="خلال الفترة المحددة"
        />
        <DashboardStatCard
          label="متوسط نقاط خبرة المرشحين"
          value="1,465 XP"
          changeText="مستوى متقدم / خبير"
          subtitle="أعلى بـ 22% من المتوسط العام"
        />
        <DashboardStatCard
          label="متوسط زمن استجابة المرشح"
          value="5.4 ساعة"
          changeText="-1.8 ساعة تحسن"
          subtitle="سرعة رد عالية"
        />
        <DashboardStatCard
          label="المقابلات التقنية المجدولة"
          value={14 * multiplier}
          changeText="73.6% معدل قبول"
          subtitle="من إجمالي الدعوات المرسلة"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="مؤشرات التواصل والقبول عبر الزمن"
          subtitle="مقارنة الرسائل المرسلة بالردود الإيجابية"
          className="lg:col-span-6"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#526077' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#526077' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1630',
                    border: '1px solid #1E325C',
                    borderRadius: '10px',
                    color: '#FAFBFC',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="messages"
                  name="رسائل مرسلة"
                  stroke="#0A1630"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="replies"
                  name="ردود وقبول"
                  stroke="#2F6BFF"
                  strokeWidth={2.25}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="توزيع المرشحين حسب الجامعات"
          subtitle="عدد المرشحين المؤهلين في كل جامعة"
          className="lg:col-span-6"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UNIVERSITY_PERFORMANCE_REPORT}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
                <XAxis
                  dataKey="university"
                  tick={{ fontSize: 10, fill: '#526077' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#526077' }} />
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
                  dataKey="candidates"
                  name="عدد المرشحين"
                  fill="#2F6BFF"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
