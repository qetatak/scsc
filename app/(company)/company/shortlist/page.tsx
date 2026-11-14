'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { toast } from 'sonner';
import {
  ArrowUpLeft,
  Download,
  FolderPlus,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCompanyDashboardStore } from '@/store/use-company-dashboard-store';
import {
  ShortlistCandidateEntry,
  ShortlistFolder,
} from '@/data/dashboard-mock-data';
import { StudentTalent } from '@/types';
import { PageHeader } from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function DraggableCandidateCard({
  entry,
  student,
  folders,
  onMoveFolder,
  onUpdateNote,
  onUpdateStage,
  onRemove,
}: {
  entry: ShortlistCandidateEntry;
  student: StudentTalent;
  folders: ShortlistFolder[];
  onMoveFolder: (username: string, folderId: string) => void;
  onUpdateNote: (username: string, note: string) => void;
  onUpdateStage: (
    username: string,
    stage: ShortlistCandidateEntry['stage']
  ) => void;
  onRemove: (username: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: entry.username,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-[12px] border border-[#E3E8F0] bg-white p-4 transition-shadow dark:border-[#1E325C] dark:bg-[#0F1E3E] ${
        isDragging ? 'z-30 opacity-85 shadow-lg ring-2 ring-[#2F6BFF]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            {...listeners}
            {...attributes}
            aria-label={`سحب البطاقة: ${student.fullName}`}
            className="cursor-grab rounded-[6px] p-1 text-[#526077] hover:bg-[#F5F6F8] active:cursor-grabbing dark:hover:bg-[#0A1630]"
          >
            <GripVertical className="h-4 w-4 stroke-[1.5]" />
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#0A1630] text-xs font-semibold text-white dark:bg-[#2F6BFF]">
            {student.initials}
          </div>
          <div>
            <Link
              href={`/students/${student.username}`}
              className="text-xs font-semibold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
            >
              {student.fullName}
            </Link>
            <p className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
              {student.major} · {student.totalXp} XP
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(entry.username)}
          aria-label={`إزالة ${student.fullName} من القائمة`}
          className="rounded-[6px] p-1 text-[#526077] hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
        </button>
      </div>

      {/* Private Recruiter Note */}
      <div className="mt-3">
        <label className="mb-1 block text-[11px] font-medium text-[#526077] dark:text-[#94A3B8]">
          ملاحظات فريق التوظيف الخاصة:
        </label>
        <textarea
          value={entry.note}
          onChange={(e) => onUpdateNote(entry.username, e.target.value)}
          rows={2}
          placeholder="أضف ملاحظة تقييم خاصة عن المرشح..."
          className="w-full rounded-[8px] border border-[#E3E8F0] bg-[#F5F6F8] p-2 text-xs outline-none focus:border-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0A1630]"
        />
      </div>

      {/* Stage & Folder Controls */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E3E8F0] pt-2.5 text-[11px] dark:border-[#1E325C]">
        <select
          value={entry.stage}
          onChange={(e) =>
            onUpdateStage(
              entry.username,
              e.target.value as ShortlistCandidateEntry['stage']
            )
          }
          aria-label="مرحلة التقييم"
          className="rounded-[6px] border border-[#E3E8F0] bg-white px-2 py-1 text-[11px] font-medium dark:border-[#1E325C] dark:bg-[#0A1630]"
        >
          <option value="تقييم أولي">تقييم أولي</option>
          <option value="مقابلة تقنية">مقابلة تقنية</option>
          <option value="عرض مبدئي">عرض مبدئي</option>
        </select>

        <select
          value={entry.folderId}
          onChange={(e) => {
            onMoveFolder(entry.username, e.target.value);
            toast.success('تم نقل المرشح إلى القائمة المحددة');
          }}
          aria-label="نقل إلى قائمة أخرى"
          className="rounded-[6px] border border-[#E3E8F0] bg-white px-2 py-1 text-[11px] text-[#526077] dark:border-[#1E325C] dark:bg-[#0A1630]"
        >
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              نقل: {f.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function DroppableShortlistColumn({
  folder,
  children,
  count,
}: {
  folder: ShortlistFolder;
  children: React.ReactNode;
  count: number;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-[16px] border p-4 transition-colors ${
        isOver
          ? 'border-[#2F6BFF] bg-[#EBF1FF]/30 dark:bg-[#2F6BFF]/10'
          : 'border-[#E3E8F0] bg-[#F1F4F9]/60 dark:border-[#1E325C] dark:bg-[#0A1630]/60'
      }`}
    >
      <div className="mb-3 flex items-center justify-between border-b border-[#E3E8F0] pb-3 dark:border-[#1E325C]">
        <div>
          <h2 className="text-sm font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            {folder.name}
          </h2>
          <p className="text-[11px] text-[#526077] dark:text-[#94A3B8]">
            {folder.description}
          </p>
        </div>
        <span className="font-tabular rounded-[8px] border border-[#E3E8F0] bg-white px-2 py-0.5 text-xs font-semibold text-[#2F6BFF] dark:border-[#1E325C] dark:bg-[#0F1E3E]">
          {count}
        </span>
      </div>
      <div className="min-h-[220px] space-y-3">{children}</div>
    </div>
  );
}

export default function CompanyShortlistPage() {
  const { allStudents } = useAppStore();
  const {
    shortlistFolders,
    shortlistCandidates,
    addShortlistFolder,
    moveCandidateToFolder,
    updateCandidateNote,
    updateCandidateStage,
    removeCandidateFromShortlist,
  } = useCompanyDashboardStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const username = String(active.id);
    const targetFolderId = String(over.id);
    moveCandidateToFolder(username, targetFolderId);
    toast.success('تم نقل المرشح بين القوائم بنجاح');
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error('يرجى إدخال اسم القائمة الجديدة');
      return;
    }
    addShortlistFolder(
      newFolderName.trim(),
      newFolderDesc.trim() || 'قائمة فرز مخصصة للمرشحين'
    );
    setNewFolderName('');
    setNewFolderDesc('');
    toast.success('تم إنشاء قائمة مختصرة جديدة');
  };

  const handleExportCsv = () => {
    const headers = [
      'الاسم الكامل',
      'اسم المستخدم',
      'الجامعة',
      'التخصص',
      'المدينة',
      'إجمالي الخبرة XP',
      'القائمة المختصرة',
      'مرحلة التقييم',
      'ملاحظات فريق التوظيف',
    ];

    const rows = shortlistCandidates.map((entry) => {
      const student = allStudents.find((s) => s.username === entry.username);
      const folder = shortlistFolders.find((f) => f.id === entry.folderId);
      return [
        student?.fullName || entry.username,
        entry.username,
        student?.university || '',
        student?.major || '',
        student?.city || '',
        String(student?.totalXp || 0),
        folder?.name || '',
        entry.stage,
        `"${(entry.note || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tadreebak-shortlist-candidates.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير القوائم المختصرة بصيغة CSV بنجاح');
  };

  return (
    <div>
      <PageHeader
        title="القوائم المختصرة للمرشحين (Shortlist)"
        description="نظم المرشحين في قوائم مسماة، اسحب وأفلت البطاقات بين القوائم، دوّن ملاحظاتك الخاصة، وصدّر البيانات بصيغة CSV."
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleExportCsv}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>تصدير CSV ({shortlistCandidates.length})</span>
            </Button>
            <Link href="/company/talent">
              <Button size="sm" className="gap-1.5">
                <span>إضافة مرشحين جدد</span>
                <ArrowUpLeft className="h-3.5 w-3.5 stroke-[1.5]" />
              </Button>
            </Link>
          </>
        }
      />

      {/* Create New Named List Form */}
      <form
        onSubmit={handleCreateFolder}
        className="mb-6 flex flex-col gap-3 rounded-[16px] border border-[#E3E8F0] bg-white p-4 sm:flex-row sm:items-center dark:border-[#1E325C] dark:bg-[#0F1E3E]"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
          <FolderPlus className="h-4 w-4 stroke-[1.5] text-[#2F6BFF]" />
          <span>إنشاء قائمة مسماة جديدة:</span>
        </div>
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="اسم القائمة (مثال: مرشحو تدريب الصيف)..."
          className="h-9 flex-1 text-xs"
        />
        <Input
          value={newFolderDesc}
          onChange={(e) => setNewFolderDesc(e.target.value)}
          placeholder="وصف مختصر للقائمة..."
          className="h-9 flex-1 text-xs"
        />
        <Button type="submit" size="sm" className="h-9 shrink-0 text-xs">
          إضافة القائمة
        </Button>
      </form>

      {/* Drag and Drop Shortlist Columns */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {shortlistFolders.map((folder) => {
            const entriesInFolder = shortlistCandidates.filter(
              (c) => c.folderId === folder.id
            );

            return (
              <DroppableShortlistColumn
                key={folder.id}
                folder={folder}
                count={entriesInFolder.length}
              >
                {entriesInFolder.length === 0 ? (
                  <div className="flex h-36 items-center justify-center rounded-[12px] border border-dashed border-[#E3E8F0] text-xs text-[#526077] dark:border-[#1E325C]">
                    اسحب مرشحاً إلى هذه القائمة
                  </div>
                ) : (
                  entriesInFolder.map((entry) => {
                    const student = allStudents.find(
                      (s) => s.username === entry.username
                    );
                    if (!student) return null;
                    return (
                      <DraggableCandidateCard
                        key={entry.username}
                        entry={entry}
                        student={student}
                        folders={shortlistFolders}
                        onMoveFolder={moveCandidateToFolder}
                        onUpdateNote={updateCandidateNote}
                        onUpdateStage={updateCandidateStage}
                        onRemove={removeCandidateFromShortlist}
                      />
                    );
                  })
                )}
              </DroppableShortlistColumn>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
