'use client';

import React, { Suspense, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/use-app-store';
import { AssignmentModeWorkspace } from '@/components/labs/assignment-mode-bar';
import { Button } from '@/components/ui/button';
import { ConfirmSheet } from '@/components/ui/confirm-sheet';

export function VirtualCompanyBar() {
  const { virtualCompany, resetVirtualCompany } = useAppStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const metrics = [
    {
      label: 'رأس المال النقدي',
      value: `${virtualCompany.capital.toLocaleString('en-US')} دينار`,
    },
    {
      label: 'إجمالي المبيعات',
      value: `${virtualCompany.revenue.toLocaleString('en-US')} دينار`,
    },
    {
      label: 'العملاء النشطون',
      value: `${virtualCompany.customers.toLocaleString('en-US')}`,
    },
    {
      label: 'صافي الربح',
      value: `${virtualCompany.netProfit.toLocaleString('en-US')} دينار`,
    },
    {
      label: 'مؤشر السمعة',
      value: `${virtualCompany.reputation}%`,
    },
  ];

  return (
    <div>
      <Suspense fallback={null}>
        <AssignmentModeWorkspace />
      </Suspense>

      <section
        aria-label="حالة الشركة الافتراضية الآن"
        className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:p-6 dark:border-[#1E325C] dark:bg-[#0A1630]"
      >
        <div className="flex flex-col justify-between gap-3 border-b border-[#E3E8F0] pb-3.5 sm:flex-row sm:items-center sm:gap-4 sm:pb-4 dark:border-[#1E325C]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
            <h2 className="text-base font-bold text-[#0A1630] dark:text-[#FAFBFC]">
              شركتك الافتراضية الآن — {virtualCompany.name}
            </h2>
            <span className="rounded-[8px] border border-[#E3E8F0] bg-[#F1F4F9] px-2.5 py-0.5 text-xs font-medium text-[#475569] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#CBD5E1]">
              متصل بالمختبرات الأربعة
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            className="min-h-[40px] self-start sm:self-auto gap-1.5 text-sm text-[#475569] hover:text-[#0A1630] dark:text-[#CBD5E1] dark:hover:text-[#FAFBFC]"
          >
            <RotateCcw className="h-4 w-4 stroke-[1.5]" />
            <span>إعادة ضبط الشركة</span>
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 py-3 sm:px-4 dark:border-[#1E325C] dark:bg-[#070D1F]"
            >
              <span className="block text-sm text-[#475569] dark:text-[#CBD5E1]">
                {m.label}
              </span>
              <p className="mt-1 font-tabular text-base sm:text-lg font-bold tracking-tight text-[#0A1630] dark:text-[#FAFBFC]">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ConfirmSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="إعادة ضبط الشركة الافتراضية"
        description="سيتم إرجاع رأس المال والمبيعات وصافي الربح ومؤشر السمعة إلى القيم الابتدائية."
        confirmLabel="إعادة ضبط"
        destructive
        onConfirm={() => {
          resetVirtualCompany();
          toast.success('تمت إعادة ضبط مؤشرات الشركة الافتراضية');
        }}
      />
    </div>
  );
}
