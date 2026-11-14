'use client';

import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { ChartCard, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function TeacherMessagesPage() {
  const { academicMessages, sendAcademicMessage } = useTeacherStore();
  const [selectedUsername, setSelectedUsername] = useState('yazan-nabulsi');
  const [studentName, setStudentName] = useState('يزن النابلسي');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    sendAcademicMessage({
      recipientUsername: selectedUsername,
      recipientName: studentName,
      subject: subject.trim() || 'توجيه أكاديمي حول الواجب العملي',
      body: body.trim(),
    });
    setSubject('');
    setBody('');
    toast.success(`تم إرسال التوجيه الأكاديمي إلى ${studentName}`);
  };

  return (
    <div>
      <PageHeader
        title="رسائل الطلاب والاستفسارات الأكاديمية"
        description="تواصل مباشرة مع طلاب شُعبك للإجابة عن استفساراتهم حول الواجبات العملية والمختبرات."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard
          title="صندوق المحادثات الأكاديمية"
          subtitle="الرسائل المتبادلة مع طلاب الشُعب"
          className="lg:col-span-7"
        >
          <div className="space-y-3">
            {academicMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                    <MessageSquare className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                    {msg.recipientName} (@{msg.recipientUsername})
                  </span>
                  <span className="font-tabular text-[11px] text-[#526077] dark:text-[#94A3B8]">
                    {msg.sentAt}
                  </span>
                </div>
                <div className="mt-1 text-xs font-semibold text-[#2F6BFF]">
                  {msg.subject}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                  {msg.body}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="إرسال رسالة توجيه جديدة"
          subtitle="اختر الطالب وأرسل ملاحظتك حول أدائه في المختبر"
          className="lg:col-span-5"
        >
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                اختر الطالب
              </label>
              <select
                value={selectedUsername}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedUsername(val);
                  const names: Record<string, string> = {
                    'yazan-nabulsi': 'يزن النابلسي',
                    'razan-abdallat': 'رزان العبداللات',
                    'omar-khasawneh': 'عمر الخصاونة',
                    'khaled-momani': 'خالد المومني',
                  };
                  setStudentName(names[val] || val);
                }}
                className="mt-1.5 flex h-10 w-full rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              >
                <option value="yazan-nabulsi">يزن النابلسي (@yazan-nabulsi)</option>
                <option value="razan-abdallat">رزان العبداللات (@razan-abdallat)</option>
                <option value="omar-khasawneh">عمر الخصاونة (@omar-khasawneh)</option>
                <option value="khaled-momani">خالد المومني (@khaled-momani)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                موضوع الرسالة
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: ملاحظات حول القيد المحاسبي الثاني"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                نص الرسالة
              </label>
              <Input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="اكتب توجيهك الأكاديمي للطالب..."
                className="mt-1.5"
              />
            </div>
            <Button type="submit" size="sm" className="w-full gap-1.5">
              <Send className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>إرسال الرسالة</span>
            </Button>
          </form>
        </ChartCard>
      </div>
    </div>
  );
}
