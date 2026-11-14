'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AssignmentSubmission,
  AssignmentTemplate,
  ClassSection,
  LabAssignment,
  PlatformAnnouncement,
  StudentSubmissionPayload,
} from '@/types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ASSIGNMENT_TEMPLATES,
  INITIAL_CLASSES,
  INITIAL_SUBMISSIONS,
  INITIAL_TEACHER_CHECKLIST,
  INITIAL_TEACHER_NOTIFICATIONS,
} from '@/data/assignments-mock-data';
import { DashboardNotification, OnboardingStep } from '@/data/dashboard-mock-data';
import { PlatformService } from '@/services/platform-service';

export interface DirectAcademicMessage {
  id: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  recipientUsername: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
}

interface TeacherStoreState {
  checklist: OnboardingStep[];
  notifications: DashboardNotification[];
  announcementDismissed: boolean;
  classes: ClassSection[];
  assignments: LabAssignment[];
  templates: AssignmentTemplate[];
  submissions: AssignmentSubmission[];
  announcements: PlatformAnnouncement[];
  academicMessages: DirectAcademicMessage[];

  // Checklist & Notifications
  toggleChecklistStep: (stepId: string) => void;
  completeChecklistStep: (stepId: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  dismissAnnouncement: () => void;

  // Classes Actions
  createClassSection: (payload: {
    courseName: string;
    courseCode: string;
    semester: string;
    university: string;
  }) => ClassSection;
  removeStudentFromClass: (classId: string, studentUsername: string) => void;
  joinClassByCode: (
    joinCode: string,
    studentUsername: string
  ) => { ok: boolean; classSection?: ClassSection; message: string };

  // Assignments & Templates Actions
  createAssignment: (
    payload: Omit<
      LabAssignment,
      'id' | 'createdAt' | 'createdByTeacherId' | 'createdByTeacherName'
    >
  ) => LabAssignment;
  saveAssignmentAsTemplate: (assignment: LabAssignment) => AssignmentTemplate;

  // Submissions & Grading Actions
  submitStudentAssignment: (params: {
    assignmentId: string;
    studentUsername: string;
    studentName: string;
    university: string;
    timeSpentMinutes: number;
    payload: StudentSubmissionPayload;
  }) => {
    ok: boolean;
    submission?: AssignmentSubmission;
    xpEarned: number;
    error?: string;
  };
  reviewSubmission: (params: {
    submissionId: string;
    manualScoreOverride: number;
    teacherFeedback: string;
  }) => void;
  reopenSubmissionAttempt: (submissionId: string) => void;

  // Announcements & Academic Messages
  createAnnouncement: (payload: {
    title: string;
    body: string;
    targetAudience: string;
    authorName: string;
    authorRole: 'teacher' | 'admin';
    scheduledAt?: string;
  }) => void;
  sendAcademicMessage: (payload: {
    recipientUsername: string;
    recipientName: string;
    subject: string;
    body: string;
  }) => void;
}

export const useTeacherStore = create<TeacherStoreState>()(
  persist(
    (set, get) => ({
      checklist: INITIAL_TEACHER_CHECKLIST,
      notifications: INITIAL_TEACHER_NOTIFICATIONS,
      announcementDismissed: false,
      classes: INITIAL_CLASSES,
      assignments: INITIAL_ASSIGNMENTS,
      templates: INITIAL_ASSIGNMENT_TEMPLATES,
      submissions: INITIAL_SUBMISSIONS,
      announcements: INITIAL_ANNOUNCEMENTS,
      academicMessages: [
        {
          id: 'tmsg-1',
          senderName: 'د. أحمد خليل العساف',
          senderRole: 'teacher',
          recipientUsername: 'yazan-nabulsi',
          recipientName: 'يزن النابلسي',
          subject: 'إشادة بأدائك في واجب قيود التأسيس المحاسبية',
          body: 'مرحباً يزن، اطلعت على حلك في مختبر المحاسبة وكان متوازناً بالكامل من المحاولة الأولى. استمر بهذا المستوى المتميز.',
          sentAt: '2026-11-12',
        },
        {
          id: 'tmsg-2',
          senderName: 'د. أحمد خليل العساف',
          senderRole: 'teacher',
          recipientUsername: 'khaled-momani',
          recipientName: 'خالد المومني',
          subject: 'ملاحظة حول القيد الثاني في الواجب الأول',
          body: 'مرحباً خالد، لاحظت أنك قلبت الحساب المدين مع الحساب الدائن في قيد شراء المعدات. قمت بإعادة فتح محاولة إضافية لك لتصحيح القيد.',
          sentAt: '2026-11-12',
        },
      ],

      toggleChecklistStep: (stepId) =>
        set((state) => ({
          checklist: state.checklist.map((item) =>
            item.id === stepId ? { ...item, completed: !item.completed } : item
          ),
        })),

      completeChecklistStep: (stepId) =>
        set((state) => ({
          checklist: state.checklist.map((item) =>
            item.id === stepId ? { ...item, completed: true } : item
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      dismissAnnouncement: () => set({ announcementDismissed: true }),

      createClassSection: ({ courseName, courseCode, semester, university }) => {
        const newClass: ClassSection = {
          id: `cls-${Date.now()}`,
          courseName,
          courseCode,
          semester,
          university,
          joinCode: PlatformService.generateClassJoinCode(courseCode, university),
          teacherId: 'usr-teacher-1',
          teacherName: 'د. أحمد خليل العساف',
          studentUsernames: ['yazan-nabulsi'],
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          classes: [newClass, ...state.classes],
        }));
        get().completeChecklistStep('t-step-class');
        return newClass;
      },

      removeStudentFromClass: (classId, studentUsername) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  studentUsernames: c.studentUsernames.filter(
                    (u) => u !== studentUsername
                  ),
                }
              : c
          ),
        })),

      joinClassByCode: (joinCode, studentUsername) => {
        const normalized = joinCode.trim().toUpperCase();
        const found = get().classes.find(
          (c) => c.joinCode.toUpperCase() === normalized
        );
        if (!found) {
          return {
            ok: false,
            message: 'كود الشعبة غير صحيح. تأكد من إدخال الكود كما زوّدك به المعلم (مثال: JU-ACC-27).',
          };
        }
        if (found.studentUsernames.includes(studentUsername)) {
          return {
            ok: true,
            classSection: found,
            message: `أنت مسجل بالفعل في شعبة "${found.courseName}".`,
          };
        }
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === found.id
              ? {
                  ...c,
                  studentUsernames: [...c.studentUsernames, studentUsername],
                }
              : c
          ),
        }));
        return {
          ok: true,
          classSection: found,
          message: `تم انضمامك بنجاح إلى شعبة "${found.courseName}" بإشراف ${found.teacherName}.`,
        };
      },

      createAssignment: (payload) => {
        const newAssignment: LabAssignment = {
          ...payload,
          id: `asg-${Date.now()}`,
          createdByTeacherId: 'usr-teacher-1',
          createdByTeacherName: 'د. أحمد خليل العساف',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          assignments: [newAssignment, ...state.assignments],
        }));
        get().completeChecklistStep('t-step-assign');
        return newAssignment;
      },

      saveAssignmentAsTemplate: (assignment) => {
        const newTpl: AssignmentTemplate = {
          id: `tpl-custom-${Date.now()}`,
          title: `قالب مخصص: ${assignment.title}`,
          labId: assignment.labId,
          difficulty: assignment.difficulty,
          summary: assignment.instructions.slice(0, 110),
          instructions: assignment.instructions,
          maxScore: assignment.maxScore,
          allowedAttempts: assignment.allowedAttempts,
          isCustom: true,
          accountingConfig: assignment.accountingConfig,
          marketingConfig: assignment.marketingConfig,
          managementConfig: assignment.managementConfig,
          pythonConfig: assignment.pythonConfig,
        };
        set((state) => ({
          templates: [newTpl, ...state.templates],
        }));
        return newTpl;
      },

      submitStudentAssignment: ({
        assignmentId,
        studentUsername,
        studentName,
        university,
        timeSpentMinutes,
        payload,
      }) => {
        const assignment = get().assignments.find((a) => a.id === assignmentId);
        if (!assignment) {
          return {
            ok: false,
            xpEarned: 0,
            error: 'لم يتم العثور على الواجب المطلوب.',
          };
        }

        const existing = get().submissions.find(
          (s) =>
            s.assignmentId === assignmentId &&
            s.studentUsername === studentUsername
        );

        const attemptsUsed = (existing?.attemptsUsed || 0) + 1;
        if (attemptsUsed > assignment.allowedAttempts) {
          return {
            ok: false,
            xpEarned: 0,
            error: 'لقد استنفدت الحد الأقصى للمحاولات المسموحة لهذا الواجب.',
          };
        }

        const { report, xpReward } = PlatformService.evaluateStudentSubmission(
          assignment,
          payload
        );

        const updatedSubmission: AssignmentSubmission = {
          id: existing?.id || `sub-${Date.now()}`,
          assignmentId: assignment.id,
          assignmentTitle: assignment.title,
          labId: assignment.labId,
          classId: assignment.targetClassId,
          studentUsername,
          studentName,
          university,
          status: 'مُصحَّح آلياً',
          attemptsUsed,
          timeSpentMinutes: (existing?.timeSpentMinutes || 0) + timeSpentMinutes,
          submittedAt: new Date().toISOString().split('T')[0],
          autoGrade: report,
          payload,
        };

        set((state) => {
          const others = state.submissions.filter(
            (s) =>
              !(
                s.assignmentId === assignmentId &&
                s.studentUsername === studentUsername
              )
          );
          return {
            submissions: [updatedSubmission, ...others],
          };
        });

        return {
          ok: true,
          submission: updatedSubmission,
          xpEarned: xpReward,
        };
      },

      reviewSubmission: ({
        submissionId,
        manualScoreOverride,
        teacherFeedback,
      }) => {
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === submissionId
              ? {
                  ...s,
                  status: 'تمت المراجعة',
                  manualScoreOverride,
                  teacherFeedback,
                  reviewedAt: new Date().toISOString().split('T')[0],
                }
              : s
          ),
        }));
        get().completeChecklistStep('t-step-review');
      },

      reopenSubmissionAttempt: (submissionId) => {
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === submissionId
              ? {
                  ...s,
                  status: 'قيد الحل',
                  attemptsUsed: Math.max(0, s.attemptsUsed - 1),
                }
              : s
          ),
        }));
      },

      createAnnouncement: ({
        title,
        body,
        targetAudience,
        authorName,
        authorRole,
        scheduledAt,
      }) => {
        const newAnn: PlatformAnnouncement = {
          id: `ann-${Date.now()}`,
          title,
          body,
          targetAudience,
          authorName,
          authorRole,
          scheduledAt:
            scheduledAt || new Date().toISOString().split('T')[0],
          active: true,
        };
        set((state) => ({
          announcements: [newAnn, ...state.announcements],
        }));
      },

      sendAcademicMessage: ({
        recipientUsername,
        recipientName,
        subject,
        body,
      }) => {
        const newMsg: DirectAcademicMessage = {
          id: `tmsg-${Date.now()}`,
          senderName: 'د. أحمد خليل العساف',
          senderRole: 'teacher',
          recipientUsername,
          recipientName,
          subject,
          body,
          sentAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          academicMessages: [newMsg, ...state.academicMessages],
        }));
      },
    }),
    {
      name: 'tadreebak-teacher-assignments-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
