'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Clock,
  Info,
  Play,
  Plus,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useTeacherStore } from '@/store/use-teacher-store';
import { PageHeader, EmptyState } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AssignmentFilterTab = 'upcoming' | 'in_progress' | 'submitted' | 'late';

const LAB_TITLES: Record<string, string> = {
  accounting: 'مختبر المحاسبة المالية',
  marketing: 'مختبر التسويق الرقمي',
  management: 'مختبر إدارة الأعمال',
  python: 'مختبر البرمجة (Python)',
};

export default function StudentAssignmentsPage() {
  const { currentStudent } = useAppStore();
  const { classes, assignments, submissions, joinClassByCode } =
    useTeacherStore();

  const [activeTab, setActiveTab] = useState<AssignmentFilterTab>('upcoming');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [selectedDetailsId, setSelectedDetailsId] = useState<string | null>(
    null
  );

  const myClasses = useMemo(
    () =>
      classes.filter((c) =>
        c.studentUsernames.includes(currentStudent.username)
      ),
    [classes, currentStudent.username]
  );

  const enrichedAssignments = useMemo(() => {
    const published = assignments.filter((a) => a.status === 'منشور');
    return published.map((asg) => {
      const sub = submissions.find(
        (s) =>
          s.assignmentId === asg.id &&
          s.studentUsername === currentStudent.username
      );
      const status = sub?.status || 'لم يبدأ';
      const dueMs = new Date(asg.dueDate).getTime() - new Date('2026-11-12').getTime();
      const daysLeft = Math.ceil(dueMs / (1000 * 60 * 60 * 24));
      return {
        assignment: asg,
        submission: sub,
        status,
        daysLeft,
      };
    });
  }, [assignments, submissions, currentStudent.username]);

  const filteredList = useMemo(() => {
    return enrichedAssignments.filter((item) => {
      if (activeTab === 'upcoming') {
        return item.status === 'لم يبدأ' && item.daysLeft >= 0;
      }
      if (activeTab === 'in_progress') {
        return item.status === 'قيد الحل';
      }
      if (activeTab === 'submitted') {
        return (
          item.status === 'مُسلَّم' ||
          item.status === 'مُصحَّح آلياً' ||
          item.status === 'تمت المراجعة'
        );
      }
      return item.status === 'متأخر' || (item.status === 'لم يبدأ' && item.daysLeft < 0);
    });
  }, [enrichedAssignments, activeTab]);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const res = joinClassByCode(joinCodeInput, currentStudent.username);
    if (res.ok) {
      toast.success(res.message);
      setJoinCodeInput('');
    } else {
      toast.error(res.message);
    }
  };

  const selectedDetailItem = enrichedAssignments.find(
    (i) => i.assignment.id === selectedDetailsId
  );

  return (
    <div>
      <PageHeader
        title="الواجبات العملية والشعب الجامعية"
        description="افتح مهامك التطبيقية مباشرة داخل المختبر في وضع الواجب (Assignment Mode) واحصل على تصحيح فوري ونقاط خبرة XP توثق في بروفايلك."
      />

      {/* Top Row: Join Class by Code + Educational Info Card */}
      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 lg:col-span-5 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            <BookOpen className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
            <h2>الانضمام لشعبة دراسية بكود المعلم</h2>
          </div>
          <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
            أدخل كود الشعبة الذي زوّدك به أستاذ المادة (مثال:{' '}
            <code className="font-tabular font-semibold text-[#2F6BFF]">
              JU-ACC-27
            </code>{' '}
            أو{' '}
            <code className="font-tabular font-semibold text-[#2F6BFF]">
              JU-PY-204
            </code>
            ).
          </p>
          <form onSubmit={handleJoinClass} className="mt-3 flex gap-2">
            <Input
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              dir="ltr"
              placeholder="JU-ACC-27"
              className="h-9 font-tabular text-xs"
            />
            <Button type="submit" size="sm" className="h-9 shrink-0 gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>انضمام للشعبة</span>
            </Button>
          </form>

          <div className="mt-4 border-t border-[#E3E8F0] pt-3 dark:border-[#1E325C]">
            <span className="text-[11px] font-medium text-[#526077]">
              شعبي المسجلة حالياً ({myClasses.length}):
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {myClasses.map((cls) => (
                <span
                  key={cls.id}
                  className="rounded-[8px] border border-[#E3E8F0] bg-[#F5F6F8] px-2.5 py-1 text-[11px] font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
                >
                  {cls.courseCode} · {cls.courseName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Info Card */}
        <div className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-5 lg:col-span-7 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              <Info className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
              <h2>كيف يعمل المصحح التلقائي للواجبات العملية؟</h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
              عند الضغط على «ابدأ الحل» يفتح المختبر المختص بشريط علوي ثابت يحتوي على مؤقت المهمة والمحاولات المتبقية دون الكشف عن الإجابة النموذجية. فور التسليم يقيم المحرك حلك وفق معايير المعلم (توازن القيود المحاسبية، أهداف ROI و CAC التسويقية، نقطة التعادل بأرقامك المخصصة، أو حالات اختبار Python داخل بيئة معزولة) ويضيف نقاط خبرة XP لبروفايلك المهني.
            </p>
          </div>

          {/* Countdown Cards for Nearest Deadlines */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {enrichedAssignments.slice(0, 3).map((item) => (
              <div
                key={item.assignment.id}
                className="rounded-[12px] border border-[#E3E8F0] bg-[#F5F6F8] p-3 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[#526077]">
                    {LAB_TITLES[item.assignment.labId]}
                  </span>
                  <span className="font-tabular font-semibold text-[#2F6BFF]">
                    {item.daysLeft >= 0
                      ? `متبقي ${item.daysLeft} يوم`
                      : 'انتهى الموعد'}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {item.assignment.title}
                </p>
                <p className="mt-1 font-tabular text-[11px] text-[#526077]">
                  التسليم: {item.assignment.dueDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full sm:w-auto overflow-x-auto no-scrollbar gap-1.5 rounded-[12px] border border-[#E3E8F0] bg-white p-1.5 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          {[
            { key: 'upcoming', label: 'القادمة' },
            { key: 'in_progress', label: 'قيد الحل' },
            { key: 'submitted', label: 'المُسلَّمة والمصححة' },
            { key: 'late', label: 'المتأخرة' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as AssignmentFilterTab)}
              className={`shrink-0 rounded-[8px] px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#0A1630] text-white dark:bg-[#2F6BFF]'
                  : 'text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="font-tabular text-xs text-[#526077]">
          إجمالي الواجبات في هذا التبويب: {filteredList.length}
        </span>
      </div>

      {/* Assignments Cards (Mobile) + Table (Tablet/Desktop) */}
      {filteredList.length === 0 ? (
        <EmptyState
          title="لا توجد واجبات في هذا القسم حالياً"
          description="بدّل بين التبويبات أعلاه لاستعراض الواجبات المسلمة أو قيد الحل."
        />
      ) : (
        <>
          {/* Mobile Native Cards */}
          <div className="space-y-3 md:hidden">
            {filteredList.map(({ assignment, submission, status, daysLeft }) => {
              const finalScore =
                submission?.manualScoreOverride ??
                submission?.autoGrade?.autoScore;

              return (
                <div
                  key={assignment.id}
                  className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 space-y-3 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-medium text-[#2F6BFF]">
                        {LAB_TITLES[assignment.labId]} · {assignment.difficulty}
                      </span>
                      <h3 className="mt-0.5 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {assignment.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                        إشراف: {assignment.createdByTeacherName}
                      </p>
                    </div>
                    {typeof finalScore === 'number' ? (
                      <span className="shrink-0 rounded-[8px] bg-[#2F6BFF]/10 px-2.5 py-1 font-tabular text-xs font-bold text-[#2F6BFF]">
                        {finalScore}/{assignment.maxScore}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-[8px] bg-[#F5F6F8] px-2.5 py-1 text-[11px] font-medium text-[#526077] dark:bg-[#0A1630] dark:text-[#94A3B8]">
                        {status}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-[10px] bg-[#F5F6F8] p-2.5 text-[11px] font-tabular dark:bg-[#0A1630]">
                    <div>
                      <span className="block font-sans text-[#526077] dark:text-[#94A3B8]">
                        موعد التسليم
                      </span>
                      <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {assignment.dueDate}
                      </span>
                      <span className="mr-1 text-[#2F6BFF]">
                        ({daysLeft >= 0 ? `باقي ${daysLeft} يوم` : `متأخر ${Math.abs(daysLeft)} يوم`})
                      </span>
                    </div>
                    <div>
                      <span className="block font-sans text-[#526077] dark:text-[#94A3B8]">
                        المحاولات
                      </span>
                      <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {submission?.attemptsUsed || 0} / {assignment.allowedAttempts}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/labs/${assignment.labId}?assignmentId=${assignment.id}`}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full min-h-[44px] gap-1.5 text-xs">
                        <Play className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span>ابدأ الحل داخل المختبر</span>
                      </Button>
                    </Link>
                    {submission?.autoGrade && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setSelectedDetailsId(
                            selectedDetailsId === assignment.id
                              ? null
                              : assignment.id
                          )
                        }
                        className="w-full min-h-[44px] text-xs"
                      >
                        تفاصيل العلامة
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden md:block overflow-x-auto rounded-[16px] border border-[#E3E8F0] bg-white dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <table className="w-full border-collapse text-right text-xs">
            <thead>
              <tr className="border-b border-[#E3E8F0] bg-[#F5F6F8] text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#94A3B8]">
                <th className="px-4 py-3.5 font-medium">عنوان الواجب العملي</th>
                <th className="px-4 py-3.5 font-medium">المختبر</th>
                <th className="px-4 py-3.5 font-medium">الصعوبة</th>
                <th className="px-4 py-3.5 font-medium">موعد التسليم</th>
                <th className="px-4 py-3.5 font-medium">المحاولات</th>
                <th className="px-4 py-3.5 font-medium">الحالة والعلامة</th>
                <th className="px-4 py-3.5 font-medium">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
              {filteredList.map(({ assignment, submission, status, daysLeft }) => {
                const finalScore =
                  submission?.manualScoreOverride ??
                  submission?.autoGrade?.autoScore;

                return (
                  <tr
                    key={assignment.id}
                    className="hover:bg-[#F5F6F8]/70 dark:hover:bg-[#0A1630]/50"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {assignment.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#526077]">
                        إشراف: {assignment.createdByTeacherName}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {LAB_TITLES[assignment.labId]}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {assignment.difficulty}
                    </td>
                    <td className="px-4 py-4 font-tabular">
                      <span className="block font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                        {assignment.dueDate}
                      </span>
                      <span className="text-[11px] text-[#2F6BFF]">
                        {daysLeft >= 0
                          ? `باقي ${daysLeft} يوم`
                          : `متأخر بـ ${Math.abs(daysLeft)} يوم`}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-tabular">
                      {submission?.attemptsUsed || 0} /{' '}
                      {assignment.allowedAttempts}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {typeof finalScore === 'number' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.5] text-emerald-600" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                        )}
                        <span>{status}</span>
                      </span>
                      {typeof finalScore === 'number' && (
                        <p className="mt-0.5 font-tabular text-xs font-bold text-[#2F6BFF]">
                          {finalScore} / {assignment.maxScore}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/labs/${assignment.labId}?assignmentId=${assignment.id}`}
                        >
                          <Button size="sm" className="h-8 gap-1.5 text-xs">
                            <Play className="h-3.5 w-3.5 stroke-[1.5]" />
                            <span>ابدأ الحل</span>
                          </Button>
                        </Link>
                        {submission?.autoGrade && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              setSelectedDetailsId(
                                selectedDetailsId === assignment.id
                                  ? null
                                  : assignment.id
                              )
                            }
                            className="h-8 text-xs"
                          >
                            تفاصيل العلامة
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detailed Grade & Teacher Feedback Drawer/Card */}
      {selectedDetailItem?.submission?.autoGrade && (
        <div className="mt-6 rounded-[16px] border border-[#2F6BFF]/40 bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
            <div>
              <h3 className="text-sm font-semibold">
                تفاصيل التصحيح الآلي وملاحظات المعلم —{' '}
                {selectedDetailItem.assignment.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#526077]">
                {selectedDetailItem.submission.autoGrade.summaryFeedback}
              </p>
            </div>
            <span className="font-tabular text-lg font-bold text-[#2F6BFF]">
              {selectedDetailItem.submission.manualScoreOverride ??
                selectedDetailItem.submission.autoGrade.autoScore}{' '}
              / {selectedDetailItem.assignment.maxScore}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {selectedDetailItem.submission.autoGrade.criteriaBreakdown.map(
              (c, idx) => (
                <div
                  key={idx}
                  className="rounded-[12px] border border-[#E3E8F0] bg-[#F5F6F8] p-3.5 text-xs dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{c.criterion}</span>
                    <span className="font-tabular text-[#2F6BFF]">
                      {c.earnedPoints}/{c.maxPoints}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                    {c.explanation}
                  </p>
                </div>
              )
            )}
          </div>

          {selectedDetailItem.submission.teacherFeedback && (
            <div className="mt-4 flex items-start gap-2 rounded-[12px] border border-[#E3E8F0] bg-[#EBF1FF]/40 p-4 text-xs dark:border-[#1E325C] dark:bg-[#2F6BFF]/10">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 stroke-[1.5] text-[#2F6BFF]" />
              <div>
                <p className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  ملاحظة المعلم المراجِعة:
                </p>
                <p className="mt-0.5 text-[#526077] dark:text-[#94A3B8]">
                  {selectedDetailItem.submission.teacherFeedback}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
