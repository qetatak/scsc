'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Check,
  HelpCircle,
  TrendingUp,
  Grid,
  Compass,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  calculateBreakEven,
  MANAGEMENT_DECISION_SCENARIOS,
  SwotCategory,
} from '@/lib/labs/management';
import { calculateSkillLevelFromXp } from '@/lib/labs/skill-calculator';
import { triggerHaptic } from '@/lib/haptics';
import { useAppStore } from '@/store/use-app-store';
import { VirtualCompanyBar } from '@/components/shared/virtual-company-bar';
import { CertificateModal } from '@/components/shared/certificate-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmSheet } from '@/components/ui/confirm-sheet';
import { cn } from '@/lib/utils';

const SWOT_META: {
  key: SwotCategory;
  title: string;
  subtitle: string;
  accentClass: string;
}[] = [
  {
    key: 'strengths',
    title: 'نقاط القوة (Strengths)',
    subtitle: 'عوامل داخلية إيجابية تميز الشركة',
    accentClass: 'bg-[#22C55E] text-white',
  },
  {
    key: 'weaknesses',
    title: 'نقاط الضعف (Weaknesses)',
    subtitle: 'عوامل داخلية تحتاج إلى تحسين ومعالجة',
    accentClass: 'bg-[#0A1630] text-white dark:bg-[#1E325C]',
  },
  {
    key: 'opportunities',
    title: 'الفرص المتاحة (Opportunities)',
    subtitle: 'عوامل خارجية في السوق تدعم النمو',
    accentClass: 'bg-[#2F6BFF] text-white',
  },
  {
    key: 'threats',
    title: 'التهديدات والمخاطر (Threats)',
    subtitle: 'عوامل خارجية وتنافسية يجب الحذر منها',
    accentClass: 'bg-red-600 text-white',
  },
];

