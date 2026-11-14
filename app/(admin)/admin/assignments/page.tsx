'use client';

import React from 'react';
import { CheckCircle2, ClipboardCheck, Trash2 } from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { useAdminStore } from '@/store/use-admin-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { toast } from 'sonner';

export default function AdminAssignmentsContentPage() {
  const { assignments, templates, classes } = useTeacherStore();
  const { recordAuditAction } = useAdminStore();

  return (
    <div>
      <PageHeader
        title="مراجعة الواجبات العملية والمحتوى الأكاديمي"
        description="تصفح جميع الواجبات المنشورة من المعلمين، اعتمد القوالب المميزة للمكتبة العامة، واحذف المحتوى المخالف."
      />

      <div className="space-y-6">
        <ChartCard
          title="الواجبات المنشورة على مستوى الجامعات"
          subtitle={`إجمالي الواجبات النشطة في النظام: ${assignments.length}`}
        >
          <div className="space-y-3">
            {assignments.map((asg) => {
              const cls = classes.find((c) => c.id === asg.targetClassId);
              return (
                <div
                  key={asg.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <ClipboardCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                      <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                        {asg.title}
                      </span>
                      <span className="text-[#526077] dark:text-[#94A3B8]">
                        — {cls?.university || 'الجامعة الأردنية'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                      المعلم: {asg.createdByTeacherName} — الشعبة:{' '}
                      {cls?.courseName || 'شعبة دراسية'} — المختبر: {asg.labId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        recordAuditAction(
                          'موافقة طلب',
                          `اعتماد واجب "${asg.title}" في مكتبة القوالب العامة`
                        );
                        toast.success(
                          `تم اعتماد "${asg.title}" في مكتبة القوالب العامة`
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-[8px] border border-[#E3E8F0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#2F6BFF] hover:bg-[#F5F6F8] dark:border-[#1E325C] dark:bg-[#0F1E3E]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>اعتماد كقالب عام</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        recordAuditAction(
                          'تحديث إعدادات',
                          `مراجعة سلامة محتوى الواجب: ${asg.title}`
                        );
                        toast.success('تم توثيق سلامة المحتوى في سجل التدقيق');
                      }}
                      className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-xs text-[#526077] hover:text-red-600 dark:text-[#94A3B8]"
                    >
                      <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>إخفاء</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard
          title={`إحصائية مكتبة القوالب المعتمدة (${templates.length} قالب)`}
          subtitle="موزعة بالتساوي على المختبرات الأربعة لضمان تغطية المناهج الجامعية"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { id: 'accounting', name: 'مختبر المحاسبة' },
              { id: 'marketing', name: 'مختبر التسويق' },
              { id: 'management', name: 'مختبر الإدارة' },
              { id: 'python', name: 'مختبر Python' },
            ].map((lab) => {
              const count = templates.filter((t) => t.labId === lab.id).length;
              return (
                <div
                  key={lab.id}
                  className="rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]"
                >
                  <div className="text-xs text-[#526077] dark:text-[#94A3B8]">
                    {lab.name}
                  </div>
                  <div className="mt-1 font-tabular text-2xl font-bold text-[#0A1630] dark:text-[#FAFBFC]">
                    {count} قوالب
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
