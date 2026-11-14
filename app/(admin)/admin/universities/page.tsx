'use client';

import React, { useState } from 'react';
import { Building2, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { useTeacherStore } from '@/store/use-teacher-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminUniversitiesPage() {
  const { universities, addUniversity, removeUniversity } = useAdminStore();
  const { classes } = useTeacherStore();
  const [newUni, setNewUni] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUni.trim()) return;
    addUniversity(newUni.trim());
    setNewUni('');
    toast.success('تمت إضافة الجامعة إلى قائمة التسجيل المعتمدة');
  };

  return (
    <div>
      <PageHeader
        title="إدارة الجامعات والشُعب الدراسية"
        description="تحكم بقائمة الجامعات المتاحة عند التسجيل وراقب الشُعب الدراسية النشطة وأكواد الانضمام."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="الجامعات المعتمدة في المنصة"
          subtitle="تظهر هذه القائمة للطلاب والمعلمين أثناء إنشاء الحساب"
          className="lg:col-span-5"
        >
          <form onSubmit={handleAdd} className="mb-4 flex gap-2">
            <Input
              value={newUni}
              onChange={(e) => setNewUni(e.target.value)}
              placeholder="اسم الجامعة الجديدة..."
              className="h-9 text-xs"
            />
            <Button type="submit" size="sm" className="gap-1 shrink-0">
              <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>إضافة</span>
            </Button>
          </form>

          <div className="space-y-2">
            {universities.map((uni) => (
              <div
                key={uni}
                className="flex items-center justify-between rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3.5 py-2.5 text-xs dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <span className="inline-flex items-center gap-2 font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  <Building2 className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                  {uni}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    removeUniversity(uni);
                    toast.success(`تم حذف ${uni} من القائمة`);
                  }}
                  className="text-red-600 hover:underline dark:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="الشُعب الدراسية النشطة وأكواد الانضمام"
          subtitle="جميع الشُعب المنشأة من قِبل المعلمين في الجامعات"
          className="lg:col-span-7"
        >
          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]"
              >
                <div>
                  <span className="text-xs font-semibold text-[#2F6BFF]">
                    {cls.university} — {cls.courseCode}
                  </span>
                  <h3 className="mt-0.5 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {cls.courseName}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                    المعلم: {cls.teacherName} — عدد الطلاب: {cls.studentUsernames.length}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 py-1.5 font-mono text-xs font-bold text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]">
                  <KeyRound className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                  {cls.joinCode}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