export default function ManagementLabPage() {
  const virtualCompany = useAppStore((s) => s.virtualCompany);
  const updateVirtualCompany = useAppStore((s) => s.updateVirtualCompany);
  const awardLabXp = useAppStore((s) => s.awardLabXp);
  const currentStudent = useAppStore((s) => s.currentStudent);

  const swotItems = useAppStore((s) => s.swotItems);
  const addSwotItem = useAppStore((s) => s.addSwotItem);
  const updateSwotItem = useAppStore((s) => s.updateSwotItem);
  const deleteSwotItem = useAppStore((s) => s.deleteSwotItem);

  const [fixedCosts, setFixedCosts] = useState<number>(12000);
  const [variableCost, setVariableCost] = useState<number>(20);
  const [sellingPrice, setSellingPrice] = useState<number>(50);

  const [newSwotText, setNewSwotText] = useState<Record<SwotCategory, string>>({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [pendingDeleteSwot, setPendingDeleteSwot] = useState<{
    id: string;
    text: string;
  } | null>(null);

  const [chosenOptions, setChosenOptions] = useState<Record<string, string>>({});

  const managementXp = currentStudent.labXp.management || 0;
  const skillInfo = calculateSkillLevelFromXp(managementXp);

  const breakEvenResult = calculateBreakEven({
    fixedCosts,
    variableCostPerUnit: variableCost,
    sellingPricePerUnit: sellingPrice,
  });

  const handleRecordBreakEven = () => {
    if (!breakEvenResult.isValid) {
      triggerHaptic('error');
      toast.error('تأكد من أن سعر البيع أعلى من التكلفة المتغيرة للوحدة.');
      return;
    }
    triggerHaptic('success');
    awardLabXp(
      'management',
      50,
      `تحليل نقطة التعادل عند ${breakEvenResult.breakEvenUnits} وحدة`
    );
    toast.success(
      `تم اعتماد تحليل نقطة التعادل (${breakEvenResult.breakEvenUnits} وحدة) (+50 XP)`
    );
  };

  const handleAddSwot = (category: SwotCategory) => {
    const text = newSwotText[category].trim();
    if (!text) return;
    triggerHaptic('success');
    addSwotItem(category, text);
    setNewSwotText((prev) => ({ ...prev, [category]: '' }));
    awardLabXp('management', 25, 'تطوير مصفوفة التخطيط الاستراتيجي SWOT');
    toast.success('تمت إضافة النقطة إلى مصفوفة SWOT (+25 XP)');
  };

  const handleSaveEditSwot = (id: string) => {
    if (editingText.trim()) {
      triggerHaptic('tap');
      updateSwotItem(id, editingText.trim());
      toast.success('تم تحديث العنصر في مصفوفة SWOT');
    }
    setEditingId(null);
  };

  const handleChooseDecision = (
    scenarioId: string,
    option: (typeof MANAGEMENT_DECISION_SCENARIOS)[0]['options'][0],
    xpReward: number
  ) => {
    setChosenOptions((prev) => ({ ...prev, [scenarioId]: option.id }));

    const nextCapital = Math.max(0, virtualCompany.capital + option.capitalImpact);
    const nextRep = Math.min(
      100,
      Math.max(10, virtualCompany.reputation + option.reputationImpact)
    );
    const nextCust = Math.max(
      10,
      virtualCompany.customers + option.customersImpact
    );

    updateVirtualCompany({
      capital: nextCapital,
      reputation: nextRep,
      customers: nextCust,
    });

    if (option.isOptimal) {
      triggerHaptic('success');
      awardLabXp(
        'management',
        xpReward,
        'اتخاذ قرار تنفيذي استراتيجي ناجح في مختبر الإدارة'
      );
      toast.success(`قرار استراتيجي صائب! (+${xpReward} XP)`);
    } else {
      triggerHaptic('tap');
      awardLabXp('management', 20);
      toast('تم تطبيق أثر القرار على الشركة الافتراضية. راجع التغذية الراجعة.');
    }
  };

  // SVG Chart Geometry
  const chartWidth = 620;
  const chartHeight = 290;
  const padLeft = 52;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 38;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const maxDataUnits =
    breakEvenResult.chartData[breakEvenResult.chartData.length - 1]?.units || 100;
  const maxDataMoney = Math.max(
    1000,
    ...breakEvenResult.chartData.map((d) => Math.max(d.totalCost, d.totalRevenue))
  );

  const toX = (u: number) => padLeft + (u / maxDataUnits) * plotW;
  const toY = (val: number) => padTop + plotH - (val / maxDataMoney) * plotH;

  const revenuePolyline = breakEvenResult.chartData
    .map((d) => `${toX(d.units)},${toY(d.totalRevenue)}`)
    .join(' ');
  const costPolyline = breakEvenResult.chartData
    .map((d) => `${toX(d.units)},${toY(d.totalCost)}`)
    .join(' ');

  const beX = toX(breakEvenResult.breakEvenUnits);
  const beY = toY(breakEvenResult.breakEvenRevenue);

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
            مختبر إدارة الأعمال — نقطة التعادل، SWOT، والقرارات
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="default" className="px-3.5 py-1.5 text-xs">
            مستواك: {skillInfo.level} ({managementXp} XP)
          </Badge>
          <CertificateModal
            studentName={currentStudent.fullName}
            labTitle="مختبر إدارة الأعمال والاستراتيجية"
            skillLevel={skillInfo.level}
            xpEarned={managementXp}
          />
        </div>
      </div>

      {/* Sticky Live Mobile Break-Even Strip */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 border-y border-[#E3E8F0] bg-[#FAFBFC]/95 px-4 py-2.5 backdrop-blur-md md:hidden dark:border-[#1E325C] dark:bg-[#070D1F]/95">
        <div className="flex items-center justify-between gap-2 font-tabular text-xs">
          <span>
            التعادل:{' '}
            <strong className="text-[#2F6BFF]">
              {breakEvenResult.isValid
                ? `${breakEvenResult.breakEvenUnits} وحدة`
                : 'غير متاح'}
            </strong>
          </span>
          <span>
            هامش المساهمة:{' '}
            <strong className="text-[#0A1630] dark:text-[#FAFBFC]">
              {breakEvenResult.contributionMarginPerUnit} JOD
            </strong>
          </span>
        </div>
      </div>

      {/* Live Virtual Company Bar */}
      <VirtualCompanyBar />

      <Tabs defaultValue="breakeven" dir="rtl" className="w-full scroll-mt-28">
        <div className="flex items-center justify-start">
          <TabsList className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
            <TabsTrigger value="breakeven" className="px-2 text-[11px] sm:px-4 sm:text-sm">
              <TrendingUp className="ml-1.5 h-3.5 w-3.5 shrink-0 stroke-[1.5] sm:ml-2 sm:h-4 sm:w-4" />
              <span className="truncate">نقطة التعادل</span>
            </TabsTrigger>
            <TabsTrigger value="swot" className="px-2 text-[11px] sm:px-4 sm:text-sm">
              <Grid className="ml-1.5 h-3.5 w-3.5 shrink-0 stroke-[1.5] sm:ml-2 sm:h-4 sm:w-4" />
              <span className="truncate">مصفوفة SWOT</span>
            </TabsTrigger>
            <TabsTrigger value="decisions" className="px-2 text-[11px] sm:px-4 sm:text-sm">
              <Compass className="ml-1.5 h-3.5 w-3.5 shrink-0 stroke-[1.5] sm:ml-2 sm:h-4 sm:w-4" />
              <span className="truncate">
                القرارات<span className="hidden sm:inline"> التنفيذية</span>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Break-Even */}
        <TabsContent value="breakeven">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 lg:col-span-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <h2 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                متغيرات التكلفة والتسعير
              </h2>

              <div className="space-y-3 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <div className="flex justify-between gap-2 text-sm font-medium">
                  <label htmlFor="be-fixed">التكاليف الثابتة:</label>
                  <span className="font-tabular shrink-0 font-semibold text-[#2F6BFF]">
                    {fixedCosts.toLocaleString('en-US')} JOD
                  </span>
                </div>
                <input
                  id="be-fixed"
                  type="range"
                  min={2000}
                  max={30000}
                  step={1000}
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-3 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <div className="flex justify-between gap-2 text-sm font-medium">
                  <label htmlFor="be-var">التكلفة المتغيرة للوحدة:</label>
                  <span className="font-tabular shrink-0 font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {variableCost} JOD
                  </span>
                </div>
                <input
                  id="be-var"
                  type="range"
                  min={5}
                  max={80}
                  step={5}
                  value={variableCost}
                  onChange={(e) => setVariableCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-3 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <div className="flex justify-between gap-2 text-sm font-medium">
                  <label htmlFor="be-price">سعر بيع الوحدة:</label>
                  <span className="font-tabular shrink-0 font-semibold text-[#22C55E]">
                    {sellingPrice} JOD
                  </span>
                </div>
                <input
                  id="be-price"
                  type="range"
                  min={15}
                  max={120}
                  step={5}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button
                type="button"
                size="lg"
                onClick={handleRecordBreakEven}
                className="w-full"
              >
                <CheckCircle2 className="h-4 w-4 stroke-[1.5]" />
                <span>اعتماد نموذج التعادل (+50 XP)</span>
              </Button>
            </div>

            <div className="space-y-5 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 lg:col-span-7 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
                  <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
                    نقطة التعادل (وحدات)
                  </span>
                  <p className="font-tabular mt-1 text-xl font-semibold text-[#2F6BFF] sm:text-2xl">
                    {breakEvenResult.isValid
                      ? `${breakEvenResult.breakEvenUnits} وحدة`
                      : 'غير متاح'}
                  </p>
                </div>
                <div className="rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
                  <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
                    إيراد التعادل المطلوب
                  </span>
                  <p className="font-tabular mt-1 text-xl font-semibold text-[#22C55E] sm:text-2xl">
                    {breakEvenResult.isValid
                      ? `${breakEvenResult.breakEvenRevenue.toLocaleString('en-US')} JOD`
                      : '—'}
                  </p>
                </div>
                <div className="rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
                  <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
                    هامش المساهمة للوحدة
                  </span>
                  <p className="font-tabular mt-1 text-xl font-semibold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                    {breakEvenResult.contributionMarginPerUnit} JOD
                  </p>
                </div>
              </div>

              {breakEvenResult.isValid && (
                <div className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                    <span>تقاطع الإيرادات مع التكاليف الكلية</span>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 text-[#22C55E]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                        الإيرادات
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-red-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        التكاليف
                      </span>
                    </div>
                  </div>

                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="h-auto w-full"
                    role="img"
                    aria-label="رسم بياني لنقطة التعادل"
                  >
                    <line
                      x1={padLeft}
                      y1={padTop}
                      x2={padLeft}
                      y2={padTop + plotH}
                      stroke="currentColor"
                      className="text-[#E3E8F0] dark:text-[#1E325C]"
                    />
                    <line
                      x1={padLeft}
                      y1={padTop + plotH}
                      x2={padLeft + plotW}
                      y2={padTop + plotH}
                      stroke="currentColor"
                      className="text-[#E3E8F0] dark:text-[#1E325C]"
                    />
                    <line
                      x1={padLeft}
                      y1={toY(fixedCosts)}
                      x2={padLeft + plotW}
                      y2={toY(fixedCosts)}
                      stroke="#94A3B8"
                      strokeDasharray="5,5"
                      strokeWidth="1.5"
                    />
                    <polyline
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2.75"
                      points={costPolyline}
                    />
                    <polyline
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="2.75"
                      points={revenuePolyline}
                    />
                    <circle
                      cx={beX}
                      cy={beY}
                      r={7}
                      fill="#2F6BFF"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <text
                      x={beX}
                      y={Math.max(20, beY - 14)}
                      textAnchor="middle"
                      className="fill-[#2F6BFF] text-[11px] font-semibold"
                    >
                      نقطة التعادل ({breakEvenResult.breakEvenUnits} وحدة)
                    </text>
                  </svg>
                </div>
              )}

              <details
                open
                className="group rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-[#2F6BFF]">
                  <span className="inline-flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 stroke-[1.5]" />
                    <span>لماذا حدث هذا؟ (التفسير الإداري)</span>
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                  {breakEvenResult.explanation}
                </p>
              </details>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: SWOT Matrix */}
        <TabsContent value="swot">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {SWOT_META.map((quad) => {
              const items = swotItems.filter((i) => i.category === quad.key);
              return (
                <div
                  key={quad.key}
                  className="flex flex-col justify-between space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                          {quad.title}
                        </h3>
                        <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                          {quad.subtitle}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'font-tabular shrink-0 rounded-[8px] px-2.5 py-1 text-xs font-semibold',
                          quad.accentClass
                        )}
                      >
                        {items.length}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2 rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]"
                        >
                          {editingId === item.id ? (
                            <div className="flex w-full items-center gap-2">
                              <Input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="min-h-[40px] text-xs"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleSaveEditSwot(item.id)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="leading-relaxed">{item.text}</span>
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  aria-label="تعديل العنصر"
                                  onClick={() => {
                                    triggerHaptic('tap');
                                    setEditingId(item.id);
                                    setEditingText(item.text);
                                  }}
                                  className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[#526077] hover:bg-[#F1F4F9] hover:text-[#2F6BFF] dark:text-[#94A3B8] dark:hover:bg-[#0A1630] cursor-pointer"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="حذف العنصر"
                                  onClick={() => {
                                    triggerHaptic('tap');
                                    setPendingDeleteSwot({
                                      id: item.id,
                                      text: item.text,
                                    });
                                  }}
                                  className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[#526077] hover:bg-red-500/10 hover:text-red-500 dark:text-[#94A3B8] cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-stretch gap-2 pt-1 sm:flex-row sm:items-center">
                    <Input
                      value={newSwotText[quad.key]}
                      onChange={(e) =>
                        setNewSwotText((prev) => ({
                          ...prev,
                          [quad.key]: e.target.value,
                        }))
                      }
                      placeholder="أضف نقطة جديدة..."
                      enterKeyHint="done"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSwot(quad.key)}
                      className="w-full shrink-0 sm:w-auto"
                    >
                      <Plus className="h-4 w-4 stroke-[1.5]" />
                      <span>إضافة</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 3: Executive Decision Scenarios */}
        <TabsContent value="decisions" className="space-y-5">
          {MANAGEMENT_DECISION_SCENARIOS.map((sc) => {
            const chosenId = chosenOptions[sc.id];
            const chosenOpt = sc.options.find((o) => o.id === chosenId);

            return (
              <div
                key={sc.id}
                className="space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                    {sc.title}
                  </h3>
                  <Badge variant="default">+{sc.xpReward} XP</Badge>
                </div>

                <p className="text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                  {sc.situation}
                </p>

                <div className="space-y-2.5">
                  {sc.options.map((opt) => {
                    const isSelected = chosenId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          handleChooseDecision(sc.id, opt, sc.xpReward)
                        }
                        className={cn(
                          'w-full rounded-[12px] border p-4 text-right transition-colors cursor-pointer',
                          isSelected
                            ? opt.isOptimal
                              ? 'border-[#22C55E] bg-[#22C55E]/10'
                              : 'border-[#2F6BFF] bg-[#2F6BFF]/10'
                            : 'border-[#E3E8F0] bg-[#FAFBFC] hover:border-[#2F6BFF]/50 dark:border-[#1E325C] dark:bg-[#070D1F]'
                        )}
                      >
                        <p className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                          {opt.label}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {chosenOpt && (
                  <div className="space-y-2 rounded-[12px] border border-[#2F6BFF]/30 bg-[#F1F4F9] p-4 dark:bg-[#070D1F]">
                    <p className="text-xs font-semibold text-[#2F6BFF]">
                      أثر القرار على الشركة الافتراضية:
                    </p>
                    <p className="text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                      {chosenOpt.feedback}
                    </p>
                    <div className="font-tabular flex flex-wrap gap-3 pt-1 text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      <span>
                        رأس المال: {chosenOpt.capitalImpact > 0 ? '+' : ''}
                        {chosenOpt.capitalImpact} JOD
                      </span>
                      <span>·</span>
                      <span>
                        السمعة: {chosenOpt.reputationImpact > 0 ? '+' : ''}
                        {chosenOpt.reputationImpact}%
                      </span>
                      <span>·</span>
                      <span>
                        العملاء: {chosenOpt.customersImpact > 0 ? '+' : ''}
                        {chosenOpt.customersImpact}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>
      </Tabs>

      <ConfirmSheet
        open={Boolean(pendingDeleteSwot)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteSwot(null);
        }}
        title="حذف نقطة من مصفوفة SWOT"
        description={
          pendingDeleteSwot
            ? `هل تريد حذف "${pendingDeleteSwot.text}" من التحليل الاستراتيجي؟`
            : ''
        }
        confirmLabel="حذف النقطة"
        destructive
        onConfirm={() => {
          if (pendingDeleteSwot) {
            triggerHaptic('tap');
            deleteSwotItem(pendingDeleteSwot.id);
            toast.success('تم حذف النقطة من مصفوفة SWOT');
          }
        }}
      />
    </div>
  );
}
