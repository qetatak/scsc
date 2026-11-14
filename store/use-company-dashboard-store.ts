'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  BillingInvoice,
  CompanyMessageTemplate,
  CompanyProfileData,
  CompanyTeamMember,
  DashboardNotification,
  INITIAL_COMPANY_CHECKLIST,
  INITIAL_COMPANY_NOTIFICATIONS,
  INITIAL_COMPANY_PROFILE,
  INITIAL_INVOICES,
  INITIAL_MESSAGE_TEMPLATES,
  INITIAL_SAVED_SEARCHES,
  INITIAL_SHORTLIST_CANDIDATES,
  INITIAL_SHORTLIST_FOLDERS,
  INITIAL_TEAM_MEMBERS,
  OnboardingChecklistItem,
  SavedTalentSearch,
  ShortlistCandidateEntry,
  ShortlistFolder,
} from '@/data/dashboard-mock-data';

interface CompanyDashboardState {
  checklist: OnboardingChecklistItem[];
  companyProfile: CompanyProfileData;
  shortlistFolders: ShortlistFolder[];
  shortlistCandidates: ShortlistCandidateEntry[];
  savedSearches: SavedTalentSearch[];
  messageTemplates: CompanyMessageTemplate[];
  teamMembers: CompanyTeamMember[];
  activePlanId: string;
  invoices: BillingInvoice[];
  notifications: DashboardNotification[];
  bannerDismissed: boolean;

  toggleChecklistStep: (stepId: string) => void;
  completeChecklistStep: (stepId: string) => void;
  resetChecklist: () => void;

  updateCompanyProfile: (partial: Partial<CompanyProfileData>) => void;
  verifyCompanyAccount: (regNumber: string) => void;

  addShortlistFolder: (name: string, description: string) => void;
  addCandidateToShortlist: (
    username: string,
    folderId: string,
    note?: string
  ) => void;
  moveCandidateToFolder: (username: string, targetFolderId: string) => void;
  updateCandidateNote: (username: string, note: string) => void;
  updateCandidateStage: (
    username: string,
    stage: ShortlistCandidateEntry['stage']
  ) => void;
  removeCandidateFromShortlist: (username: string) => void;

  saveTalentSearch: (search: Omit<SavedTalentSearch, 'id'>) => void;
  deleteSavedSearch: (id: string) => void;

  saveMessageTemplate: (
    template: Omit<CompanyMessageTemplate, 'id'> & { id?: string }
  ) => void;
  deleteMessageTemplate: (id: string) => void;

  inviteTeamMember: (
    name: string,
    email: string,
    role: CompanyTeamMember['role'],
    department: string
  ) => void;
  updateTeamMemberRole: (
    id: string,
    role: CompanyTeamMember['role']
  ) => void;
  removeTeamMember: (id: string) => void;

  changeSubscriptionPlan: (planId: string) => void;

  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  dismissBanner: () => void;
}

export const useCompanyDashboardStore = create<CompanyDashboardState>()(
  persist(
    (set) => ({
      checklist: INITIAL_COMPANY_CHECKLIST,
      companyProfile: INITIAL_COMPANY_PROFILE,
      shortlistFolders: INITIAL_SHORTLIST_FOLDERS,
      shortlistCandidates: INITIAL_SHORTLIST_CANDIDATES,
      savedSearches: INITIAL_SAVED_SEARCHES,
      messageTemplates: INITIAL_MESSAGE_TEMPLATES,
      teamMembers: INITIAL_TEAM_MEMBERS,
      activePlanId: 'plan-growth',
      invoices: INITIAL_INVOICES,
      notifications: INITIAL_COMPANY_NOTIFICATIONS,
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

      resetChecklist: () => set({ checklist: INITIAL_COMPANY_CHECKLIST }),

      updateCompanyProfile: (partial) =>
        set((state) => ({
          companyProfile: { ...state.companyProfile, ...partial },
        })),

      verifyCompanyAccount: (regNumber) =>
        set((state) => ({
          companyProfile: {
            ...state.companyProfile,
            commercialRegNumber: regNumber,
            isVerified: true,
          },
          checklist: state.checklist.map((c) =>
            c.id === 'c-step-verify' ? { ...c, completed: true } : c
          ),
        })),

      addShortlistFolder: (name, description) =>
        set((state) => ({
          shortlistFolders: [
            ...state.shortlistFolders,
            {
              id: `folder-${Date.now()}`,
              name,
              description,
            },
          ],
        })),

      addCandidateToShortlist: (username, folderId, note = '') =>
        set((state) => {
          const exists = state.shortlistCandidates.some(
            (c) => c.username === username
          );
          if (exists) {
            return {
              shortlistCandidates: state.shortlistCandidates.map((c) =>
                c.username === username ? { ...c, folderId } : c
              ),
            };
          }
          return {
            shortlistCandidates: [
              ...state.shortlistCandidates,
              {
                username,
                folderId,
                addedAt: new Date().toISOString().split('T')[0],
                note,
                stage: 'تقييم أولي',
              },
            ],
          };
        }),

      moveCandidateToFolder: (username, targetFolderId) =>
        set((state) => ({
          shortlistCandidates: state.shortlistCandidates.map((c) =>
            c.username === username ? { ...c, folderId: targetFolderId } : c
          ),
        })),

      updateCandidateNote: (username, note) =>
        set((state) => ({
          shortlistCandidates: state.shortlistCandidates.map((c) =>
            c.username === username ? { ...c, note } : c
          ),
        })),

      updateCandidateStage: (username, stage) =>
        set((state) => ({
          shortlistCandidates: state.shortlistCandidates.map((c) =>
            c.username === username ? { ...c, stage } : c
          ),
        })),

      removeCandidateFromShortlist: (username) =>
        set((state) => ({
          shortlistCandidates: state.shortlistCandidates.filter(
            (c) => c.username !== username
          ),
        })),

      saveTalentSearch: (search) =>
        set((state) => ({
          savedSearches: [
            {
              ...search,
              id: `sv-${Date.now()}`,
            },
            ...state.savedSearches,
          ],
        })),

      deleteSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        })),

      saveMessageTemplate: (template) =>
        set((state) => {
          if (template.id) {
            return {
              messageTemplates: state.messageTemplates.map((t) =>
                t.id === template.id
                  ? { ...t, ...template, id: template.id }
                  : t
              ),
            };
          }
          return {
            messageTemplates: [
              ...state.messageTemplates,
              { ...template, id: `tpl-${Date.now()}` },
            ],
          };
        }),

      deleteMessageTemplate: (id) =>
        set((state) => ({
          messageTemplates: state.messageTemplates.filter((t) => t.id !== id),
        })),

      inviteTeamMember: (name, email, role, department) =>
        set((state) => ({
          teamMembers: [
            ...state.teamMembers,
            {
              id: `tm-${Date.now()}`,
              name,
              email,
              role,
              department,
              status: 'دعوة معلقة',
              joinedAt: new Date().toISOString().split('T')[0],
            },
          ],
        })),

      updateTeamMemberRole: (id, role) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((m) =>
            m.id === id ? { ...m, role } : m
          ),
        })),

      removeTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        })),

      changeSubscriptionPlan: (planId) => set({ activePlanId: planId }),

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
      name: 'tadreebak-company-dashboard-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
