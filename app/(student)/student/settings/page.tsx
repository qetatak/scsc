'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AlertTriangle, Lock, Save, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useStudentDashboardStore } from '@/store/use-student-dashboard-store';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const accountInfoSchema = z.object({
  fullName: z.string().min(3, 'الاسم الكامل مطلوب'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  city: z.string().min(2, 'المدينة مطلوبة'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف'),
    confirmPassword: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export default function StudentSettingsPage() {
  const router = useRouter();
  const { currentStudent, user, updateStudentProfile, logoutUser } =
    useAppStore();
  const { privacy, updatePrivacy, resetChecklist } = useStudentDashboardStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const infoForm = useForm<z.infer<typeof accountInfoSchema>>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      fullName: currentStudent.fullName,
      email: user?.email || 'yazan.nabulsi@ju.edu.jo',
      city: currentStudent.city,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSaveInfo = (values: z.infer<typeof accountInfoSchema>) => {
    updateStudentProfile({
      fullName: values.fullName,
      city: values.city,
    });
    toast.success('تم تحديث البيانات الشخصية بنجاح');
  };

  const handleSavePassword = () => {
    passwordForm.reset();
    toast.success('تم تحديث كلمة المرور بنجاح');
  };

  const handleConfirmDeleteAccount = () => {
    setDeleteModalOpen(false);
    logoutUser();
    toast.info('تم حذف جلسة الحساب والعودة إلى صفحة الدخول');
    router.push('/login');
  };

  return (
    <div>
      <PageHeader
        title="إعدادات الحساب والخصوصية"
        description="إدارة بياناتك الشخصية، كلمة المرور، تفضيلات الإشعارات، ولغة الواجهة."
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              resetChecklist();
              toast.success('تمت إعادة إظهار قائمة الإعداد الأولي في الصفحة الرئيسية');
            }}
          >
            إعادة عرض خطوات الإعداد الأولي
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Right Column: Personal Data + Password */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              البيانات الشخصية الأساسية
            </h2>
            <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
              تُستخدم هذه البيانات في شهادات الإتمام الرسمية الموثقة.
            </p>

            <form
              onSubmit={infoForm.handleSubmit(handleSaveInfo)}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  الاسم الكامل
                </label>
                <Input {...infoForm.register('fullName')} />
                {infoForm.formState.errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">
                    {infoForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    البريد الإلكتروني الجامعي أو الشخصي
                  </label>
                  <Input {...infoForm.register('email')} dir="ltr" />
                  {infoForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {infoForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    المدينة
                  </label>
                  <Input {...infoForm.register('city')} />
                </div>
              </div>

              <Button type="submit" size="sm" className="gap-1.5">
                <Save className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>حفظ البيانات الشخصية</span>
              </Button>
            </form>
          </div>

          <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              تغيير كلمة المرور
            </h2>
            <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
              اختر كلمة مرور قوية لحماية سجل إنجازاتك وشهاداتك.
            </p>

            <form
              onSubmit={passwordForm.handleSubmit(handleSavePassword)}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-medium">
                  كلمة المرور الحالية
                </label>
                <Input
                  type="password"
                  {...passwordForm.register('currentPassword')}
                  dir="ltr"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    كلمة المرور الجديدة
                  </label>
                  <Input
                    type="password"
                    {...passwordForm.register('newPassword')}
                    dir="ltr"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <Input
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    dir="ltr"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" variant="secondary" size="sm" className="gap-1.5">
                <Lock className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>تحديث كلمة المرور</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Left Column: Notifications, Language & Danger Zone */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              تفضيلات الإشعارات واللغة
            </h2>

            <div className="mt-4 space-y-3 text-xs">
              <label className="flex cursor-pointer items-center justify-between rounded-[10px] border border-[#E3E8F0] p-3 dark:border-[#1E325C]">
                <span>تنبيهات فورية عند استلام دعوة مقابلة من شركة</span>
                <input
                  type="checkbox"
                  checked={privacy.companyInviteAlerts}
                  onChange={(e) => {
                    updatePrivacy({ companyInviteAlerts: e.target.checked });
                    toast.success('تم تحديث إعدادات تنبيهات الشركات');
                  }}
                  className="h-4 w-4 accent-[#2F6BFF]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-[10px] border border-[#E3E8F0] p-3 dark:border-[#1E325C]">
                <span>تقرير أسبوعي بتقدم النقاط في المختبرات</span>
                <input
                  type="checkbox"
                  checked={privacy.weeklyProgressDigest}
                  onChange={(e) => {
                    updatePrivacy({ weeklyProgressDigest: e.target.checked });
                    toast.success('تم تحديث إعدادات الملخص الأسبوعي');
                  }}
                  className="h-4 w-4 accent-[#2F6BFF]"
                />
              </label>

              <div className="pt-2">
                <label className="mb-1.5 block font-medium">
                  لغة الواجهة والتقارير
                </label>
                <select
                  value={privacy.preferredLanguage}
                  onChange={(e) => {
                    updatePrivacy({
                      preferredLanguage: e.target.value as 'ar' | 'en',
                    });
                    toast.success('تم حفظ تفضيل اللغة');
                  }}
                  className="h-10 w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-xs dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <option value="ar">العربية (الافتراضية — RTL)</option>
                  <option value="en">English (International)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="rounded-[16px] border border-red-200 bg-white p-6 dark:border-red-900/50 dark:bg-[#0F1E3E]">
            <h2 className="text-base font-semibold text-red-600">
              منطقة الخطر — حذف الحساب
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
              يؤدي حذف الحساب إلى إزالة بروفايلك العام من بوابة الشركات وإلغاء كافة الشهادات الرقمية المرتبطة به.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="mt-4 gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>طلب حذف الحساب نهائياً</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1630]/60 p-4 backdrop-blur-xs"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[20px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-red-50 text-red-600 dark:bg-red-950/50">
              <AlertTriangle className="h-5 w-5 stroke-[1.5]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              تأكيد حذف الحساب النهائي
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
              هل أنت متأكد من رغبتك في حذف حسابك؟ سيتم مسح تقدمك في المختبرات الأربعة وإخفاء ملفك عن الشركات فوراً.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmDeleteAccount}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                نعم، احذف الحساب
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
