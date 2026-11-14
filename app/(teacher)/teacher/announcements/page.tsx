'use client';

import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TeacherAnnouncementsPage() {
  const { classes, announcements, createAnnouncement } = useTeacherStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error('يرجى إدخال عنوان الإعلان ومحتواه.');
      return;
    }
    createAnnouncement({
      title: title.trim(),
      body: body.trim(),
      targetAudience: classId,
      authorName: 'د. أحمد خليل العساف',
      authorRole: 'teacher',
    });
    setTitle('');
    setBody('');
    toast.success('تم نشر الإعلان لطلاب الشعبة الدراسية');
  };

  return (
    <div>
      <PageHeader
        title="إعلانات الشُعب الدراسية"
        description="انشر تنبيهات أكاديمية ومواعيد تسليم الواجبات العملية لطلاب مساقاتك."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="نشر إعلان جديد للشعبة"
          subtitle="يظهر الإعلان فوراً في لوحة تحكم جميع الطلاب المسجلين في الشعبة."
          className="lg:col-span-5"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>الشعبة المستهدفة</Label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>عنوان الإعلان</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تذكير بموعد تسليم واجب قيود التسوية"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>نص الإعلان</Label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="اكتب التفاصيل والتوجيهات الأكاديمية للطلاب..."
                className="mt-1.5 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              />
            </div>
            <Button type="submit" size="sm" className="w-full gap-1.5">
              <Send className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>إرسال الإعلان للطلاب</span>
            </Button>
          </form>
        </ChartCard>

        <ChartCard
          title="سجل الإعلانات المنشورة"
          subtitle="جميع التنبيهات المرسلة للشُعب الدراسية"
          className="lg:col-span-7"
        >
          <div className="space-y-3">
            {announcements.map((ann) => {
              const cls = classes.find((c) => c.id === ann.targetAudience);
              return (
                <div
                  key={ann.id}
                  className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#2F6BFF]">
                      <Bell className="h-3.5 w-3.5 stroke-[1.5]" />
                      {cls ? cls.courseName : 'إعلان عام للمساقات'}
                    </span>
                    <span className="font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
                      {ann.scheduledAt}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    {ann.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                    {ann.body}
                  </p>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
