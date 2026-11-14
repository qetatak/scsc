'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  FlaskConical,
  Save,
  Send,
} from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';
import { triggerHaptic } from '@/lib/haptics';
import { AssignmentDifficulty, LabId } from '@/types';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LAB_OPTIONS: { id: LabId; title: string; subtitle: string }[] = [
  {
    id: 'accounting',
    title: 'مختبر المحاسبة المالية',
    subtitle: 'دفتر اليومية، توازن المدين والدائن، والترحيل لدفتر الأستاذ',
  },
  {
    id: 'marketing',
    title: 'مختبر التسويق الرقمي',
    subtitle: 'توزيع الميزانية الإعلانية، تحقيق ROI مستهدف، وتقليص CAC',
  },
  {
    id: 'management',
    title: 'مختبر إدارة الأعمال',
    subtitle: 'قرارات استراتيجية تشغيلية ونقطة التعادل مع متغيرات عشوائية لكل طالب',
  },
  {
    id: 'python',
    title: 'مختبر البرمجة (Python)',
    subtitle: 'كتابة دوال برمجية واجتياز اختبارات التحقق التلقائية المخفية',
  },
];

function NewAssignmentWizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  const { classes, templates, createAssignment } = useTeacherStore();
  const selectedTemplate = templates.find((t) => t.id === templateId);
  const { keyboardHeight } = useKeyboardOffset(true);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [title, setTitle] = useState(selectedTemplate?.title || '');
  const [instructions, setInstructions] = useState(
    selectedTemplate?.instructions ||
      'أكمل المهمة العملية المطلوبة داخل المختبر التفاعلي وتحقق من توازن المؤشرات قبل الإرسال.'
  );
  const [targetClassId, setTargetClassId] = useState(
    classes[0]?.id || 'cls-acc-101'
  );
  const [difficulty, setDifficulty] = useState<AssignmentDifficulty>(
    selectedTemplate?.difficulty || 'متوسط'
  );

  const [labId, setLabId] = useState<LabId>(
    selectedTemplate?.labId || 'accounting'
  );

  const [accDebitAccount, setAccDebitAccount] = useState('النقدية في الصندوق');
  const [accCreditAccount, setAccCreditAccount] = useState('رأس المال');
  const [accAmount, setAccAmount] = useState(25000);

  const [mktMaxBudget, setMktMaxBudget] = useState(4000);
  const [mktMinRoi, setMktMinRoi] = useState(40);
  const [mktMinCustomers, setMktMinCustomers] = useState(45);
  const [mktMaxCac, setMktMaxCac] = useState(75);

  const [mgmtFixedCosts, setMgmtFixedCosts] = useState(24000);
  const [mgmtVarCost, setMgmtVarCost] = useState(35);
  const [mgmtPrice, setMgmtPrice] = useState(75);
  const [mgmtRandomize, setMgmtRandomize] = useState(true);

  const [pyFunctionName, setPyFunctionName] = useState('calculate_net_profit');
  const [pyStarterCode, setPyStarterCode] = useState(
    'def calculate_net_profit(revenue, expenses, tax_rate):\n    gross = revenue - expenses\n    return round(gross * (1 - tax_rate), 2)\n'
  );
  const [pyTestExpr, setPyTestExpr] = useState(
    'calculate_net_profit(10000, 6000, 0.15)'
  );
  const [pyExpectedOut, setPyExpectedOut] = useState('3400.0');

  const [dueDate, setDueDate] = useState('2026-11-30');
  const [allowedAttempts, setAllowedAttempts] = useState(
    selectedTemplate?.allowedAttempts || 3
  );
  const [maxScore, setMaxScore] = useState(selectedTemplate?.maxScore || 100);
  const [showModelAnswer, setShowModelAnswer] = useState(true);

  const selectedClass =
    classes.find((c) => c.id === targetClassId) || classes[0];

  const handleSave = (status: 'منشور' | 'مسودة') => {
    if (!title.trim()) {
      triggerHaptic('error');
      toast.error('يرجى إدخال عنوان الواجب العملي.');
      setStep(1);
      return;
    }

    const created = createAssignment({
      title: title.trim(),
      labId,
      instructions: instructions.trim(),
      difficulty,
      maxScore: Number(maxScore) || 100,
      dueDate,
      allowedAttempts: Number(allowedAttempts) || 3,
      showModelAnswerAfterSubmit: showModelAnswer,
      targetClassId: selectedClass?.id || 'cls-acc-101',
      targetStudentUsernames: [],
      status,
      accountingConfig:
        labId === 'accounting'
          ? {
              operationsPrompt: [instructions.trim()],
              modelEntries: [
                {
                  id: 'je-model-1',
                  description: instructions.trim(),
                  debitAccount: accDebitAccount,
                  creditAccount: accCreditAccount,
                  debitAmount: Number(accAmount),
                  creditAmount: Number(accAmount),
                },
              ],
              availableAccounts: [
                accDebitAccount,
                accCreditAccount,
                'النقدية في الصندوق',
                'البنك العربي',
                'رأس المال',
                'المبيعات',
              ],
            }
          : undefined,
      marketingConfig:
        labId === 'marketing'
          ? {
              scenarioContext: instructions.trim(),
              maxBudgetJod: Number(mktMaxBudget),
              minRoiPercent: Number(mktMinRoi),
              maxCacJod: Number(mktMaxCac),
              minCustomers: Number(mktMinCustomers),
            }
          : undefined,
      managementConfig:
        labId === 'management'
          ? {
              mode: 'breakeven',
              baseFixedCosts: Number(mgmtFixedCosts),
              baseVariableCostPerUnit: Number(mgmtVarCost),
              baseSellingPricePerUnit: Number(mgmtPrice),
              randomizePerStudent: mgmtRandomize,
              tolerancePercent: 5,
              swotMinItemsPerQuadrant: 2,
              swotRequiredKeywords: ['تكلفة', 'سوق'],
            }
          : undefined,
      pythonConfig:
        labId === 'python'
          ? {
              functionName: pyFunctionName.trim(),
              starterCode: pyStarterCode,
              referenceSolution: pyStarterCode,
              timeoutMs: 3000,
              testCases: [
                {
                  id: 'tc-1',
                  label: 'حالة اختبار أساسية (مرئية للطالب)',
                  inputExpr: pyTestExpr,
                  expectedOutput: pyExpectedOut,
                  isHidden: false,
                  weight: 50,
                },
                {
                  id: 'tc-2',
                  label: 'حالة اختبار حافة (مخفية للتصحيح)',
                  inputExpr: pyTestExpr,
                  expectedOutput: pyExpectedOut,
                  isHidden: true,
                  weight: 50,
                },
              ],
            }
          : undefined,
    });

    triggerHaptic('success');
    toast.success(
      status === 'منشور'
        ? 'تم نشر الواجب العملي للشعبة الدراسية'
        : 'تم حفظ الواجب كمسودة'
    );
    router.push(`/teacher/assignments/${created.id}`);
  };

  return (
    <div
      style={{
        paddingBottom: keyboardHeight > 0 ? keyboardHeight + 96 : undefined,
      }}
      className="pb-20 lg:pb-0"
    >
      <PageHeader
        title="إنشاء واجب عملي تفاعلي"
        description="صمم مهمة عملية مرتبطة بمختبر محدد مع تصحيح تلقائي فوري."
      />

      <div className="mb-5 rounded-[16px] border border-[#E3E8F0] bg-white p-3.5 sm:p-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {[
            { num: 1, label: 'بيانات الواجب' },
            { num: 2, label: 'المختبر والمهمة' },
            { num: 3, label: 'التصحيح والموعد' },
            { num: 4, label: 'المعاينة والنشر' },
          ].map((item) => {
            const isActive = step === item.num;
            const isDone = step > item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => setStep(item.num as 1 | 2 | 3 | 4)}
                className={`flex min-h-[44px] items-center gap-2 rounded-[10px] border p-2.5 text-right transition-colors ${
                  isActive
                    ? 'border-[#2F6BFF] bg-[#2F6BFF]/8 text-[#0A1630] dark:text-[#FAFBFC]'
                    : isDone
                    ? 'border-[#E3E8F0] bg-[#FAFBFC] text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]'
                    : 'border-[#E3E8F0] text-[#526077] dark:border-[#1E325C] dark:text-[#94A3B8]'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-tabular text-xs font-bold ${
                    isActive || isDone
                      ? 'bg-[#2F6BFF] text-white'
                      : 'bg-[#E3E8F0] text-[#526077] dark:bg-[#1E325C] dark:text-[#94A3B8]'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[2]" /> : item.num}
                </span>
                <span className="truncate text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              الخطوة 1: المعلومات الأساسية والشعبة المستهدفة
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="asg-title">عنوان الواجب العملي</Label>
                <Input
                  id="asg-title"
                  enterKeyHint="next"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: قيود تأسيس شركة أفق"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="asg-class">الشعبة الدراسية</Label>
                <select
                  id="asg-class"
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="mt-1.5 flex min-h-[46px] w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-base sm:text-sm text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseName} ({c.courseCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="asg-desc">تعليمات الواجب والسيناريو العملي</Label>
              <textarea
                id="asg-desc"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-base sm:text-sm text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="asg-diff">مستوى الصعوبة</Label>
                <select
                  id="asg-diff"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as AssignmentDifficulty)
                  }
                  className="mt-1.5 flex min-h-[46px] w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-base sm:text-sm text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
                >
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
              </div>
              <div>
                <Label htmlFor="asg-score">الدرجة القصوى للواجب</Label>
                <Input
                  id="asg-score"
                  type="number"
                  inputMode="numeric"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="mt-1.5 font-tabular"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              الخطوة 2: اختيار المختبر وتخصيص شروط المهمة
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {LAB_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLabId(opt.id)}
                  className={`flex min-h-[56px] items-start gap-3 rounded-[12px] border p-4 text-right transition-colors ${
                    labId === opt.id
                      ? 'border-[#2F6BFF] bg-[#2F6BFF]/8'
                      : 'border-[#E3E8F0] hover:border-[#94A3B8] dark:border-[#1E325C]'
                  }`}
                >
                  <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 stroke-[1.5] text-[#2F6BFF]" />
                  <div>
                    <div className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {opt.title}
                    </div>
                    <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                      {opt.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {labId === 'accounting' && (
              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <h3 className="mb-3 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  شروط الحل المحاسبي المتوقع
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label>الحساب المدين المتوقع</Label>
                    <Input
                      value={accDebitAccount}
                      onChange={(e) => setAccDebitAccount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>الحساب الدائن المتوقع</Label>
                    <Input
                      value={accCreditAccount}
                      onChange={(e) => setAccCreditAccount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>المبلغ المالي المطلوب (د.أ)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={accAmount}
                      onChange={(e) => setAccAmount(Number(e.target.value))}
                      className="mt-1 font-tabular"
                    />
                  </div>
                </div>
              </div>
            )}

            {labId === 'marketing' && (
              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <h3 className="mb-3 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  الأهداف الرقمية للحملة الإعلانية
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <Label>سقف الميزانية ($)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={mktMaxBudget}
                      onChange={(e) => setMktMaxBudget(Number(e.target.value))}
                      className="mt-1 font-tabular"
                    />
                  </div>
                  <div>
                    <Label>الحد الأدنى للعائد ROI (%)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={mktMinRoi}
                      onChange={(e) => setMktMinRoi(Number(e.target.value))}
                      className="mt-1 font-tabular"
                    />
                  </div>
                  <div>
                    <Label>الحد الأدنى للعملاء</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={mktMinCustomers}
                      onChange={(e) =>
                        setMktMinCustomers(Number(e.target.value))
                      }
                      className="mt-1 font-tabular"
                    />
                  </div>
                  <div>
                    <Label>الحد الأقصى CAC ($)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={mktMaxCac}
                      onChange={(e) => setMktMaxCac(Number(e.target.value))}
                      className="mt-1 font-tabular"
                    />
                  </div>
                </div>
              </div>
            )}

            {labId === 'management' && (
              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <h3 className="mb-3 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  شروط حساب نقطة التعادل
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label>التكاليف الثابتة (د.أ)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={mgmtFixedCosts}
                      onChange={(e) => setMgmtFixedCosts(Number(e.target.value))}
                      className="mt-1 font-tabular"
                    />
                  </div>
                  <div>
                    <Label>التكلفة المتغيرة للوحدة (د.أ)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={mgmtVarCost}
                      onChange={(e) => setMgmtVarCost(Number(e.target.value))}
                      className="mt-1 font-tabular"
                    />
                  </div>
                  <div>
                    <Label>سعر بيع الوحدة (د.أ)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={mgmtPrice}
                      onChange={(e) => setMgmtPrice(Number(e.target.value))}
                      className="mt-1 font-tabular"
                    />
                  </div>
                </div>
                <label className="mt-4 flex min-h-[40px] items-center gap-2.5 text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  <input
                    type="checkbox"
                    checked={mgmtRandomize}
                    onChange={(e) => setMgmtRandomize(e.target.checked)}
                    className="h-5 w-5 rounded border-[#E3E8F0] accent-[#2F6BFF]"
                  />
                  <span>
                    توليد متغيرات رقمية عشوائية لكل طالب لمنع نقل الإجابات
                  </span>
                </label>
              </div>
            )}

            {labId === 'python' && (
              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <h3 className="mb-3 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  إعدادات دالة Python وحالات الاختبار
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label>اسم الدالة</Label>
                    <Input
                      value={pyFunctionName}
                      onChange={(e) => setPyFunctionName(e.target.value)}
                      dir="ltr"
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label>تعبير الاختبار</Label>
                    <Input
                      value={pyTestExpr}
                      onChange={(e) => setPyTestExpr(e.target.value)}
                      dir="ltr"
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label>المخرج المتوقع</Label>
                    <Input
                      value={pyExpectedOut}
                      onChange={(e) => setPyExpectedOut(e.target.value)}
                      dir="ltr"
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label>الكود المبدئي (Starter Code)</Label>
                  <textarea
                    rows={4}
                    dir="ltr"
                    value={pyStarterCode}
                    onChange={(e) => setPyStarterCode(e.target.value)}
                    className="mobile-code-editor mt-1 w-full rounded-[10px] border border-[#E3E8F0] bg-white p-3 font-mono text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              الخطوة 3: الموعد النهائي وعدد المحاولات
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>تاريخ التسليم النهائي</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1.5 font-tabular"
                />
              </div>
              <div>
                <Label>الحد الأقصى للمحاولات</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  value={allowedAttempts}
                  onChange={(e) => setAllowedAttempts(Number(e.target.value))}
                  className="mt-1.5 font-tabular"
                />
              </div>
              <div>
                <Label>الدرجة القصوى</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  className="mt-1.5 font-tabular"
                />
              </div>
            </div>

            <label className="flex min-h-[44px] items-center gap-2.5 text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              <input
                type="checkbox"
                checked={showModelAnswer}
                onChange={(e) => setShowModelAnswer(e.target.checked)}
                className="h-5 w-5 rounded border-[#E3E8F0] accent-[#2F6BFF]"
              />
              <span>إظهار تفصيل التصحيح والحل النموذجي للطالب فور التسليم</span>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                الخطوة 4: معاينة الواجب والنشر
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#2F6BFF]/10 px-2.5 py-1 text-xs font-semibold text-[#2F6BFF]">
                <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
                معاينة حية
              </span>
            </div>

            <div className="rounded-[14px] border border-[#1E325C] bg-[#0A1630] p-4 text-white sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E325C] pb-3">
                <div>
                  <span className="text-[11px] font-semibold text-[#2F6BFF]">
                    {selectedClass?.courseName}
                  </span>
                  <h3 className="mt-0.5 text-base font-semibold">
                    {title || 'عنوان الواجب العملي'}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tabular text-xs">
                  <span className="rounded-[8px] bg-[#132347] px-2.5 py-1">
                    الموعد: {dueDate}
                  </span>
                  <span className="rounded-[8px] bg-[#132347] px-2.5 py-1">
                    المحاولات: {allowedAttempts}
                  </span>
                  <span className="rounded-[8px] bg-[#2F6BFF] px-2.5 py-1 font-semibold">
                    الدرجة: {maxScore}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#D6DEEB]">
                {instructions}
              </p>
            </div>

            <div className="hidden flex-wrap items-center justify-end gap-3 border-t border-[#E3E8F0] pt-4 lg:flex dark:border-[#1E325C]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSave('مسودة')}
                className="gap-1.5"
              >
                <Save className="h-4 w-4 stroke-[1.5]" />
                <span>حفظ كمسودة</span>
              </Button>
              <Button
                type="button"
                onClick={() => handleSave('منشور')}
                className="gap-1.5"
              >
                <Send className="h-4 w-4 stroke-[1.5]" />
                <span>نشر الواجب لطلاب الشعبة الآن</span>
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Inline Prev / Next Footer */}
        <div className="mt-6 hidden items-center justify-between border-t border-[#E3E8F0] pt-4 lg:flex dark:border-[#1E325C]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4)}
            className="gap-1.5"
          >
            <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>السابق</span>
          </Button>

          {step < 4 && (
            <Button
              type="button"
              size="sm"
              onClick={() => setStep((s) => Math.min(4, s + 1) as 1 | 2 | 3 | 4)}
              className="gap-1.5"
            >
              <span>الخطوة التالية</span>
              <ArrowLeft className="h-3.5 w-3.5 stroke-[1.5]" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Sticky Bottom Wizard Navigation Bar (< lg), cleared safely above capsule or keyboard */}
      <div
        style={{
          bottom:
            keyboardHeight > 0
              ? keyboardHeight
              : 'calc(5.25rem + env(safe-area-inset-bottom))',
        }}
        className="fixed inset-x-3 z-30 mx-auto flex max-w-xl items-center justify-between gap-2 rounded-[16px] border border-[#E3E8F0] bg-white/95 p-2.5 shadow-lg backdrop-blur-md lg:hidden dark:border-[#1E325C] dark:bg-[#0A1630]/95"
      >
        <Button
          type="button"
          variant="outline"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4)}
          className="min-h-[44px] gap-1.5 px-4"
        >
          <ArrowRight className="h-4 w-4 stroke-[1.5]" />
          <span>السابق</span>
        </Button>

        {step < 4 ? (
          <Button
            type="button"
            onClick={() => setStep((s) => Math.min(4, s + 1) as 1 | 2 | 3 | 4)}
            className="min-h-[44px] flex-1 gap-1.5"
          >
            <span>الخطوة التالية</span>
            <ArrowLeft className="h-4 w-4 stroke-[1.5]" />
          </Button>
        ) : (
          <div className="flex flex-1 items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSave('مسودة')}
              className="min-h-[44px] px-3 text-xs"
            >
              مسودة
            </Button>
            <Button
              type="button"
              onClick={() => handleSave('منشور')}
              className="min-h-[44px] flex-1 gap-1.5 text-xs"
            >
              <Send className="h-4 w-4 stroke-[1.5]" />
              <span>نشر الواجب</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewAssignmentWizardPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm">جاري تحميل معالج الواجبات...</div>}
    >
      <NewAssignmentWizardInner />
    </Suspense>
  );
}
