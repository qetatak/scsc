'use client';

import React from 'react';
import Link from 'next/link';
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
import {
  ArrowUpLeft,
  BookmarkCheck,
  Eye,
  MessageSquare,
  Percent,
  Search,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import {
  COMPANY_FUNNEL_DATA,
  COMPANY_MONTHLY_ACTIVITY,
  COMPANY_SEARCHED_SKILLS,
} from '@/data/dashboard-mock-data';
import {
  ChartCard,
  ChecklistCard,
  DashboardStatCard,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

export default function CompanyOverviewPage() {
  const { allStudents, companyMessages } = useAppStore();
  const {
    checklist,
    toggleChecklistStep,
    shortlistCandidates,
    companyProfile,
  } = useCompanyDashboardStore();

  const suggestedTalents = allStudents
    .filter((s) => s.isPublicToCompanies)
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, 4);

  const repliedCount = companyMessages.filter(
    (m) => m.status === 'تم القبول والرد'
  ).length;
  const replyRate =
    companyMessages.length > 0
      ? ((repliedCount / companyMessages.length) * 100).toFixed(1)
      : '73.6';

  return (
    <div>
      <PageHeader
        title={`لوحة استقطاب المواهب — ${companyProfile.companyName}`}
        description="متابعة مؤشرات الفرز، قمع التوظيف، وأحدث المرشحين المتفوقين في المختبرات العملية."
        actions={
          <>
            <Link href="/company/shortlist">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <BookmarkCheck className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>القائمة المختصرة ({shortlistCandidates.length})</span>
              </Button>
            </Link>
            <Link href="/company/talent">
              <Button size="sm" className="gap-1.5">
                <Search className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>البحث عن مواهب</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 1. First-Time Company Account Setup Checklist */}
      <ChecklistCard
        title="إعداد حساب الشركة لأول مرة"
        subtitle="أكمل خطوات التهيئة لتفعيل كافة مزايا استقطاب الخريجين والتواصل المباشر."
        items={checklist}
        onToggleStep={toggleChecklistStep}
      />

      {/* 2. Monthly Summary: 4 StatCards */}
      <section aria-label="ملخص الشهر للشركة" className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            ملخص الشهر الحالي
          </h2>
          <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
            مقارنة بالشهر السابق
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            label="بروفايلات تمت مشاهدتها"
            value={148}
            changeText="+12.1% عن الشهر السابق"
            subtitle="مرشحون في المحاسبة و Python"
            icon={Eye}
          />
          <DashboardStatCard
            label="طلاب في القائمة المختصرة"
            value={shortlistCandidates.length}
            changeText="+16.6% عن الشهر السابق"
            subtitle="موزعون على 3 قوائم توظيف"
            icon={BookmarkCheck}
          />
          <DashboardStatCard
            label="رسائل ودعوات مرسلة"
            value={19}
            changeText="+11.8% عن الشهر السابق"
            subtitle="دعوات مقابلات وتدريب تعاوني"
            icon={MessageSquare}
          />
          <DashboardStatCard
            label="نسبة الردود الإيجابية"
            value={`${replyRate}%`}
            changeText="+4.2% عن الشهر السابق"
            subtitle="متوسط وقت الرد: 6 ساعات"
            icon={Percent}
          />
        </div>
      </section>

      {/* 3. Recruitment Funnel + Top Searched Skills BarChart */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="قمع استقطاب المواهب (Recruitment Funnel)"
          subtitle="معدل التحول من استعراض البروفايل حتى قبول المقابلة"
          className="lg:col-span-6"
        >
          <div className="space-y-4 py-2">
            {COMPANY_FUNNEL_DATA.map((item, idx) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    0{idx + 1}. {item.stage}
                  </span>
                  <div className="flex items-center gap-3 font-tabular">
                    <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {item.count} مرشح
                    </span>
                    <span className="w-12 text-left text-[#2F6BFF]">
                      {item.conversionPct}%
                    </span>
                  </div>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-[8px] bg-[#F1F4F9] dark:bg-[#0A1630]">
                  <div
                    className="flex h-full items-center rounded-[8px] bg-[#2F6BFF] px-2.5 text-[11px] font-semibold text-white transition-all"
                    style={{ width: `${Math.max(14, item.conversionPct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="أكثر المهارات العملية بحثاً"
          subtitle="توزيع عمليات الفرز حسب المهارات الموثقة في المختبرات"
          className="lg:col-span-6"
        >
          <div className="h-[220px] sm:h-60 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COMPANY_SEARCHED_SKILLS}
                layout="vertical"
                margin={{ left: 8, right: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#526077' }}
                  axisLine={{ stroke: '#E3E8F0' }}
                />
                <YAxis
                  type="category"
                  dataKey="skill"
                  width={106}
                  tick={{ fontSize: 10, fill: '#526077' }}
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
                  dataKey="searches"
                  name="عمليات البحث"
                  fill="#2F6BFF"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 4. Monthly Activity LineChart + Suggested Talents List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="النشاط الشهري لاستقطاب المواهب"
          subtitle="تطور المشاهدات والقوائم المختصرة والرسائل عبر 6 أشهر"
          className="lg:col-span-7"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COMPANY_MONTHLY_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
                <XAxis
                  dataKey="month"
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
                <Line
                  type="monotone"
                  dataKey="views"
                  name="مشاهدات البروفايلات"
                  stroke="#0A1630"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="shortlisted"
                  name="القائمة المختصرة"
                  stroke="#2F6BFF"
                  strokeWidth={2.25}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="مواهب مقترحة بحسب بحثك السابق"
          subtitle="مرشحون متطابقون مع معايير التقنية المالية والمحاسبة"
          className="lg:col-span-5"
          action={
            <Link
              href="/company/talent"
              className="text-xs font-medium text-[#2F6BFF] hover:underline"
            >
              عرض الكل
            </Link>
          }
        >
          <div className="space-y-3">
            {suggestedTalents.map((student) => (
              <div
                key={student.username}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[#E3E8F0] p-3.5 transition-colors hover:border-[#2F6BFF] dark:border-[#1E325C]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#0A1630] text-xs font-semibold text-white dark:bg-[#2F6BFF]">
                    {student.initials}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {student.fullName}
                    </h3>
                    <p className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      {student.major} · {student.university}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-tabular text-xs font-semibold text-[#2F6BFF]">
                    {student.totalXp.toLocaleString('en-US')} XP
                  </span>
                  <Link href={`/company/talent?candidate=${student.username}`}>
                    <Button variant="secondary" size="sm" className="h-8 px-2.5 text-xs">
                      <span>معاينة</span>
                      <ArrowUpLeft className="mr-1 h-3 w-3 stroke-[1.5]" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
