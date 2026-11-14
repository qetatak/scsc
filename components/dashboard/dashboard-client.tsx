'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Activity,
  Calendar,
  Award,
  FlaskConical,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  ArrowUpLeft,
  CheckCircle2,
  XCircle,
  Send,
  Settings,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { LABS_METADATA, ACHIEVEMENT_BADGES, UNIVERSITIES, MAJORS } from '@/data/mock-data';
import {
  generateStudentSkillMetrics,
  calculateSkillLevelFromXp,
} from '@/lib/labs/skill-calculator';
import { VirtualCompanyBar } from '@/components/shared/virtual-company-bar';
import { CertificateModal } from '@/components/shared/certificate-modal';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { studentProfileSchema, StudentProfileFormValues } from '@/lib/validations';

export function DashboardClient() {
  const {
    currentStudent,
    companyMessages,
    togglePublicProfile,
    updateStudentProfile,
    replyToCompanyMessage,
    declineCompanyMessage,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'settings'>('overview');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const skillMetrics = generateStudentSkillMetrics(currentStudent.labXp);
  const overallLevel = calculateSkillLevelFromXp(
    Math.round(currentStudent.totalXp / 3.5)
  );
  const myMessages = companyMessages.filter(
    (m) => m.studentUsername === currentStudent.username
  );
  const earnedBadges = ACHIEVEMENT_BADGES.filter((b) =>
    currentStudent.earnedBadges.includes(b.id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    values: {
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

  const onSaveProfile = (values: StudentProfileFormValues) => {
    updateStudentProfile(values);
    toast.success('تم تحديث بيانات بروفايلك المهني بنجاح!');
  };

  const handleReply = (messageId: string) => {
    const text = (replyTexts[messageId] || '').trim();
    if (!text) {
      toast.error('يرجى كتابة نص الرد أولاً');
      return;
    }
    replyToCompanyMessage(messageId, text);
    toast.success('تم إرسال ردك إلى الشركة بنجاح!');
    setReplyTexts((prev) => ({ ...prev, [messageId]: '' }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Profile Banner */}
      <div className="mb-8 flex flex-col justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${currentStudent.gradient} text-xl font-extrabold text-white shadow-md`}
          >
            {currentStudent.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                مرحباً، {currentStudent.fullName}
              </h1>
              <Badge variant="default">المستوى: {overallLevel.level}</Badge>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {currentStudent.major} • {currentStudent.university}
            </p>
          </div>
        </div>

        {/* Public Profile Visibility Toggle + Preview Link */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              togglePublicProfile();
              toast.success(
                currentStudent.isPublicToCompanies
                  ? 'تم إخفاء بروفايلك مؤقتاً عن محرك بحث الشركات'
                  : 'أصبح بروفايلك مرئياً الآن للشركات الباحثة عن مواهب!'
              );
            }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-extrabold transition-all ${
              currentStudent.isPublicToCompanies
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {currentStudent.isPublicToCompanies ? (
              <>
                <Eye className="h-4 w-4 text-emerald-600" />
                إظهار بروفايلي للشركات: مفعّل
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-slate-500" />
                إظهار بروفايلي للشركات: متوقف
              </>
            )}
          </button>

          <Link href={`/students/${currentStudent.username}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              معاينة بروفايلي العام
              <ArrowUpLeft className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/labs">
            <Button size="sm" className="gap-1.5">
              <FlaskConical className="h-4 w-4" />
              متابعة التدريب في المختبرات
            </Button>
          </Link>
        </div>
      </div>

      {/* Virtual Company Live Bar */}
      <div className="mb-8">
        <VirtualCompanyBar />
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي نقاط الخبرة (XP)"
          value={`${currentStudent.totalXp.toLocaleString('en-US')} XP`}
          sublabel="تتحدث تلقائياً من المختبرات"
          icon={Activity}
          tone="blue"
        />
        <StatCard
          label="المستوى المهني العام"
          value={`${overallLevel.level} (${overallLevel.score}%)`}
          sublabel="مبني على 4 مختبرات عملية"
          icon={UserCheck}
          tone="emerald"
        />
        <StatCard
          label="سلسلة الأيام المتتالية"
          value={`${currentStudent.streakDays} يوم`}
          sublabel="استمرارية تدريب يومية"
          icon={Calendar}
          tone="amber"
        />
        <StatCard
          label="رسائل الشركات الواردة"
          value={`${myMessages.length} دعوات`}
          sublabel={`${myMessages.filter((m) => m.status === 'قيد الانتظار').length} دعوة بانتظار ردك`}
          icon={Mail}
          tone="turquoise"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          تقدمي في المختبرات والشهادات
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold transition-all ${
            activeTab === 'inbox'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Mail className="h-4 w-4" />
          رسائل ودعوات الشركات ({myMessages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold transition-all ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Settings className="h-4 w-4" />
          تعديل بيانات البروفايل
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              تفاصيل أدائك في المختبرات الأربعة
            </h2>

            {skillMetrics.map((metric) => {
              const labMeta = LABS_METADATA.find((l) => l.id === metric.labId);
              const labXp = currentStudent.labXp[metric.labId] || 0;
              return (
                <div
                  key={metric.labId}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                          {labMeta?.title || metric.skillName}
                        </h3>
                        <Badge
                          variant={
                            metric.level === 'خبير' || metric.level === 'متقدم'
                              ? 'success'
                              : metric.level === 'متوسط'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {metric.level}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        الرصيد الحالي: {labXp} XP • نسبة الإتقان: {metric.score}%
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <CertificateModal
                        studentName={currentStudent.fullName}
                        labTitle={labMeta?.title || metric.skillName}
                        skillLevel={metric.level}
                        xpEarned={labXp}
                        triggerLabel="إصدار الشهادة"
                      />
                      {labMeta && (
                        <Link href={labMeta.slug}>
                          <Button size="sm" className="gap-1.5">
                            دخول المختبر
                            <ArrowUpLeft className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-blue-600 to-cyan-500 transition-all duration-500"
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 lg:col-span-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              الأوسمة المكتسبة ({earnedBadges.length}/{ACHIEVEMENT_BADGES.length})
            </h2>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-3">
                {ACHIEVEMENT_BADGES.map((badge) => {
                  const unlocked = currentStudent.earnedBadges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`flex items-start gap-3 rounded-2xl border p-3.5 ${
                        unlocked
                          ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20'
                          : 'border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-800/30'
                      }`}
                    >
                      <Award
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          unlocked ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {badge.title}
                          </h4>
                          {unlocked && (
                            <span className="text-[11px] font-bold text-[#2F6BFF]">
                              مكتسب
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Company Messages Inbox */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {myMessages.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Mail className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                لا توجد رسائل واردة بعد
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                تأكد من تفعيل خيار &quot;إظهار بروفايلي للشركات&quot; وواصل رفع نقاطك في المختبرات.
              </p>
            </div>
          ) : (
            myMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {msg.companyName}
                      </h3>
                      <Badge
                        variant={
                          msg.status === 'قيد الانتظار'
                            ? 'warning'
                            : msg.status === 'تم القبول والرد'
                              ? 'success'
                              : 'secondary'
                        }
                      >
                        {msg.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {msg.subject} • {msg.offeredRoleType} ({msg.senderRole})
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {msg.sentAt}
                  </span>
                </div>

                <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                  {msg.message}
                </p>

                {msg.studentReply && (
                  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs font-semibold text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                    <span className="font-extrabold">ردّك المرسل: </span>
                    {msg.studentReply}
                  </div>
                )}

                {msg.status === 'قيد الانتظار' && (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                      value={replyTexts[msg.id] || ''}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({
                          ...prev,
                          [msg.id]: e.target.value,
                        }))
                      }
                      placeholder="اكتب ردك للشركة (مثال: يسعدني تحديد موعد للمقابلة هذا الأسبوع)..."
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReply(msg.id)}
                        className="gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        إرسال الرد
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          declineCompanyMessage(msg.id);
                          toast.info('تم الاعتذار عن الدعوة');
                        }}
                        className="gap-1 text-slate-500 hover:text-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                        اعتذار
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Profile Settings */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="mb-2 text-xl font-extrabold text-slate-900 dark:text-white">
            تحديث بيانات البروفايل المهني والتعليمي
          </h2>
          <p className="mb-6 text-xs text-slate-500">
            ملاحظة: مستويات المهارات ونقاط الخبرة (XP) لا تُعدّل يدوياً، بل تُحسب تلقائياً من نتائجك في المختبرات لضمان المصداقية أمام الشركات.
          </p>

          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الاسم الكامل
                </label>
                <Input {...register('fullName')} />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  المدينة
                </label>
                <Input {...register('city')} />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الجامعة
                </label>
                <select
                  {...register('university')}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  التخصص الجامعي
                </label>
                <select
                  {...register('major')}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {MAJORS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  سنة التخرج المتوقعة
                </label>
                <Input {...register('graduationYear')} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رابط GitHub أو معرض الأعمال
                </label>
                <Input {...register('githubOrPortfolio')} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                النبذة المهنية المختصرة (تظهر للشركات في أعلى البروفايل)
              </label>
              <textarea
                {...register('bio')}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {errors.bio && (
                <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                تفاصيل التعليم والمواد المتقدمة ومشروع التخرج
              </label>
              <textarea
                {...register('educationDetails')}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {errors.educationDetails && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.educationDetails.message}
                </p>
              )}
            </div>

            <Button type="submit" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              حفظ التعديلات في البروفايل العام
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
