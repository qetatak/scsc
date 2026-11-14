'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpLeft,
  CheckCircle2,
  Plus,
  Minus,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { COMPANY_PARTNERS } from '@/data/mock-data';
import { HOME_FAQS } from '@/lib/seo/json-ld';
import { VirtualCompanyBar } from '@/components/shared/virtual-company-bar';
import { RadarChart } from '@/components/shared/radar-chart';
import { Button } from '@/components/ui/button';
import {
  HeroSystemIllustration,
  StepTrainIllustration,
  StepProfileIllustration,
  StepCompanyIllustration,
  AccountingScalePreview,
  MarketingGrowthPreview,
  ManagementBreakEvenPreview,
  PythonCodePreview,
  TeacherAutoGradingIllustration,
} from '@/components/home/home-illustrations';

const DEMO_RADAR = [
  { axis: 'المحاسبة', value: 92 },
  { axis: 'التسويق', value: 78 },
  { axis: 'الإدارة', value: 84 },
  { axis: 'بايثون', value: 96 },
  { axis: 'التحليل', value: 94 },
  { axis: 'القرار', value: 86 },
];

function CountUpMetric({
  target,
  suffix = '',
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const duration = 800;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="space-y-1">
      <p className="font-tabular text-3xl font-bold tracking-tight text-[#0A1630] sm:text-4xl dark:text-[#FAFBFC]">
        {val.toLocaleString('en-US')}
        {suffix}
      </p>
      <p className="text-sm text-[#475569] dark:text-[#CBD5E1]">{label}</p>
    </div>
  );
}

