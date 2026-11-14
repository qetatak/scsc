'use client';

import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { useAdminStore } from '@/store/use-admin-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminAnnouncementsPage() {
  const { announcements, createAnnouncement } = useTeacherStore();
  const { recordAuditAction } = useAdminStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<string>('all');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error('يرجى إدخال عنوان الإعلان ومحتواه.');
      return;
    }
    createAnnouncement({
      title: title.trim(),
      body: body.trim(),
      targetAudience: audience,
      authorName: 'مدير النظام العام',
      authorRole: 'admin',
    });
    recordAuditAction(
      'تحديث إعدادات',
      `بث إعلان عام للمنصة: ${title.trim()}`
    );
    setTitle('');
    setBody('');
    toast.success('تم بث الإعلان العام وتوثيقه في سجل التدقيق');
  };

  return (
    <div>
      <PageHeader
        title="الإعلانات العامة وبث التنبيهات"
        description="أرسل إعلانات رسمية لجميع مستخدمي المنصة أو لفئة محددة (الطلاب، المعلمين، أو الشركات)."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="بث إعلان جديد"
          subtitle="يظهر الإعلان في شريط الإشعارات العلوي للجمهور المستهدف."
          className="lg:col-span-5"
        >
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <Label>الجمهور المستهدف</Label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              >
                <option value="all">جميع مستخدمي المنصة</option>
                <option value="students">الطلاب فقط</option>
                <option value="teachers">المعلمون فقط</option>
                <option value="companies">الشركات فقط</option>
              </select>
            </div>
            <div>
              <Label>عنوان الإعلان</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تحديث محرك التصحيح التلقائي لمختبر المحاسبة"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>نص الإعلان</Label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="اكتب تفاصيل التحديث أو التنبيه..."
                className="mt-1.5 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              />
            </div>
            <Button type="submit" size="sm" className="w-full gap-1.5">
              <Send className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>بث الإعلان الآن</span>
            </Button>
          </form>
        </ChartCard>

        <ChartCard
          title="سجل الإعلانات العامة المنشورة"
          subtitle="جميع التنبيهات الرسمية الصادرة عن إدارة المنصة"
          className="lg:col-span-7"
        >
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#2F6BFF]">
                    <Bell className="h-3.5 w-3.5 stroke-[1.5]" />
                    الجمهور: {ann.targetAudience === 'all' ? 'الجميع' : ann.targetAudience}
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
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
