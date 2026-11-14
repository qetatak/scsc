'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Trash2, UserPlus } from 'lucide-react';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import { CompanyTeamMember } from '@/data/dashboard-mock-data';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const inviteMemberSchema = z.object({
  name: z.string().min(3, 'اسم العضو مطلوب'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  department: z.string().min(2, 'القسم الإداري مطلوب'),
  role: z.enum(['مدير الحساب', 'مسؤول توظيف', 'مراجع تقني']),
});

type InviteMemberValues = z.infer<typeof inviteMemberSchema>;

export default function CompanyTeamPage() {
  const {
    teamMembers,
    inviteTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
  } = useCompanyDashboardStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      department: 'استقطاب المواهب',
      role: 'مسؤول توظيف',
    },
  });

  const onInvite = (values: InviteMemberValues) => {
    inviteTeamMember(values.name, values.email, values.role, values.department);
    reset();
    toast.success(`تم إرسال دعوة الانضمام إلى ${values.name} (${values.role})`);
  };

  return (
    <div>
      <PageHeader
        title="إدارة فريق التوظيف والصلاحيات"
        description="أضف مسؤولي التوظيف والمراجعين التقنيين وحدد صلاحيات كل عضو في استعراض المرشحين والتواصل معهم."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Invite Member Form */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleSubmit(onInvite)}
            className="space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-6 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]"
          >
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              دعوة عضو جديد للفريق
            </h2>

            <div>
              <label className="mb-1.5 block font-medium">الاسم الكامل</label>
              <Input {...register('name')} placeholder="مثال: طارق الزعبي" />
              {errors.name && (
                <p className="mt-1 text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-medium">
                البريد الإلكتروني الوظيفي
              </label>
              <Input
                {...register('email')}
                dir="ltr"
                placeholder="name@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-medium">القسم</label>
              <Input {...register('department')} />
            </div>

            <div>
              <label className="mb-1.5 block font-medium">الدور والصلاحية</label>
              <select
                {...register('role')}
                className="h-10 w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-xs dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <option value="مسؤول توظيف">مسؤول توظيف (بحث وتواصل)</option>
                <option value="مراجع تقني">مراجع تقني (تقييم وملاحظات)</option>
                <option value="مدير الحساب">مدير الحساب (صلاحيات كاملة)</option>
              </select>
            </div>

            <Button type="submit" size="sm" className="w-full gap-1.5">
              <UserPlus className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>إرسال دعوة للعضو</span>
            </Button>
          </form>
        </div>

        {/* Team Members Cards (Mobile) + Table (Tablet/Desktop) */}
        <div className="lg:col-span-8">
          <div className="space-y-3 md:hidden">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-[16px] border border-[#E3E8F0] bg-white p-4 space-y-3 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {member.name}
                    </p>
                    <p className="font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      {member.email}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      {member.department} · <span className="font-medium text-[#2F6BFF]">{member.status}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeTeamMember(member.id);
                      toast.info(`تمت إزالة ${member.name} من الفريق`);
                    }}
                    aria-label={`إزالة ${member.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[#526077] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.5]" />
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[#526077]">
                    الصلاحية والدور
                  </label>
                  <select
                    value={member.role}
                    onChange={(e) => {
                      updateTeamMemberRole(
                        member.id,
                        e.target.value as CompanyTeamMember['role']
                      );
                      toast.success(`تم تحديث دور ${member.name}`);
                    }}
                    aria-label={`دور ${member.name}`}
                    className="h-11 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-xs font-medium dark:border-[#1E325C] dark:bg-[#0A1630]"
                  >
                    <option value="مدير الحساب">مدير الحساب</option>
                    <option value="مسؤول توظيف">مسؤول توظيف</option>
                    <option value="مراجع تقني">مراجع تقني</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto rounded-[16px] border border-[#E3E8F0] bg-white dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <table className="w-full border-collapse text-right text-xs">
              <thead>
                <tr className="border-b border-[#E3E8F0] bg-[#F5F6F8] text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#94A3B8]">
                  <th className="px-4 py-3.5 font-medium">العضو</th>
                  <th className="px-4 py-3.5 font-medium">القسم</th>
                  <th className="px-4 py-3.5 font-medium">الدور</th>
                  <th className="px-4 py-3.5 font-medium">الحالة</th>
                  <th className="px-4 py-3.5 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0] dark:divide-[#1E325C]">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {member.name}
                      </p>
                      <p className="font-tabular text-[11px] text-[#526077]">
                        {member.email}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-[#526077] dark:text-[#94A3B8]">
                      {member.department}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={member.role}
                        onChange={(e) => {
                          updateTeamMemberRole(
                            member.id,
                            e.target.value as CompanyTeamMember['role']
                          );
                          toast.success(`تم تحديث دور ${member.name}`);
                        }}
                        aria-label={`دور ${member.name}`}
                        className="rounded-[8px] border border-[#E3E8F0] bg-white px-2.5 py-1 text-xs font-medium dark:border-[#1E325C] dark:bg-[#0A1630]"
                      >
                        <option value="مدير الحساب">مدير الحساب</option>
                        <option value="مسؤول توظيف">مسؤول توظيف</option>
                        <option value="مراجع تقني">مراجع تقني</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#2F6BFF]">
                      {member.status}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          removeTeamMember(member.id);
                          toast.info(`تمت إزالة ${member.name} من الفريق`);
                        }}
                        aria-label={`إزالة ${member.name}`}
                        className="rounded-[6px] p-1.5 text-[#526077] hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.5]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
