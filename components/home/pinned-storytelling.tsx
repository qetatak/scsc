'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { RadarChart } from '@/components/shared/radar-chart';

const STORY_STEPS = [
  {
    stepNumber: '01',
    tag: 'المرحلة الأولى — المختبرات العملية',
    title: 'تدرّب داخل محاكي الشركة الافتراضية.',
    description:
      'ينفذ الطالب قيود المحاسبة، ويضبط ميزانية التسويق، ويحلل نقطة التعادل، ويكتب سكربتات Python على بيانات شركة افتراضية واحدة.',
    linkHref: '/labs/accounting',
    linkLabel: 'جرّب مختبر المحاسبة',
  },
  {
    stepNumber: '02',
    tag: 'المرحلة الثانية — التوثيق التلقائي',
    title: 'يتشكل بروفايلك ومخطط مهاراتك تلقائياً.',
    description:
      'تُترجم كل عملية صحيحة فوراً إلى نقاط خبرة جدولية ومخطط رادار سداسي الأبعاد يعكس قوتك الفعلية دون كتابة سيرة ذاتية إنشائية.',
    linkHref: '/students/yazan-nabulsi',
    linkLabel: 'معاينة البروفايل العام',
  },
  {
    stepNumber: '03',
    tag: 'المرحلة الثالثة — استقطاب الشركات',
    title: 'تفلتر الشركات النتائج وتتواصل معك مباشرة.',
    description:
      'تستعرض فرق التوظيف جدول المرشحين مرتباً حسب الإتقان العملي في كل مختبر وترسل دعوات المقابلات بضغطة واحدة.',
    linkHref: '/company/dashboard',
    linkLabel: 'استعراض لوحة الشركات',
  },
];

const DEMO_RADAR = [
  { axis: 'المحاسبة المالية', value: 92 },
  { axis: 'التسويق والنمو', value: 78 },
  { axis: 'إدارة الأعمال', value: 84 },
  { axis: 'برمجة Python', value: 96 },
  { axis: 'التحليل الرقمي', value: 94 },
  { axis: 'اتخاذ القرار', value: 86 },
];

