'use client';

import React from 'react';
import { toast } from 'sonner';
import { Check, CreditCard, Download } from 'lucide-react';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import { BILLING_PLANS, BillingInvoice } from '@/data/dashboard-mock-data';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

export default function CompanyBillingPage() {
  const { activePlanId, changeSubscriptionPlan, invoices } =
    useCompanyDashboardStore();

  const handleDownloadInvoice = (inv: BillingInvoice) => {
    const content = [
      `TADREEBAK B2B INVOICE #${inv.invoiceNumber}`,
      `التاريخ: ${inv.date}`,
      `الباقة: ${inv.planName}`,
      `المبلغ: ${inv.amountJod} JOD`,
      `الحالة: ${inv.status}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`تم تنزيل إيصال الفاتورة ${inv.invoiceNumber}`);
  };

  return (
    <div>
      <PageHeader
        title="خطط الاشتراك والفواتير"
        description="اختر الباقة المناسبة لحجم استقطاب الخريجين في شركتك واستعرض سجل الفواتير الشهرية."
      />

      {/* Subscription Plans Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {BILLING_PLANS.map((plan) => {
          const isCurrent = activePlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-[16px] border p-6 transition-colors ${
                isCurrent
                  ? 'border-[#2F6BFF] bg-white dark:bg-[#0F1E3E]'
                  : 'border-[#E3E8F0] bg-white dark:border-[#1E325C] dark:bg-[#0F1E3E]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {plan.name}
                  </h2>
                  {isCurrent && (
                    <span className="text-xs font-semibold text-[#2F6BFF]">
                      الخطة الحالية
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                  {plan.audience}
                </p>

                <div className="mt-5 flex items-baseline gap-2 border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
                  <span className="font-tabular text-3xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {plan.priceJod === 0 ? 'مجاناً' : `${plan.priceJod} د.أ`}
                  </span>
                  <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-4 space-y-2.5 text-xs">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-[#0A1630]/90 dark:text-[#FAFBFC]/90"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[2] text-[#2F6BFF]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4">
                <Button
                  type="button"
                  variant={isCurrent ? 'secondary' : 'default'}
                  size="sm"
                  disabled={isCurrent}
                  onClick={() => {
                    changeSubscriptionPlan(plan.id);
                    toast.success(`تم التحديث إلى ${plan.name} بنجاح`);
                  }}
                  className="w-full text-xs"
                >
                  {isCurrent ? 'مفعّلة حالياً' : 'الترقية / التبديل لهذه الباقة'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices List */}
      <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              سجل الفواتير الشهرية
            </h2>
          </div>
        </div>

        {/* Mobile Invoice Cards */}
        <div className="space-y-3 md:hidden">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 space-y-2.5 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-tabular text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {inv.invoiceNumber}
                </span>
                <span className="text-xs font-medium text-[#2F6BFF]">
                  {inv.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[#526077] dark:text-[#94A3B8]">
                  {inv.planName} · <span className="font-tabular">{inv.date}</span>
                </span>
                <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {inv.amountJod} JOD
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleDownloadInvoice(inv)}
                className="w-full min-h-[40px] gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>تنزيل الإيصال</span>
              </Button>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-right text-xs">
            <thead>
              <tr className="border-b border-[#E3E8F0] bg-[#F5F6F8] text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#94A3B8]">
                <th className="px-4 py-3 font-medium">رقم الفاتورة</th>
                <th className="px-4 py-3 font-medium">التاريخ</th>
                <th className="px-4 py-3 font-medium">الباقة</th>
                <th className="px-4 py-3 font-medium">المبلغ</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">الإيصال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-3.5 font-tabular font-semibold">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3.5 font-tabular text-[#526077]">
                    {inv.date}
                  </td>
                  <td className="px-4 py-3.5">{inv.planName}</td>
                  <td className="px-4 py-3.5 font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {inv.amountJod} JOD
                  </td>
                  <td className="px-4 py-3.5 font-medium text-[#2F6BFF]">
                    {inv.status}
                  </td>
                  <td className="px-4 py-3.5">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadInvoice(inv)}
                      className="h-7 gap-1 px-2.5 text-xs"
                    >
                      <Download className="h-3 w-3 stroke-[1.5]" />
                      <span>تنزيل</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
