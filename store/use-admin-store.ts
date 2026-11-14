'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ApprovalRequestItem,
  AuditLogEntry,
  LabId,
  UserRole,
} from '@/types';
import {
  INITIAL_APPROVAL_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLATFORM_USERS,
  PlatformUserRecord,
} from '@/data/assignments-mock-data';
import { UNIVERSITIES } from '@/data/mock-data';
import { DashboardNotification } from '@/data/dashboard-mock-data';

export interface LabAdminControl {
  labId: LabId;
  title: string;
  enabled: boolean;
  publishedScenariosCount: number;
  weeklyActiveStudents: number;
}

export interface SiteSettingsConfig {
  siteNameAr: string;
  siteNameEn: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  maxUploadSizeMb: number;
  privacyPolicySummary: string;
  featureFlags: {
    enableAutoGrader: boolean;
    enableRandomizedManagementVars: boolean;
    enablePyodideWorker: boolean;
    enableCompanyDirectMessaging: boolean;
    requireAdminApprovalForTeachers: boolean;
  };
}

interface AdminStoreState {
  users: PlatformUserRecord[];
  approvalRequests: ApprovalRequestItem[];
  universities: string[];
  labsControl: LabAdminControl[];
  auditLogs: AuditLogEntry[];
  notifications: DashboardNotification[];
  announcementDismissed: boolean;
  siteSettings: SiteSettingsConfig;

  // Notifications
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  dismissAnnouncement: () => void;

  // User Management Actions
  suspendOrActivateUser: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  deleteUserRecord: (userId: string) => void;
  resetUserPassword: (userId: string) => void;

  // Approval Queue Actions
  submitRegistrationApprovalRequest: (payload: {
    applicantName: string;
    applicantEmail: string;
    role: 'teacher' | 'company';
    organizationOrUniversity: string;
    departmentOrCommercialReg: string;
    notes: string;
  }) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;

  // Universities & Labs Actions
  addUniversity: (name: string) => void;
  removeUniversity: (name: string) => void;
  toggleLabEnabled: (labId: LabId) => void;

  // Audit & Settings Actions
  recordAuditAction: (
    actionType: AuditLogEntry['actionType'],
    targetLabel: string,
    actorName?: string,
    actorRole?: UserRole
  ) => void;
  updateSiteSettings: (partial: Partial<SiteSettingsConfig>) => void;
  toggleFeatureFlag: (
    flagKey: keyof SiteSettingsConfig['featureFlags']
  ) => void;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      users: INITIAL_PLATFORM_USERS,
      approvalRequests: INITIAL_APPROVAL_REQUESTS,
      universities: [...UNIVERSITIES],
      labsControl: [
        {
          labId: 'accounting',
          title: 'مختبر المحاسبة المالية والدورة المحاسبية',
          enabled: true,
          publishedScenariosCount: 10,
          weeklyActiveStudents: 412,
        },
        {
          labId: 'python',
          title: 'مختبر البرمجة للأعمال وتحليل البيانات (Python)',
          enabled: true,
          publishedScenariosCount: 10,
          weeklyActiveStudents: 485,
        },
        {
          labId: 'marketing',
          title: 'مختبر التسويق الرقمي واقتصاديات الوحدة',
          enabled: true,
          publishedScenariosCount: 10,
          weeklyActiveStudents: 320,
        },
        {
          labId: 'management',
          title: 'مختبر إدارة الأعمال ونقطة التعادل و SWOT',
          enabled: true,
          publishedScenariosCount: 10,
          weeklyActiveStudents: 295,
        },
      ],
      auditLogs: INITIAL_AUDIT_LOGS,
      notifications: [
        {
          id: 'adm-notif-1',
          title: '3 طلبات موافقة جديدة بانتظار المراجعة',
          description: 'طلبا انضمام لمعلمين جامعيين وطلب توثيق سجل تجاري لشركة.',
          timeAgo: 'منذ 20 دقيقة',
          read: false,
          href: '/admin/approvals',
        },
        {
          id: 'adm-notif-2',
          title: 'نمو قياسي في مختبر برمجة Python',
          description: 'ارتفع عدد التسليمات المصححة آلياً بنسبة 28% هذا الأسبوع.',
          timeAgo: 'منذ 3 ساعات',
          read: false,
          href: '/admin/reports',
        },
      ],
      announcementDismissed: false,
      siteSettings: {
        siteNameAr: 'تدريبك',
        siteNameEn: 'Tadreebak',
        tagline: 'المختبرات العملية التفاعلية وبناء البروفايل المهني الجامعي',
        seoTitle: 'تدريبك Tadreebak — المختبرات العملية وبناء البروفايل المهني',
        seoDescription:
          'منصة المختبرات التفاعلية لطلاب الجامعات والخريجين في المحاسبة والتسويق وإدارة الأعمال وبرمجة Python.',
        maxUploadSizeMb: 15,
        privacyPolicySummary:
          'تُحفظ سجلات الأداء الموثقة في المختبرات وتُعرض للشركات المسجلة فقط بموافقة الطالب الصريحة.',
        featureFlags: {
          enableAutoGrader: true,
          enableRandomizedManagementVars: true,
          enablePyodideWorker: true,
          enableCompanyDirectMessaging: true,
          requireAdminApprovalForTeachers: true,
        },
      },

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

