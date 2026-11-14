'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CheckCircle2, Save, ShieldCheck } from 'lucide-react';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'اسم الشركة مطلوب'),
  legalName: z.string().min(3, 'الاسم القانوني للشركة مطلوب'),
  industry: z.string().min(3, 'القطاع الصناعي مطلوب'),
  city: z.string().min(2, 'المدينة مطلوبة'),
  website: z.string().url('يرجى إدخال رابط موقع إلكتروني صحيح'),
  employeesCount: z.string().min(2, 'حجم الشركة مطلوب'),
  contactEmail: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  contactPhone: z.string().min(6, 'رقم الهاتف مطلوب'),
  commercialRegNumber: z.string().min(4, 'رقم السجل التجاري مطلوب للتوثيق'),
  description: z.string().min(20, 'وصف الشركة يجب ألا يقل عن 20 حرفاً'),
});

type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;

export default function CompanyProfilePage() {
  const {
    companyProfile,
    updateCompanyProfile,
    verifyCompanyAccount,
    completeChecklistStep,
  } = useCompanyDashboardStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: companyProfile.companyName,
      legalName: companyProfile.legalName,
      industry: companyProfile.industry,
      city: companyProfile.city,
      website: companyProfile.website,
      employeesCount: companyProfile.employeesCount,
      contactEmail: companyProfile.contactEmail,
      contactPhone: companyProfile.contactPhone,
      commercialRegNumber: companyProfile.commercialRegNumber,
      description: companyProfile.description,
    },
  });

  const regNumberValue = watch('commercialRegNumber');

  const onSubmit = (values: CompanyProfileFormValues) => {
    updateCompanyProfile(values);
    completeChecklistStep('c-step-profile');
    toast.success('تم حفظ ملف الشركة وتحديث بياناتها بنجاح');
  };

  return (
    <div>
      <PageHeader
        title="ملف الشركة وتوثيق الحساب الرسمي"
        description="تظهر هذه المعلومات للطلاب عند استلامهم دعوات المقابلات من فريق التوظيف لديكم."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-[16px] border border-[#E3E8F0] bg-white p-6 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-medium">
                  اسم الشركة المختصر
                </label>
                <Input {...register('companyName')} />
                {errors.companyName && (
                  <p className="mt-1 text-red-600">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-medium">
                  الاسم القانوني الرسمي
                </label>
                <Input {...register('legalName')} />
                {errors.legalName && (
                  <p className="mt-1 text-red-600">{errors.legalName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block font-medium">القطاع</label>
                <Input {...register('industry')} />
              </div>
              <div>
                <label className="mb-1.5 block font-medium">المدينة</label>
                <Input {...register('city')} />
              </div>
              <div>
                <label className="mb-1.5 block font-medium">عدد الموظفين</label>
                <Input {...register('employeesCount')} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block font-medium">
                  الموقع الإلكتروني
                </label>
                <Input {...register('website')} dir="ltr" />
                {errors.website && (
                  <p className="mt-1 text-red-600">{errors.website.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-medium">
                  بريد التوظيف الرسمي
                </label>
                <Input {...register('contactEmail')} dir="ltr" />
                {errors.contactEmail && (
                  <p className="mt-1 text-red-600">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-medium">هاتف التواصل</label>
                <Input {...register('contactPhone')} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-medium">
                نبذة تعريفية عن الشركة وبيئة العمل
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-[12px] border border-[#E3E8F0] bg-white p-3 text-sm outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
              />
              {errors.description && (
                <p className="mt-1 text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" className="gap-1.5">
                <Save className="h-4 w-4 stroke-[1.5]" />
                <span>حفظ بيانات الشركة</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Verification Column */}
        <div className="lg:col-span-4">
          <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 stroke-[1.5] text-[#2F6BFF]" />
              <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                حالة التوثيق الرسمي (Verification)
              </h2>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
              تحصل الشركات الموثقة بالسجل التجاري على أولوية ظهور رسائلها في صناديق الطلاب بنسبة استجابة أعلى.
            </p>

            <div className="mt-4 rounded-[12px] border border-[#E3E8F0] bg-[#F5F6F8] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#526077]">الحالة الحالية:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#2F6BFF]">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.75]" />
                  <span>
                    {companyProfile.isVerified
                      ? 'شركة موثقة رسمياً'
                      : 'بانتظار التوثيق'}
                  </span>
                </span>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium">
                  رقم السجل التجاري / الترخيص
                </label>
                <Input {...register('commercialRegNumber')} dir="ltr" />
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  verifyCompanyAccount(
                    regNumberValue || 'JO-AMM-2019-94821'
                  );
                  toast.success('تم توثيق حساب الشركة وتحديث خطوات الإعداد الأولي');
                }}
                className="mt-3 w-full text-xs"
              >
                تأكيد وتحديث شارة التوثيق
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
