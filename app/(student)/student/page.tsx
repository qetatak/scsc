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
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import {
  Activity,
  ArrowUpLeft,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  FlaskConical,
  MessageSquare,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useStudentDashboardStore } from '@/store/use-student-dashboard-store';
import { useTeacherStore } from '@/store/use-teacher-store';
import {
  STUDENT_RECENT_ACTIVITIES,
  STUDENT_WEEKLY_ACTIVITY,
  StudentActivityRow,
} from '@/data/dashboard-mock-data';
import { LABS_METADATA } from '@/data/mock-data';
import {
  ChartCard,
  ChecklistCard,
  DashboardStatCard,
  DataTable,
  DataTableColumn,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

export default function StudentOverviewPage() {
  const { currentStudent, companyMessages } = useAppStore();
  const { checklist, toggleChecklistStep, projects } =
    useStudentDashboardStore();
  const { assignments, submissions, classes } = useTeacherStore();

  const enrolledClassIds = classes
    .filter((c) => c.studentUsernames.includes(currentStudent.username))
    .map((c) => c.id);

  const myAssignments = assignments.filter(
    (a) => a.status === 'منشور' && enrolledClassIds.includes(a.targetClassId)
  );

  const myMessages = companyMessages.filter(
    (m) => m.studentUsername === currentStudent.username
  );

  // Calculate profile completion percentage
  const completionChecks = [
    Boolean(currentStudent.bio && currentStudent.bio.length > 20),
    Boolean(currentStudent.educationDetails),
    Boolean(currentStudent.githubOrPortfolio),
    Boolean(currentStudent.linkedinUrl),
    currentStudent.isPublicToCompanies,
    projects.length > 0,
  ];
  const profileCompletionPct = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100
  );

  const radarData = [
    {
      subject: 'المحاسبة',
      score: Math.min(100, Math.round((currentStudent.labXp.accounting / 500) * 100)),
    },
    {
      subject: 'التسويق',
      score: Math.min(100, Math.round((currentStudent.labXp.marketing / 500) * 100)),
    },
    {
      subject: 'الإدارة',
      score: Math.min(100, Math.round((currentStudent.labXp.management / 500) * 100)),
    },
    {
      subject: 'Python',
      score: Math.min(100, Math.round((currentStudent.labXp.python / 500) * 100)),
    },
  ];

  // Recommended labs sorted by lowest XP so student can level up
  const recommendedLabs = [...LABS_METADATA].sort(
    (a, b) =>
      (currentStudent.labXp[a.id] || 0) - (currentStudent.labXp[b.id] || 0)
  );

  const activityColumns: DataTableColumn<StudentActivityRow>[] = [
    {
      key: 'title',
      header: 'التمرين / المهمة العملية',
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <span className="font-medium text-[#0A1630] dark:text-[#FAFBFC]">
          {r.title}
        </span>
      ),
    },
    {
      key: 'labName',
      header: 'المختبر',
      sortable: true,
      sortValue: (r) => r.labName,
      render: (r) => (
        <span className="text-[#526077] dark:text-[#94A3B8]">{r.labName}</span>
      ),
    },
    {
      key: 'scorePct',
      header: 'درجة الإتقان',
      sortable: true,
      sortValue: (r) => r.scorePct,
      render: (r) => (
        <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
          {r.scorePct}%
        </span>
      ),
    },
    {
      key: 'xpEarned',
      header: 'الخبرة المكتسبة',
      sortable: true,
      sortValue: (r) => r.xpEarned,
      render: (r) => (
        <span className="font-tabular font-semibold text-[#2F6BFF]">
          +{r.xpEarned} XP
        </span>
      ),
    },
    {
      key: 'completedAt',
      header: 'التاريخ',
      sortable: true,
      sortValue: (r) => r.completedAt,
      render: (r) => (
        <span className="font-tabular text-[#526077] dark:text-[#94A3B8]">
          {r.completedAt}
        </span>
      ),
    },
  ];

  const circleRadius = 46;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (profileCompletionPct / 100) * circleCircumference;

  return (
    <div>
      <PageHeader
        title={`مرحباً، ${currentStudent.fullName}`}
        description="ملخص أدائك العملي في المختبرات التفاعلية وتفاعل الشركات مع بروفايلك المهني هذا الشهر."
        actions={
          <>
            <Link href={`/students/${currentStudent.username}`}>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <span>معاينة البروفايل العام</span>
                <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
              </Button>
            </Link>
            <Link href="/labs/accounting">
              <Button size="sm" className="gap-1.5">
                <FlaskConical className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>متابعة التدريب العملي</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 1. First-Time Account Setup Checklist */}
      <ChecklistCard
        title="إعداد حسابك لأول مرة"
        subtitle="أكمل الخطوات الأربع التالية لتعزيز ظهور ملفك المهني أمام مسؤولي التوظيف في الشركات."
        items={checklist}
        onToggleStep={toggleChecklistStep}
      />

      {/* 2. Monthly Summary: 4 StatCards */}
      <section aria-label="ملخص الشهر" className="mb-6">
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
            label="نقاط الخبرة (XP)"
            value={currentStudent.totalXp.toLocaleString('en-US')}
            changeText="+18.4% عن الشهر السابق"
            subtitle="المرتبة #01 على مستوى الجامعات"
            icon={Activity}
          />
          <DashboardStatCard
            label="التمارين المنجزة"
            value={24}
            changeText="+22.0% عن الشهر السابق"
            subtitle="في 4 مختبرات محاكاة عملية"
            icon={CheckCircle2}
          />
          <DashboardStatCard
            label="مشاهدات البروفايل من الشركات"
            value={38}
            changeText="+31.5% عن الشهر السابق"
            subtitle="من شركات التقنية والبنوك"
            icon={Eye}
          />
          <DashboardStatCard
            label="الرسائل الواردة"
            value={myMessages.length}
            changeText="+25.0% عن الشهر السابق"
            subtitle="عروض مقابلات وتدريب تعاوني"
            icon={MessageSquare}
          />
        </div>
      </section>

      {/* Practical Assignments Section */}
      <section aria-label="واجباتي العملية" className="mb-6">
        <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
                <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  واجباتي العملية من أساتذة المساقات
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                مهام تطبيقية داخل المختبرات التفاعلية تصحح تلقائياً وتمنحك نقاط خبرة إضافية.
              </p>
            </div>
            <Link href="/student/assignments">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <span>عرض كل الواجبات والانضمام لشعبة</span>
                <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {myAssignments.slice(0, 4).map((assignment) => {
              const cls = classes.find((c) => c.id === assignment.targetClassId);
              const sub = submissions.find(
                (s) =>
                  s.assignmentId === assignment.id &&
                  s.studentUsername === currentStudent.username
              );
              const isSubmitted =
                sub?.status === 'مُصحَّح آلياً' ||
                sub?.status === 'تمت المراجعة' ||
                sub?.status === 'متأخر';
              const finalScore =
                sub?.manualScoreOverride ?? sub?.autoGrade?.autoScore ?? 0;
              return (
                <div
                  key={assignment.id}
                  className="flex flex-col justify-between rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-medium text-[#2F6BFF]">
                        {cls?.courseName || 'مساق جامعي'}
                      </span>
                      <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {assignment.maxScore} نقطة
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {assignment.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      <Clock className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span className="font-tabular">
                        التسليم: {assignment.dueDate}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E3E8F0] pt-3 dark:border-[#1E325C]">
                    <span className="font-tabular text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
                      {isSubmitted
                        ? `الدرجة: ${finalScore}/${assignment.maxScore}`
                        : 'قيد الحل'}
                    </span>
                    <Link
                      href={`/labs/${assignment.labId}?assignmentId=${assignment.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6BFF] hover:underline"
                    >
                      <span>{isSubmitted ? 'مراجعة الحل' : 'فتح في المختبر'}</span>
                      <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Weekly Activity LineChart + Strengths RadarChart + Circular Profile Completion */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="نشاط التدريب الأسبوعي"
          subtitle="نقاط الخبرة المكتسبة يومياً خلال الأيام السبعة الماضية"
          className="lg:col-span-5"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={STUDENT_WEEKLY_ACTIVITY}>
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
                <Line
                  type="monotone"
                  dataKey="xp"
                  name="نقاط الخبرة (XP)"
                  stroke="#2F6BFF"
                  strokeWidth={2.25}
                  dot={{ r: 4, fill: '#0A1630', stroke: '#2F6BFF', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#2F6BFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="توازن المهارات في المختبرات الأربعة"
          subtitle="نسبة الإتقان المئوية لكل مجال تخصصي"
          className="lg:col-span-4"
        >
          <div className="h-[220px] sm:h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart
                cx="50%"
                cy="50%"
                outerRadius="72%"
                data={radarData}
              >
                <PolarGrid stroke="#E3E8F0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: '#526077' }}
                />
                <Radar
                  name="نسبة الإتقان"
                  dataKey="score"
                  stroke="#2F6BFF"
                  fill="#2F6BFF"
                  fillOpacity={0.22}
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
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Circular Profile Completion Indicator */}
        <div className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-6 lg:col-span-3 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          <div>
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              اكتمال البروفايل المهني
            </h2>
            <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
              البروفايلات المكتملة بنسبة 100% تتلقى 3 أضعاف دعوات المقابلات.
            </p>
          </div>

          <div className="my-4 flex flex-col items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 112 112">
                <circle
                  cx="56"
                  cy="56"
                  r={circleRadius}
                  fill="none"
                  stroke="#F1F4F9"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={circleRadius}
                  fill="none"
                  stroke="#2F6BFF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-tabular text-2xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {profileCompletionPct}%
                </span>
                <span className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  مكتمل
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#E3E8F0] pt-3 text-xs dark:border-[#1E325C]">
            <div className="flex items-center justify-between">
              <span className="text-[#526077] dark:text-[#94A3B8]">
                حالة الظهور للشركات
              </span>
              <span className="font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                {currentStudent.isPublicToCompanies ? 'متاح للباحثين' : 'مخفي'}
              </span>
            </div>
            <Link href="/student/profile" className="block pt-1">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                تحديث البروفايل المهني
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Activities Table + Recommended Lab to Continue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="آخر الأنشطة والتمارين المنجزة"
          subtitle="سجل التمارين التفاعلية الموثقة في حسابك"
          className="lg:col-span-8"
        >
          <DataTable
            data={STUDENT_RECENT_ACTIVITIES}
            columns={activityColumns}
            rowKey={(r) => r.id}
            searchPlaceholder="ابحث باسم التمرين أو المختبر..."
            searchMatcher={(r, q) =>
              r.title.toLowerCase().includes(q) ||
              r.labName.toLowerCase().includes(q)
            }
            pageSize={4}
          />
        </ChartCard>

        <ChartCard
          title="المختبر الموصى به للمتابعة"
          subtitle="مرتب حسب الفجوة المهارية لرفع تقييمك الكلي"
          className="lg:col-span-4"
        >
          <div className="space-y-3">
            {recommendedLabs.map((lab, idx) => {
              const currentXp = currentStudent.labXp[lab.id] || 0;
              const pct = Math.min(100, Math.round((currentXp / 500) * 100));
              return (
                <div
                  key={lab.id}
                  className="rounded-[12px] border border-[#E3E8F0] p-4 transition-colors hover:border-[#2F6BFF] dark:border-[#1E325C]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
                      {idx === 0 ? 'توصية ذات أولوية' : `مختبر #0${idx + 1}`}
                    </span>
                    <span className="font-tabular text-xs font-semibold text-[#2F6BFF]">
                      {currentXp} / 500 XP
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {lab.title}
                  </h3>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F4F9] dark:bg-[#0A1630]">
                    <div
                      className="h-full bg-[#2F6BFF]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      إنجاز {pct}%
                    </span>
                    <Link
                      href={lab.slug}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#2F6BFF] hover:underline"
                    >
                      <span>ابدأ التمرين</span>
                      <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