export function PinnedStorytelling() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = Math.min(
        totalScrollable,
        Math.max(0, -rect.top)
      );
      const ratio = scrolled / totalScrollable;

      if (ratio < 0.34) {
        setActiveStage(0);
      } else if (ratio < 0.68) {
        setActiveStage(1);
      } else {
        setActiveStage(2);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="كيف يعمل تدريبك"
      className="relative border-y border-[#E3E8F0] bg-[#F1F4F9] lg:min-h-[250vh] dark:border-[#1E325C] dark:bg-[#0F1E3E]"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:sticky lg:top-18 lg:flex lg:min-h-[calc(100vh-4.5rem)] lg:items-center lg:py-12 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Right Column: All 3 steps rendered in initial SSR HTML for crawlers, visually highlighted by activeStage */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
              <span className="font-tabular text-xs font-medium tracking-widest text-[#2F6BFF] uppercase">
                WORKFLOW ARCHITECTURE
              </span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#0A1630] sm:text-3xl dark:text-[#FAFBFC]">
                من التجربة العملية إلى عرض العمل في ثلاث مراحل متصلة.
              </h2>
            </div>

            <div className="space-y-4">
              {STORY_STEPS.map((step, index) => {
                const isCurrent = activeStage === index;
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setActiveStage(index)}
                    className={`cursor-pointer rounded-[16px] border p-5 transition-all duration-300 ${
                      isCurrent
                        ? 'border-[#2F6BFF] bg-white dark:bg-[#0A1630]'
                        : 'border-[#E3E8F0] bg-[#FAFBFC]/60 opacity-65 hover:opacity-95 dark:border-[#1E325C] dark:bg-[#0A1630]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#2F6BFF]">
                        {step.tag}
                      </span>
                      <span className="font-tabular text-lg font-medium text-[#0A1630]/45 dark:text-[#94A3B8]">
                        {step.stepNumber}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#0A1630]/70 dark:text-[#94A3B8]">
                      {step.description}
                    </p>
                    <div className="mt-3">
                      <Link
                        href={step.linkHref}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2F6BFF] hover:underline"
                      >
                        <span>{step.linkLabel}</span>
                        <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left Column: Morphing Product Stage (60fps transform & opacity only) */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[20px] border border-[#E3E8F0] bg-white p-5 sm:p-8 lg:min-h-[450px] dark:border-[#1E325C] dark:bg-[#0A1630]">
              {/* Top Window Header */}
              <div className="mb-5 flex items-center justify-between border-b border-[#E3E8F0] pb-4 sm:mb-6 dark:border-[#1E325C]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
                    STAGE 0{activeStage + 1} / 03
                  </span>
                  <span className="text-xs text-[#0A1630]/55 dark:text-[#94A3B8]">
                    — {STORY_STEPS[activeStage].tag}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveStage(idx)}
                      aria-label={`الانتقال إلى المرحلة ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        activeStage === idx
                          ? 'w-7 bg-[#2F6BFF]'
                          : 'w-2.5 bg-[#E3E8F0] dark:bg-[#1E325C]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Stage 1 UI: Live Accounting Balance Equation */}
              <div
                className={`transition-all duration-300 ${
                  activeStage === 0
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none absolute inset-x-5 sm:inset-x-8 top-20 translate-y-4 opacity-0'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    محاكي معادلة الميزانية — تحصيل إيراد خدمات برمجية
                  </span>
                  <span className="rounded-[8px] border border-[#2F6BFF]/30 bg-[#2F6BFF]/10 px-2.5 py-1 font-tabular text-xs font-medium text-[#2F6BFF]">
                    موازن 100%
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 font-tabular sm:grid-cols-3">
                  <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
                    <span className="text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
                      الأصول (Assets)
                    </span>
                    <p className="mt-1 text-xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      73,500 JOD
                    </p>
                    <span className="mt-1 block text-[11px] text-[#2F6BFF]">
                      +8,500 نقدية بالبنك
                    </span>
                  </div>
                  <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
                    <span className="text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
                      الالتزامات (Liabilities)
                    </span>
                    <p className="mt-1 text-xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      15,000 JOD
                    </p>
                    <span className="mt-1 block text-[11px] text-[#0A1630]/50 dark:text-[#94A3B8]">
                      دائنون وموردون
                    </span>
                  </div>
                  <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
                    <span className="text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
                      حقوق الملكية (Equity)
                    </span>
                    <p className="mt-1 text-xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      58,500 JOD
                    </p>
                    <span className="mt-1 block text-[11px] text-[#2F6BFF]">
                      +8,500 أرباح محتجزة
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-[12px] border border-[#E3E8F0] bg-[#0A1630] p-4 text-[#FAFBFC] dark:border-[#1E325C]">
                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>قيد اليومية المزدوج المولّد</span>
                    <span className="font-tabular text-[#2F6BFF]">+35 XP</span>
                  </div>
                  <div className="mt-3 space-y-1.5 font-tabular text-xs">
                    <div className="flex justify-between">
                      <span>من ح/ النقدية لدى البنك (أصل متداول)</span>
                      <span>8,500 JOD مدين</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>إلى ح/ إيرادات المبيعات (حقوق ملكية)</span>
                      <span>8,500 JOD دائن</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 2 UI: Public Student Profile & Live Radar Chart */}
              <div
                className={`transition-all duration-300 ${
                  activeStage === 1
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none absolute inset-x-8 top-20 translate-y-4 opacity-0'
                }`}
              >
                <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0A1630] font-semibold text-[#FAFBFC] dark:bg-[#2F6BFF]">
                        يز
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                          يزن النابلسي
                        </p>
                        <p className="text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
                          الجامعة الأردنية · 1,680 XP
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        { label: 'برمجة الأعمال (Python)', pct: 98 },
                        { label: 'المحاسبة وتوازن القوائم', pct: 92 },
                        { label: 'إدارة الأعمال والتعادل', pct: 78 },
                        { label: 'التسويق الرقمي والعائد', pct: 72 },
                      ].map((skill) => (
                        <div key={skill.label}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-[#0A1630] dark:text-[#FAFBFC]">
                              {skill.label}
                            </span>
                            <span className="font-tabular font-medium text-[#2F6BFF]">
                              {skill.pct}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F4F9] dark:bg-[#0F1E3E]">
                            <div
                              className="h-full bg-[#2F6BFF]"
                              style={{ width: `${skill.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center sm:col-span-6">
                    <RadarChart data={DEMO_RADAR} size={235} />
                  </div>
                </div>
              </div>

              {/* Stage 3 UI: Company Talent Filter & Direct Invite */}
              <div
                className={`transition-all duration-300 ${
                  activeStage === 2
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none absolute inset-x-8 top-20 translate-y-4 opacity-0'
                }`}
              >
                <div className="mb-3 flex items-center justify-between text-xs text-[#0A1630]/65 dark:text-[#94A3B8]">
                  <span>فلتر الشركات النشط: المحاسبة + Python · الحد الأدنى 1,400 XP</span>
                  <span className="font-tabular text-[#2F6BFF]">3 مرشحين مطابقين</span>
                </div>

                {/* Mobile Stage 3 Cards */}
                <div className="space-y-2.5 sm:hidden">
                  {[
                    {
                      name: 'يزن النابلسي',
                      uni: 'الجامعة الأردنية',
                      acc: '460 XP',
                      py: '490 XP',
                    },
                    {
                      name: 'رزان العبداللات',
                      uni: 'جامعة الأميرة سمية',
                      acc: '490 XP',
                      py: '420 XP',
                    },
                    {
                      name: 'عمر الخصاونة',
                      uni: 'العلوم والتكنولوجيا',
                      acc: '390 XP',
                      py: '410 XP',
                    },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between gap-2 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]"
                    >
                      <div>
                        <p className="font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                          {row.name}
                        </p>
                        <p className="font-tabular text-[11px] text-[#2F6BFF]">
                          {row.acc} · {row.py}
                        </p>
                      </div>
                      <Link
                        href="/company/dashboard"
                        className="rounded-[8px] bg-[#2F6BFF] px-3 py-1.5 text-[11px] font-medium text-[#FAFBFC]"
                      >
                        دعوة
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Desktop & Tablet Stage 3 Table */}
                <div className="hidden overflow-hidden rounded-[12px] border border-[#E3E8F0] sm:block dark:border-[#1E325C]">
                  <table className="w-full text-right text-xs">
                    <thead className="border-b border-[#E3E8F0] bg-[#F1F4F9] text-[#0A1630]/70 dark:border-[#1E325C] dark:bg-[#0F1E3E] dark:text-[#94A3B8]">
                      <tr>
                        <th className="px-3.5 py-2.5 font-medium">المرشح</th>
                        <th className="px-3.5 py-2.5 font-medium">الجامعة</th>
                        <th className="px-3.5 py-2.5 font-medium">المحاسبة</th>
                        <th className="px-3.5 py-2.5 font-medium">Python</th>
                        <th className="px-3.5 py-2.5 font-medium">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E8F0] font-tabular dark:divide-[#1E325C]">
                      {[
                        {
                          name: 'يزن النابلسي',
                          uni: 'الجامعة الأردنية',
                          acc: '460 XP',
                          py: '490 XP',
                        },
                        {
                          name: 'رزان العبداللات',
                          uni: 'جامعة الأميرة سمية',
                          acc: '490 XP',
                          py: '420 XP',
                        },
                        {
                          name: 'عمر الخصاونة',
                          uni: 'العلوم والتكنولوجيا',
                          acc: '390 XP',
                          py: '410 XP',
                        },
                      ].map((row) => (
                        <tr key={row.name} className="bg-white dark:bg-[#0A1630]">
                          <td className="px-3.5 py-3 font-sans font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                            {row.name}
                          </td>
                          <td className="px-3.5 py-3 font-sans text-[#0A1630]/70 dark:text-[#94A3B8]">
                            {row.uni}
                          </td>
                          <td className="px-3.5 py-3 text-[#2F6BFF]">{row.acc}</td>
                          <td className="px-3.5 py-3 text-[#2F6BFF]">{row.py}</td>
                          <td className="px-3.5 py-3 font-sans">
                            <Link
                              href="/company/dashboard"
                              className="inline-block rounded-[8px] bg-[#2F6BFF] px-2.5 py-1 text-[11px] font-medium text-[#FAFBFC]"
                            >
                              دعوة لمقابلة
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
