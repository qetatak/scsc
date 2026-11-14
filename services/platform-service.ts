import {
  AssignmentSubmission,
  ClassSection,
  LabAssignment,
  StudentSubmissionPayload,
  StudentTalent,
} from '@/types';
import { gradeSubmissionByAssignment } from '@/lib/grading';

/**
 * Clean service layer isolating UI components from the underlying data store.
 * Can be swapped with Prisma / REST API endpoints without changing page components.
 */
export const PlatformService = {
  generateClassJoinCode(courseCode: string, university: string): string {
    const cleanCode = courseCode
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6);
    const uniPrefix = university.includes('الأردنية')
      ? 'JU'
      : university.includes('سمية')
      ? 'PSUT'
      : university.includes('العلوم')
      ? 'JUST'
      : 'UNI';
    const suffix = Math.floor(10 + Math.random() * 89);
    return `${uniPrefix}-${cleanCode || 'CLS'}-${suffix}`;
  },

  evaluateStudentSubmission(
    assignment: LabAssignment,
    payload: StudentSubmissionPayload
  ) {
    const report = gradeSubmissionByAssignment(assignment, payload);
    // Calculate XP earned from assignment completion (up to 120 XP for 100% score)
    const xpReward = Math.max(15, Math.round((report.percentage / 100) * 100));
    return {
      report,
      xpReward,
    };
  },

  buildGradebookMatrix(
    classes: ClassSection[],
    selectedClassId: string | 'all',
    assignments: LabAssignment[],
    submissions: AssignmentSubmission[],
    allStudents: StudentTalent[]
  ) {
    const targetClasses =
      selectedClassId === 'all'
        ? classes
        : classes.filter((c) => c.id === selectedClassId);

    const studentSet = new Set<string>();
    targetClasses.forEach((cls) => {
      cls.studentUsernames.forEach((u) => studentSet.add(u));
    });

    const relevantAssignments = assignments.filter(
      (a) =>
        a.status === 'منشور' &&
        (selectedClassId === 'all' || a.targetClassId === selectedClassId)
    );

    const rows = Array.from(studentSet).map((username) => {
      const student = allStudents.find((s) => s.username === username);
      const scoresByAssignment: Record<string, number | null> = {};
      let sum = 0;
      let count = 0;

      relevantAssignments.forEach((asg) => {
        const sub = submissions.find(
          (s) => s.assignmentId === asg.id && s.studentUsername === username
        );
        const finalScore =
          sub?.manualScoreOverride ?? sub?.autoGrade?.autoScore ?? null;
        scoresByAssignment[asg.id] = finalScore;
        if (typeof finalScore === 'number') {
          sum += finalScore;
          count += 1;
        }
      });

      const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;

      return {
        username,
        fullName: student?.fullName || username,
        university: student?.university || 'الجامعة الأردنية',
        scoresByAssignment,
        completedCount: count,
        totalAssignments: relevantAssignments.length,
        average,
      };
    });

    return {
      assignments: relevantAssignments,
      rows,
    };
  },

  exportRowsToCsv(filename: string, headers: string[], rows: string[][]) {
    if (typeof window === 'undefined') return;
    const escapedRows = rows.map((r) =>
      r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent =
      '\uFEFF' + [headers.join(','), ...escapedRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
};
