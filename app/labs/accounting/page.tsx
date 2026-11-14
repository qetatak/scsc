'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Play,
  Award,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ACCOUNTING_SCENARIOS,
  ACCOUNTING_QUIZ_QUESTIONS,
  AccountingScenario,
  applyAccountingScenario,
  JournalEntryResult,
} from '@/lib/labs/accounting';
import { calculateSkillLevelFromXp } from '@/lib/labs/skill-calculator';
import { triggerHaptic } from '@/lib/haptics';
import { useAppStore } from '@/store/use-app-store';
import { VirtualCompanyBar } from '@/components/shared/virtual-company-bar';
import { CertificateModal } from '@/components/shared/certificate-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function AccountingLabPage() {
  const virtualCompany = useAppStore((s) => s.virtualCompany);
  const updateVirtualCompany = useAppStore((s) => s.updateVirtualCompany);
  const awardLabXp = useAppStore((s) => s.awardLabXp);
  const currentStudent = useAppStore((s) => s.currentStudent);

  const [selectedScenario, setSelectedScenario] = useState<AccountingScenario>(
    ACCOUNTING_SCENARIOS[0]
  );
  const [customAmount, setCustomAmount] = useState<string>(
    String(ACCOUNTING_SCENARIOS[0].defaultAmount)
  );
  const [lastJournal, setLastJournal] = useState<JournalEntryResult | null>(null);
  const [journalHistory, setJournalHistory] = useState<JournalEntryResult[]>([]);

  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const accountingXp = currentStudent.labXp.accounting || 0;
  const skillInfo = calculateSkillLevelFromXp(accountingXp);

  const handleSelectScenario = (scenario: AccountingScenario) => {
    triggerHaptic('tap');
    setSelectedScenario(scenario);
    setCustomAmount(String(scenario.defaultAmount));
  };

  const handleExecuteTransaction = () => {
    const parsedAmount = Number(customAmount) || selectedScenario.defaultAmount;
    const result = applyAccountingScenario(
      {
        assets: virtualCompany.assets,
        liabilities: virtualCompany.liabilities,
        equity: virtualCompany.equity,
      },
      selectedScenario,
      parsedAmount
    );

    const revDelta =
      (selectedScenario.revenueDeltaMultiplier || 0) * result.amount;
    const expDelta =
      (selectedScenario.expenseDeltaMultiplier || 0) * result.amount;
    const newRevenue = virtualCompany.revenue + revDelta;
    const newExpenses = virtualCompany.expenses + expDelta;

    updateVirtualCompany({
      assets: result.newAssets,
      liabilities: result.newLiabilities,
      equity: result.newEquity,
      capital: Math.max(0, virtualCompany.capital + result.assetsDelta),
      revenue: newRevenue,
      expenses: newExpenses,
      netProfit: newRevenue - newExpenses,
    });

    setLastJournal(result);
    setJournalHistory((prev) => [result, ...prev.slice(0, 5)]);
    awardLabXp(
      'accounting',
      selectedScenario.xpReward,
      `تنفيذ وموازنة قيد: ${selectedScenario.title}`
    );

    triggerHaptic('success');
    toast.success(
      `تم تسجيل القيد بنجاح! الميزانية متوازنة (+${selectedScenario.xpReward} XP)`
    );
  };

  const currentQuestion = ACCOUNTING_QUIZ_QUESTIONS[currentQuizIdx];

  const handleCheckQuiz = () => {
    if (!selectedOptionId) return;
    setQuizSubmitted(true);
    if (selectedOptionId === currentQuestion.correctOptionId) {
      triggerHaptic('success');
      awardLabXp(
        'accounting',
        currentQuestion.xpReward,
        'اجتياز اختبار قيود اليومية في مختبر المحاسبة'
      );
      toast.success(
        `إجابة صحيحة! حصلت على +${currentQuestion.xpReward} XP في المحاسبة.`
      );
    } else {
      triggerHaptic('error');
      toast.error('إجابة غير دقيقة، راجع التفسير المحاسبي أدناه وحاول مجدداً.');
    }
  };

  const handleNextQuestion = () => {
    triggerHaptic('tap');
    setSelectedOptionId(null);
    setQuizSubmitted(false);
    setCurrentQuizIdx((prev) => (prev + 1) % ACCOUNTING_QUIZ_QUESTIONS.length);
  };

  const totalRightSide = virtualCompany.liabilities + virtualCompany.equity;
  const isEquationBalanced = virtualCompany.assets === totalRightSide;
  const liabilitiesShare =
    totalRightSide > 0
      ? Math.round((virtualCompany.liabilities / totalRightSide) * 100)
      : 30;
  const equityShare = 100 - liabilitiesShare;

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 md:space-y-8 md:py-10 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <Link
            href="/labs"
            className="hidden items-center gap-2 text-xs font-medium text-[#526077] hover:text-[#2F6BFF] md:inline-flex dark:text-[#94A3B8]"
          >
            <ArrowRight className="h-4 w-4 stroke-[1.5]" />
            <span>العودة إلى جميع المختبرات</span>
          </Link>
          <h1 className="text-xl font-semibold text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
            مختبر المحاسبة المالية — محاكي الميزانية والقيود
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="default" className="px-3.5 py-1.5 text-xs">
            مستواك: {skillInfo.level} ({accountingXp} XP)
          </Badge>
          <CertificateModal
            studentName={currentStudent.fullName}
            labTitle="مختبر المحاسبة المالية"
            skillLevel={skillInfo.level}
            xpEarned={accountingXp}
          />
        </div>
      </div>

      {/* Sticky Live Mobile Balance Equation Strip */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 border-y border-[#E3E8F0] bg-[#FAFBFC]/95 px-4 py-2.5 backdrop-blur-md md:hidden dark:border-[#1E325C] dark:bg-[#070D1F]/95">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 font-tabular">
            <span>
              الأصول:{' '}
              <strong className="text-[#0A1630] dark:text-[#FAFBFC]">
                {virtualCompany.assets.toLocaleString('en-US')}
              </strong>
            </span>
            <span className="text-[#526077] dark:text-[#94A3B8]">=</span>
            <span>
              الخصوم+الملكية:{' '}
              <strong className="text-[#2F6BFF]">
                {totalRightSide.toLocaleString('en-US')}
              </strong>
            </span>
          </div>
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-[8px] px-2 py-0.5 text-[11px] font-medium',
              isEquationBalanced
                ? 'bg-[#22C55E]/15 text-[#22C55E]'
                : 'bg-red-500/15 text-red-600 dark:text-red-400'
            )}
          >
            <CheckCircle2 className="h-3 w-3 stroke-[1.75]" />
            <span>{isEquationBalanced ? 'متوازنة' : 'غير متوازنة'}</span>
          </span>
        </div>
      </div>

      {/* Live Virtual Company Bar */}
      <VirtualCompanyBar />

      {/* Visual Accounting Balance Equation Stage */}
      <section className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 md:p-8 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#2F6BFF] text-white">
              <Scale className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                ميزان معادلة الميزانية العمومية اللحظي
              </h2>
              <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                القاعدة الذهبية: الأصول = الالتزامات (الخصوم) + حقوق الملكية
              </p>
            </div>
          </div>

          <span
            className={cn(
              'inline-flex items-center gap-1.5 self-start rounded-[8px] border px-3 py-1 text-xs font-medium sm:self-auto',
              isEquationBalanced
                ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]'
                : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.75]" />
            <span>
              {isEquationBalanced
                ? 'المعادلة متوازنة (المدين = الدائن)'
                : 'المعادلة غير متوازنة'}
            </span>
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 items-center gap-4 lg:grid-cols-11">
          <div className="rounded-[14px] border border-[#2F6BFF]/30 bg-[#F1F4F9] p-4 sm:p-5 lg:col-span-5 dark:border-[#1E325C] dark:bg-[#070D1F]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#2F6BFF]">
                إجمالي الأصول (Assets - مدينة)
              </span>
              <span className="font-tabular text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
                100%
              </span>
            </div>
            <p className="font-tabular mt-2 text-2xl font-semibold text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
              {virtualCompany.assets.toLocaleString('en-US')} JOD
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#E3E8F0] dark:bg-[#1E325C]">
              <div className="h-full w-full rounded-full bg-[#2F6BFF] transition-all duration-500" />
            </div>
          </div>

          <div className="flex items-center justify-center lg:col-span-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3E8F0] bg-[#F1F4F9] text-xl font-semibold text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]">
              =
            </span>
          </div>

          <div className="rounded-[14px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 sm:p-5 lg:col-span-5 dark:border-[#1E325C] dark:bg-[#070D1F]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
              <span className="font-tabular text-[#0A1630] dark:text-[#FAFBFC]">
                الالتزامات: {virtualCompany.liabilities.toLocaleString('en-US')} ({liabilitiesShare}%)
              </span>
              <span className="font-tabular text-[#22C55E]">
                الملكية: {virtualCompany.equity.toLocaleString('en-US')} ({equityShare}%)
              </span>
            </div>
            <p className="font-tabular mt-2 text-2xl font-semibold text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
              {totalRightSide.toLocaleString('en-US')} JOD
            </p>
            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-[#E3E8F0] dark:bg-[#1E325C]">
              <div
                className="h-full bg-[#0A1630] transition-all duration-500 dark:bg-[#94A3B8]"
                style={{ width: `${liabilitiesShare}%` }}
                title="الالتزامات"
              />
              <div
                className="h-full bg-[#22C55E] transition-all duration-500"
                style={{ width: `${equityShare}%` }}
                title="حقوق الملكية"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="simulator" dir="rtl" className="w-full">
        <div className="flex items-center justify-start">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="simulator" className="flex-1 sm:flex-initial">
              <BookOpen className="ml-2 h-4 w-4 stroke-[1.5]" />
              <span>محاكي القيود (7 سيناريوهات)</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex-1 sm:flex-initial">
              <Award className="ml-2 h-4 w-4 stroke-[1.5]" />
              <span>وضع &ldquo;اختبرني&rdquo; (+75 XP)</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Interactive Scenarios */}
        <TabsContent value="simulator">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 lg:col-span-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <h3 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                1. اختر العملية المالية لتطبيقها
              </h3>

              <div className="space-y-2.5">
                {ACCOUNTING_SCENARIOS.map((sc) => {
                  const active = sc.id === selectedScenario.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleSelectScenario(sc)}
                      className={cn(
                        'flex min-h-[54px] w-full items-center justify-between gap-3 rounded-[12px] border p-3.5 text-right transition-colors cursor-pointer',
                        active
                          ? 'border-[#2F6BFF] bg-[#2F6BFF]/8 dark:bg-[#2F6BFF]/15'
                          : 'border-[#E3E8F0] bg-[#FAFBFC] hover:border-[#2F6BFF]/50 dark:border-[#1E325C] dark:bg-[#070D1F]'
                      )}
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium text-[#2F6BFF]">
                          {sc.category}
                        </span>
                        <p className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                          {sc.title}
                        </p>
                      </div>
                      <Badge variant="default">+{sc.xpReward} XP</Badge>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <label
                  htmlFor="acc-custom-amount"
                  className="block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]"
                >
                  2. أدخل قيمة العملية (JOD):
                </label>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Input
                    id="acc-custom-amount"
                    type="number"
                    inputMode="numeric"
                    enterKeyHint="done"
                    min={100}
                    step={100}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="font-tabular font-semibold"
                  />
                  <Button
                    type="button"
                    onClick={handleExecuteTransaction}
                    className="w-full shrink-0 sm:w-auto"
                  >
                    <Play className="h-4 w-4 stroke-[1.5]" />
                    <span>تنفيذ وتوليد القيد</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-5 lg:col-span-6">
              <div className="space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                    دفتر اليومية — القيد المزدوج
                  </h3>
                  <Badge variant="default">Debit / Credit</Badge>
                </div>

                {lastJournal ? (
                  <div className="space-y-4">
                    <div className="space-y-2.5 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 text-sm dark:border-[#1E325C] dark:bg-[#070D1F]">
                      <p className="text-xs font-medium text-[#526077] dark:text-[#94A3B8]">
                        العملية: {lastJournal.title}
                      </p>
                      <div className="rounded-[10px] border border-[#2F6BFF]/30 bg-white p-3 font-medium text-[#0A1630] dark:bg-[#0A1630] dark:text-[#FAFBFC]">
                        {lastJournal.debitLine}
                      </div>
                      <div className="mr-4 rounded-[10px] border border-[#22C55E]/30 bg-white p-3 font-medium text-[#0A1630] dark:bg-[#0A1630] dark:text-[#FAFBFC]">
                        {lastJournal.creditLine}
                      </div>
                    </div>

                    <details
                      open
                      className="group rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-[#2F6BFF]">
                        <span className="inline-flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 stroke-[1.5]" />
                          <span>لماذا حدث هذا؟ (التفسير المحاسبي)</span>
                        </span>
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                        {lastJournal.whyExplanation}
                      </p>
                    </details>
                  </div>
                ) : (
                  <div className="space-y-2 rounded-[12px] border border-dashed border-[#E3E8F0] p-6 text-center dark:border-[#1E325C]">
                    <Scale className="mx-auto h-7 w-7 stroke-[1.5] text-[#2F6BFF]" />
                    <p className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      اختر عملية مالية واضغط &ldquo;تنفيذ وتوليد القيد&rdquo;
                    </p>
                    <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                      سيظهر هنا القيد المزدوج مع شرح مفصل لأثره على الميزانية.
                    </p>
                  </div>
                )}
              </div>

              {journalHistory.length > 0 && (
                <div className="space-y-3 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
                  <h4 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    سجل القيود المنفذة ({journalHistory.length})
                  </h4>
                  <div className="space-y-2">
                    {journalHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3.5 py-2.5 text-xs dark:border-[#1E325C] dark:bg-[#070D1F]"
                      >
                        <span className="truncate font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                          {item.title}
                        </span>
                        <span className="font-tabular shrink-0 font-semibold text-[#2F6BFF]">
                          {item.amount.toLocaleString('en-US')} JOD
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Quiz Mode */}
        <TabsContent value="quiz">
          <div className="mx-auto max-w-3xl space-y-5 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-7 dark:border-[#1E325C] dark:bg-[#0A1630]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-tabular text-xs font-semibold text-[#2F6BFF]">
                سؤال {currentQuizIdx + 1} من {ACCOUNTING_QUIZ_QUESTIONS.length}
              </span>
              <Badge variant="default">+{currentQuestion.xpReward} XP</Badge>
            </div>

            <h3 className="text-base font-semibold leading-relaxed text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
              {currentQuestion.prompt}
            </h3>

            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.id === currentQuestion.correctOptionId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={quizSubmitted}
                    onClick={() => {
                      triggerHaptic('tap');
                      setSelectedOptionId(opt.id);
                    }}
                    className={cn(
                      'w-full space-y-1 rounded-[12px] border p-4 text-right transition-colors cursor-pointer',
                      quizSubmitted && isCorrect
                        ? 'border-[#22C55E] bg-[#22C55E]/10'
                        : quizSubmitted && isSelected && !isCorrect
                        ? 'border-red-500 bg-red-500/10'
                        : isSelected
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/10'
                        : 'border-[#E3E8F0] bg-[#FAFBFC] hover:border-[#2F6BFF]/50 dark:border-[#1E325C] dark:bg-[#070D1F]'
                    )}
                  >
                    <p className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      المدين: {opt.debit}
                    </p>
                    <p className="mr-4 text-sm text-[#526077] dark:text-[#94A3B8]">
                      الدائن: {opt.credit}
                    </p>
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div
                className={cn(
                  'space-y-1.5 rounded-[12px] border p-4 text-sm',
                  selectedOptionId === currentQuestion.correctOptionId
                    ? 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#0A1630] dark:text-[#FAFBFC]'
                    : 'border-red-500/40 bg-red-500/10 text-[#0A1630] dark:text-[#FAFBFC]'
                )}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {selectedOptionId === currentQuestion.correctOptionId ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                      <span>إجابة صحيحة وممتازة</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>إجابة غير صحيحة — السبب المحاسبي:</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {!quizSubmitted ? (
                <Button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleCheckQuiz}
                  className="w-full sm:w-auto"
                >
                  تحقق من الإجابة
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto"
                >
                  السؤال التالي
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
