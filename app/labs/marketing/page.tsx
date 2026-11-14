'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  Users,
  Wallet,
  CheckCircle2,
  HelpCircle,
  Send,
  Target,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  MARKETING_CHANNELS,
  MARKETING_CHALLENGES,
  MarketingChannelId,
  simulateMarketingCampaign,
  evaluateMarketingChallenge,
} from '@/lib/labs/marketing';
import { calculateSkillLevelFromXp } from '@/lib/labs/skill-calculator';
import { triggerHaptic } from '@/lib/haptics';
import { useAppStore } from '@/store/use-app-store';
import { VirtualCompanyBar } from '@/components/shared/virtual-company-bar';
import { CertificateModal } from '@/components/shared/certificate-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MarketingLabPage() {
  const virtualCompany = useAppStore((s) => s.virtualCompany);
  const updateVirtualCompany = useAppStore((s) => s.updateVirtualCompany);
  const awardLabXp = useAppStore((s) => s.awardLabXp);
  const currentStudent = useAppStore((s) => s.currentStudent);

  const [productPrice, setProductPrice] = useState<number>(45);
  const [adBudget, setAdBudget] = useState<number>(1200);
  const [channelId, setChannelId] = useState<MarketingChannelId>('search_seo');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const marketingXp = currentStudent.labXp.marketing || 0;
  const skillInfo = calculateSkillLevelFromXp(marketingXp);

  const simResult = simulateMarketingCampaign({
    productPrice,
    adBudget,
    channelId,
  });

  const handleApproveCampaign = () => {
    const newRevenue = virtualCompany.revenue + simResult.expectedRevenue;
    const newExpenses = virtualCompany.expenses + simResult.adBudget;
    const newNetProfit = newRevenue - newExpenses;
    const newCapital = Math.max(
      0,
      virtualCompany.capital + simResult.netCampaignProfit
    );
    const newAssets = virtualCompany.assets + simResult.netCampaignProfit;
    const newEquity = virtualCompany.equity + simResult.netCampaignProfit;

    updateVirtualCompany({
      revenue: newRevenue,
      expenses: newExpenses,
      netProfit: newNetProfit,
      capital: newCapital,
      customers: virtualCompany.customers + simResult.expectedCustomers,
      assets: newAssets,
      equity: newEquity,
    });

    awardLabXp(
      'marketing',
      60,
      `اعتماد حملة تسويقية بعائد ROI ${simResult.roiPercentage}% واكتساب ${simResult.expectedCustomers} عميلاً`
    );

    triggerHaptic('success');
    toast.success(
      `تم اعتماد الحملة وترحيل الإيراد (${simResult.expectedRevenue} JOD) والمصروف (${simResult.adBudget} JOD) إلى المحاسبة (+60 XP)`
    );
  };

  const handleClaimChallenge = (challengeId: string) => {
    const ch = MARKETING_CHALLENGES.find((c) => c.id === challengeId);
    if (!ch) return;
    const passed = evaluateMarketingChallenge(simResult, ch);
    if (!passed) {
      triggerHaptic('error');
      toast.error(
        'لم تتحقق شروط التحدي بعد! عدّل السعر أو الميزانية أو القناة للوصول للهدف.'
      );
      return;
    }
    if (completedChallenges.includes(challengeId)) {
      toast('لقد حصدت نقاط هذا التحدي بالفعل!');
      return;
    }
    triggerHaptic('success');
    setCompletedChallenges((prev) => [...prev, challengeId]);
    awardLabXp('marketing', ch.xpReward, `إنجاز ${ch.title}`);
    toast.success(`رائع! أنجزت التحدي وحصلت على +${ch.xpReward} XP!`);
  };

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
            مختبر التسويق الرقمي — محاكي الحملات والعائد ROI%
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="default" className="px-3.5 py-1.5 text-xs">
            مستواك: {skillInfo.level} ({marketingXp} XP)
          </Badge>
          <CertificateModal
            studentName={currentStudent.fullName}
            labTitle="مختبر التسويق الرقمي والنمو"
            skillLevel={skillInfo.level}
            xpEarned={marketingXp}
          />
        </div>
      </div>

      {/* Sticky Live Mobile KPI Strip */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 border-y border-[#E3E8F0] bg-[#FAFBFC]/95 px-4 py-2.5 backdrop-blur-md md:hidden dark:border-[#1E325C] dark:bg-[#070D1F]/95">
        <div className="flex items-center justify-between gap-2 font-tabular text-xs">
          <span>
            ROI:{' '}
            <strong
              className={
                simResult.roiPercentage >= 100
                  ? 'text-[#22C55E]'
                  : 'text-[#2F6BFF]'
              }
            >
              {simResult.roiPercentage}%
            </strong>
          </span>
          <span>
            CAC:{' '}
            <strong className="text-[#0A1630] dark:text-[#FAFBFC]">
              {simResult.cac} JOD
            </strong>
          </span>
          <span>
            العملاء:{' '}
            <strong className="text-[#2F6BFF]">
              {simResult.expectedCustomers}
            </strong>
          </span>
        </div>
      </div>

      {/* Virtual Company Bar */}
      <VirtualCompanyBar />

      {/* Main Split Sandbox */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Controls Deck */}
        <div className="space-y-5 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 lg:col-span-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
          <h2 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
            لوحة التحكم في المتغيرات التسويقية
          </h2>

          {/* Slider 1 */}
          <div className="space-y-3 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="slider-price"
                className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]"
              >
                1. سعر المنتج / الاشتراك:
              </label>
              <span className="font-tabular shrink-0 text-base font-semibold text-[#2F6BFF]">
                {productPrice} JOD
              </span>
            </div>
            <input
              id="slider-price"
              type="range"
              min={15}
              max={100}
              step={5}
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
              <span>15 JOD</span>
              <span>50 JOD</span>
              <span>100 JOD</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-3 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="slider-budget"
                className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]"
              >
                2. ميزانية الحملة الإعلانية:
              </label>
              <span className="font-tabular shrink-0 text-base font-semibold text-[#2F6BFF]">
                {adBudget.toLocaleString('en-US')} JOD
              </span>
            </div>
            <input
              id="slider-budget"
              type="range"
              min={300}
              max={5000}
              step={100}
              value={adBudget}
              onChange={(e) => setAdBudget(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
              <span>300 JOD</span>
              <span>2,500 JOD</span>
              <span>5,000 JOD</span>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="space-y-2.5">
            <p className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              3. اختر قناة الترويج (Place &amp; Promotion):
            </p>
            <div className="space-y-2">
              {MARKETING_CHANNELS.map((ch) => {
                const active = ch.id === channelId;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap');
                      setChannelId(ch.id);
                    }}
                    className={cn(
                      'w-full rounded-[12px] border p-3.5 text-right transition-colors cursor-pointer',
                      active
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/8 dark:bg-[#2F6BFF]/15'
                        : 'border-[#E3E8F0] bg-[#FAFBFC] hover:border-[#2F6BFF]/50 dark:border-[#1E325C] dark:bg-[#070D1F]'
                    )}
                  >
                    <p className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      {ch.name}
                    </p>
                    <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                      {ch.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results & Challenges */}
        <div className="space-y-5 lg:col-span-6">
          <div className="space-y-5 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#0A1630] sm:text-lg dark:text-[#FAFBFC]">
                نتائج المحاكاة اللحظية
              </h2>
              <span
                className={cn(
                  'font-tabular rounded-[8px] px-3 py-1 text-xs font-semibold',
                  simResult.roiPercentage >= 100
                    ? 'bg-[#22C55E]/15 text-[#22C55E]'
                    : 'bg-[#2F6BFF]/12 text-[#2F6BFF]'
                )}
              >
                ROI: {simResult.roiPercentage}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <span className="flex items-center gap-1.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  <Wallet className="h-3.5 w-3.5 shrink-0 text-[#2F6BFF]" />
                  تكلفة العميل (CAC)
                </span>
                <p className="font-tabular mt-1 text-lg font-semibold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                  {simResult.cac} JOD
                </p>
              </div>

              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <span className="flex items-center gap-1.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  <Users className="h-3.5 w-3.5 shrink-0 text-[#2F6BFF]" />
                  العملاء المتوقعون
                </span>
                <p className="font-tabular mt-1 text-lg font-semibold text-[#0A1630] sm:text-2xl dark:text-[#FAFBFC]">
                  {simResult.expectedCustomers} عميل
                </p>
              </div>

              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <span className="flex items-center gap-1.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[#22C55E]" />
                  الإيرادات المتوقعة
                </span>
                <p className="font-tabular mt-1 text-lg font-semibold text-[#22C55E] sm:text-2xl">
                  {simResult.expectedRevenue.toLocaleString('en-US')} JOD
                </p>
              </div>

              <div className="rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-3.5 dark:border-[#1E325C] dark:bg-[#070D1F]">
                <span className="flex items-center gap-1.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[#2F6BFF]" />
                  صافي ربح الحملة
                </span>
                <p
                  className={cn(
                    'font-tabular mt-1 text-lg font-semibold sm:text-2xl',
                    simResult.netCampaignProfit >= 0
                      ? 'text-[#2F6BFF]'
                      : 'text-red-500'
                  )}
                >
                  {simResult.netCampaignProfit.toLocaleString('en-US')} JOD
                </p>
              </div>
            </div>

            <details
              open
              className="group rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-[#2F6BFF]">
                <span className="inline-flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 stroke-[1.5]" />
                  <span>لماذا ظهرت هذه النتيجة؟</span>
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                {simResult.priceElasticityNote}
              </p>
            </details>

            <Button
              type="button"
              size="lg"
              onClick={handleApproveCampaign}
              className="w-full"
            >
              <Send className="h-4 w-4 stroke-[1.5]" />
              <span>اعتماد الحملة وترحيلها للمحاسبة (+60 XP)</span>
            </Button>
          </div>

          {/* Challenges */}
          <div className="space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 stroke-[1.5] text-[#2F6BFF]" />
              <h3 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                تحديات التسويق التطبيقية
              </h3>
            </div>

            <div className="space-y-3">
              {MARKETING_CHALLENGES.map((ch) => {
                const isMet = evaluateMarketingChallenge(simResult, ch);
                const isClaimed = completedChallenges.includes(ch.id);
                return (
                  <div
                    key={ch.id}
                    className="space-y-2.5 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {ch.title}
                      </h4>
                      <span
                        className={cn(
                          'font-tabular shrink-0 rounded-[8px] px-2.5 py-0.5 text-xs font-medium',
                          isMet
                            ? 'bg-[#22C55E]/15 text-[#22C55E]'
                            : 'border border-[#E3E8F0] bg-white text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#94A3B8]'
                        )}
                      >
                        +{ch.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                      {ch.description}
                    </p>
                    <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isMet ? 'text-[#22C55E]' : 'text-[#526077] dark:text-[#94A3B8]'
                        )}
                      >
                        {isMet
                          ? 'الإعدادات الحالية تحقق شروط التحدي'
                          : 'عدّل المؤشرات لتحقيق الشرط'}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant={isMet ? 'default' : 'outline'}
                        disabled={!isMet || isClaimed}
                        onClick={() => handleClaimChallenge(ch.id)}
                        className="w-full sm:w-auto"
                      >
                        {isClaimed ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>تم استلام النقاط</span>
                          </>
                        ) : (
                          <span>احصد نقاط التحدي</span>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible 4Ps Educational Section */}
      <details className="group rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
          <span>المزيج التسويقي الرباعي (4Ps) وكيف طبّقته في المحاكي</span>
          <ChevronDown className="h-5 w-5 shrink-0 text-[#526077] transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: '1. المنتج (Product)',
              desc: 'القيمة التي تقدمها الشركة الافتراضية للعميل وتحدد سقف السعر المقبول في السوق.',
            },
            {
              title: '2. السعر (Price)',
              desc: 'المؤشر الأول للربحية؛ رفعه يزيد هامش الربح للوحدة لكن المبالغة فيه تخفض التحويل.',
            },
            {
              title: '3. المكان / القناة (Place)',
              desc: 'المنصة الرقمية التي يتواجد فيها جمهورك المستهدف (محركات البحث، شبكات التواصل، البريد).',
            },
            {
              title: '4. الترويج (Promotion)',
              desc: 'ميزانية الإعلانات والرسالة التسويقية التي تحول الزائر إلى عميل فعلي بتكلفة استحواذ مدروسة.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="space-y-1.5 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]"
            >
              <h4 className="text-sm font-semibold text-[#2F6BFF]">{item.title}</h4>
              <p className="text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