export function HomeSections() {
  const { allStudents } = useAppStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredStudents = [...allStudents]
    .filter((s) => s.isPublicToCompanies)
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, 4);

  const steps = [
    {
      num: '١',
      title: '١. تدرّب',
      description:
        'طبّق مهام المحاسبة والتسويق والإدارة والبرمجة داخل شركة افتراضية واحدة.',
      illustration: <StepTrainIllustration />,
    },
    {
      num: '٢',
      title: '٢. ابنِ بروفايلك',
      description:
        'تتحوّل نتائجك تلقائياً إلى نقاط ومخطط مهارات يثبت مستواك الفعلي.',
      illustration: <StepProfileIllustration />,
    },
    {
      num: '٣',
      title: '٣. تجدك الشركات',
      description:
        'تبحث الشركات حسب المهارة وترسل لك دعوة للمقابلة دون سيرة ذاتية تقليدية.',
      illustration: <StepCompanyIllustration />,
    },
  ];

  return (
    <div>
      {/* 1. HERO SECTION (LIGHT) + LARGE VISUAL + VIRTUAL COMPANY NOW */}
      <section className="bg-[#FAFBFC] pt-5 pb-12 sm:pt-7 md:pt-9 md:pb-16 dark:bg-[#070D1F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="font-bold tracking-tight text-[#0A1630] dark:text-[#FAFBFC]"
              style={{
                fontSize: 'clamp(30px, 4.2vw, 52px)',
                lineHeight: 1.2,
              }}
            >
              <span className="block">تدرّب في شركة افتراضية.</span>
              <span className="mt-1 block text-[#2F6BFF]">
                واجعل نتائجك تتحدث عنك.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-[1.7] text-[#475569] sm:text-lg dark:text-[#CBD5E1]">
              طبّق المحاسبة والتسويق وإدارة الأعمال والبرمجة عملياً داخل المتصفح، ليبني أداؤك ملفاً مهنياً موثقاً تراه الشركات مباشرة.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/labs" className="w-full sm:w-auto">
                <Button size="lg" className="min-h-[48px] w-full px-7 text-base font-semibold sm:w-auto">
                  <span>ابدأ التدريب مجاناً</span>
                  <ArrowUpLeft className="h-4 w-4 stroke-[1.75]" />
                </Button>
              </Link>
              <Link href="/for-companies" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] w-full px-7 text-base font-semibold sm:w-auto"
                >
                  <span>للشركات</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Large Architectural Visual Diagram directly below Hero CTA */}
          <div className="mx-auto mt-7 max-w-5xl md:mt-8">
            <HeroSystemIllustration />
          </div>

          {/* Compact Trust Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#E3E8F0] pt-8 sm:grid-cols-4 dark:border-[#1E325C]">
            <CountUpMetric target={4} label="مختبرات عملية مترابطة" />
            <CountUpMetric target={20} suffix="+" label="ملف طالب موثق" />
            <CountUpMetric target={16} label="تمريناً تطبيقياً" />
            <CountUpMetric target={8} label="شركات شريكة" />
          </div>

          {/* Live Virtual Company State Bar */}
          <div className="mt-10">
            <VirtualCompanyBar />
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS IN 3 SIMPLE STEPS (DARK) */}
      <section
        aria-label="كيف تبدأ رحلتك"
        className="border-y border-[#1E325C] bg-[#0A1630] py-16 text-[#FAFBFC] md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-[#60A5FA]">
              ثلاث خطوات بسيطة
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              تدرّب، ثم تظهر للشركات
            </h2>
            <p className="mt-3 text-base leading-[1.7] text-[#CBD5E1]">
              لا تحتاج إلى سيرة ذاتية جاهزة أو خبرة مسبقة؛ ابدأ بالتطبيق الفوري واترك أرقامك تتكلم.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-11 lg:gap-3">
            {steps.map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col justify-between rounded-[16px] border border-[#1E325C] bg-[#070D1F] p-6 lg:col-span-3">
                  <div>
                    <div className="mb-4">{step.illustration}</div>
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base leading-[1.7] text-[#CBD5E1]">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Animated SVG Connector Between Steps */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center lg:col-span-1"
                  >
                    {/* Desktop Horizontal Connector */}
                    <svg
                      viewBox="0 0 64 24"
                      className="hidden h-6 w-14 lg:block"
                    >
                      <line
                        x1="60"
                        y1="12"
                        x2="8"
                        y2="12"
                        stroke="#2F6BFF"
                        strokeWidth="2"
                        className="animate-flow-dash"
                      />
                      <path
                        d="M 14 7 L 7 12 L 14 17"
                        fill="none"
                        stroke="#2F6BFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Mobile Vertical Connector */}
                    <svg
                      viewBox="0 0 24 36"
                      className="h-7 w-6 lg:hidden"
                    >
                      <line
                        x1="12"
                        y1="2"
                        x2="12"
                        y2="30"
                        stroke="#2F6BFF"
                        strokeWidth="2"
                        className="animate-flow-dash"
                      />
                      <path
                        d="M 7 25 L 12 31 L 17 25"
                        fill="none"
                        stroke="#2F6BFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FOUR INTERACTIVE LABS WITH LIVE MINI-PREVIEWS (LIGHT, ASYMMETRIC) */}
      <section className="bg-[#FAFBFC] py-16 md:py-24 dark:bg-[#070D1F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#E3E8F0] pb-6 sm:flex-row sm:items-end dark:border-[#1E325C]">
            <div>
              <span className="text-sm font-semibold text-[#2F6BFF]">
                المختبرات التفاعلية
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1630] sm:text-4xl dark:text-[#FAFBFC]">
                أربعة مختبرات تحاكي العمل الحقيقي.
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-[1.7] text-[#475569] dark:text-[#CBD5E1]">
                كل قرار تتخذه في أي مختبر ينعكس فوراً على بقية أقسام الشركة الافتراضية.
              </p>
            </div>
            <Link href="/labs" className="w-full sm:w-auto">
              <Button variant="outline" className="min-h-[44px] w-full text-sm font-semibold sm:w-auto">
                <span>تصفح جميع المختبرات</span>
                <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            {/* Featured Lab 1 (7 cols): Accounting with Moving Balance Scale */}
            <article className="flex flex-col justify-between rounded-[16px] border-2 border-[#2F6BFF]/35 bg-white p-6 sm:p-7 lg:col-span-7 dark:border-[#2F6BFF]/45 dark:bg-[#0A1630]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#2F6BFF]">
                    المختبر الأول · المحاسبة
                  </span>
                  <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                    ٧ تمارين وتقييم فوري
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                  <Link href="/labs/accounting" className="hover:text-[#2F6BFF]">
                    مختبر المحاسبة المالية والميزانية
                  </Link>
                </h3>
                <p className="mt-2 text-base leading-[1.7] text-[#475569] dark:text-[#CBD5E1]">
                  سجّل العمليات المالية وشاهد توازن الأصول والالتزامات والقيود المحاسبية لحظياً.
                </p>

                <AccountingScalePreview />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                  وسام: ميزانية متوازنة
                </span>
                <Link href="/labs/accounting">
                  <Button size="sm" className="min-h-[42px] px-5 text-sm font-semibold">
                    <span>ابدأ في المحاسبة</span>
                    <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
                  </Button>
                </Link>
              </div>
            </article>

            {/* Lab 2 (5 cols): Marketing with Rising Growth Chart */}
            <article className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 sm:p-7 lg:col-span-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#2F6BFF]">
                    المختبر الثاني · التسويق
                  </span>
                  <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                    حملات وميزانيات
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                  <Link href="/labs/marketing" className="hover:text-[#2F6BFF]">
                    مختبر التسويق الرقمي والنمو
                  </Link>
                </h3>
                <p className="mt-2 text-base leading-[1.7] text-[#475569] dark:text-[#CBD5E1]">
                  حدّد السعر وميزانية الإعلان لترفع المبيعات وتضبط تكلفة جذب العميل.
                </p>

                <MarketingGrowthPreview />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                  وسام: مسوّق محترف
                </span>
                <Link
                  href="/labs/marketing"
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#2F6BFF] hover:underline"
                >
                  <span>دخول المختبر</span>
                  <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
                </Link>
              </div>
            </article>

            {/* Lab 3 (5 cols): Management with Break-Even Intersection Chart */}
            <article className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 sm:p-7 lg:col-span-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#2F6BFF]">
                    المختبر الثالث · الإدارة
                  </span>
                  <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                    قرارات وتكاليف
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                  <Link href="/labs/management" className="hover:text-[#2F6BFF]">
                    مختبر إدارة الأعمال والقرارات
                  </Link>
                </h3>
                <p className="mt-2 text-base leading-[1.7] text-[#475569] dark:text-[#CBD5E1]">
                  احسب نقطة التعادل وحلّل وضع الشركة لتختار القرار الإداري الأفضل.
                </p>

                <ManagementBreakEvenPreview />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                  وسام: قائد استراتيجي
                </span>
                <Link
                  href="/labs/management"
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#2F6BFF] hover:underline"
                >
                  <span>دخول المختبر</span>
                  <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
                </Link>
              </div>
            </article>

            {/* Lab 4 (7 cols): Python Programming with Live Executing Line */}
            <article className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 sm:p-7 lg:col-span-7 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#2F6BFF]">
                    المختبر الرابع · البرمجة
                  </span>
                  <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                    ٥ تمارين عملية بلغة بايثون
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                  <Link href="/labs/python" className="hover:text-[#2F6BFF]">
                    مختبر البرمجة وتحليل البيانات (بايثون)
                  </Link>
                </h3>
                <p className="mt-2 text-base leading-[1.7] text-[#475569] dark:text-[#CBD5E1]">
                  اكتب الكود وشغّله مباشرة من متصفحك لتحليل أرقام المبيعات والأرباح.
                </p>

                <PythonCodePreview />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                  وسام: محلل بيانات
                </span>
                <Link
                  href="/labs/python"
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#2F6BFF] hover:underline"
                >
                  <span>دخول المختبر</span>
                  <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 4. DEDICATED TEACHERS SECTION (DARK): PRACTICAL ASSIGNMENTS & AUTO-GRADING */}
      <section
        aria-label="للمعلمين والجامعات"
        className="border-y border-[#1E325C] bg-[#0A1630] py-16 text-[#FAFBFC] md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#60A5FA]">
                <GraduationCap className="h-4 w-4 stroke-[1.75]" />
                <span>للمعلمين وأعضاء هيئة التدريس</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                واجبات عملية داخل المختبر وتصحيح تلقائي فوري.
              </h2>
              <p className="mt-4 text-base leading-[1.7] text-[#CBD5E1]">
                بدلاً من الواجبات الورقية أو الأسئلة النظرية، أرسل لطلابك تكليفاً عملياً يُحل داخل المختبر وتصدر درجته وملاحظاته تلقائياً.
              </p>

              <ul className="mt-6 space-y-3 text-base text-[#E2E8F0]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 stroke-[1.75] text-[#22C55E]" />
                  <span>أنشئ واجباً تطبيقياً لأي شعبة خلال دقيقة واحدة.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 stroke-[1.75] text-[#22C55E]" />
                  <span>يتحقّق النظام تلقائياً من صحة القيود والأرقام والكود البرمجي.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 stroke-[1.75] text-[#22C55E]" />
                  <span>راجع درجات جميع الطلاب ونقاط القوة في سجل موحّد.</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link href="/teacher" className="inline-block w-full sm:w-auto">
                  <Button size="lg" className="min-h-[48px] w-full px-6 text-base font-semibold sm:w-auto">
                    <span>استكشف لوحة المعلم</span>
                    <ArrowUpLeft className="h-4 w-4 stroke-[1.75]" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <TeacherAutoGradingIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 5. STUDENT PROFILE + COMPANY TALENT PREVIEW CARDS (LIGHT) */}
      <section className="bg-[#FAFBFC] py-16 md:py-24 dark:bg-[#070D1F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="text-sm font-semibold text-[#2F6BFF]">
              ملف الطالب وبوابة الشركات
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1630] sm:text-4xl dark:text-[#FAFBFC]">
              مهاراتك بالأرقام، والشركات تبحث بالنتائج.
            </h2>
            <p className="mt-2 text-base leading-[1.7] text-[#475569] dark:text-[#CBD5E1]">
              شاهد كيف يظهر ملفك الموثق بمخطط المهارات، وكيف تصفّي الشركات الطلاب الجاهزين للتوظيف.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Sample Student Profile Card with RadarChart (5 cols) */}
            <article className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0A1630] lg:col-span-5">
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#0A1630] text-base font-bold text-white dark:bg-[#2F6BFF]">
                      يز
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                        يزن النابلسي
                      </h3>
                      <p className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                        الجامعة الأردنية · ١,٦٨٠ نقطة
                      </p>
                    </div>
                  </div>
                  <span className="rounded-[8px] bg-[#2F6BFF]/10 px-3 py-1 text-xs font-semibold text-[#2F6BFF]">
                    نموذج ملف طالب
                  </span>
                </div>

                <div className="mt-4 flex justify-center">
                  <RadarChart data={DEMO_RADAR} size={265} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                  تحديث تلقائي مع كل تمرين
                </span>
                <Link
                  href="/students/yazan-nabulsi"
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#2F6BFF] hover:underline"
                >
                  <span>عرض البروفايل الكامل</span>
                  <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
                </Link>
              </div>
            </article>

            {/* Sample Company Talent Dashboard Preview Card (7 cols) */}
            <article className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0A1630] lg:col-span-7">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#2F6BFF]/10 text-[#2F6BFF]">
                      <Briefcase className="h-5 w-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                        قائمة المواهب لدى الشركات
                      </h3>
                      <p className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                        فرز مباشر حسب الإتقان في المختبرات
                      </p>
                    </div>
                  </div>
                  <span className="rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 py-1 text-xs font-semibold text-[#475569] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#CBD5E1]">
                    نموذج لوحة الشركات
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {featuredStudents.map((student, idx) => (
                    <div
                      key={student.id}
                      className="flex flex-col justify-between gap-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 sm:flex-row sm:items-center dark:border-[#1E325C] dark:bg-[#070D1F]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#2F6BFF]/10 text-sm font-bold text-[#2F6BFF]">
                          {idx + 1}
                        </span>
                        <div>
                          <Link
                            href={`/students/${student.username}`}
                            className="text-base font-bold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
                          >
                            {student.fullName}
                          </Link>
                          <p className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                            {student.major} · {student.university}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span className="font-tabular text-sm font-bold text-[#2F6BFF]">
                          {student.totalXp.toLocaleString('en-US')} نقطة
                        </span>
                        <Link
                          href="/for-companies"
                          className="inline-flex min-h-[38px] items-center rounded-[10px] bg-[#2F6BFF] px-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D56E0]"
                        >
                          دعوة لمقابلة
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <Link
                  href="/leaderboard"
                  className="text-sm font-semibold text-[#475569] hover:text-[#2F6BFF] dark:text-[#CBD5E1]"
                >
                  عرض جميع المتصدرين ({allStudents.length})
                </Link>
                <Link href="/for-companies">
                  <Button className="min-h-[42px] px-5 text-sm font-semibold">
                    <span>افتح بوابة الشركات</span>
                    <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
                  </Button>
                </Link>
              </div>
            </article>
          </div>

          {/* Partner Companies Compact Strip */}
          <div className="mt-12 border-t border-[#E3E8F0] pt-10 dark:border-[#1E325C]">
            <p className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
              شركات شريكة تتابع نتائج المختبرات:
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {COMPANY_PARTNERS.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-3 rounded-[14px] border border-[#E3E8F0] bg-white p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F4F9] text-sm font-bold text-[#0A1630] dark:bg-[#070D1F] dark:text-[#FAFBFC]">
                    {company.initials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                      {company.name}
                    </h3>
                    <p className="truncate text-sm text-[#475569] dark:text-[#CBD5E1]">
                      {company.industry} · {company.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ + CLOSING CTA (LIGHT SECONDARY + DARK CTA CARD) */}
      <section className="border-t border-[#E3E8F0] bg-[#F1F4F9] py-16 md:py-24 dark:border-[#1E325C] dark:bg-[#0A1630]/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-[#E3E8F0] pb-6 dark:border-[#1E325C]">
            <span className="text-sm font-semibold text-[#2F6BFF]">
              الأسئلة الشائعة
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
              إجابات سريعة قبل أن تبدأ.
            </h2>
          </div>

          <div className="divide-y divide-[#E3E8F0] rounded-[16px] border border-[#E3E8F0] bg-white px-5 sm:px-7 dark:divide-[#1E325C] dark:border-[#1E325C] dark:bg-[#0A1630]">
            {HOME_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.question} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-4 text-right text-base font-bold text-[#0A1630] dark:text-[#FAFBFC]"
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <Minus className="h-5 w-5 shrink-0 stroke-[1.75] text-[#2F6BFF]" />
                    ) : (
                      <Plus className="h-5 w-5 shrink-0 stroke-[1.75] text-[#475569] dark:text-[#CBD5E1]" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'mt-3 max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-base leading-[1.7] text-[#475569] dark:text-[#CBD5E1]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Dark Navy CTA */}
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[20px] border border-[#1E325C] bg-[#0A1630] p-7 text-[#FAFBFC] sm:p-12 lg:p-14">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                  ابدأ تدريبك العملي الأول اليوم مجاناً.
                </h2>
                <p className="mt-3 text-base leading-[1.7] text-[#CBD5E1]">
                  ادخل المختبرات الأربعة مباشرة من متصفحك دون تثبيت أي برامج، واجعل نتائجك تتحدث عن مهاراتك.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href="/labs" className="w-full sm:w-auto">
                  <Button size="lg" className="min-h-[48px] w-full px-7 text-base font-semibold sm:w-auto">
                    <span>ابدأ التدريب مجاناً</span>
                    <ArrowUpLeft className="h-4 w-4 stroke-[1.75]" />
                  </Button>
                </Link>
                <Link href="/for-companies" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-[48px] w-full border-[#334155] bg-transparent px-7 text-base font-semibold text-white hover:border-[#2F6BFF] hover:text-[#60A5FA] sm:w-auto"
                  >
                    للشركات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
