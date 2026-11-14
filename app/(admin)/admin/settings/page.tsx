'use client';

import React, { useState } from 'react';
import { Save, Sliders } from 'lucide-react';
import { useAdminStore } from '@/store/use-admin-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { siteSettings, toggleFeatureFlag, updateSiteSettings } =
    useAdminStore();

  const [siteNameAr, setSiteNameAr] = useState(siteSettings.siteNameAr);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [seoDescription, setSeoDescription] = useState(
    siteSettings.seoDescription
  );
  const [maxUploadSizeMb, setMaxUploadSizeMb] = useState(
    siteSettings.maxUploadSizeMb
  );
  const [privacyPolicySummary, setPrivacyPolicySummary] = useState(
    siteSettings.privacyPolicySummary
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteNameAr: siteNameAr.trim(),
      tagline: tagline.trim(),
      seoDescription: seoDescription.trim(),
      maxUploadSizeMb: Number(maxUploadSizeMb),
      privacyPolicySummary: privacyPolicySummary.trim(),
    });
    toast.success('تم حفظ إعدادات الموقع وتوثيق التعديل في سجل التدقيق');
  };

  return (
    <div>
      <PageHeader
        title="إعدادات المنصة ومفاتيح الميزات (Feature Flags)"
        description="تحكم بهوية المنصة، إعدادات محركات البحث SEO، الحدود القصوى للملفات، وتفعيل الميزات الحية."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="هوية المنصة وإعدادات النظام العامة"
          subtitle="تنعكس هذه الإعدادات على العناوين الوصفية وسياسات الاستخدام."
          className="lg:col-span-7"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>اسم المنصة بالعربية</Label>
                <Input
                  value={siteNameAr}
                  onChange={(e) => setSiteNameAr(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>الحد الأقصى لحجم المرفقات (MB)</Label>
                <Input
                  type="number"
                  value={maxUploadSizeMb}
                  onChange={(e) => setMaxUploadSizeMb(Number(e.target.value))}
                  className="mt-1.5 font-tabular"
                />
              </div>
            </div>

            <div>
              <Label>الشعار التسويقي (Tagline)</Label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>وصف محركات البحث (SEO Meta Description)</Label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              />
            </div>

            <div>
              <Label>ملخص سياسة الخصوصية وحماية البيانات</Label>
              <textarea
                rows={3}
                value={privacyPolicySummary}
                onChange={(e) => setPrivacyPolicySummary(e.target.value)}
                className="mt-1.5 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="gap-1.5">
                <Save className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>حفظ إعدادات المنصة</span>
              </Button>
            </div>
          </form>
        </ChartCard>

        <ChartCard
          title="مفاتيح تشغيل الميزات (Feature Flags)"
          subtitle="تفعيل أو إيقاف فوري للخصائص الرئيسية في المنصة"
          className="lg:col-span-5"
        >
          <div className="space-y-3">
            {[
              {
                key: 'enableAutoGrader' as const,
                title: 'تفعيل محرك التصحيح التلقائي الفوري',
                desc: 'تصحيح الواجبات العملية فور تسليم الطالب داخل المختبر.',
              },
              {
                key: 'enableRandomizedManagementVars' as const,
                title: 'توليد متغيرات عشوائية لكل طالب',
                desc: 'تخصيص أرقام نقطة التعادل في مختبر الإدارة لمنع نقل الحلول.',
              },
              {
                key: 'enablePyodideWorker' as const,
                title: 'تشغيل مختبر Python داخل Web Worker',
                desc: 'تنفيذ الكود البرمجي مع مهلة زمنية آمنة 3 ثوانٍ.',
              },
              {
                key: 'enableCompanyDirectMessaging' as const,
                title: 'مراسلة الشركات المباشرة للطلاب',
                desc: 'السماح للشركات الموثقة بإرسال دعوات مقابلات للطلاب.',
              },
              {
                key: 'requireAdminApprovalForTeachers' as const,
                title: 'اشتراط موافقة الأدمن لحسابات المعلمين',
                desc: 'مراجعة بيانات المعلمين الجدد قبل تفعيل صلاحية النشر.',
              },
            ].map((flag) => {
              const active = siteSettings.featureFlags[flag.key];
              return (
                <div
                  key={flag.key}
                  className="flex items-center justify-between gap-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      <Sliders className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                      {flag.title}
                    </div>
                    <p className="mt-1 text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      {flag.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleFeatureFlag(flag.key);
                      toast.success(`تم تحديث حالة الميزة: ${flag.title}`);
                    }}
                    className={`shrink-0 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#2F6BFF] text-white'
                        : 'bg-[#E3E8F0] text-[#526077] dark:bg-[#1E325C] dark:text-[#94A3B8]'
                    }`}
                  >
                    {active ? 'مُفعَّل' : 'مُعطَّل'}
                  </button>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
