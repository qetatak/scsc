'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  ArrowUpLeft,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useStudentDashboardStore } from '@/store/use-student-dashboard-store';
import { RadarChart } from '@/components/shared/radar-chart';
import { generateRadarChartAxes } from '@/lib/labs/skill-calculator';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const studentProfileEditorSchema = z.object({
  fullName: z.string().min(3, 'الاسم الكامل مطلوب (3 أحرف على الأقل)'),
  university: z.string().min(3, 'اسم الجامعة مطلوب'),
  major: z.string().min(3, 'التخصص الجامعي مطلوب'),
  graduationYear: z.string().min(4, 'سنة التخرج مطلوبة'),
  city: z.string().min(2, 'المدينة مطلوبة'),
  bio: z.string().min(20, 'النبذة المهنية يجب أن تكون 20 حرفاً على الأقل'),
  educationDetails: z.string().min(10, 'تفاصيل التعليم مطلوبة'),
  githubOrPortfolio: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

type ProfileEditorValues = z.infer<typeof studentProfileEditorSchema>;

export default function StudentProfileEditorPage() {
  const { currentStudent, updateStudentProfile, togglePublicProfile } =
    useAppStore();
  const {
    projects,
    addProject,
    deleteProject,
    privacy,
    updatePrivacy,
    completeChecklistStep,
  } = useStudentDashboardStore();

  const [activeTab, setActiveTab] = useState<
    'bio' | 'education' | 'skills' | 'projects' | 'links'
  >('bio');

  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjLab, setNewProjLab] = useState('مختبر البرمجة للأعمال (Python)');
  const [newProjSummary, setNewProjSummary] = useState('');
  const [newProjMetrics, setNewProjMetrics] = useState('');
  const [newProjLink, setNewProjLink] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileEditorValues>({
    resolver: zodResolver(studentProfileEditorSchema),
    defaultValues: {
      fullName: currentStudent.fullName,
      university: currentStudent.university,
      major: currentStudent.major,
      graduationYear: currentStudent.graduationYear,
      city: currentStudent.city,
      bio: currentStudent.bio,
      educationDetails: currentStudent.educationDetails,
      githubOrPortfolio: currentStudent.githubOrPortfolio || '',
      linkedinUrl: currentStudent.linkedinUrl || '',
    },
  });

  const watchedValues = watch();

  const onSubmit = (values: ProfileEditorValues) => {
    updateStudentProfile(values);
    completeChecklistStep('step-edu');
    if (values.githubOrPortfolio || values.linkedinUrl) {
      completeChecklistStep('step-links');
    }
    toast.success('تم حفظ تعديلات البروفايل المهني وتحديث المعاينة الحية');
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjSummary.trim()) {
      toast.error('يرجى إدخال عنوان المشروع وملخصه التطبيقي');
      return;
    }
    addProject({
      title: newProjTitle.trim(),
      labName: newProjLab,
      summary: newProjSummary.trim(),
      metricsText: newProjMetrics.trim() || 'مشروع تطبيقي موثق',
      date: 'نوفمبر 2026',
      link: newProjLink.trim() || 'https://github.com/yazan-nabulsi',
    });
    completeChecklistStep('step-links');
    setNewProjTitle('');
    setNewProjSummary('');
    setNewProjMetrics('');
    setNewProjLink('');
    toast.success('تمت إضافة المشروع التطبيقي إلى بروفايلك العام');
  };

  const radarAxes = generateRadarChartAxes(currentStudent.labXp);

  return (
    <div>
      <PageHeader
        title="محرر البروفايل المهني وإعدادات الخصوصية"
        description="تحكم في كافة أقسام صفحتك المهنية العامة وشاهد كيف يبدو ملفك أمام مسؤولي التوظيف في الوقت الفعلي."
        actions={
          <Link href={`/students/${currentStudent.username}`}>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <span>فتح الصفحة العامة</span>
              <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
            </Button>
          </Link>
        }
      />

      {/* Visibility & Privacy Bar */}
      <div className="mb-6 rounded-[16px] border border-[#E3E8F0] bg-white p-5 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E3E8F0] pb-4 sm:flex-row sm:items-center dark:border-[#1E325C]">
          <div>
            <h2 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              إظهار البروفايل في بوابة الشركات
            </h2>
            <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
              عند تفعيل هذا الخيار يظهر بروفايلك في جدول فرز المواهب للشركات المسجلة.
            </p>
          </div>
          <Button
            type="button"
            variant={currentStudent.isPublicToCompanies ? 'default' : 'secondary'}
            size="sm"
            onClick={() => {
              togglePublicProfile();
              completeChecklistStep('step-public');
              toast.success(
                !currentStudent.isPublicToCompanies
                  ? 'تم فتح البروفايل المهني للشركات'
                  : 'تم إخفاء البروفايل عن بوابة الشركات مؤقتاً'
              );
            }}
            className="gap-2 text-xs"
          >
            {currentStudent.isPublicToCompanies ? (
              <>
                <Eye className="h-4 w-4 stroke-[1.5]" />
                <span>البروفايل متاح للشركات (مفعّل)</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 stroke-[1.5]" />
                <span>البروفايل مخفي حالياً</span>
              </>
            )}
          </Button>
        </div>

        {/* Privacy Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-6 text-xs">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={privacy.hideUniversity}
              onChange={(e) =>
                updatePrivacy({ hideUniversity: e.target.checked })
              }
              className="h-4 w-4 rounded border-[#E3E8F0] accent-[#2F6BFF]"
            />
            <span>إخفاء اسم الجامعة في العرض العام</span>
          </label>

          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={privacy.hideCity}
              onChange={(e) => updatePrivacy({ hideCity: e.target.checked })}
              className="h-4 w-4 rounded border-[#E3E8F0] accent-[#2F6BFF]"
            />
            <span>إخفاء المدينة عن الزوار</span>
          </label>

          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={privacy.hideEmail}
              onChange={(e) => updatePrivacy({ hideEmail: e.target.checked })}
              className="h-4 w-4 rounded border-[#E3E8F0] accent-[#2F6BFF]"
            />
            <span>قصر التواصل عبر صندوق رسائل المنصة فقط</span>
          </label>
        </div>
      </div>

      {/* Split Layout: Multi-Section Editor (Right) + Live Preview (Left) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Editor Column */}
        <div className="lg:col-span-7">
          <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            {/* Section Tabs */}
            <div className="mb-6 flex flex-wrap gap-1.5 rounded-[12px] bg-[#F5F6F8] p-1.5 dark:bg-[#0A1630]">
              {[
                { key: 'bio', label: 'النبذة والبيانات' },
                { key: 'education', label: 'التعليم الجامعي' },
                { key: 'skills', label: 'المهارات الموثقة' },
                { key: 'projects', label: 'المشاريع التطبيقية' },
                { key: 'links', label: 'الروابط المهنية' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      t.key as
                        | 'bio'
                        | 'education'
                        | 'skills'
                        | 'projects'
                        | 'links'
                    )
                  }
                  className={`rounded-[8px] px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === t.key
                      ? 'bg-white text-[#2F6BFF] dark:bg-[#0F1E3E]'
                      : 'text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab !== 'projects' && activeTab !== 'skills' ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {activeTab === 'bio' && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium">
                          الاسم الكامل
                        </label>
                        <Input {...register('fullName')} />
                        {errors.fullName && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium">
                          المدينة
                        </label>
                        <Input {...register('city')} />
                        {errors.city && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium">
                        النبذة المهنية المختصرة
                      </label>
                      <textarea
                        {...register('bio')}
                        rows={4}
                        className="w-full rounded-[12px] border border-[#E3E8F0] bg-white p-3 text-sm outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
                      />
                      {errors.bio && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.bio.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'education' && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium">
                          الجامعة
                        </label>
                        <Input {...register('university')} />
                        {errors.university && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.university.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium">
                          التخصص الأكاديمي
                        </label>
                        <Input {...register('major')} />
                        {errors.major && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.major.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium">
                        سنة التخرج
                      </label>
                      <Input {...register('graduationYear')} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium">
                        تفاصيل المساقات والمشاريع الأكاديمية
                      </label>
                      <textarea
                        {...register('educationDetails')}
                        rows={4}
                        className="w-full rounded-[12px] border border-[#E3E8F0] bg-white p-3 text-sm outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
                      />
                      {errors.educationDetails && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.educationDetails.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {activeTab === 'links' && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium">
                        رابط GitHub أو معرض الأعمال (Portfolio)
                      </label>
                      <Input
                        {...register('githubOrPortfolio')}
                        dir="ltr"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium">
                        رابط حساب LinkedIn المهني
                      </label>
                      <Input
                        {...register('linkedinUrl')}
                        dir="ltr"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4 stroke-[1.5]" />
                    <span>حفظ التعديلات</span>
                  </Button>
                </div>
              </form>
            ) : activeTab === 'skills' ? (
              <div className="space-y-4">
                <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                  تُحتسب نسب المهارات تلقائياً من نقاط الخبرة الفعلية التي تحققها داخل المختبرات الأربعة لضمان مصداقية البروفايل أمام الشركات.
                </p>
                {[
                  { label: 'برمجة Python وتحليل البيانات', xp: currentStudent.labXp.python },
                  { label: 'المحاسبة المالية والدورة المحاسبية', xp: currentStudent.labXp.accounting },
                  { label: 'إدارة الأعمال وتحليل نقطة التعادل', xp: currentStudent.labXp.management },
                  { label: 'التسويق الرقمي وتكلفة الاستحواذ', xp: currentStudent.labXp.marketing },
                ].map((s) => {
                  const pct = Math.min(100, Math.round((s.xp / 500) * 100));
                  return (
                    <div
                      key={s.label}
                      className="rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]"
                    >
                      <div className="flex justify-between text-xs font-medium">
                        <span>{s.label}</span>
                        <span className="font-tabular text-[#2F6BFF]">
                          {s.xp} XP ({pct}%)
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-[#F1F4F9] dark:bg-[#0A1630]">
                        <div
                          className="h-1.5 rounded-full bg-[#2F6BFF]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-5">
                <form
                  onSubmit={handleAddProject}
                  className="space-y-3 rounded-[12px] border border-[#E3E8F0] bg-[#F5F6F8] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <h3 className="text-xs font-semibold">
                    إضافة مشروع تطبيقي جديد للبروفايل
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="عنوان المشروع..."
                      className="bg-white text-xs"
                    />
                    <Input
                      value={newProjLab}
                      onChange={(e) => setNewProjLab(e.target.value)}
                      placeholder="المختبر المرتبط..."
                      className="bg-white text-xs"
                    />
                  </div>
                  <Input
                    value={newProjSummary}
                    onChange={(e) => setNewProjSummary(e.target.value)}
                    placeholder="وصف مختصر للمشكلة والنتيجة..."
                    className="bg-white text-xs"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      value={newProjMetrics}
                      onChange={(e) => setNewProjMetrics(e.target.value)}
                      placeholder="الأثر الرقمي (مثال: دقة 98%)..."
                      className="bg-white text-xs"
                    />
                    <Input
                      value={newProjLink}
                      onChange={(e) => setNewProjLink(e.target.value)}
                      placeholder="رابط المشروع على GitHub..."
                      dir="ltr"
                      className="bg-white text-xs"
                    />
                  </div>
                  <Button type="submit" size="sm" className="gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
                    <span>إضافة المشروع</span>
                  </Button>
                </form>

                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start justify-between gap-3 rounded-[12px] border border-[#E3E8F0] p-4 dark:border-[#1E325C]"
                    >
                      <div>
                        <span className="text-[11px] text-[#2F6BFF]">
                          {p.labName} · {p.date}
                        </span>
                        <h4 className="mt-0.5 text-sm font-semibold">
                          {p.title}
                        </h4>
                        <p className="mt-1 text-xs text-[#526077] dark:text-[#94A3B8]">
                          {p.summary}
                        </p>
                        <p className="mt-1.5 font-tabular text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                          {p.metricsText}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteProject(p.id);
                          toast.success('تم حذف المشروع من البروفايل');
                        }}
                        aria-label={`حذف مشروع ${p.title}`}
                        className="rounded-[8px] p-1.5 text-[#526077] hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Public Profile Preview Column */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <div className="mb-4 flex items-center justify-between border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
              <span className="text-xs font-semibold text-[#2F6BFF]">
                معاينة حية لملفك العام
              </span>
              <span className="font-tabular text-[11px] text-[#526077]">
                /students/{currentStudent.username}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0A1630] text-sm font-semibold text-white dark:bg-[#2F6BFF]">
                {currentStudent.initials}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {watchedValues.fullName || currentStudent.fullName}
                </h3>
                <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                  {watchedValues.major || currentStudent.major}
                  {!privacy.hideUniversity &&
                    ` · ${watchedValues.university || currentStudent.university}`}
                  {!privacy.hideCity &&
                    ` · ${watchedValues.city || currentStudent.city}`}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
              {watchedValues.bio || currentStudent.bio}
            </p>

            <div className="my-5 flex justify-center rounded-[12px] border border-[#E3E8F0] bg-[#F5F6F8] py-4 dark:border-[#1E325C] dark:bg-[#0A1630]">
              <RadarChart axes={radarAxes} size={210} />
            </div>

            <div className="space-y-2 border-t border-[#E3E8F0] pt-4 text-xs dark:border-[#1E325C]">
              <div className="flex justify-between">
                <span className="text-[#526077]">إجمالي الخبرة الموثقة</span>
                <span className="font-tabular font-semibold text-[#2F6BFF]">
                  {currentStudent.totalXp.toLocaleString('en-US')} XP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526077]">المشاريع المعروضة</span>
                <span className="font-tabular font-semibold">
                  {projects.length} مشاريع
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
