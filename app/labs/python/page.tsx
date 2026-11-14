'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Play,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Cpu,
  ChevronDown,
  PanelBottomOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PYTHON_EXERCISES,
  PythonExercise,
  evaluatePythonCodeFallback,
} from '@/lib/labs/python';
import { calculateSkillLevelFromXp } from '@/lib/labs/skill-calculator';
import { triggerHaptic } from '@/lib/haptics';
import { useKeyboardOffset } from '@/hooks/use-keyboard-offset';
import { useAppStore } from '@/store/use-app-store';
import { VirtualCompanyBar } from '@/components/shared/virtual-company-bar';
import { CertificateModal } from '@/components/shared/certificate-modal';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<{
      runPythonAsync: (code: string) => Promise<unknown>;
      setStdout: (options: { batched: (msg: string) => void }) => void;
    }>;
  }
}

const CODE_SYMBOLS: { label: string; value: string }[] = [
  { label: 'Tab', value: '    ' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: ':', value: ':' },
  { label: '"', value: '"' },
  { label: "'", value: "'" },
  { label: '[', value: '[' },
  { label: ']', value: ']' },
  { label: '{', value: '{' },
  { label: '}', value: '}' },
  { label: '=', value: '=' },
  { label: '_', value: '_' },
];

export default function PythonLabPage() {
  const awardLabXp = useAppStore((s) => s.awardLabXp);
  const currentStudent = useAppStore((s) => s.currentStudent);
  const { isKeyboardOpen } = useKeyboardOffset(false);

  const [selectedEx, setSelectedEx] = useState<PythonExercise>(
    PYTHON_EXERCISES[0]
  );
  const [code, setCode] = useState<string>(PYTHON_EXERCISES[0].starterCode);
  const [terminalOutput, setTerminalOutput] = useState<string>(
    'اضغط على "تشغيل الكود" لتنفيذ برنامج بايثون وعرض المخرجات...'
  );
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [pyodideStatus, setPyodideStatus] = useState<
    'idle' | 'loading' | 'ready' | 'fallback'
  >('idle');
  const [completedExIds, setCompletedExIds] = useState<string[]>([]);
  const [terminalDrawerOpen, setTerminalDrawerOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pyodideRef = useRef<{
    runPythonAsync: (code: string) => Promise<unknown>;
    setStdout: (options: { batched: (msg: string) => void }) => void;
  } | null>(null);

  const pythonXp = currentStudent.labXp.python || 0;
  const skillInfo = calculateSkillLevelFromXp(pythonXp);

  const handleSelectExercise = (ex: PythonExercise) => {
    triggerHaptic('tap');
    setSelectedEx(ex);
    setCode(ex.starterCode);
    setTestPassed(null);
    setFeedback('');
    setTerminalOutput('جاهز للتشغيل...');
  };

  const insertSymbol = (symbolValue: string) => {
    triggerHaptic('tap');
    const el = textareaRef.current;
    if (!el) {
      setCode((prev) => prev + symbolValue);
      return;
    }
    const start = el.selectionStart ?? code.length;
    const end = el.selectionEnd ?? code.length;
    const updated = code.slice(0, start) + symbolValue + code.slice(end);
    setCode(updated);
    window.requestAnimationFrame(() => {
      el.focus();
      const nextPos = start + symbolValue.length;
      el.setSelectionRange(nextPos, nextPos);
    });
  };

  const ensurePyodideLoaded = async () => {
    if (pyodideRef.current) return pyodideRef.current;
    if (typeof window === 'undefined') return null;

    try {
      setPyodideStatus('loading');
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src =
            'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.async = true;
          const timeout = setTimeout(
            () => reject(new Error('Pyodide CDN timeout')),
            2500
          );
          script.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          script.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Failed to load Pyodide script'));
          };
          document.head.appendChild(script);
        });
      }

      if (window.loadPyodide) {
        const instance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });
        pyodideRef.current = instance;
        setPyodideStatus('ready');
        return instance;
      }
    } catch {
      setPyodideStatus('fallback');
    }
    return null;
  };

  const handleRunCode = async () => {
    triggerHaptic('tap');
    setIsRunning(true);
    setTerminalOutput('جاري تشغيل مفسر Python...');

    let finalStdout = '';
    let passed = false;
    let feedbackMsg = '';

    const pyodide = await ensurePyodideLoaded();

    if (pyodide) {
      try {
        const lines: string[] = [];
        pyodide.setStdout({
          batched: (msg: string) => lines.push(msg),
        });
        await pyodide.runPythonAsync(code);
        finalStdout = lines.join('\n').trim();
        passed = finalStdout.includes(selectedEx.expectedOutputSubstring);
        feedbackMsg = passed
          ? 'تم تنفيذ الكود عبر Pyodide واجتياز الاختبار التلقائي بنجاح!'
          : `الناتج الفعلي (${finalStdout || 'فارغ'}) لا يطابق الناتج المتوقع (${selectedEx.expectedOutputSubstring}).`;
      } catch (err) {
        finalStdout = String(err);
        passed = false;
        feedbackMsg = 'حدث خطأ برمجي أثناء التنفيذ. راجع الصياغة وحاول مجدداً.';
      }
    } else {
      const fallbackRes = evaluatePythonCodeFallback(code, selectedEx);
      finalStdout = fallbackRes.stdout;
      passed = fallbackRes.passed;
      feedbackMsg = fallbackRes.feedback;
    }

    setTerminalOutput(finalStdout || '(لا توجد مخرجات مطبوعة)');
    setTestPassed(passed);
    setFeedback(feedbackMsg);
    setIsRunning(false);

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTerminalDrawerOpen(true);
    }

    if (passed) {
      triggerHaptic('success');
      if (!completedExIds.includes(selectedEx.id)) {
        setCompletedExIds((prev) => [...prev, selectedEx.id]);
        awardLabXp(
          'python',
          selectedEx.xpReward,
          `إتمام تمرين بايثون: ${selectedEx.title}`
        );
        toast.success(
          `أحسنت! اجتزت الاختبار البرمجي وحصلت على +${selectedEx.xpReward} XP!`
        );
      } else {
        toast.success('الكود يعمل بشكل صحيح واجتاز الاختبار التلقائي!');
      }
    } else {
      triggerHaptic('error');
      toast.error('لم يجتز الكود الاختبار التلقائي بعد، راجع المخرجات.');
    }
  };

  const terminalBlock = (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#94A3B8]">
          مخرجات الطرفية (Terminal Output)
        </span>
        <span className="font-mono text-[11px] text-[#94A3B8]">
          المتوقع: {selectedEx.expectedOutputSubstring}
        </span>
      </div>
      <pre
        dir="ltr"
        className="overflow-x-auto rounded-[12px] border border-[#1E325C] bg-[#070D1F] p-3.5 font-mono text-sm text-[#22C55E]"
      >
        {terminalOutput}
      </pre>

      {testPassed !== null && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-[10px] border px-3.5 py-2.5 text-xs font-medium',
            testPassed
              ? 'border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]'
              : 'border-red-500/40 bg-red-500/15 text-red-400'
          )}
        >
          {testPassed ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#22C55E]" />
          ) : (
            <Terminal className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );

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
            مختبر البرمجة للأعمال (Python) — أتمتة البيانات
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="default" className="px-3.5 py-1.5 text-xs">
            مستواك: {skillInfo.level} ({pythonXp} XP)
          </Badge>
          <CertificateModal
            studentName={currentStudent.fullName}
            labTitle="مختبر البرمجة للأعمال (Python)"
            skillLevel={skillInfo.level}
            xpEarned={pythonXp}
          />
        </div>
      </div>

      {/* Live Virtual Company Bar */}
      <VirtualCompanyBar />

      {/* Main Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Exercises Selector: Horizontal Snap Strip on < lg, Sidebar on >= lg */}
        <div className="space-y-3 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-5 lg:col-span-4 dark:border-[#1E325C] dark:bg-[#0A1630]">
          <div className="flex items-center justify-between gap-2 px-1">
            <h2 className="text-sm font-semibold text-[#0A1630] sm:text-base dark:text-[#FAFBFC]">
              تمارين بايثون التطبيقية (5)
            </h2>
            <span className="font-tabular text-xs text-[#2F6BFF] lg:hidden">
              اسحب لاختيار التمرين
            </span>
          </div>

          <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 no-scrollbar lg:block lg:space-y-2.5 lg:overflow-visible lg:pb-0">
            {PYTHON_EXERCISES.map((ex) => {
              const isActive = ex.id === selectedEx.id;
              const isDone = completedExIds.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelectExercise(ex)}
                  className={cn(
                    'w-[76vw] max-w-[260px] shrink-0 snap-start space-y-1.5 rounded-[12px] border p-3.5 text-right transition-colors cursor-pointer lg:w-full lg:max-w-none',
                    isActive
                      ? 'border-[#2F6BFF] bg-[#2F6BFF]/10'
                      : 'border-[#E3E8F0] bg-[#FAFBFC] hover:border-[#2F6BFF]/50 dark:border-[#1E325C] dark:bg-[#070D1F]'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={ex.level === 'مبتدئ' ? 'success' : 'default'}>
                      {ex.level}
                    </Badge>
                    <span className="font-tabular text-xs font-semibold text-[#2F6BFF]">
                      {isDone ? 'مكتمل' : `+${ex.xpReward} XP`}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    {ex.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor & Terminal */}
        <div className="space-y-5 lg:col-span-8">
          <div className="space-y-2.5 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                {selectedEx.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                <Cpu className="h-4 w-4 text-[#2F6BFF]" />
                {pyodideStatus === 'loading'
                  ? 'جاري تحميل Pyodide...'
                  : pyodideStatus === 'ready'
                  ? 'مفسر Pyodide نشط'
                  : 'مفسر بايثون جاهز'}
              </span>
            </div>

            <p className="text-xs font-medium text-[#2F6BFF]">
              سياق الأعمال: {selectedEx.businessContext}
            </p>
            <p className="text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
              {selectedEx.prompt}
            </p>
          </div>

          {/* Code Editor Card */}
          <div className="overflow-hidden rounded-[16px] border border-[#1E325C] bg-[#0A1630] text-[#FAFBFC]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E325C] bg-[#070D1F] px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#2F6BFF]" />
                <span className="font-mono text-xs font-semibold text-[#FAFBFC]">
                  business_script.py
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    triggerHaptic('tap');
                    setCode(selectedEx.starterCode);
                  }}
                  className="text-xs text-[#94A3B8] hover:bg-[#132347] hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>إعادة ضبط</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isRunning}
                  onClick={handleRunCode}
                  className="hidden lg:inline-flex"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{isRunning ? 'جاري التشغيل...' : 'تشغيل واختبار الكود'}</span>
                </Button>
              </div>
            </div>

            {/* Mobile Keyboard Symbol Accessory Bar */}
            <div
              dir="ltr"
              className="flex items-center gap-1.5 overflow-x-auto border-b border-[#1E325C] bg-[#0D1A38] px-3 py-2 no-scrollbar"
            >
              {CODE_SYMBOLS.map((sym) => (
                <button
                  key={sym.label}
                  type="button"
                  onClick={() => insertSymbol(sym.value)}
                  className="flex min-h-[36px] min-w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#1E325C] bg-[#070D1F] px-2.5 font-mono text-xs font-semibold text-[#FAFBFC] active:scale-95 active:border-[#2F6BFF] cursor-pointer"
                >
                  {sym.label}
                </button>
              ))}
            </div>

            {/* LTR Code Textarea */}
            <div dir="ltr" className="p-3.5 sm:p-4">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={8}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                aria-label="محرر كود بايثون"
                className="mobile-code-editor w-full resize-y bg-transparent font-mono leading-relaxed text-[#FAFBFC] focus:outline-none sm:text-sm"
              />
            </div>

            {/* Sticky Ergonomic Run & Terminal Drawer Bar inside editor on < lg */}
            <div
              className={cn(
                'sticky z-20 flex items-center gap-2 border-t border-[#1E325C] bg-[#070D1F]/95 px-3.5 py-2.5 backdrop-blur-md lg:hidden',
                isKeyboardOpen
                  ? 'bottom-0'
                  : 'bottom-[calc(5.25rem+env(safe-area-inset-bottom))]'
              )}
            >
              <Button
                type="button"
                disabled={isRunning}
                onClick={handleRunCode}
                className="flex-1"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? 'جاري التشغيل...' : 'تشغيل واختبار الكود'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  triggerHaptic('tap');
                  setTerminalDrawerOpen(true);
                }}
                className="border-[#1E325C] bg-[#0A1630] text-[#FAFBFC]"
              >
                <PanelBottomOpen className="h-4 w-4 text-[#2F6BFF]" />
                <span>الطرفية</span>
              </Button>
            </div>

            {/* Inline Terminal Output on Desktop (>= lg) */}
            <div className="hidden border-t border-[#1E325C] bg-[#070D1F] p-5 lg:block">
              {terminalBlock}
            </div>
          </div>

          {/* Mobile Compact Terminal Status Card */}
          <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[#E3E8F0] bg-white p-3.5 lg:hidden dark:border-[#1E325C] dark:bg-[#0A1630]">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                حالة التنفيذ والمخرجات
              </p>
              <p className="truncate font-mono text-xs text-[#526077] dark:text-[#94A3B8]">
                {terminalOutput}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setTerminalDrawerOpen(true)}
            >
              عرض
            </Button>
          </div>

          {/* Line-by-Line Explanation Collapsible Disclosure */}
          <details className="group rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-[#0A1630] sm:text-base dark:text-[#FAFBFC]">
                <BookOpen className="h-5 w-5 text-[#2F6BFF]" />
                <span>شرح الكود سطراً بسطر (لماذا كتبناه هكذا؟)</span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[#526077] transition-transform group-open:rotate-180" />
            </summary>

            <div className="mt-4 space-y-2.5">
              {selectedEx.lineExplanations.map((item, idx) => (
                <div
                  key={idx}
                  className="space-y-1.5 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]"
                >
                  <code
                    dir="ltr"
                    className="block overflow-x-auto font-mono text-xs font-semibold text-[#2F6BFF]"
                  >
                    {item.line}
                  </code>
                  <p className="text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* Vaul BottomSheet Terminal Output Drawer (< lg) */}
      <BottomSheet
        open={terminalDrawerOpen}
        onOpenChange={setTerminalDrawerOpen}
        title="طرفية بايثون والمخرجات"
        description={`الشرط المطلوب: ${selectedEx.expectedOutputSubstring}`}
      >
        <div className="rounded-[14px] border border-[#1E325C] bg-[#0A1630] p-4">
          {terminalBlock}
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            disabled={isRunning}
            onClick={handleRunCode}
            className="flex-1"
          >
            <Play className="h-4 w-4" />
            <span>إعادة التشغيل</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setTerminalDrawerOpen(false)}
          >
            إغلاق
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
