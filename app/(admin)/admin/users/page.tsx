'use client';

import React, { useState } from 'react';
import {
  Ban,
  CheckCircle2,
  Download,
  KeyRound,
  Trash2,
} from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { PlatformUserRecord } from '@/data/assignments-mock-data';
import { UserRole } from '@/types';
import {
  ChartCard,
  DataTable,
  DataTableColumn,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ROLE_LABELS: Record<UserRole, string> = {
  student: 'طالب جامعي',
  teacher: 'معلم / أستاذ مساق',
  company: 'شركة موظِّفة',
  admin: 'مسؤول النظام',
};

export default function AdminUsersPage() {
  const {
    users,
    suspendOrActivateUser,
    changeUserRole,
    resetUserPassword,
    deleteUserRecord,
  } = useAdminStore();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userToDelete, setUserToDelete] =
    useState<PlatformUserRecord | null>(null);

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      'المعرف',
      'الاسم الكامل',
      'البريد الإلكتروني',
      'الدور',
      'المؤسسة / الجامعة',
      'الحالة',
      'تاريخ التسجيل',
    ];
    const lines = filtered.map((u) =>
      [
        u.id,
        `"${u.fullName}"`,
        u.email,
        ROLE_LABELS[u.role],
        `"${u.universityOrOrg}"`,
        u.status,
        u.joinedAt,
      ].join(',')
    );
    const csv = '\uFEFF' + [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tadreebak-users-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('تم تصدير قائمة المستخدمين بصيغة CSV');
  };

  const columns: DataTableColumn<PlatformUserRecord>[] = [
    {
      key: 'fullName',
      header: 'المستخدم',
      sortable: true,
      sortValue: (r) => r.fullName,
      render: (r) => (
        <div>
          <div className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            {r.fullName}
          </div>
          <div className="font-mono text-[11px] text-[#526077] dark:text-[#94A3B8]">
            {r.email}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'الدور والصلاحية',
      render: (r) => (
        <select
          value={r.role}
          onChange={(e) => {
            const nextRole = e.target.value as UserRole;
            changeUserRole(r.id, nextRole);
            toast.success(
              `تم تغيير صلاحية ${r.fullName} إلى ${ROLE_LABELS[nextRole]}`
            );
          }}
          className="h-7 rounded-[6px] border border-[#E3E8F0] bg-[#FAFBFC] px-2 text-xs font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
        >
          <option value="student">طالب</option>
          <option value="teacher">معلم</option>
          <option value="company">شركة</option>
          <option value="admin">أدمن</option>
        </select>
      ),
    },
    {
      key: 'universityOrOrg',
      header: 'الجامعة / المؤسسة',
      sortable: true,
      sortValue: (r) => r.universityOrOrg,
      render: (r) => (
        <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
          {r.universityOrOrg}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (r) => (
        <span
          className={`inline-flex rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${
            r.status === 'نشط'
              ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
              : r.status === 'بانتظار الموافقة'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
              : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'joinedAt',
      header: 'تاريخ الانضمام',
      render: (r) => (
        <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
          {r.joinedAt}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'إجراءات إدارية',
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              suspendOrActivateUser(r.id);
              toast.success(
                r.status === 'معلّق'
                  ? `تم إعادة تفعيل حساب ${r.fullName}`
                  : `تم تعليق حساب ${r.fullName} مؤقتاً`
              );
            }}
            className="inline-flex items-center gap-1 rounded-[6px] border border-[#E3E8F0] px-2 py-1 text-[11px] font-medium text-[#0A1630] hover:bg-[#F5F6F8] dark:border-[#1E325C] dark:text-[#FAFBFC] dark:hover:bg-[#1E325C]"
          >
            {r.status === 'معلّق' ? (
              <>
                <CheckCircle2 className="h-3 w-3 stroke-[1.5] text-[#2F6BFF]" />
                <span>تفعيل</span>
              </>
            ) : (
              <>
                <Ban className="h-3 w-3 stroke-[1.5] text-amber-600" />
                <span>تعليق</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              resetUserPassword(r.id);
              toast.success(`تم إرسال رابط إعادة تعيين كلمة المرور إلى ${r.email}`);
            }}
            className="inline-flex items-center gap-1 rounded-[6px] border border-[#E3E8F0] px-2 py-1 text-[11px] font-medium text-[#526077] hover:text-[#0A1630] dark:border-[#1E325C] dark:text-[#94A3B8]"
            title="إعادة تعيين كلمة المرور"
          >
            <KeyRound className="h-3 w-3 stroke-[1.5]" />
            <span>كلمة المرور</span>
          </button>

          <button
            type="button"
            onClick={() => setUserToDelete(r)}
            className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-3 w-3 stroke-[1.5]" />
            <span>حذف</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="إدارة المستخدمين والصلاحيات"
        description="جدول شامل لجميع حسابات الطلاب والمعلمين والشركات مع إجراءات التفعيل، تغيير الصلاحية، وتصدير CSV."
        actions={
          <Button size="sm" onClick={handleExportCsv} className="gap-1.5">
            <Download className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>تصدير المستخدمين (CSV)</span>
          </Button>
        }
      />

      {userToDelete && (
        <div className="mb-6 rounded-[16px] border border-red-300 bg-red-50/70 p-5 dark:border-red-900 dark:bg-red-950/30">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
            تأكيد حذف الحساب نهائياً
          </h3>
          <p className="mt-1 text-xs text-red-700 dark:text-red-300">
            هل أنت متأكد من حذف حساب <strong>{userToDelete.fullName}</strong> (
            {userToDelete.email})؟ سيتم تسجيل هذه العملية في سجل التدقيق الأمني.
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setUserToDelete(null)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                deleteUserRecord(userToDelete.id);
                toast.success(`تم حذف حساب ${userToDelete.fullName} نهائياً`);
                setUserToDelete(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              تأكيد الحذف النهائي
            </Button>
          </div>
        </div>
      )}

      <ChartCard
        title="سجل حسابات المنصة"
        subtitle="فلترة فورية حسب الدور أو الحالة أو البحث بالاسم والبريد والجامعة."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-8 rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-2.5 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
            >
              <option value="all">جميع الأدوار</option>
              <option value="student">الطلاب</option>
              <option value="teacher">المعلمون</option>
              <option value="company">الشركات</option>
              <option value="admin">الأدمن</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-2.5 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
            >
              <option value="all">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="بانتظار الموافقة">بانتظار الموافقة</option>
              <option value="معلّق">معلّق</option>
            </select>
          </div>
        }
      >
        <DataTable
          data={filtered}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="ابحث بالاسم أو البريد أو الجامعة..."
          searchMatcher={(r, q) =>
            r.fullName.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.universityOrOrg.toLowerCase().includes(q)
          }
          pageSize={8}
        />
      </ChartCard>
    </div>
  );
}
