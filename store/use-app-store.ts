'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CompanyMessage,
  LabId,
  StudentTalent,
  UserRole,
  UserSession,
  VirtualCompanyState,
} from '@/types';
import {
  INITIAL_COMPANY_MESSAGES,
  INITIAL_VIRTUAL_COMPANY,
  STUDENTS_DATA,
} from '@/data/mock-data';
import { INITIAL_SWOT_ITEMS, SwotItem } from '@/lib/labs/management';

function setRoleCookie(role: UserRole | null) {
  if (typeof document === 'undefined') return;
  if (!role) {
    document.cookie = 'tadreebak_role=; path=/; max-age=0; SameSite=Lax';
    return;
  }
  document.cookie = `tadreebak_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export const DEMO_STUDENT_USER: UserSession = {
  id: 'usr-student-1',
  name: 'يزن النابلسي',
  username: 'yazan-nabulsi',
  email: 'yazan@students.ju.edu.jo',
  role: 'student',
  organizationOrUniversity: 'الجامعة الأردنية',
  approvalStatus: 'approved',
};

export const DEMO_TEACHER_USER: UserSession = {
  id: 'usr-teacher-1',
  name: 'د. أحمد خليل العساف',
  username: 'dr-ahmad-khalil',
  email: 'a.khalil@ju.edu.jo',
  role: 'teacher',
  organizationOrUniversity: 'الجامعة الأردنية — كلية الأعمال وتقنية المعلومات',
  approvalStatus: 'approved',
};

export const DEMO_COMPANY_USER: UserSession = {
  id: 'usr-company-1',
  name: 'سارة الخطيب',
  username: 'futuretech-hr',
  email: 'talent@futuretech.jo',
  role: 'company',
  organizationOrUniversity: 'شركة تقنية المستقبل',
  approvalStatus: 'approved',
};

export const DEMO_ADMIN_USER: UserSession = {
  id: 'usr-admin-root',
  name: 'مدير النظام العام',
  username: 'admin',
  email: 'admin@tadreebak.com',
  role: 'admin',
  organizationOrUniversity: 'إدارة منصة تدريبك',
  approvalStatus: 'approved',
};

interface AppState {
  virtualCompany: VirtualCompanyState;
  currentStudent: StudentTalent;
  allStudents: StudentTalent[];
  swotItems: SwotItem[];
  companyMessages: (CompanyMessage & { read?: boolean })[];
  shortlistedUsernames: string[];
  user: UserSession | null;
  theme: 'light' | 'dark';
  darkMode: boolean;
  hasHydrated: boolean;

  // Virtual Company & Lab XP Actions
  awardLabXp: (labId: LabId, xpToAdd: number, achievementNote?: string) => void;
  updateVirtualCompany: (partial: Partial<VirtualCompanyState>) => void;
  resetVirtualCompany: () => void;

  // SWOT Actions
  addSwotItem: (category: SwotItem['category'], text: string) => void;
  updateSwotItem: (id: string, text: string) => void;
  deleteSwotItem: (id: string) => void;

  // Student Profile & Visibility Actions
  updateStudentProfile: (partial: Partial<StudentTalent>) => void;
  togglePublicProfile: () => void;

  // Company Messages & Shortlist Actions
  sendCompanyMessage: (
    payload: Omit<CompanyMessage, 'id' | 'sentAt' | 'status'>
  ) => void;
  replyToCompanyMessage: (messageId: string, replyText: string) => void;
  declineCompanyMessage: (messageId: string) => void;
  toggleShortlistStudent: (username: string) => boolean;

  // Auth & Theme
  loginUser: (user: UserSession) => void;
  switchRole: (role: UserRole) => void;
  logoutUser: () => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleDarkMode: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      virtualCompany: INITIAL_VIRTUAL_COMPANY,
      currentStudent: STUDENTS_DATA[0],
      allStudents: STUDENTS_DATA,
      swotItems: INITIAL_SWOT_ITEMS,
      companyMessages: INITIAL_COMPANY_MESSAGES,
      shortlistedUsernames: ['yazan-nabulsi', 'razan-abdallat'],
      user: DEMO_STUDENT_USER,
      theme: 'light',
      darkMode: false,
      hasHydrated: false,

      awardLabXp: (labId, xpToAdd, achievementNote) => {
        set((state) => {
          const prevXp = state.currentStudent.labXp[labId] || 0;
          const nextLabXp = {
            ...state.currentStudent.labXp,
            [labId]: prevXp + xpToAdd,
          };
          const nextTotalXp =
            nextLabXp.accounting +
            nextLabXp.marketing +
            nextLabXp.management +
            nextLabXp.python;

          const nextAchievements = achievementNote
            ? [
                achievementNote,
                ...state.currentStudent.topAchievements.filter(
                  (a) => a !== achievementNote
                ),
              ].slice(0, 6)
            : state.currentStudent.topAchievements;

          const updatedStudent: StudentTalent = {
            ...state.currentStudent,
            labXp: nextLabXp,
            totalXp: nextTotalXp,
            topAchievements: nextAchievements,
          };

          const updatedAll = state.allStudents.map((s) =>
            s.username === updatedStudent.username ? updatedStudent : s
          );

          return {
            currentStudent: updatedStudent,
            allStudents: updatedAll,
          };
        });
      },

      updateVirtualCompany: (partial) => {
        set((state) => ({
          virtualCompany: {
            ...state.virtualCompany,
            ...partial,
          },
        }));
      },

      resetVirtualCompany: () => {
        set({ virtualCompany: INITIAL_VIRTUAL_COMPANY });
      },

      addSwotItem: (category, text) => {
        const newItem: SwotItem = {
          id: `swot-${Date.now()}`,
          category,
          text,
        };
        set((state) => ({
          swotItems: [...state.swotItems, newItem],
        }));
      },

      updateSwotItem: (id, text) => {
        set((state) => ({
          swotItems: state.swotItems.map((item) =>
            item.id === id ? { ...item, text } : item
          ),
        }));
      },

      deleteSwotItem: (id) => {
        set((state) => ({
          swotItems: state.swotItems.filter((item) => item.id !== id),
        }));
      },

      updateStudentProfile: (partial) => {
        set((state) => {
          const updated: StudentTalent = {
            ...state.currentStudent,
            ...partial,
          };
          return {
            currentStudent: updated,
            allStudents: state.allStudents.map((s) =>
              s.username === updated.username ? updated : s
            ),
          };
        });
      },

      togglePublicProfile: () => {
        set((state) => {
          const updated: StudentTalent = {
            ...state.currentStudent,
            isPublicToCompanies: !state.currentStudent.isPublicToCompanies,
          };
          return {
            currentStudent: updated,
            allStudents: state.allStudents.map((s) =>
              s.username === updated.username ? updated : s
            ),
          };
        });
      },

      sendCompanyMessage: (payload) => {
        const newMsg = {
          ...payload,
          id: `msg-${Date.now()}`,
          sentAt: new Date().toISOString().split('T')[0],
          status: 'قيد الانتظار' as const,
          read: false,
        };
        set((state) => ({
          companyMessages: [newMsg, ...state.companyMessages],
        }));
      },

      replyToCompanyMessage: (messageId, replyText) => {
        set((state) => ({
          companyMessages: state.companyMessages.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  status: 'تم القبول والرد',
                  studentReply: replyText,
                  read: true,
                }
              : m
          ),
        }));
      },

      declineCompanyMessage: (messageId) => {
        set((state) => ({
          companyMessages: state.companyMessages.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  status: 'معتذر',
                  read: true,
                }
              : m
          ),
        }));
      },

      toggleShortlistStudent: (username) => {
        const current = get().shortlistedUsernames;
        const exists = current.includes(username);
        const next = exists
          ? current.filter((u) => u !== username)
          : [...current, username];
        set({ shortlistedUsernames: next });
        return !exists;
      },

      loginUser: (user) => {
        setRoleCookie(user.role);
        set({ user });
      },

      switchRole: (role) => {
        const nextUser =
          role === 'company'
            ? DEMO_COMPANY_USER
            : role === 'teacher'
            ? DEMO_TEACHER_USER
            : role === 'admin'
            ? DEMO_ADMIN_USER
            : DEMO_STUDENT_USER;
        setRoleCookie(role);
        set({ user: nextUser });
      },

      logoutUser: () => {
        if (typeof fetch !== 'undefined') {
          fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        }
        setRoleCookie('student');
        set({ user: null });
      },

      logout: () => {
        get().logoutUser();
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next, darkMode: next === 'dark' });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next === 'dark');
        }
      },

      toggleDarkMode: () => {
        get().toggleTheme();
      },

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: 'tadreebak-labs-storage-v2',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle(
              'dark',
              state.theme === 'dark'
            );
          }
        }
      },
    }
  )
);
