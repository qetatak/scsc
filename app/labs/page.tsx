'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { LABS_METADATA } from '@/data/mock-data';
import { calculateSkillLevelFromXp } from '@/lib/labs/skill-calculator';
import { getCourseJsonLd, getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { triggerHaptic } from '@/lib/haptics';
import { VirtualCompanyBar } from '@/components/shared/virtual-company-bar';
import { CertificateModal } from '@/components/shared/certificate-modal';
import { Button } from '@/components/ui/button';

export default function LabsCatalogPage() {
  const { currentStudent } = useAppStore();

  const [miniAssetDelta, setMiniAssetDelta] = useState(10000);
  const [miniAdSpend, setMiniAdSpend] = useState(1500);
  const [miniFixedCost, setMiniFixedCost] = useState(12000);

  const coursesJsonLd = LABS_METADATA.map((lab) => getCourseJsonLd(lab));
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'الرئيسية', path: '/' },
    { name: 'المختبرات التفاعلية', path: '/labs' },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, ...coursesJsonLd]),
        }}
      />

      <header className="mb-8 border-b border-[#E3E8F0] pb-6 md:mb-12 md:pb-10 dark:border-[#1E325C]">
        <span className="font-tabular text-xs font-medium tracking-widest text-[#2F6BFF] uppercase">
          INTERACTIVE SIMULATION CATALOG
        </span>
        <h1
          className="mt-2.5 font-semibold tracking-tight text-[#0A1630] dark:text-[#FAFBFC]"
          style={{ fontSize: 'clamp(28px, 4.2vw, 56px)', lineHeight: 1.16 }}
        >
          مختبرات المحاكاة العملية الأربعة.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#526077] sm:text-base dark:text-[#94A3B8]">
          كل مختبر يمثل قسماً حيوياً داخل الشركة الافتراضية الموحدة. جرّب المعاينات المصغرة أدناه أو ادخل إلى المختبر الكامل لرفع رصيد خبرتك.
        </p>
      </header>

      <div className="mb-8 md:mb-14">
        <VirtualCompanyBar />
      </div>

      <div className="space-y-6 md:space-y-12">
        {LABS_METADATA.map((lab, idx) => {
          const xp = currentStudent.labXp[lab.id] || 0;
          const skill = calculateSkillLevelFromXp(xp);
          const isReversed = idx % 2 === 1;

          return (
            <section
              key={lab.id}
              className="grid grid-cols-1 items-center gap-6 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-7 lg:grid-cols-12 lg:gap-8 lg:p-9 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div
                className={`space-y-4 sm:space-y-5 lg:col-span-6 ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
                  <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
                    0{idx + 1} / {lab.id.toUpperCase()} LAB
                  </span>
                  <span className="font-tabular text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    المستوى: {skill.level} · {xp} XP ({skill.score}%)
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                    {lab.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                    {lab.description}
                  </p>
                </div>

                <div>
                  <div className="mb-1.5 flex justify-between font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
                    <span>نسبة الإتقان في المختبر</span>
                    <span className="font-semibold text-[#2F6BFF]">{skill.score}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F4F9] dark:bg-[#070D1F]">
                    <div
                      className="h-full bg-[#2F6BFF] transition-all duration-300"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {lab.skillsLearned.map((s) => (
                    <span
                      key={s}
                      className="rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 py-1 text-xs text-[#0A1630]/80 dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#94A3B8]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col items-stretch gap-2.5 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href={lab.slug}
                    onClick={() => triggerHaptic('tap')}
                    className="w-full sm:w-auto"
                  >
                    <Button size="lg" className="w-full sm:w-auto">
                      <span>دخول المختبر الكامل</span>
                      <ArrowUpLeft className="h-4 w-4 stroke-[1.5]" />
                    </Button>
                  </Link>
                  <CertificateModal
                    studentName={currentStudent.fullName}
                    labTitle={lab.title}
                    skillLevel={skill.level}
                    xpEarned={xp}
                    triggerLabel="شهادة المختبر"
                  />
                </div>
              </div>

              <div
                className={`rounded-[14px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 sm:p-5 lg:col-span-6 dark:border-[#1E325C] dark:bg-[#070D1F] ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-2 border-b border-[#E3E8F0] pb-3 text-xs dark:border-[#1E325C]">
                  <span className="truncate font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    معاينة تفاعلية — {lab.subtitle}
                  </span>
                  <span className="font-tabular shrink-0 text-[#2F6BFF]">LIVE PREVIEW</span>
                </div>

                {lab.id === 'accounting' && (
                  <div className="space-y-4 font-tabular">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-sans text-[#526077] dark:text-[#94A3B8]">
                        استثمار رأس المال الإضافي:
                      </span>
                      <span className="shrink-0 font-semibold text-[#2F6BFF]">
                        {miniAssetDelta.toLocaleString('en-US')} JOD
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5000}
                      max={30000}
                      step={2500}
                      value={miniAssetDelta}
                      onChange={(e) => setMiniAssetDelta(Number(e.target.value))}
                      aria-label="قيمة استثمار رأس المال"
                      className="w-full"
                    />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-[12px] border border-[#E3E8F0] bg-white p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]">
                        <span className="block font-sans text-[#526077] dark:text-[#94A3B8]">
                          الأصول بعد العملية
                        </span>
                        <span className="mt-1 block text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                          {(65000 + miniAssetDelta).toLocaleString('en-US')} JOD
                        </span>
                      </div>
                      <div className="rounded-[12px] border border-[#E3E8F0] bg-white p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]">
                        <span className="block font-sans text-[#526077] dark:text-[#94A3B8]">
                          الالتزامات + الملكية
                        </span>
                        <span className="mt-1 block text-base font-semibold text-[#2F6BFF]">
                          {(65000 + miniAssetDelta).toLocaleString('en-US')} JOD
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {lab.id === 'marketing' && (
                  <div className="space-y-4 font-tabular">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-sans text-[#526077] dark:text-[#94A3B8]">
                        ميزانية الحملة التجريبية:
                      </span>
                      <span className="shrink-0 font-semibold text-[#2F6BFF]">
                        {miniAdSpend.toLocaleString('en-US')} JOD
                      </span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={5000}
                      step={250}
                      value={miniAdSpend}
                      onChange={(e) => setMiniAdSpend(Number(e.target.value))}
                      aria-label="ميزانية الحملة الإعلانية"
                      className="w-full"
                    />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-[12px] border border-[#E3E8F0] bg-white p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]">
                        <span className="block font-sans text-[#526077] dark:text-[#94A3B8]">
                          العملاء المتوقعون
                        </span>
                        <span className="mt-1 block text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                          {Math.round(miniAdSpend / 14)} عميل
                        </span>
                      </div>
                      <div className="rounded-[12px] border border-[#E3E8F0] bg-white p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]">
                        <span className="block font-sans text-[#526077] dark:text-[#94A3B8]">
                          الإيراد المتوقع
                        </span>
                        <span className="mt-1 block text-base font-semibold text-[#2F6BFF]">
                          {(Math.round(miniAdSpend / 14) * 45).toLocaleString('en-US')} JOD
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {lab.id === 'management' && (
                  <div className="space-y-4 font-tabular">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-sans text-[#526077] dark:text-[#94A3B8]">
                        التكاليف الثابتة الشهرية:
                      </span>
                      <span className="shrink-0 font-semibold text-[#2F6BFF]">
                        {miniFixedCost.toLocaleString('en-US')} JOD
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6000}
                      max={24000}
                      step={1500}
                      value={miniFixedCost}
                      onChange={(e) => setMiniFixedCost(Number(e.target.value))}
                      aria-label="التكاليف الثابتة"
                      className="w-full"
                    />
                    <div className="rounded-[12px] border border-[#E3E8F0] bg-white p-3.5 text-xs dark:border-[#1E325C] dark:bg-[#0A1630]">
                      <span className="block font-sans text-[#526077] dark:text-[#94A3B8]">
                        نقطة التعادل (هامش مساهمة 40 JOD للوحدة)
                      </span>
                      <span className="mt-1 block text-base font-semibold text-[#2F6BFF]">
                        {Math.ceil(miniFixedCost / 40)} وحدة مباعة للوصول للتعادل
                      </span>
                    </div>
                  </div>
                )}

                {lab.id === 'python' && (
                  <div
                    dir="ltr"
                    className="rounded-[12px] border border-[#1E325C] bg-[#0A1630] p-4 font-mono text-xs text-[#FAFBFC]"
                  >
                    <pre className="overflow-x-auto leading-relaxed">
                      <code>{`def calc_roi(revenue, cost):
    return round(((revenue - cost) / cost) * 100, 1)

# Live output: 150.0%
print(f"ROI: {calc_roi(12500, 5000)}%")`}</code>
                    </pre>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
