'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpLeft,
  Copy,
  FlaskConical,
  Plus,
} from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { AssignmentDifficulty, LabId } from '@/types';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LAB_NAMES: Record<LabId, string> = {
  accounting: 'مختبر المحاسبة المالية',
  marketing: 'مختبر التسويق الرقمي',
  management: 'مختبر إدارة الأعمال',
  python: 'مختبر البرمجة (Python)',
};

export default function TeacherTemplatesLibraryPage() {
  const { templates, saveAssignmentAsTemplate, classes } = useTeacherStore();

  const [labFilter, setLabFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newLabId, setNewLabId] = useState<LabId>('accounting');
  const [newDifficulty, setNewDifficulty] =
    useState<AssignmentDifficulty>('متوسط');
  const [newInstructions, setNewInstructions] = useState('');

  const filteredTemplates = templates.filter((t) => {
    if (labFilter !== 'all' && t.labId !== labFilter) return false;
    if (diffFilter !== 'all' && t.difficulty !== diffFilter) return false;
    if (
      searchQuery.trim() &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSaveCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInstructions.trim()) {
      toast.error('يرجى إدخال عنوان القالب ونص السيناريو العملي.');
      return;
    }
    saveAssignmentAsTemplate({
      id: `asg-custom-${Date.now()}`,
      title: newTitle.trim(),
      labId: newLabId,
      difficulty: newDifficulty,
      instructions: newInstructions.trim(),
      maxScore: 100,
      dueDate: '2026-12-01',
      allowedAttempts: 3,
      showModelAnswerAfterSubmit: true,
      targetClassId: classes[0]?.id || 'cls-acc-101',
      targetStudentUsernames: [],
      status: 'مسودة',
      createdByTeacherId: 'usr-teacher-1',
      createdByTeacherName: 'د. أحمد خليل العساف',
      createdAt: '2026-11-12',
    });
    setNewTitle('');
    setNewInstructions('');
    setShowCustomModal(false);
    toast.success('تم حفظ القالب الخاص في مكتبتك الأكاديمية');
  };

  return (
    <div>
      <PageHeader
        title={`مكتبة قوالب الواجبات الجاهزة (${templates.length} قالب تطبيقي)`}
        description="10 قوالب عملية محكمة لكل مختبر (محاسبة، تسويق، إدارة، Python) قابلة للنسخ والتخصيص الفوري."
        actions={
          <Button
            size="sm"
            onClick={() => setShowCustomModal((v) => !v)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>حفظ قالب خاص جديد</span>
          </Button>
        }
      />

      {showCustomModal && (
        <form
          onSubmit={handleSaveCustomTemplate}
          className="mb-6 rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
        >
          <h2 className="mb-4 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            إضافة قالب واجب مخصص إلى مكتبتك
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>عنوان القالب</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: تسوية حسابات الذمم المدينة"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>المختبر</Label>
              <select
                value={newLabId}
                onChange={(e) => setNewLabId(e.target.value as LabId)}
                className="mt-1.5 flex h-11 w-full rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-sm text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              >
                <option value="accounting">مختبر المحاسبة المالية</option>
                <option value="marketing">مختبر التسويق الرقمي</option>
                <option value="management">مختبر إدارة الأعمال</option>
                <option value="python">مختبر البرمجة (Python)</option>
              </select>
            </div>
            <div>
              <Label>مستوى الصعوبة</Label>
              <select
                value={newDifficulty}
                onChange={(e) =>
                  setNewDifficulty(e.target.value as AssignmentDifficulty)
                }
                className="mt-1.5 flex h-11 w-full rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-sm text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
              >
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="متقدم">متقدم</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Label>نص السيناريو العملي</Label>
            <textarea
              rows={2}
              value={newInstructions}
              onChange={(e) => setNewInstructions(e.target.value)}
              placeholder="اكتب تفاصيل المهمة التي سيقوم الطالب بتنفيذها داخل المختبر..."
              className="mt-1.5 w-full rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-3 text-sm text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowCustomModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" size="sm">
              حفظ في المكتبة
            </Button>
          </div>
        </form>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#E3E8F0] bg-white p-4 dark:border-[#1E325C] dark:bg-[#0F1E3E]">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `الكل (${templates.length})` },
            { id: 'accounting', label: 'المحاسبة (10)' },
            { id: 'marketing', label: 'التسويق (10)' },
            { id: 'management', label: 'الإدارة (10)' },
            { id: 'python', label: 'Python (10)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLabFilter(tab.id)}
              className={`rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                labFilter === tab.id
                  ? 'bg-[#0A1630] text-white dark:bg-[#2F6BFF]'
                  : 'bg-[#F5F6F8] text-[#526077] hover:text-[#0A1630] dark:bg-[#0A1630] dark:text-[#94A3B8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={diffFilter}
            onChange={(e) => setDiffFilter(e.target.value)}
            className="h-9 rounded-[8px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 text-xs text-[#0A1630] dark:border-[#1E325C] dark:bg-[#0A1630] dark:text-[#FAFBFC]"
          >
            <option value="all">كل المستويات</option>
            <option value="مبتدئ">مبتدئ</option>
            <option value="متوسط">متوسط</option>
            <option value="متقدم">متقدم</option>
          </select>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في القوالب..."
            className="h-9 w-52 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="flex flex-col justify-between rounded-[16px] border border-[#E3E8F0] bg-white p-5 transition-colors hover:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0F1E3E]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#2F6BFF]">
                  <FlaskConical className="h-3.5 w-3.5 stroke-[1.5]" />
                  {LAB_NAMES[tpl.labId]}
                </span>
                <span className="rounded-[6px] border border-[#E3E8F0] px-2 py-0.5 text-[11px] font-medium text-[#526077] dark:border-[#1E325C] dark:text-[#94A3B8]">
                  {tpl.difficulty}
                </span>
              </div>

              <h3 className="mt-2 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                {tpl.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#526077] dark:text-[#94A3B8]">
                {tpl.summary}
              </p>

              <div className="mt-3 rounded-[10px] bg-[#FAFBFC] p-3 text-[11px] text-[#526077] dark:bg-[#0A1630] dark:text-[#94A3B8]">
                <div className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  تعليمات السيناريو:
                </div>
                <p className="mt-1 line-clamp-2">{tpl.instructions}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#E3E8F0] pt-3.5 dark:border-[#1E325C]">
              <div className="flex items-center gap-3 font-tabular text-xs text-[#526077] dark:text-[#94A3B8]">
                <span>المحاولات: {tpl.allowedAttempts}</span>
                <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                  {tpl.maxScore} نقطة
                </span>
              </div>

              <Link
                href={`/teacher/assignments/new?templateId=${tpl.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6BFF] hover:underline"
              >
                <Copy className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>نسخ وتخصيص كواجب</span>
                <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