      recordAuditAction: (
        actionType,
        targetLabel,
        actorName = 'مدير النظام العام',
        actorRole = 'admin'
      ) => {
        const entry: AuditLogEntry = {
          id: `aud-${Date.now()}`,
          actorName,
          actorRole,
          actionType,
          targetLabel,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          ipAddress: '10.24.0.12',
        };
        set((state) => ({
          auditLogs: [entry, ...state.auditLogs],
        }));
      },

      suspendOrActivateUser: (userId) => {
        const target = get().users.find((u) => u.id === userId);
        if (!target) return;
        const nextStatus = target.status === 'نشط' ? 'معلّق' : 'نشط';
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: nextStatus } : u
          ),
        }));
        get().recordAuditAction(
          'تعليق حساب',
          `${nextStatus === 'معلّق' ? 'تعليق' : 'إعادة تفعيل'} حساب: ${target.fullName}`
        );
      },

      changeUserRole: (userId, newRole) => {
        const target = get().users.find((u) => u.id === userId);
        if (!target) return;
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, role: newRole } : u
          ),
        }));
        get().recordAuditAction(
          'تغيير دور',
          `تغيير دور المستخدم ${target.fullName} إلى ${newRole}`
        );
      },

      deleteUserRecord: (userId) => {
        const target = get().users.find((u) => u.id === userId);
        if (!target) return;
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
        get().recordAuditAction(
          'حذف مستخدم',
          `حذف حساب المستخدم: ${target.fullName} (${target.email})`
        );
      },

      resetUserPassword: (userId) => {
        const target = get().users.find((u) => u.id === userId);
        if (!target) return;
        get().recordAuditAction(
          'تحديث إعدادات',
          `إرسال رابط إعادة تعيين كلمة المرور إلى: ${target.email}`
        );
      },

      submitRegistrationApprovalRequest: (payload) => {
        const newReq: ApprovalRequestItem = {
          id: `req-${Date.now()}`,
          ...payload,
          submittedAt: new Date().toISOString().split('T')[0],
          status: 'قيد المراجعة',
        };
        const newUser: PlatformUserRecord = {
          id: `usr-pending-${Date.now()}`,
          fullName: payload.applicantName,
          username: payload.applicantEmail.split('@')[0],
          email: payload.applicantEmail,
          role: payload.role,
          universityOrOrg: payload.organizationOrUniversity,
          status: 'بانتظار الموافقة',
          joinedAt: new Date().toISOString().split('T')[0],
          xpOrMetric: 'طلب جديد',
        };
        set((state) => ({
          approvalRequests: [newReq, ...state.approvalRequests],
          users: [newUser, ...state.users],
        }));
      },

      approveRequest: (requestId) => {
        const req = get().approvalRequests.find((r) => r.id === requestId);
        if (!req) return;
        set((state) => ({
          approvalRequests: state.approvalRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'مقبول' } : r
          ),
          users: state.users.map((u) =>
            u.email.toLowerCase() === req.applicantEmail.toLowerCase()
              ? { ...u, status: 'نشط' }
              : u
          ),
        }));
        get().recordAuditAction(
          'موافقة طلب',
          `قبول وتفعيل حساب (${req.role === 'teacher' ? 'معلم' : 'شركة'}): ${req.applicantName}`
        );
      },

      rejectRequest: (requestId, reason) => {
        const req = get().approvalRequests.find((r) => r.id === requestId);
        if (!req) return;
        set((state) => ({
          approvalRequests: state.approvalRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'مرفوض', rejectionReason: reason }
              : r
          ),
        }));
        get().recordAuditAction(
          'رفض طلب',
          `رفض طلب ${req.applicantName} — السبب: ${reason}`
        );
      },

      addUniversity: (name) => {
        const trimmed = name.trim();
        if (!trimmed || get().universities.includes(trimmed)) return;
        set((state) => ({
          universities: [...state.universities, trimmed],
        }));
        get().recordAuditAction(
          'تحديث إعدادات',
          `إضافة جامعة جديدة إلى الدليل: ${trimmed}`
        );
      },

      removeUniversity: (name) => {
        set((state) => ({
          universities: state.universities.filter((u) => u !== name),
        }));
        get().recordAuditAction(
          'تحديث إعدادات',
          `إزالة جامعة من الدليل: ${name}`
        );
      },

      toggleLabEnabled: (labId) => {
        const target = get().labsControl.find((l) => l.labId === labId);
        set((state) => ({
          labsControl: state.labsControl.map((l) =>
            l.labId === labId ? { ...l, enabled: !l.enabled } : l
          ),
        }));
        if (target) {
          get().recordAuditAction(
            'تحديث إعدادات',
            `${target.enabled ? 'تعطيل مؤقت' : 'تفعيل'} ${target.title}`
          );
        }
      },

      updateSiteSettings: (partial) => {
        set((state) => ({
          siteSettings: { ...state.siteSettings, ...partial },
        }));
        get().recordAuditAction(
          'تحديث إعدادات',
          'تحديث إعدادات الهوية والسيو والسياسات العامة للموقع'
        );
      },

      toggleFeatureFlag: (flagKey) => {
        set((state) => ({
          siteSettings: {
            ...state.siteSettings,
            featureFlags: {
              ...state.siteSettings.featureFlags,
              [flagKey]: !state.siteSettings.featureFlags[flagKey],
            },
          },
        }));
        get().recordAuditAction(
          'تحديث إعدادات',
          `تبديل مفتاح الميزة (Feature Flag): ${String(flagKey)}`
        );
      },
    }),
    {
      name: 'tadreebak-admin-platform-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
