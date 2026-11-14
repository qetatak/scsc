'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Copy,
  KeyRound,
  Link2,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import { useTeacherStore } from '@/store/use-teacher-store';
import { useAppStore } from '@/store/use-app-store';
import {
  ChartCard,
  DataTable,
  DataTableColumn,
  PageHeader,
} from '@/components/dashboard/ui-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EnrolledStudentRow {
  username: string;
  fullName: string;
  university: string;
  major: string;
  totalXp: number;
  completedCount: number;
  avgScore: number;
}

export default function TeacherClassesPage() {
  const {
    classes,
    assignments,
    submissions,
    createClassSection,
    removeStudentFromClass,
  } = useTeacherStore();
  const { allStudents: students } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || ''
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [semester, setSemester] = useState('الفصل الأول 2026/2027');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeClass =
    classes.find((c) => c.id === selectedClassId) || classes[0];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !courseCode.trim()) {
      toast.error('يرجى إدخال اسم المساق ورمز الشعبة.');
      return;
    }
    const created = createClassSection({
      courseName: courseName.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      semester: semester.trim(),
      university: 'الجامعة الأردنية',
    });
    setSelectedClassId(created.id);
    setCourseName('');
    setCourseCode('');
    setShowCreateForm(false);
    toast.success(`تم إنشاء الشعبة بكود انضمام: ${created.joinCode}`);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`تم نسخ كود الانضمام (${code})`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyInviteLink = (code: string) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://tadreebak.jo';
    const url = `${origin}/student/assignments?joinCode=${code}`;
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ رابط الدعوة المباشر للطلاب');
  };

  const classAssignments = activeClass
    ? assignments.filter((a) => a.targetClassId === activeClass.id)
    : [];

  const enrolledRows: EnrolledStudentRow[] = activeClass
    ? activeClass.studentUsernames.map((username) => {
        const st = students.find((s) => s.username === username);
        const stSubs = submissions.filter(
          (sub) =>
            sub.studentUsername === username &&
            classAssignments.some((a) => a.id === sub.assignmentId)
        );
        const avg =
          stSubs.length > 0
            ? Math.round(
                stSubs.reduce(
                  (sum, s) =>
                    sum + (s.manualScoreOverride ?? s.autoGrade?.autoScore ?? 0),
                  0
                ) / stSubs.length
              )
            : 0;
        return {
          username,
          fullName: st?.fullName || username,
          university: st?.university || activeClass.university,
          major: st?.major || 'محاسبة وأعمال',
          totalXp: st?.totalXp || 450,
          completedCount: stSubs.length,
          avgScore: avg,
        };
      })
    : [];

  const columns: DataTableColumn<EnrolledStudentRow>[] = [
    {
      key: 'fullName',
      header: 'اسم الطالب',
      sortable: true,
      sortValue: (r) => r.fullName,
      render: (r) => (
        <div>
          <Link
            href={`/students/${r.username}`}
            className="font-semibold text-[#0A1630] hover:text-[#2F6BFF] dark:text-[#FAFBFC]"
          >
            {r.fullName}
          </Link>
          <p className="font-mono text-[11px] text-[#526077] dark:text-[#94A3B8]">
            @{r.username}
          </p>
        </div>
      ),
    },
    {
      key: 'major',
      header: 'التخصص الجامعي',
      sortable: true,
      sortValue: (r) => r.major,
      render: (r) => (
        <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
          {r.major}
        </span>
      ),
    },
    {
      key: 'completedCount',
      header: 'الواجبات المُسلَّمة',
      sortable: true,
      sortValue: (r) => r.completedCount,
      render: (r) => (
        <span className="font-tabular font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
          {r.completedCount} / {classAssignments.length}
        </span>
      ),
    },
    {
      key: 'avgScore',
      header: 'متوسط الدرجة',
      sortable: true,
      sortValue: (r) => r.avgScore,
      render: (r) => (
        <span className="font-tabular font-semibold text-[#2F6BFF]">
          {r.avgScore > 0 ? `${r.avgScore}%` : '—'}
        </span>
      ),
    },
    {
      key: 'totalXp',
      header: 'إجمالي الخبرة (XP)',
      sortable: true,
      sortValue: (r) => r.totalXp,
      render: (r) => (
        <span className="font-tabular text-xs font-medium text-[#0A1630] dark:text-[#FAFBFC]">
          {r.totalXp.toLocaleString('en-US')} XP
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'إجراءات',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/students/${r.username}`}
            className="text-xs font-medium text-[#2F6BFF] hover:underline"
          >
            عرض البروفايل
          </Link>
          {activeClass && (
            <button
              type="button"
              onClick={() => {
                removeStudentFromClass(activeClass.id, r.username);
                toast.success(`تم إزالة الطالب ${r.fullName} من الشعبة`);
              }}
              className="inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>إزالة</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الشُعب الدراسية وإدارة الطلاب"
        description="أنشئ شُعباً دراسية لمساقاتك الجامعية، شارك كود الانضمام الفريد مع طلابك، وتابع تقدمهم العملي."
        actions={
          <Button
            size="sm"
            onClick={() => setShowCreateForm((v) => !v)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>إنشاء شعبة دراسية جديدة</span>
          </Button>
        }
      />

      {showCreateForm && (
        <form
          onSubmit={handleCreateClass}
          className="mb-6 rounded-[16px] border border-[#E3E8F0] bg-white p-5 sm:p-6 dark:border-[#1E325C] dark:bg-[#0F1E3E]"
        >
          <h2 className="mb-4 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
            إضافة شعبة دراسية جديدة
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="class-name">اسم المساق والشعبة</Label>
              <Input
                id="class-name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="مثال: محاسبة متوسطة (1) — شعبة 3"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="course-code">رمز المساق الأكاديمي</Label>
              <Input
                id="course-code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="مثال: ACC-202"
                dir="ltr"
                className="mt-1.5 font-mono"
              />
            </div>
            <div>
              <Label htmlFor="semester">الفصل الدراسي</Label>
              <Input
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" size="sm">
              توليد كود الانضمام وحفظ الشعبة
            </Button>
          </div>
        </form>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {classes.map((cls) => {
          const isSelected = activeClass?.id === cls.id;
          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`cursor-pointer rounded-[16px] border p-5 transition-colors ${
                isSelected
                  ? 'border-[#2F6BFF] bg-white dark:border-[#2F6BFF] dark:bg-[#0F1E3E]'
                  : 'border-[#E3E8F0] bg-white hover:border-[#94A3B8] dark:border-[#1E325C] dark:bg-[#0F1E3E]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-[#2F6BFF]">
                  {cls.courseCode}
                </span>
                <span className="text-xs text-[#526077] dark:text-[#94A3B8]">
                  {cls.semester}
                </span>
              </div>
              <h3 className="mt-1.5 text-base font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
                {cls.courseName}
              </h3>

              <div className="mt-4 flex items-center justify-between rounded-[10px] border border-[#E3E8F0] bg-[#FAFBFC] px-3 py-2 dark:border-[#1E325C] dark:bg-[#0A1630]">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 stroke-[1.5] text-[#2F6BFF]" />
                  <span className="font-mono text-xs font-bold tracking-wider text-[#0A1630] dark:text-[#FAFBFC]">
                    {cls.joinCode}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(cls.joinCode, cls.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-medium text-[#2F6BFF] hover:bg-[#2F6BFF]/10"
                  >
                    {copiedId === cls.id ? (
                      <Check className="h-3 w-3 stroke-[1.5]" />
                    ) : (
                      <Copy className="h-3 w-3 stroke-[1.5]" />
                    )}
                    <span>نسخ الكود</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyInviteLink(cls.joinCode);
                    }}
                    className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-medium text-[#526077] hover:bg-[#E3E8F0]/50 dark:text-[#94A3B8]"
                    title="نسخ رابط الدعوة"
                  >
                    <Link2 className="h-3 w-3 stroke-[1.5]" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#526077] dark:text-[#94A3B8]">
                <span className="inline-flex items-center gap-1.5 font-tabular">
                  <Users className="h-3.5 w-3.5 stroke-[1.5]" />
                  {cls.studentUsernames.length} طالب مسجل
                </span>
                <span className="font-medium text-[#0A1630] dark:text-[#FAFBFC]">
                  {
                    assignments.filter((a) => a.targetClassId === cls.id).length
                  }{' '}
                  واجبات عملية
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {activeClass && (
        <ChartCard
          title={`قائمة طلاب: ${activeClass.courseName}`}
          subtitle={`كود الانضمام الفريد للشعبة: ${activeClass.joinCode} — إجمالي الطلاب المسجلين: ${enrolledRows.length}`}
        >
          <DataTable
            data={enrolledRows}
            columns={columns}
            rowKey={(r) => r.username}
            searchPlaceholder="ابحث باسم الطالب أو اسم المستخدم..."
            searchMatcher={(r, q) =>
              r.fullName.toLowerCase().includes(q) ||
              r.username.toLowerCase().includes(q)
            }
            pageSize={6}
          />
        </ChartCard>
      )}
    </div>
  );
}
