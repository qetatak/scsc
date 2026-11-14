'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Building2,
  Check,
  MessageSquare,
  Send,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { EmptyState, PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';

export default function StudentMessagesPage() {
  const {
    currentStudent,
    companyMessages,
    replyToCompanyMessage,
    declineCompanyMessage,
  } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'قيد الانتظار' | 'تم القبول والرد' | 'معتذر'
  >('all');

  const studentInbox = companyMessages.filter(
    (m) => m.studentUsername === currentStudent.username
  );

  const filteredMessages = studentInbox.filter((m) =>
    statusFilter === 'all' ? true : m.status === statusFilter
  );

  const [selectedId, setSelectedId] = useState<string>(
    studentInbox[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  const activeMessage =
    filteredMessages.find((m) => m.id === selectedId) ||
    filteredMessages[0] ||
    null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage) return;
    const text =
      replyText.trim() ||
      'شكراً لتواصلكم، يسعدني قبول دعوة المقابلة وتنسيق الموعد المناسب هذا الأسبوع.';
    replyToCompanyMessage(activeMessage.id, text);
    setReplyText('');
    toast.success(`تم إرسال ردك وقبول الدعوة من ${activeMessage.companyName}`);
  };

  const handleDecline = () => {
    if (!activeMessage) return;
    declineCompanyMessage(activeMessage.id);
    toast.info(`تم الاعتذار عن عرض ${activeMessage.companyName}`);
  };

  const getStatusLabel = (status: string) => {
    if (status === 'قيد الانتظار') return 'جديد';
    if (status === 'تم القبول والرد') return 'تم الرد';
    return 'مرفوض';
  };

  return (
    <div>
      <PageHeader
        title="صندوق رسائل ودعوات الشركات"
        description="تواصل مباشر مع فرق التوظيف المهتمة بنتائجك العملية في المختبرات التفاعلية."
      />

      {/* Status Filter Tabs */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-[12px] border border-[#E3E8F0] bg-white p-1.5 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          {[
            { key: 'all', label: `الكل (${studentInbox.length})` },
            {
              key: 'قيد الانتظار',
              label: `جديد (${studentInbox.filter((m) => m.status === 'قيد الانتظار').length})`,
            },
            {
              key: 'تم القبول والرد',
              label: `تم الرد (${studentInbox.filter((m) => m.status === 'تم القبول والرد').length})`,
            },
            {
              key: 'معتذر',
              label: `مرفوض (${studentInbox.filter((m) => m.status === 'معتذر').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                setStatusFilter(
                  tab.key as 'all' | 'قيد الانتظار' | 'تم القبول والرد' | 'معتذر'
                )
              }
              className={`rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-[#0A1630] text-white dark:bg-[#2F6BFF]'
                  : 'text-[#526077] hover:text-[#0A1630] dark:text-[#94A3B8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <EmptyState
          title="لا توجد رسائل ضمن هذا التصنيف"
          description="استمر في إتمام تمارين المختبرات لرفع ترتيبك وزيادة وصول الشركات إلى بروفايلك."
          actionLabel="عرض جميع الرسائل"
          onAction={() => setStatusFilter('all')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Right Pane: Messages List */}
          <div className="space-y-2.5 lg:col-span-5">
            {filteredMessages.map((msg) => {
              const isSelected = activeMessage?.id === msg.id;
              return (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => setSelectedId(msg.id)}
                  className={`w-full rounded-[16px] border p-4 text-right transition-colors ${
                    isSelected
                      ? 'border-[#2F6BFF] bg-white dark:bg-[#0F1E3E]'
                      : 'border-[#E3E8F0] bg-white/80 hover:border-[#0A1630]/30 dark:border-[#1E325C] dark:bg-[#0F1E3E]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#0A1630] text-xs font-semibold text-white dark:bg-[#2F6BFF]">
                        {msg.companyInitials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                          {msg.companyName}
                        </p>
                        <p className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
                          {msg.senderRole}
                        </p>
                      </div>
                    </div>
                    <span className="font-tabular text-[11px] text-[#526077]">
                      {msg.sentAt}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-1 text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    {msg.subject}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-[#526077] dark:text-[#94A3B8]">
                    {msg.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#E3E8F0] pt-2.5 text-[11px] dark:border-[#1E325C]">
                    <span className="text-[#526077] dark:text-[#94A3B8]">
                      {msg.offeredRoleType}
                    </span>
                    <span
                      className={
                        msg.status === 'قيد الانتظار'
                          ? 'font-semibold text-[#2F6BFF]'
                          : msg.status === 'تم القبول والرد'
                            ? 'font-semibold text-[#0A1630] dark:text-[#FAFBFC]'
                            : 'text-[#526077]'
                      }
                    >
                      الحالة: {getStatusLabel(msg.status)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Left Pane: Active Conversation */}
          <div className="lg:col-span-7">
            {activeMessage && (
              <div className="flex h-full flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
                <div>
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E3E8F0] pb-4 dark:border-[#1E325C]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0A1630] text-sm font-semibold text-white dark:bg-[#2F6BFF]">
                        {activeMessage.companyInitials}
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                          {activeMessage.companyName}
                        </h2>
                        <p className="text-xs text-[#526077] dark:text-[#94A3B8]">
                          {activeMessage.senderRole} · نوع الفرصة:{' '}
                          {activeMessage.offeredRoleType}
                        </p>
                      </div>
                    </div>

                    <div className="text-left text-xs">
                      <span className="font-tabular block text-[#526077]">
                        تاريخ الإرسال: {activeMessage.sentAt}
                      </span>
                      <span className="mt-1 inline-block font-semibold text-[#2F6BFF]">
                        الحالة: {getStatusLabel(activeMessage.status)}
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="mt-5 rounded-[12px] border border-[#E3E8F0] bg-[#F5F6F8] p-4 dark:border-[#1E325C] dark:bg-[#0A1630]">
                    <h3 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                      {activeMessage.subject}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#0A1630]/90 dark:text-[#FAFBFC]/90">
                      {activeMessage.message}
                    </p>
                  </div>

                  {/* Student Reply if exists */}
                  {activeMessage.studentReply && (
                    <div className="mt-4 rounded-[12px] border border-[#2F6BFF]/40 bg-[#EBF1FF]/40 p-4 dark:bg-[#2F6BFF]/10">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#2F6BFF]">
                        <span>ردك المرسل إلى {activeMessage.companyName}</span>
                        <MessageSquare className="h-3.5 w-3.5 stroke-[1.5]" />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#0A1630] dark:text-[#FAFBFC]">
                        {activeMessage.studentReply}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reply / Action Box */}
                <form
                  onSubmit={handleSendReply}
                  className="mt-6 border-t border-[#E3E8F0] pt-5 dark:border-[#1E325C]"
                >
                  <label className="mb-2 block text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                    الرد على {activeMessage.companyName}
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="اكتب ردك لتحديد موعد المقابلة أو الاستفسار عن تفاصيل الدور..."
                    className="w-full rounded-[12px] border border-[#E3E8F0] bg-white p-3 text-xs outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <Button type="submit" size="sm" className="gap-1.5 text-xs">
                        <Send className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span>قبول الدعوة وإرسال الرد</span>
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          replyToCompanyMessage(
                            activeMessage.id,
                            'أشكركم على الدعوة الكريمة، أؤكد قبولي للمقابلة وأتطلع للتواصل معكم.'
                          );
                          toast.success('تم قبول الدعوة وإرسال تأكيد فوري');
                        }}
                        className="gap-1.5 text-xs"
                      >
                        <Check className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span>قبول سريع</span>
                      </Button>
                    </div>

                    {activeMessage.status !== 'معتذر' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDecline}
                        className="gap-1.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        <X className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span>اعتذار عن العرض</span>
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
