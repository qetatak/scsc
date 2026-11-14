'use client';

import { useState } from 'react';
import { Download, Printer, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CertificateModalProps {
  studentName: string;
  labTitle: string;
  skillLevel: string;
  xpEarned: number;
  triggerLabel?: string;
}

export function CertificateModal({
  studentName,
  labTitle,
  skillLevel,
  xpEarned,
  triggerLabel = 'عرض الشهادة',
}: CertificateModalProps) {
  const [open, setOpen] = useState(false);

  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FAFBFC';
    ctx.fillRect(0, 0, 1200, 800);

    ctx.strokeStyle = '#0A1630';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 1104, 704);

    ctx.strokeStyle = '#2F6BFF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(64, 64, 1072, 672);

    ctx.fillStyle = '#2F6BFF';
    ctx.textAlign = 'center';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('TADREEBAK PRACTICAL SIMULATION CERTIFICATE', 600, 150);

    ctx.fillStyle = '#0A1630';
    ctx.font = '600 46px sans-serif';
    ctx.fillText('شهادة إتمام تدريب عملي موثق', 600, 235);

    ctx.fillStyle = '#4A5568';
    ctx.font = '400 26px sans-serif';
    ctx.fillText('توثق منصة تدريبك إتمام الطالب / الخريج:', 600, 325);

    ctx.fillStyle = '#0A1630';
    ctx.font = '600 44px sans-serif';
    ctx.fillText(studentName, 600, 400);

    ctx.fillStyle = '#2F6BFF';
    ctx.font = '600 32px sans-serif';
    ctx.fillText(`المختبر: ${labTitle}`, 600, 485);

    ctx.fillStyle = '#0A1630';
    ctx.font = '500 26px sans-serif';
    ctx.fillText(
      `المستوى العملي: ${skillLevel}  |  الخبرة الموثقة: ${xpEarned} XP`,
      600,
      555
    );

    ctx.fillStyle = '#4A5568';
    ctx.font = '400 20px sans-serif';
    ctx.fillText(
      `تاريخ الإصدار: ${new Date().toISOString().split('T')[0]} — tadreebak.com`,
      600,
      655
    );

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Tadreebak_Certificate_${labTitle.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();

    toast.success('تم تنزيل الشهادة بصيغة PNG');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <FileCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
          <span>{triggerLabel}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>شهادة إتمام مختبر تفاعلي — تدريبك</DialogTitle>
          <DialogDescription>
            شهادة موثقة تعكس الأداء العملي الفعلي داخل المختبر الافتراضي، قابلة للتنزيل أو الطباعة.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-[16px] border border-[#0A1630] bg-[#FAFBFC] p-5 text-center md:p-10 dark:border-[#1E325C] dark:bg-[#0A1630]">
          <p className="font-tabular text-xs font-medium tracking-widest text-[#2F6BFF] uppercase">
            TADREEBAK VERIFIED LAB CREDENTIAL
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            شهادة إتمام تدريب عملي
          </h3>

          <p className="mt-4 text-xs text-[#0A1630]/60 dark:text-[#94A3B8]">
            تُمنح هذه الشهادة إلى
          </p>

          <p className="mt-1 text-2xl font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            {studentName}
          </p>

          <p className="mt-4 text-sm text-[#0A1630]/80 dark:text-[#94A3B8]">
            لاجتيازه المهام العملية في{' '}
            <strong className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
              {labTitle}
            </strong>
          </p>

          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-4 rounded-[12px] border border-[#E3E8F0] bg-[#F1F4F9] px-5 py-2.5 text-xs font-medium text-[#0A1630] dark:border-[#1E325C] dark:bg-[#070D1F] dark:text-[#FAFBFC]">
            <span>المستوى المحقق: {skillLevel}</span>
            <span>·</span>
            <span className="font-tabular text-[#2F6BFF]">
              الرصيد: {xpEarned} XP
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#E3E8F0] pt-4 text-[11px] text-[#0A1630]/60 dark:border-[#1E325C] dark:text-[#94A3B8]">
            <span>منصة تدريبك — Tadreebak</span>
            <span className="font-tabular">
              {new Date().toISOString().split('T')[0]}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 stroke-[1.5]" />
            <span>طباعة / PDF</span>
          </Button>
          <Button type="button" onClick={handleDownloadImage}>
            <Download className="h-4 w-4 stroke-[1.5]" />
            <span>تنزيل كصورة PNG</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
