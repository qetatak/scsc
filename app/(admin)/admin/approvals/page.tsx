'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminApprovalsPage() {
  const { approvalRequests, approveRequest, rejectRequest } = useAdminStore();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  return (
    <div>
      <PageHeader
        title="طلبات الموافقة والتوثيق (المعلمون والشركات)"
        description="راجع بيانات المعلمين الجدد وطلبات توثيق الشركات الموظِّفة قبل منحهم صلاحية النشر والتواصل."
      />

      <ChartCard
        title="طابور المراجعة والتوثيق"
        subtitle="كل قرار موافقة أو رفض يُسجل تلقائياً في سجل التدقيق الأمني (Audit Log)."
      >
        <div className="space-y-4">
          {approvalRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-[14px] border border-[#E3E8F0] bg-[#FAFBFC] p-5 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
                    <span className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {req.applicantName}
                    </span>
                    <span className="rounded-[6px] bg-[#2F6BFF]/10 px-2 py-0.5 text-[11px] font-semibold text-[#2F6BFF]">
                      {req.role === 'teacher' ? 'أستاذ جامعي / معلم' : 'شركة موظِّفة'}
                    </span>
                    <span
                      className={`rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${
                        req.status === 'مقبول'
                          ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                          : req.status === 'مرفوض'
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#526077] dark:text-[#94A3B8]">
                    {req.applicantEmail} — {req.organizationOrUniversity}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    {req.departmentOrCommercialReg}
                  </p>
                  <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                    {req.notes}
                  </p>
                  {req.rejectionReason && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                      سبب الرفض: {req.rejectionReason}
                    </p>
                  )}
                </div>

                {req.status === 'قيد المراجعة' && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        approveRequest(req.id);
                        toast.success(`تم اعتماد وتوثيق حساب ${req.applicantName}`);
                      }}
                      className="gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>قبول وتفعيل الحساب</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setRejectingId(req.id)}
                      className="gap-1.5 text-red-600 dark:text-red-400"
                    >
                      <X className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>رفض مع ذكر السبب</span>
                    </Button>
                  </div>
                )}
              </div>

              {rejectingId === req.id && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E3E8F0] pt-3 dark:border-[#1E325C]">
                  <Input
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="اكتب سبب الرفض ليُرسل لمقدم الطلب..."
                    className="h-9 flex-1 text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!rejectionReason.trim()) {
                        toast.error('يرجى كتابة سبب الرفض.');
                        return;
                      }
                      rejectRequest(req.id, rejectionReason.trim());
                      setRejectingId(null);
                      setRejectionReason('');
                      toast.success('تم رفض الطلب وتسجيل السبب');
                    }}
                  >
                    تأكيد الرفض
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
