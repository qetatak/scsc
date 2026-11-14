'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  DashboardNotification,
  INITIAL_STUDENT_CERTIFICATES,
  INITIAL_STUDENT_CHECKLIST,
  INITIAL_STUDENT_NOTIFICATIONS,
  INITIAL_STUDENT_PROJECTS,
  OnboardingChecklistItem,
  StudentCertificateItem,
  StudentProjectItem,
} from '@/data/dashboard-mock-data';

interface StudentPrivacySettings {
  hideUniversity: boolean;
  hideCity: boolean;
  hideEmail: boolean;
  emailNotifications: boolean;
  companyInviteAlerts: boolean;
  weeklyProgressDigest: boolean;
  preferredLanguage: 'ar' | 'en';
}

interface StudentDashboardState {
  checklist: OnboardingChecklistItem[];
  projects: StudentProjectItem[];
  certificates: StudentCertificateItem[];
  notifications: DashboardNotification[];
  privacy: StudentPrivacySettings;
  bannerDismissed: boolean;

  toggleChecklistStep: (stepId: string) => void;
  completeChecklistStep: (stepId: string) => void;
  resetChecklist: () => void;
  addProject: (project: Omit<StudentProjectItem, 'id'>) => void;
  deleteProject: (projectId: string) => void;
  updatePrivacy: (partial: Partial<StudentPrivacySettings>) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  dismissBanner: () => void;
}

export const useStudentDashboardStore = create<StudentDashboardState>()(
  persist(
    (set) => ({
      checklist: INITIAL_STUDENT_CHECKLIST,
      projects: INITIAL_STUDENT_PROJECTS,
      certificates: INITIAL_STUDENT_CERTIFICATES,
      notifications: INITIAL_STUDENT_NOTIFICATIONS,
      privacy: {
        hideUniversity: false,
        hideCity: false,
        hideEmail: true,
        emailNotifications: true,
        companyInviteAlerts: true,
        weeklyProgressDigest: true,
        preferredLanguage: 'ar',
      },
      bannerDismissed: false,

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

      resetChecklist: () => set({ checklist: INITIAL_STUDENT_CHECKLIST }),

      addProject: (project) =>
        set((state) => ({
          projects: [
            {
              ...project,
              id: `proj-${Date.now()}`,
            },
            ...state.projects,
          ],
        })),

      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),

      updatePrivacy: (partial) =>
        set((state) => ({
          privacy: { ...state.privacy, ...partial },
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

      dismissBanner: () => set({ bannerDismissed: true }),
    }),
    {
      name: 'tadreebak-student-dashboard-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
