'use client';

import React from 'react';
import { Bell, ShieldAlert } from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';

export default function AdminNotificationsPage() {
  const { approvalRequests, auditLogs } = useAdminStore();
  const pendingCount = approvalRequests.filter(
    (a) => a.status === 'قيد المراجعة'
  ).length;

  return (
    <div>
      <PageHeader
        title="مركز إشعارات وتنبيهات النظام"
        description="تنبيهات فورية حول طلبات التوثيق الجديدة والعمليات الأمنية في المنصة."
      />

      <ChartCard
        title="التنبيهات النشطة"
        subtitle={`لديك ${pendingCount} طلبات توثيق بانتظار المراجعة`}
      >
        <div className="space-y-3">
          {approvalRequests
            .filter((a) => a.status === 'قيد المراجعة')
            .map((req) => (
              <div
                key={req.id}
                className="flex items-start gap-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <Bell className="mt-0.5 h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
                <div>
                  <h3 className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    طلب توثيق جديد: {req.applicantName} (
                    {req.organizationOrUniversity})
                  </h3>
                  <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                    {req.notes}
                  </p>
                </div>
              </div>
            ))}

          {auditLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]"
            >
              <ShieldAlert className="mt-0.5 h-4 w-4 stroke-[1.5] text-[#526077]" />
              <div>
                <h3 className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {log.actionType} — {log.targetLabel}
                </h3>
                <p className="mt-0.5 font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
                  بواسطة {log.actorName} في {log.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
