'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CompanySettingsPage() {
  const { resetChecklist } = useCompanyDashboardStore();
  const [notifyOnReply, setNotifyOnReply] = useState(true);
  const [weeklyTalentDigest, setWeeklyTalentDigest] = useState(true);
  const [atsWebhookUrl, setAtsWebhookUrl] = useState(
    'https://api.futuretech.jo/webhooks/tadreebak-ats'
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم حفظ إعدادات حساب الشركة وتنبيهات التوظيف بنجاح');
  };

  return (
    <div>
      <PageHeader
        title="إعدادات حساب الشركة والربط البرمجي"
        description="تخصيص إشعارات ردود المرشحين وربط بوابة التوظيف مع نظام تتبع المتقدمين (ATS)."
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              resetChecklist();
              toast.success('تمت إعادة إظهار قائمة الإعداد الأولي للشركة');
            }}
          >
            إعادة عرض خطوات الإعداد الأولي
          </Button>
        }
      />

      <form
        onSubmit={handleSaveSettings}
        className="max-w-2xl space-y-6 rounded-[16px] border border-[#E3E8F0] bg-white p-6 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]"
      >
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            إشعارات البريد الإلكتروني لفريق التوظيف
          </h2>

          <label className="flex cursor-pointer items-center justify-between rounded-[10px] border border-[#E3E8F0] p-3.5 dark:border-[#1E325C]">
            <span>إشعار فوري عند رد المرشح أو قبوله دعوة المقابلة</span>
            <input
              type="checkbox"
              checked={notifyOnReply}
              onChange={(e) => setNotifyOnReply(e.target.checked)}
              className="h-4 w-4 accent-[#2F6BFF]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-[10px] border border-[#E3E8F0] p-3.5 dark:border-[#1E325C]">
            <span>ملخص أسبوعي بأبرز الخريجين المتفوقين في المختبرات</span>
            <input
              type="checkbox"
              checked={weeklyTalentDigest}
              onChange={(e) => setWeeklyTalentDigest(e.target.checked)}
              className="h-4 w-4 accent-[#2F6BFF]"
            />
          </label>
        </div>

        <div className="border-t border-[#E3E8F0] pt-5 dark:border-[#1E325C]">
          <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            الربط مع نظام الموارد البشرية (ATS Webhook)
          </h2>
          <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
            إرسال بيانات المرشحين المقبولين تلقائياً إلى نظام الموارد البشرية الداخلي.
          </p>
          <div className="mt-3">
            <label className="mb-1.5 block font-medium">
              رابط الـ Webhook الرسمي
            </label>
            <Input
              value={atsWebhookUrl}
              onChange={(e) => setAtsWebhookUrl(e.target.value)}
              dir="ltr"
            />
          </div>
        </div>

        <Button type="submit" size="sm" className="gap-1.5">
          <Save className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>حفظ إعدادات الشركة</span>
        </Button>
      </form>
    </div>
  );
}
