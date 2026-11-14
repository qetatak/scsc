'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Share2,
  Send,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { ACHIEVEMENT_BADGES, LABS_METADATA } from '@/data/mock-data';
import {
  generateStudentSkillMetrics,
  generateRadarChartAxes,
  calculateSkillLevelFromXp,
} from '@/lib/labs/skill-calculator';
import { RadarChart } from '@/components/shared/radar-chart';
import { CertificateModal } from '@/components/shared/certificate-modal';
import { triggerHaptic } from '@/lib/haptics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { contactStudentSchema, ContactStudentFormValues } from '@/lib/validations';
import { StudentTalent } from '@/types';

interface StudentProfileClientProps {
  initialUsername: string;
  fallbackStudent?: StudentTalent;
}

export function StudentProfileClient({
  initialUsername,
  fallbackStudent,
}: StudentProfileClientProps) {
  const {
    allStudents,
    shortlistedUsernames,
    toggleShortlistStudent,
    sendCompanyMessage,
  } = useAppStore();

  const student =
    allStudents.find((s) => s.username === initialUsername) ||
    fallbackStudent ||
    allStudents[0];

  const [contactOpen, setContactOpen] = useState(false);

  const isShortlisted = shortlistedUsernames.includes(student.username);
  const skillMetrics = generateStudentSkillMetrics(student.labXp);
  const radarAxes = generateRadarChartAxes(student.labXp);
  const overallLevel = calculateSkillLevelFromXp(Math.round(student.totalXp / 3.5));

  const earnedBadges = ACHIEVEMENT_BADGES.filter((b) =>
    student.earnedBadges.includes(b.id)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactStudentFormValues>({
    resolver: zodResolver(contactStudentSchema),
    defaultValues: {
      companyName: 'شركة تقنية المستقبل',
      senderRole: 'سارة الخطيب - مسؤولة استقطاب المواهب',
      offeredRoleType: 'مرشح لوظيفة / تدريب عملي مدفوع',
      subject: `دعوة لمقابلة عمل — ${student.fullName}`,
      message: `مرحباً ${student.fullName}، اطلعنا على نتائجك الموثقة في مختبرات تدريبك ونود دعوتك لمقابلة تعارف قصيرة.`,
    },
  });

  const handleShareProfile = () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/students/${student.username}`
        : `https://tadreebak.com/students/${student.username}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    toast.success('تم نسخ رابط البروفايل المهني إلى الحافظة');
  };

  const onSubmitContact = (values: ContactStudentFormValues) => {
    sendCompanyMessage({
      studentUsername: student.username,
      studentName: student.fullName,
      companyName: values.companyName,
      companyInitials: values.companyName.slice(0, 2),
      companyGradient: 'from-blue-600 to-cyan-500',
      senderRole: values.senderRole,
      offeredRoleType: values.offeredRoleType,
      subject: values.subject,
      message: values.message,
    });
    toast.success(`تم إرسال الدعوة مباشرة إلى ${student.fullName}`);
    setContactOpen(false);
    reset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-14 lg:px-8">
      {/* Breadcrumb Bar */}
      <div className="mb-6 md:mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#0A1630]/70 hover:text-[#2F6BFF] dark:text-[#94A3B8]"
        >
          <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>العودة إلى جدول المتصدرين</span>
        </Link>
        <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
          VERIFIED TALENT DOSSIER · #{student.username.toUpperCase()}
        </span>
      </div>

      {/* Professional Profile Card */}
      <section aria-label="ملف الطالب التعريفي" className="mb-6 md:mb-10 rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-9 dark:border-[#1E325C] dark:bg-[#0A1630]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-[14px] bg-[#0A1630] text-xl sm:text-2xl font-semibold text-[#FAFBFC] dark:bg-[#2F6BFF]">
              {student.initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-[#0A1630] sm:text-4xl dark:text-[#FAFBFC]">
                  {student.fullName}
                </h1>
                <Badge variant="default">المستوى: {overallLevel.level}</Badge>
              </div>

              <p className="mt-1.5 text-sm sm:text-base font-medium text-[#2F6BFF]">
                {student.major} — {student.university}
              </p>

              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                {student.bio}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E3E8F0] pt-4 font-tabular text-xs text-[#526077] dark:border-[#1E325C] dark:text-[#94A3B8]">
                <span>المدينة: {student.city}</span>
                <span>التخرج: {student.graduationYear}</span>
                <span>الاستمرارية: {student.streakDays} يوم</span>
                <span className="font-semibold text-[#2F6BFF]">
                  الخبرة الموثقة: {student.totalXp.toLocaleString('en-US')} XP
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                triggerHaptic('tap');
                handleShareProfile();
              }}
            >
              <Share2 className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>نسخ الرابط</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                triggerHaptic('success');
                toggleShortlistStudent(student.username);
                toast.success(
                  isShortlisted
                    ? 'تمت إزالة المرشح من القائمة المختصرة'
                    : 'تم حفظ المرشح في القائمة المختصرة'
                );
              }}
            >
              <Bookmark
                className={`h-3.5 w-3.5 stroke-[1.5] ${
                  isShortlisted ? 'fill-current text-[#2F6BFF]' : ''
                }`}
              />
              <span>{isShortlisted ? 'بالقائمة المختصرة' : 'حفظ بالقائمة'}</span>
            </Button>

            <Button
              size="sm"
              className="col-span-2 sm:col-span-1"
              onClick={() => {
                triggerHaptic('tap');
                setContactOpen(true);
              }}
            >
              <Send className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>تواصل مع المرشح</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Right Column (7 cols): Thin Skill Meters & Timeline of Achievements */}
        <div className="space-y-8 lg:col-span-7">
          {/* Skill Cards with Thin Meters */}
          <section className="rounded-[20px] border border-[#E3E8F0] bg-white p-4 sm:p-7 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <div className="mb-5 sm:mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
              <div>
                <h2 className="text-xl font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  مقاييس الأداء العملي المحسوبة من المختبرات
                </h2>
                <p className="mt-1 text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
                  تُشتق النسب المئوية مباشرة من التجارب العملية التي أتمّها الطالب داخل المنصة.
                </p>
              </div>
              <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
                AUTO-VERIFIED
              </span>
            </div>

            <div className="space-y-5">
              {skillMetrics.map((metric) => {
                const labMeta = LABS_METADATA.find((l) => l.id === metric.labId);
                const labXp = student.labXp[metric.labId] || 0;
                return (
                  <div
                    key={metric.labId}
                    className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                          {metric.skillName}
                        </span>
                        <Badge variant="default">{metric.level}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-tabular text-xs font-semibold text-[#2F6BFF]">
                          {labXp} XP · {metric.score}%
                        </span>
                        <CertificateModal
                          studentName={student.fullName}
                          labTitle={labMeta?.title || metric.skillName}
                          skillLevel={metric.level}
                          xpEarned={labXp}
                          triggerLabel="الشهادة"
                        />
                      </div>
                    </div>

                    {/* Thin 4px Architectural Progress Meter */}
                    <div className="my-3 h-1 w-full overflow-hidden rounded-full bg-[#E3E8F0] dark:bg-[#1E325C]">
                      <div
                        className="h-full bg-[#2F6BFF] transition-all duration-500"
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>

                    {labMeta && (
                      <div className="flex flex-wrap gap-1.5">
                        {labMeta.skillsLearned.map((sub) => (
                          <span
                            key={sub}
                            className="rounded-[6px] border border-[#E3E8F0] bg-white px-2 py-0.5 text-[11px] text-[#0A1630]/75 dark:border-[#1E325C] dark:bg-[#0F1E3E] dark:text-[#94A3B8]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Timeline of Practical Achievements & Education */}
          <section className="rounded-[20px] border border-[#E3E8F0] bg-white p-4 sm:p-7 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <h2 className="mb-5 sm:mb-6 border-b border-[#E3E8F0] pb-4 text-lg sm:text-xl font-medium text-[#0A1630] dark:border-[#1E325C] dark:text-[#FAFBFC]">
              السجل الزمني للإنجازات العملية والتعليم
            </h2>

            <div className="relative mr-3 border-r border-[#E3E8F0] pr-6 space-y-6 dark:border-[#1E325C]">
              {/* Education node */}
              <div className="relative">
                <span className="absolute -right-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#2F6BFF] bg-white dark:bg-[#0A1630]" />
                <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
                  ACADEMIC RECORD · {student.graduationYear}
                </span>
                <h3 className="mt-1 text-base font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  {student.university} — {student.major}
                </h3>
                <p className="mt-1 text-xs text-[#0A1630]/70 dark:text-[#94A3B8]">
                  {student.educationDetails}
                </p>
              </div>

              {/* Practical Achievement nodes */}
              {student.topAchievements.map((ach, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -right-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#2F6BFF]" />
                  <span className="font-tabular text-xs text-[#0A1630]/55 dark:text-[#94A3B8]">
                    VERIFIED LAB MILESTONE 0{idx + 1}
                  </span>
                  <p className="mt-1 text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    {ach}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Left Column (5 cols): Radar Chart & Verified Credentials */}
        <div className="space-y-6 sm:space-y-8 lg:col-span-5">
          <section className="rounded-[20px] border border-[#E3E8F0] bg-white p-4 sm:p-7 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <h2 className="text-lg font-medium text-[#0A1630] dark:text-[#FAFBFC]">
              مخطط التوازن المهني (Radar Chart)
            </h2>
            <p className="mt-1 text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
              توزيع الكفاءة عبر المحاور الستة المحسوبة من أداء المختبرات.
            </p>
            <div className="mt-5 flex justify-center">
              <RadarChart data={radarAxes} size={270} />
            </div>
          </section>

          <section className="rounded-[20px] border border-[#E3E8F0] bg-white p-4 sm:p-7 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <div className="mb-4 flex items-center justify-between border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
              <h2 className="text-lg font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                الأوسمة الموثقة
              </h2>
              <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
                {earnedBadges.length} / {ACHIEVEMENT_BADGES.length}
              </span>
            </div>

            <div className="space-y-3">
              {earnedBadges.map((badge, idx) => (
                <div
                  key={badge.id}
                  className="flex items-start justify-between gap-3 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3.5 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <div>
                    <h3 className="text-sm font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                      {badge.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#0A1630]/65 dark:text-[#94A3B8]">
                      {badge.description}
                    </p>
                  </div>
                  <span className="font-tabular text-xs font-medium text-[#2F6BFF]">
                    0{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>مراسلة {student.fullName}</DialogTitle>
            <DialogDescription>
              أرسل دعوة رسمية لإجراء مقابلة عمل أو تدريب بناءً على السجل العملي للطالب.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitContact)} className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                اسم الشركة
              </label>
              <Input {...register('companyName')} />
              {errors.companyName && (
                <p className="mt-1 text-xs text-[#2F6BFF]">{errors.companyName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  اسم المسؤول والمسمى
                </label>
                <Input {...register('senderRole')} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  نوع العرض
                </label>
                <Input {...register('offeredRoleType')} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                عنوان الرسالة
              </label>
              <Input {...register('subject')} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                تفاصيل الدعوة
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full rounded-[10px] border border-[#E3E8F0] bg-white p-3.5 text-base sm:text-sm text-[#0A1630] focus:border-[#2F6BFF] focus:outline-none dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setContactOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                <Send className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>إرسال الدعوة</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
