'use client';

import React from 'react';
import { Building2, ShieldCheck, Ban } from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminCompaniesPage() {
  const { users, suspendOrActivateUser, recordAuditAction } = useAdminStore();
  const companyUsers = users.filter((u) => u.role === 'company');

  return (
    <div>
      <PageHeader
        title="إدارة الشركات الموظِّفة والتوثيق"
        description="متابعة حسابات الشركات المسجلة، منح شارة التوثيق الرسمي، ومراقبة نشاط التواصل مع الطلاب."
      />

      <ChartCard
        title="الشركات المسجلة في بوابة التوظيف"
        subtitle="يمكنك منح شارة شركة موثقة أو إيقاف الشركات المخالفة لسياسة التواصل."
      >
        <div className="space-y-3">
          {companyUsers.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
                  <span className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {comp.fullName}
                  </span>
                  <span
                    className={`rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${
                      comp.status === 'نشط'
                        ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {comp.status === 'نشط' ? 'شركة موثقة ونشطة' : 'حساب معلّق'}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-[#526077] dark:text-[#94A3B8]">
                  {comp.email} — {comp.universityOrOrg}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    recordAuditAction(
                      'موافقة طلب',
                      `تأكيد شارة التوثيق الرسمية لشركة: ${comp.universityOrOrg}`
                    );
                    toast.success(
                      `تم تحديث شارة التوثيق الرسمية لشركة ${comp.universityOrOrg}`
                    );
                  }}
                  className="gap-1.5 text-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                  <span>تأكيد التوثيق</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    suspendOrActivateUser(comp.id);
                    toast.success(`تم تحديث حالة حساب ${comp.fullName}`);
                  }}
                  className="gap-1.5 text-xs text-amber-700 dark:text-amber-300"
                >
                  <Ban className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>
                    {comp.status === 'معلّق' ? 'إعادة تفعيل' : 'تعليق مؤقت'}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
