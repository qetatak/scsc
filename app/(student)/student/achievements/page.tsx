'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Award,
  Check,
  Copy,
  Download,
  Eye,
  FileCheck2,
  Lock,
  Share2,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useStudentDashboardStore } from '@/store/use-student-dashboard-store';
import { ACHIEVEMENT_BADGES } from '@/data/mock-data';
import { StudentCertificateItem } from '@/data/dashboard-mock-data';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

export default function StudentAchievementsPage() {
  const { currentStudent } = useAppStore();
  const { certificates } = useStudentDashboardStore();
  const [previewCert, setPreviewCert] =
    useState<StudentCertificateItem | null>(null);

  const handleDownloadCertificate = (cert: StudentCertificateItem) => {
    const content = [
      'TADREEBAK VERIFIED COMPLETION CERTIFICATE',
      '=========================================',
      `الاسم: ${currentStudent.fullName}`,
      `الجامعة: ${currentStudent.university}`,
      `الشهادة: ${cert.title}`,
      `رمز التحقق الرسمي: ${cert.verificationCode}`,
      `تاريخ الإصدار: ${cert.issueDate}`,
      `درجة الإتقان العملي: ${cert.gradePct}%`,
      `المهارات الموثقة: ${cert.skillsCovered.join(' ، ')}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.verificationCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`تم تنزيل وثيقة الشهادة (${cert.verificationCode}) بنجاح`);
  };

  const handleShareCertificate = (cert: StudentCertificateItem) => {
    const shareUrl = `${window.location.origin}/students/${currentStudent.username}?cert=${cert.verificationCode}`;
    navigator.clipboard?.writeText(shareUrl);
    toast.success('تم نسخ رابط التحقق من الشهادة إلى الحافظة');
  };

  return (
    <div>
      <PageHeader
        title="الإنجازات والشهادات الموثقة"
        description="شارات الإتقان المكتسبة من المختبرات التفاعلية وشهادات الإتمام الرسمية القابلة للتحقق من الشركات."
      />

      {/* 1. Completion Certificates */}
      <section aria-label="شهادات الإتمام" className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              شهادات الإتمام الرقمية ({certificates.length})
            </h2>
            <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
              تصدر الشهادة تلقائياً عند تجاوز 400 نقطة خبرة في المختبر.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#2F6BFF]">
                    <FileCheck2 className="h-4 w-4 stroke-[1.5]" />
                    <span className="font-tabular">{cert.verificationCode}</span>
                  </span>
                  <span className="font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
                    صدرت في {cert.issueDate}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {cert.title}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#526077] dark:text-[#94A3B8]">
                  <span>درجة الإتقان:</span>
                  <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {cert.gradePct}%
                  </span>
                  <span>·</span>
                  <span>{cert.skillsCovered.join(' · ')}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[#E3E8F0] pt-4 dark:border-[#1E325C]">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPreviewCert(cert)}
                  className="gap-1.5 text-xs"
                >
                  <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>معاينة الشهادة</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownloadCertificate(cert)}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>تنزيل PDF / وثيقة</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareCertificate(cert)}
                  className="gap-1.5 text-xs"
                >
                  <Share2 className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>مشاركة الرابط</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Clean Achievement Badges */}
      <section aria-label="شارات الإنجاز">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            شارات الإنجاز التخصصية
          </h2>
          <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
            تُمنح الشارات بناءً على نقاط الخبرة الفعلية المسجلة في المختبرات.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENT_BADGES.map((badge, idx) => {
            const unlocked =
              currentStudent.earnedBadges.includes(badge.id) ||
              (badge.labId !== 'general' &&
                (currentStudent.labXp[badge.labId] || 0) >= badge.requiredXp);

            return (
              <div
                key={badge.id}
                className={`rounded-[16px] border p-5 transition-colors ${
                  unlocked
                    ? 'border-[#E3E8F0] bg-white dark:border-[#1E325C] dark:bg-[#0F1E3E]'
                    : 'border-[#E3E8F0] bg-[#F5F6F8]/60 opacity-65 dark:border-[#1E325C] dark:bg-[#0A1630]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E3E8F0] bg-[#F5F6F8] text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]">
                    {unlocked ? (
                      <Award className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
                    ) : (
                      <Lock className="h-4 w-4 stroke-[1.5] text-[#526077]" />
                    )}
                  </div>
                  <span className="font-tabular text-xs font-semibold text-[#526077] dark:text-[#94A3B8]">
                    0{idx + 1} · {badge.requiredXp} XP
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {badge.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                  {badge.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-[#E3E8F0] pt-3 text-xs dark:border-[#1E325C]">
                  <span className="text-[#526077] dark:text-[#94A3B8]">
                    الحالة
                  </span>
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 font-medium text-[#2F6BFF]">
                      <Check className="h-3.5 w-3.5 stroke-[2]" />
                      <span>مكتسبة وموثقة</span>
                    </span>
                  ) : (
                    <span className="text-[#526077]">غير مكتملة بعد</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1630]/70 p-4 backdrop-blur-xs"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="w-full max-w-2xl rounded-[20px] border border-[#E3E8F0] bg-white p-6 sm:p-8 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
              <span className="font-tabular text-xs font-semibold tracking-wider text-[#2F6BFF] uppercase">
                VERIFIED CREDENTIAL · {previewCert.verificationCode}
              </span>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                aria-label="إغلاق المعاينة"
                className="rounded-[8px] p-1 text-[#526077] hover:bg-[#F5F6F8] dark:hover:bg-[#0A1630]"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="my-6 rounded-[16px] border border-[#1E325C] bg-[#0A1630] p-6 sm:p-8 text-[#FAFBFC]">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>TADREEBAK SIMULATION LABS</span>
                <span className="font-tabular">{previewCert.issueDate}</span>
              </div>
              <p className="mt-6 text-xs text-[#94A3B8]">
                تشهد منصة تدريبك بأن الطالب / الخريج:
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-white">
                {currentStudent.fullName}
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8]">
                {currentStudent.major} — {currentStudent.university}
              </p>

              <p className="mt-5 text-sm text-[#FAFBFC]/90">
                قد أتم بنجاح متطلبات المحاكاة العملية لـ:
              </p>
              <p className="mt-1 text-base font-semibold text-[#2F6BFF]">
                {previewCert.title}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#1E325C] pt-4 text-xs">
                <div>
                  <span className="text-[#94A3B8]">درجة الإتقان: </span>
                  <span className="font-tabular font-semibold text-white">
                    {previewCert.gradePct}%
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">رمز التحقق: </span>
                  <span className="font-tabular font-semibold text-white">
                    {previewCert.verificationCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleShareCertificate(previewCert)}
                className="gap-1.5"
              >
                <Copy className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>نسخ رابط التحقق</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleDownloadCertificate(previewCert)}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>تنزيل الشهادة</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
