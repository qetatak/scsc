'use client';

import React from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';

const INSTITUTIONAL_PLANS = [
  {
    id: 'plan-uni',
    organization: 'الجامعة الأردنية — كلية الأعمال وتكنولوجيا المعلومات',
    tier: 'باقة الجامعات الشاملة (Enterprise Campus)',
    seats: 'حتى 2,500 طالب و 40 أستاذ مساق',
    annualFee: '4,800 د.أ / سنوياً',
    status: 'نشط',
  },
  {
    id: 'plan-psut',
    organization: 'جامعة الأميرة سمية للتكنولوجيا',
    tier: 'باقة الجامعات الشاملة (Enterprise Campus)',
    seats: 'حتى 1,500 طالب و 25 أستاذ مساق',
    annualFee: '3,600 د.أ / سنوياً',
    status: 'نشط',
  },
  {
    id: 'plan-comp',
    organization: 'مجموعة المدار المالية والتقنية',
    tier: 'باقة استقطاب الكفاءات للشركات (Recruiter Pro)',
    seats: 'وصول كامل للباحثين ورسائل غير محدودة',
    annualFee: '1,200 د.أ / سنوياً',
    status: 'نشط',
  },
];

export default function AdminBillingPage() {
  return (
    <div>
      <PageHeader
        title="الفوترة واشتراكات الجامعات والشركات"
        description="متابعة الباقات المؤسسية للجامعات واشتراكات بوابة استقطاب الكفاءات للشركات."
      />

      <ChartCard
        title="العقود والاشتراكات المؤسسية النشطة"
        subtitle="التدريب العملي مجاني بالكامل للطلاب الأفراد وممول عبر اشتراكات الجامعات والشركات الموظِّفة."
      >
        <div className="space-y-3">
          {INSTITUTIONAL_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
                  <span className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {plan.organization}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                  {plan.tier} — {plan.seats}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-tabular text-sm font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                  {plan.annualFee}
                </span>
                <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#2F6BFF]/10 px-2.5 py-1 text-xs font-semibold text-[#2F6BFF]">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.5]" />
                  {plan.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
