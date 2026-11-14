'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Save,
  Send,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import { CompanyMessageTemplate } from '@/data/dashboard-mock-data';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CompanyMessagesPage() {
  const { allStudents, companyMessages, sendCompanyMessage } = useAppStore();
  const {
    companyProfile,
    messageTemplates,
    saveMessageTemplate,
    deleteMessageTemplate,
    completeChecklistStep,
  } = useCompanyDashboardStore();

  const [activeTab, setActiveTab] = useState<'messages' | 'templates'>(
    'messages'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Compose state
  const [targetUsername, setTargetUsername] = useState(
    allStudents[0]?.username || 'yazan-nabulsi'
  );
  const [roleType, setRoleType] = useState(
    messageTemplates[0]?.roleType || 'وظيفة دوام كامل لحديثي التخرج'
  );
  const [subject, setSubject] = useState(
    messageTemplates[0]?.subject ||
      'دعوة لمقابلة تقنية — فريق التقنية المالية'
  );
  const [body, setBody] = useState(
    messageTemplates[0]?.body ||
      'مرحباً، اطلعنا على نتائجك الموثقة في مختبرات تدريبك ونود دعوتك لمقابلة تقنية.'
  );

  // Template editor state
  const [editingTemplate, setEditingTemplate] = useState<
    Partial<CompanyMessageTemplate>
  >({
    title: '',
    roleType: 'وظيفة دوام كامل لحديثي التخرج',
    subject: '',
    body: '',
  });

  const filteredMessages = companyMessages.filter((m) =>
    statusFilter === 'all' ? true : m.status === statusFilter
  );

  const handleApplyTemplate = (tpl: CompanyMessageTemplate) => {
    setRoleType(tpl.roleType);
    setSubject(tpl.subject);
    setBody(tpl.body);
    toast.info(`تم تطبيق قالب: ${tpl.title}`);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const student = allStudents.find((s) => s.username === targetUsername);
    if (!student || !subject.trim() || !body.trim()) {
      toast.error('يرجى تعبئة عنوان ونص الرسالة');
      return;
    }

    sendCompanyMessage({
      companyName: companyProfile.companyName,
      companyInitials: 'تم',
      companyGradient: 'from-[#0A1630] to-[#2F6BFF]',
      senderRole: 'فريق استقطاب المواهب',
      studentUsername: student.username,
      studentName: student.fullName,
      subject: subject.trim(),
      offeredRoleType: roleType.trim(),
      message: body.trim(),
    });
    completeChecklistStep('c-step-msg');
    toast.success(`تم إرسال الرسالة إلى ${student.fullName} بنجاح`);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingTemplate.title?.trim() ||
      !editingTemplate.subject?.trim() ||
      !editingTemplate.body?.trim()
    ) {
      toast.error('يرجى إدخال اسم القالب وعنوانه ونصه');
      return;
    }
    saveMessageTemplate({
      id: editingTemplate.id,
      title: editingTemplate.title.trim(),
      roleType: editingTemplate.roleType || 'وظيفة دوام كامل',
      subject: editingTemplate.subject.trim(),
      body: editingTemplate.body.trim(),
    });
    setEditingTemplate({
      title: '',
      roleType: 'وظيفة دوام كامل لحديثي التخرج',
      subject: '',
      body: '',
    });
    toast.success('تم حفظ قالب الرسالة بنجاح');
  };

  return (
    <div>
      <PageHeader
        title="رسائل المرشحين وقوالب التواصل"
        description="إدارة الصادر والوارد مع المرشحين واستخدام قوالب دعوات المقابلات القابلة للتعديل."
        actions={
          <div className="flex items-center gap-1.5 rounded-[10px] border border-[#E3E8F0] bg-white p-1 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`rounded-[8px] px-3 py-1.5 text-xs font-medium ${
                activeTab === 'messages'
                  ? 'bg-[#0A1630] text-white dark:bg-[#2F6BFF]'
                  : 'text-[#526077]'
              }`}
            >
              الصادر والردود ({companyMessages.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`rounded-[8px] px-3 py-1.5 text-xs font-medium ${
                activeTab === 'templates'
                  ? 'bg-[#0A1630] text-white dark:bg-[#2F6BFF]'
                  : 'text-[#526077]'
              }`}
            >
              قوالب الرسائل ({messageTemplates.length})
            </button>
          </div>
        }
      />

      {activeTab === 'messages' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Right Column: Compose Message with Quick Templates */}
          <div className="lg:col-span-5">
            <div className="rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
              <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                إرسال رسالة أو دعوة مقابلة جديدة
              </h2>
              <p className="mt-0.5 text-xs text-[#526077] dark:text-[#94A3B8]">
                اختر قالباً جاهزاً أو خصص الرسالة للمرشح.
              </p>

              {/* Quick Template Buttons */}
              <div className="mt-4">
                <span className="mb-1.5 block text-[11px] font-medium text-[#526077]">
                  تعبئة سريعة من القوالب:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {messageTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="inline-flex items-center gap-1 rounded-[8px] border border-[#E3E8F0] bg-[#F5F6F8] px-2.5 py-1 text-[11px] font-medium text-[#0A1630] hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
                    >
                      <FileText className="h-3 w-3 stroke-[1.5] text-[#2F6BFF]" />
                      <span>{tpl.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSend} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="mb-1 block font-medium">
                    المرشح المستلم
                  </label>
                  <select
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                    className="h-10 w-full rounded-[10px] border border-[#E3E8F0] bg-white px-3 text-xs dark:border-[#1E325C] dark:bg-[#0A1630]"
                  >
                    {allStudents
                      .filter((s) => s.isPublicToCompanies)
                      .map((s) => (
                        <option key={s.username} value={s.username}>
                          {s.fullName} — {s.major} ({s.totalXp} XP)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium">نوع الفرصة</label>
                  <Input
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">عنوان الرسالة</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">نص الرسالة</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    className="w-full rounded-[12px] border border-[#E3E8F0] bg-white p-3 text-xs outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
                  />
                </div>

                <Button type="submit" size="sm" className="w-full gap-1.5">
                  <Send className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>إرسال الدعوة للمرشح</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Left Column: Sent & Replied Messages */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border border-[#E3E8F0] bg-white p-3 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
              <span className="text-xs font-semibold">تصفية حسب الحالة:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'all', label: 'الكل' },
                  { key: 'تم القبول والرد', label: 'تم القبول والرد' },
                  { key: 'قيد الانتظار', label: 'قيد الانتظار' },
                  { key: 'معتذر', label: 'معتذر' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setStatusFilter(f.key)}
                    className={`rounded-[8px] px-2.5 py-1 text-xs font-medium ${
                      statusFilter === f.key
                        ? 'bg-[#2F6BFF] text-white'
                        : 'bg-[#F5F6F8] text-[#526077] dark:bg-[#0A1630]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
                  <div>
                    <span className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      إلى المرشح: {msg.studentName}
                    </span>
                    <span className="mx-2 text-[#526077]">·</span>
                    <span className="text-xs text-[#526077]">
                      {msg.offeredRoleType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-tabular text-[#526077]">
                      {msg.sentAt}
                    </span>
                    <span className="font-semibold text-[#2F6BFF]">
                      {msg.status}
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {msg.subject}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                  {msg.message}
                </p>

                {msg.studentReply && (
                  <div className="mt-3 rounded-[10px] border border-[#2F6BFF]/30 bg-[#EBF1FF]/40 p-3 text-xs dark:bg-[#2F6BFF]/10">
                    <span className="font-semibold text-[#2F6BFF]">
                      رد المرشح ({msg.studentName}):
                    </span>
                    <p className="mt-1 text-[#0A1630] dark:text-[#FAFBFC]">
                      {msg.studentReply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Templates Manager Tab */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSaveTemplate}
              className="space-y-3 rounded-[16px] border border-[#E3E8F0] bg-white p-6 text-xs dark:border-[#1E325C] dark:bg-[#0F1E3E]"
            >
              <h2 className="text-base font-semibold">
                {editingTemplate.id ? 'تعديل القالب' : 'إضافة قالب رسالة جديد'}
              </h2>
              <div>
                <label className="mb-1 block font-medium">اسم القالب</label>
                <Input
                  value={editingTemplate.title || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="مثال: دعوة مقابلة محاسب مالي..."
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">نوع الفرصة</label>
                <Input
                  value={editingTemplate.roleType || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({
                      ...p,
                      roleType: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">عنوان الرسالة</label>
                <Input
                  value={editingTemplate.subject || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({
                      ...p,
                      subject: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">نص القالب</label>
                <textarea
                  value={editingTemplate.body || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({ ...p, body: e.target.value }))
                  }
                  rows={4}
                  className="w-full rounded-[12px] border border-[#E3E8F0] bg-white p-3 text-xs outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
                />
              </div>
              <Button type="submit" size="sm" className="gap-1.5">
                <Save className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>حفظ القالب</span>
              </Button>
            </form>
          </div>

          <div className="space-y-3 lg:col-span-7">
            {messageTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-[16px] border border-[#E3E8F0] bg-white p-5 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{tpl.title}</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingTemplate(tpl)}
                      className="h-7 px-2.5 text-xs"
                    >
                      تعديل
                    </Button>
                    <button
                      type="button"
                      onClick={() => deleteMessageTemplate(tpl.id)}
                      aria-label={`حذف قالب ${tpl.title}`}
                      className="rounded-[6px] p-1 text-[#526077] hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs font-medium text-[#2F6BFF]">
                  {tpl.subject}
                </p>
                <p className="mt-2 text-xs text-[#526077] dark:text-[#94A3B8]">
                  {tpl.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
