'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  Save,
  XCircle,
} from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { AssignmentSubmission } from '@/types';
import {
  ChartCard,
  DataTable,
  DataTableColumn,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TeacherAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    assignments,
    submissions,
    classes,
    reviewSubmission,
    reopenSubmissionAttempt,
  } = useTeacherStore();

  const assignment =
    assignments.find((a) => a.id === id) || assignments[0];

  const cls = classes.find((c) => c.id === assignment?.targetClassId);

  const assignmentSubs = submissions.filter(
    (s) => s.assignmentId === assignment?.id
  );

  const [selectedSubId, setSelectedSubId] = useState<string>(
    assignmentSubs[0]?.id || ''
  );

  const activeSub =
    assignmentSubs.find((s) => s.id === selectedSubId) ||
    assignmentSubs[0] ||
    null;

  const initialScore = activeSub
    ? activeSub.manualScoreOverride ?? activeSub.autoGrade?.autoScore ?? 85
    : 85;

  const [manualScore, setManualScore] = useState<string>(String(initialScore));
  const [feedbackText, setFeedbackText] = useState<string>(
    activeSub?.teacherFeedback || ''
  );

  const handleSelectSubmission = (sub: AssignmentSubmission) => {
    setSelectedSubId(sub.id);
    setManualScore(
      String(sub.manualScoreOverride ?? sub.autoGrade?.autoScore ?? 85)
    );
    setFeedbackText(sub.teacherFeedback || '');
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;
    const scoreNum = Math.min(100, Math.max(0, Number(manualScore) || 0));
    reviewSubmission({
      submissionId: activeSub.id,
      manualScoreOverride: scoreNum,
      teacherFeedback: feedbackText.trim(),
    });
    toast.success(`تم اعتماد الدرجة (${scoreNum}/100) وحفظ الملاحظات للطالب`);
  };

  const handleReopenAttempt = () => {
    if (!activeSub) return;
    reopenSubmissionAttempt(activeSub.id);
    toast.success(`تم إعادة فتح المحاولة للطالب ${activeSub.studentName}`);
  };

  const columns: DataTableColumn<AssignmentSubmission>[] = [
    {
      key: 'studentName',
      header: 'الطالب',
      sortable: true,
      sortValue: (r) => r.studentName,
      render: (r) => (
        <div>
          <button
            type="button"
            onClick={() => handleSelectSubmission(r)}
            className="font-semibold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
          >
            {r.studentName}
          </button>
          <p className="font-mono text-[11px] text-[#526077] dark:text-[#94A3B8]">
            @{r.studentUsername}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'حالة التسليم',
      render: (r) => (
        <span
          className={`inline-flex rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${
            r.status === 'تمت المراجعة' || r.status === 'مُصحَّح آلياً'
              ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
              : r.status === 'متأخر'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
              : 'bg-[#E3E8F0] text-[#526077] dark:bg-[#1E325C] dark:text-[#94A3B8]'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'attemptsUsed',
      header: 'المحاولات',
      render: (r) => (
        <span className="font-tabular text-xs">
          {r.attemptsUsed} / {assignment?.allowedAttempts || 3}
        </span>
      ),
    },
    {
      key: 'timeSpentMinutes',
      header: 'الوقت المستغرق',
      sortable: true,
      sortValue: (r) => r.timeSpentMinutes,
      render: (r) => (
        <span className="inline-flex items-center gap-1 font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
          <Clock className="h-3.5 w-3.5 stroke-[1.5]" />
          {r.timeSpentMinutes} دقيقة
        </span>
      ),
    },
    {
      key: 'autoScore',
      header: 'التصحيح التلقائي',
      sortable: true,
      sortValue: (r) => r.autoGrade?.autoScore ?? 0,
      render: (r) => (
        <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
          {r.autoGrade?.autoScore ?? 0}%
        </span>
      ),
    },
    {
      key: 'finalScore',
      header: 'الدرجة النهائية',
      sortable: true,
      sortValue: (r) => r.manualScoreOverride ?? r.autoGrade?.autoScore ?? 0,
      render: (r) => (
        <span className="font-tabular font-bold text-[#2F6BFF]">
          {r.manualScoreOverride ?? r.autoGrade?.autoScore ?? 0} /{' '}
          {assignment?.maxScore || 100}
        </span>
      ),
    },
    {
      key: 'inspect',
      header: 'فحص الحل',
      render: (r) => (
        <Button
          type="button"
          variant={activeSub?.id === r.id ? 'default' : 'secondary'}
          size="sm"
          onClick={() => handleSelectSubmission(r)}
          className="h-7 text-xs"
        >
          مراجعة الخطوات
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`مراجعة التسليمات: ${assignment?.title || 'واجب عملي'}`}
        description={`${cls?.courseName || 'الشعبة الدراسية'} — الموعد النهائي: ${assignment?.dueDate} — الدرجة القصوى: ${assignment?.maxScore}`}
        actions={
          <Link href="/teacher/assignments">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>العودة للواجبات</span>
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <ChartCard
          title="سجل تسليمات الطلاب"
          subtitle="اختر أي طالب من الجدول لعرض خطوات حله العملية جنباً إلى جنب مع بطاقة التصحيح التلقائي."
        >
          <DataTable
            data={assignmentSubs}
            columns={columns}
            rowKey={(r) => r.id}
            searchPlaceholder="ابحث باسم الطالب..."
            searchMatcher={(r, q) =>
              r.studentName.toLowerCase().includes(q) ||
              r.studentUsername.toLowerCase().includes(q)
            }
            pageSize={5}
          />
        </ChartCard>
      </div>

      {activeSub && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ChartCard
            title={`خطوات الحل العملي للطالب: ${activeSub.studentName}`}
            subtitle={`تاريخ التسليم: ${activeSub.submittedAt || 'قيد الحل'} — المحاولات المستهلكة: ${activeSub.attemptsUsed}`}
            className="lg:col-span-7"
            action={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleReopenAttempt}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>إعادة فتح المحاولة للطالب</span>
              </Button>
            }
          >
            <div className="space-y-4">
              {activeSub.payload.accountingEntries && (
                <div className="rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]">
                  <h4 className="mb-2.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    قيود دفتر اليومية المُدخلة من الطالب:
                  </h4>

                  <div className="space-y-2 md:hidden">
                    {activeSub.payload.accountingEntries.map((entry, i) => (
                      <div
                        key={i}
                        className="rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs space-y-1.5 dark:border-[#1E325C] dark:bg-[#0A1630]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                            مدين: {entry.debitAccount}
                          </span>
                          <span className="font-tabular font-bold text-[#2F6BFF]">
                            {entry.debitAmount.toLocaleString('en-US')} د.أ
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-[#526077] dark:text-[#94A3B8]">
                          <span>دائن: {entry.creditAccount}</span>
                          <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                            {entry.creditAmount.toLocaleString('en-US')} د.أ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-[#E3E8F0] text-[#526077] dark:border-[#1E325C] dark:text-[#94A3B8]">
                          <th className="pb-2">الحساب المدين</th>
                          <th className="pb-2">الحساب الدائن</th>
                          <th className="pb-2">مدين (د.أ)</th>
                          <th className="pb-2">دائن (د.أ)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
                        {activeSub.payload.accountingEntries.map((entry, i) => (
                          <tr key={i}>
                            <td className="py-2 font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                              {entry.debitAccount}
                            </td>
                            <td className="py-2 text-[#526077] dark:text-[#94A3B8]">
                              {entry.creditAccount}
                            </td>
                            <td className="py-2 font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                              {entry.debitAmount.toLocaleString('en-US')}
                            </td>
                            <td className="py-2 font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                              {entry.creditAmount.toLocaleString('en-US')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSub.payload.marketingSolution && (
                <div className="rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]">
                  <h4 className="mb-2.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    إعدادات الحملة التسويقية المقدمة من الطالب:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-[8px] bg-[#FAFBFC] p-3 dark:bg-[#0A1630]">
                      <div className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                        القناة الإعلانية
                      </div>
                      <div className="mt-1 font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {activeSub.payload.marketingSolution.channelId}
                      </div>
                    </div>
                    <div className="rounded-[8px] bg-[#FAFBFC] p-3 dark:bg-[#0A1630]">
                      <div className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                        سعر المنتج
                      </div>
                      <div className="mt-1 font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        ${activeSub.payload.marketingSolution.productPrice}
                      </div>
                    </div>
                    <div className="rounded-[8px] bg-[#FAFBFC] p-3 dark:bg-[#0A1630]">
                      <div className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                        الميزانية الإعلانية
                      </div>
                      <div className="mt-1 font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        ${activeSub.payload.marketingSolution.adBudget}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSub.payload.managementSolution && (
                <div className="rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]">
                  <h4 className="mb-2.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    حسابات نقطة التعادل والمتغيرات المخصصة للطالب:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-[8px] bg-[#FAFBFC] p-3 dark:bg-[#0A1630]">
                      نقطة التعادل المحسوبة:{' '}
                      <strong className="font-tabular">
                        {activeSub.payload.managementSolution.studentBreakEvenUnits} وحدة
                      </strong>
                    </div>
                    <div className="rounded-[8px] bg-[#FAFBFC] p-3 dark:bg-[#0A1630]">
                      هامش المساهمة:{' '}
                      <strong className="font-tabular">
                        {activeSub.payload.managementSolution.studentContributionMargin} د.أ
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {activeSub.payload.pythonSolution && (
                <div className="rounded-[12px] border border-[#E3E8F0] bg-[#0A1630] p-4 text-white">
                  <h4 className="mb-2 text-xs font-semibold text-[#94A3B8]">
                    الكود البرمجي المُسلَّم (Python):
                  </h4>
                  <pre
                    dir="ltr"
                    className="overflow-x-auto font-mono text-xs leading-relaxed text-[#E3E8F0]"
                  >
                    {activeSub.payload.pythonSolution.code}
                  </pre>
                </div>
              )}
            </div>
          </ChartCard>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
              <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
                <div>
                  <span className="text-[11px] font-semibold text-[#2F6BFF]">
                    بطاقة التصحيح التلقائي (Auto-Grader Info Card)
                  </span>
                  <h3 className="mt-0.5 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    تفصيل معايير التقييم
                  </h3>
                </div>
                <div className="text-left">
                  <div className="font-tabular text-2xl font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                    {activeSub.autoGrade?.autoScore ?? 0}%
                  </div>
                  <div className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                    درجة المحرك
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {activeSub.autoGrade?.criteriaBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 dark:border-[#1E325C] dark:bg-[#0A1630]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {item.passed ? (
                          <CheckCircle2 className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
                        ) : (
                          <XCircle className="h-4 w-4 stroke-[1.5] text-red-500" />
                        )}
                        {item.criterion}
                      </span>
                      <span className="font-tabular text-xs font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                        {item.earnedPoints} / {item.maxPoints}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSaveOverride}
              className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
            >
              <h3 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                تعديل الدرجة يدوياً وإضافة توجيه أكاديمي
              </h3>
              <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                يمكنك اعتماد الدرجة التلقائية كما هي أو تعديلها مع إرسال ملاحظات مفصلة للطالب.
              </p>

              <div className="mt-4">
                <Label htmlFor="manual-score">الدرجة النهائية المعتمدة (من 100)</Label>
                <Input
                  id="manual-score"
                  type="number"
                  min={0}
                  max={100}
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  className="mt-1.5 font-tabular"
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="teacher-feedback">ملاحظات المعلم للطالب</Label>
                <textarea
                  id="teacher-feedback"
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="اكتب ملاحظاتك الأكاديمية حول خطوات الحل..."
                  className="mt-1.5 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" size="sm" className="gap-1.5">
                  <Save className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>اعتماد الدرجة وحفظ التوجيه</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
