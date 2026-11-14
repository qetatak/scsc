'use client';

import React from 'react';
import { FlaskConical, Power } from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { useTeacherStore } from '@/store/use-teacher-store';
import { LABS_METADATA } from '@/data/mock-data';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminLabsPage() {
  const { labsControl, toggleLabEnabled } = useAdminStore();
  const { templates } = useTeacherStore();

  return (
    <div>
      <PageHeader
        title="إدارة المختبرات التفاعلية والسيناريوهات"
        description="تفعيل أو تعطيل المختبرات الأربعة، ومراجعة السيناريوهات وقوالب الواجبات المعتمدة."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {LABS_METADATA.map((lab) => {
          const ctrl = labsControl.find((l) => l.labId === lab.id);
          const isEnabled = ctrl ? ctrl.enabled : true;
          const labTemplates = templates.filter((t) => t.labId === lab.id);
          return (
            <ChartCard
              key={lab.id}
              title={lab.title}
              subtitle={lab.description}
              action={
                <Button
                  size="sm"
                  variant={isEnabled ? 'default' : 'secondary'}
                  onClick={() => {
                    toggleLabEnabled(lab.id);
                    toast.success(
                      isEnabled
                        ? `تم إيقاف ${lab.title} مؤقتاً للصيانة`
                        : `تم تفعيل ${lab.title} لجميع الطلاب`
                    );
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Power className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>{isEnabled ? 'نشط ومتاح' : 'معطل مؤقتاً'}</span>
                </Button>
              }
            >
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-[10px] bg-[#FAFBFC] p-3 dark:bg-[#0A1630]">
                  <span className="text-[#526077] dark:text-[#94A3B8]">
                    التخصص التطبيقي:
                  </span>
                  <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {lab.subtitle} ({lab.badgeTitle})
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-[10px] bg-[#FAFBFC] p-3 dark:bg-[#0A1630]">
                  <span className="text-[#526077] dark:text-[#94A3B8]">
                    عدد قوالب الواجبات الجاهزة:
                  </span>
                  <span className="font-tabular font-bold text-[#2F6BFF]">
                    {labTemplates.length} قوالب معتمدة
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[#526077] dark:text-[#94A3B8]">
                  <FlaskConical className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                  <span>محرك التصحيح التلقائي الفوري متصل ويعمل بكفاءة 100%</span>
                </div>
              </div>
            </ChartCard>
          );
        })}
      </div>
    </div>
  );
}
