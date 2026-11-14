'use client';

import React from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import {
  Activity,
  ArrowUpLeft,
  ClipboardCheck,
  MessageSquare,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { useTeacherStore } from '@/store/use-teacher-store';
import { useAppStore } from '@/store/use-app-store';
import {
  ChartCard,
  DashboardStatCard,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

const USER_GROWTH_DATA = [
  { month: 'يونيو', students: 420, teachers: 28, companies: 19 },
  { month: 'يوليو', students: 540, teachers: 34, companies: 24 },
  { month: 'أغسطس', students: 690, teachers: 42, companies: 31 },
  { month: 'سبتمبر', students: 880, teachers: 56, companies: 38 },
  { month: 'أكتوبر', students: 1040, teachers: 68, companies: 45 },
  { month: 'نوفمبر', students: 1197, teachers: 79, companies: 54 },
];

const LAB_POPULARITY_DATA = [
  { lab: 'المحاسبة', sessions: 1420, submissions: 890 },
  { lab: 'Python', sessions: 1680, submissions: 1120 },
  { lab: 'التسويق', sessions: 980, submissions: 640 },
  { lab: 'الإدارة', sessions: 860, submissions: 590 },
];

export default function AdminOverviewPage() {
  const { users, approvalRequests, auditLogs } = useAdminStore();
  const { assignments } = useTeacherStore();
  const { companyMessages } = useAppStore();

  const studentCount = users.filter((u) => u.role === 'student').length;
  const teacherCount = users.filter((u) => u.role === 'teacher').length;
  const companyCount = users.filter((u) => u.role === 'company').length;
  const pendingApprovals = approvalRequests.filter(
    (a) => a.status === 'قيد المراجعة'
  );

  const roleBreakdown = [
    { role: 'الطلاب الجامعيون', count: studentCount * 380 },
    { role: 'أعضاء هيئة التدريس', count: teacherCount * 39 },
    { role: 'الشركات الموظِّفة', count: companyCount * 54 },
  ];

  return (
    <div>
      <PageHeader
        title="النظرة العامة لإدارة المنصة"
        description="مراقبة شاملة لحسابات المستخدمين، طلبات التوثيق الأكاديمي والشركات، نشاط المختبرات، وسجل العمليات الحساسة."
        actions={
          <>
            <Link href="/admin/approvals">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>طلبات الموافقة ({pendingApprovals.length})</span>
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button size="sm" className="gap-1.5">
                <Users className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>إدارة المستخدمين</span>
              </Button>
            </Link>
          </>
        }
      />

      <section aria-label="مؤشرات المنصة الكلية" className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            مؤشرات الأداء والنمو الشهرية
          </h2>
          <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
            مقارنة بالشهر السابق
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            label="إجمالي المستخدمين المسجلين"
            value="1,197"
            changeText="+21.8% عن الشهر السابق"
            subtitle={`${studentCount} طلاب، ${teacherCount} معلمين، ${companyCount} شركات في العينة`}
            icon={Users}
          />
          <DashboardStatCard
            label="المستخدمون النشطون أسبوعياً"
            value="864"
            changeText="+16.4% عن الشهر السابق"
            subtitle="معدل تفاعل 72.1% في المختبرات"
            icon={Activity}
          />
          <DashboardStatCard
            label="الواجبات العملية المنشورة"
            value={assignments.length * 18}
            changeText="+28.0% عن الشهر السابق"
            subtitle="عبر 12 جامعة أردنية وعربية"
            icon={ClipboardCheck}
          />
          <DashboardStatCard
            label="رسائل التوظيف من الشركات"
            value={companyMessages.length * 42}
            changeText="+34.5% عن الشهر السابق"
            subtitle="تواصل مباشر مع الطلاب المتميزين"
            icon={MessageSquare}
          />
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="نمو المستخدمين حسب الدور"
          subtitle="تطور أعداد الطلاب والمعلمين والشركات خلال الأشهر الستة الماضية"
          className="lg:col-span-7"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USER_GROWTH_DATA}>
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
                  dataKey="students"
                  name="الطلاب"
                  stroke="#2F6BFF"
                  strokeWidth={2.25}
                />
                <Line
                  type="monotone"
                  dataKey="teachers"
                  name="المعلمون"
                  stroke="#0A1630"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="companies"
                  name="الشركات"
                  stroke="#64748B"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="أكثر المختبرات استخداماً وتسليماً"
          subtitle="مجموع الجلسات التفاعلية وتسليمات الواجبات لكل مختبر"
          className="lg:col-span-5"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LAB_POPULARITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F0" />
                <XAxis
                  dataKey="lab"
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
                  dataKey="sessions"
                  name="جلسات التدريب"
                  fill="#2F6BFF"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="submissions"
                  name="تسليمات الواجبات"
                  fill="#0A1630"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="توزيع الأدوار على المنصة"
          subtitle="نسبة كل شريحة من إجمالي الحسابات النشطة"
          className="lg:col-span-4"
        >
          <div className="space-y-4">
            {roleBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {item.role}
                  </span>
                  <span className="font-tabular font-bold text-[#2F6BFF]">
                    {item.count.toLocaleString('en-US')} حساب
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="طلبات التوثيق المعلقة"
          subtitle="معلمون وشركات بانتظار المراجعة والاعتماد"
          className="lg:col-span-4"
          action={
            <Link
              href="/admin/approvals"
              className="text-xs font-semibold text-[#2F6BFF] hover:underline"
            >
              مراجعة الكل
            </Link>
          }
        >
          <div className="space-y-3">
            {pendingApprovals.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="rounded-[12px] border border-[#E3E8F0] p-3.5 dark:border-[#1E325C]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {req.applicantName}
                  </span>
                  <span className="rounded-[6px] bg-[#2F6BFF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#2F6BFF]">
                    {req.role === 'teacher' ? 'أكاديمي / معلم' : 'شركة موظِّفة'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                  {req.organizationOrUniversity}
                </p>
                <div className="mt-2 flex justify-end">
                  <Link
                    href="/admin/approvals"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F6BFF] hover:underline"
                  >
                    <span>فحص الطلب</span>
                    <ArrowUpLeft className="h-3 w-3 stroke-[1.5]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="آخر العمليات في سجل التدقيق"
          subtitle="أحدث الإجراءات الإدارية الموثقة"
          className="lg:col-span-4"
          action={
            <Link
              href="/admin/audit-log"
              className="text-xs font-semibold text-[#2F6BFF] hover:underline"
            >
              السجل الكامل
            </Link>
          }
        >
          <div className="space-y-3">
            {auditLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {log.actionType}
                  </span>
                  <span className="font-tabular text-[10px] text-[#526077] dark:text-[#94A3B8]">
                    {log.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  {log.targetLabel}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
