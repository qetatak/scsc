'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { AuditLogEntry } from '@/types';
import {
  ChartCard,
  DataTable,
  DataTableColumn,
  PageHeader,
} from '@/components/dashboard/ui-kit';

export default function AdminAuditLogPage() {
  const { auditLogs } = useAdminStore();

  const columns: DataTableColumn<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      header: 'التوقيت الزمني',
      sortable: true,
      sortValue: (r) => r.timestamp,
      render: (r) => (
        <span className="font-tabular font-mono text-xs text-[#526077] dark:text-[#94A3B8]">
          {r.timestamp}
        </span>
      ),
    },
    {
      key: 'actorName',
      header: 'المسؤول المنفِّذ',
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
          <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
          {r.actorName}
        </span>
      ),
    },
    {
      key: 'actionType',
      header: 'نوع العملية',
      render: (r) => (
        <span className="rounded-[6px] border border-[#E3E8F0] bg-[#FAFBFC] px-2 py-0.5 text-[11px] font-semibold text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]">
          {r.actionType}
        </span>
      ),
    },
    {
      key: 'targetLabel',
      header: 'العنصر المستهدف والتفاصيل',
      render: (r) => (
        <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
          {r.targetLabel}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      header: 'عنوان IP',
      render: (r) => (
        <span className="font-mono text-xs text-[#526077] dark:text-[#94A3B8]">
          {r.ipAddress}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="سجل العمليات والتدقيق الأمني (Audit Log)"
        description="توثيق غير قابل للتعديل لكل عملية حساسة: حذف مستخدم، تغيير صلاحية، موافقة على شركة، أو تعديل إعدادات المنصة."
      />

      <ChartCard
        title="سجل التدقيق الزمني"
        subtitle="ابحث بالعملية أو اسم المستخدم المستهدف أو المسؤول."
      >
        <DataTable
          data={auditLogs}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="ابحث في سجل التدقيق..."
          searchMatcher={(r, q) =>
            r.actionType.toLowerCase().includes(q) ||
            r.targetLabel.toLowerCase().includes(q) ||
            r.actorName.toLowerCase().includes(q)
          }
          pageSize={10}
        />
      </ChartCard>
    </div>
  );
}
