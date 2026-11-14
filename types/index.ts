export type LabId = 'accounting' | 'marketing' | 'management' | 'python';

export type UserRole = 'student' | 'teacher' | 'company' | 'admin';

export type SkillLevelName = 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';

export interface VirtualCompanyState {
  name: string;
  capital: number;
  revenue: number;
  expenses: number;
  netProfit: number;
  customers: number;
  reputation: number; // 0 to 100
  assets: number;
  liabilities: number;
  equity: number;
}

export interface LabProgress {
  labId: LabId;
  xp: number;
  completedScenarios: string[];
  quizzesPassed: number;
  certificateEarned: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  labId: LabId | 'general';
  iconName: string;
  requiredXp: number;
  tone: 'blue' | 'turquoise' | 'emerald' | 'amber';
}

export interface StudentSkillMetric {
  skillName: string;
  labId: LabId;
  score: number; // 0 - 100
  level: SkillLevelName;
}

export interface StudentTalent {
  id: string;
  username: string;
  fullName: string;
  initials: string;
  gradient: string;
  university: string;
  major: string;
  graduationYear: string;
  city: string;
  bio: string;
  educationDetails: string;
  githubOrPortfolio?: string;
  linkedinUrl?: string;
  isPublicToCompanies: boolean;
  streakDays: number;
  labXp: Record<LabId, number>;
  totalXp: number;
  earnedBadges: string[];
  topAchievements: string[];
}

export interface CompanyPartner {
  id: string;
  name: string;
  initials: string;
  gradient: string;
  industry: string;
  city: string;
  employeesRange: string;
  hiringFocus: string[];
}

export type CompanyMessageStatus = 'قيد الانتظار' | 'تم القبول والرد' | 'معتذر';

export interface CompanyMessage {
  id: string;
  companyName: string;
  companyInitials: string;
  companyGradient: string;
  senderRole: string;
  studentUsername: string;
  studentName: string;
  subject: string;
  message: string;
  offeredRoleType: string;
  sentAt: string;
  status: CompanyMessageStatus;
  studentReply?: string;
}

export interface UserSession {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  organizationOrUniversity: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
}

/* =========================================================
   PRACTICAL ASSIGNMENTS & AUTO-GRADING TYPES
   ========================================================= */

export type AssignmentDifficulty = 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';

export type SubmissionStatus =
  | 'لم يبدأ'
  | 'قيد الحل'
  | 'مُسلَّم'
  | 'مُصحَّح آلياً'
  | 'تمت المراجعة'
  | 'متأخر';

export interface AccountingJournalEntryLine {
  id: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  debitAmount: number;
  creditAmount: number;
}

export interface AccountingAssignmentConfig {
  operationsPrompt: string[];
  modelEntries: AccountingJournalEntryLine[];
  availableAccounts: string[];
}

export interface MarketingAssignmentConfig {
  scenarioContext: string;
  maxBudgetJod: number;
  minRoiPercent: number;
  maxCacJod: number;
  minCustomers: number;
  recommendedChannel?: 'search_seo' | 'social_ads' | 'influencers' | 'email_content';
}

export interface ManagementAssignmentConfig {
  mode: 'breakeven' | 'swot';
  baseFixedCosts: number;
  baseVariableCostPerUnit: number;
  baseSellingPricePerUnit: number;
  randomizePerStudent: boolean;
  tolerancePercent: number; // e.g. 5 means ±5% accepted
  swotMinItemsPerQuadrant: number;
  swotRequiredKeywords: string[];
}

export interface PythonTestCase {
  id: string;
  label: string;
  inputExpr: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
}

export interface PythonAssignmentConfig {
  functionName: string;
  starterCode: string;
  referenceSolution: string;
  timeoutMs: number;
  testCases: PythonTestCase[];
}

export interface LabAssignment {
  id: string;
  title: string;
  labId: LabId;
  instructions: string;
  difficulty: AssignmentDifficulty;
  maxScore: number;
  dueDate: string; // YYYY-MM-DD
  allowedAttempts: number;
  showModelAnswerAfterSubmit: boolean;
  targetClassId: string;
  targetStudentUsernames: string[]; // empty means entire class
  status: 'منشور' | 'مسودة';
  createdByTeacherId: string;
  createdByTeacherName: string;
  createdAt: string;
  accountingConfig?: AccountingAssignmentConfig;
  marketingConfig?: MarketingAssignmentConfig;
  managementConfig?: ManagementAssignmentConfig;
  pythonConfig?: PythonAssignmentConfig;
}

export interface AssignmentTemplate {
  id: string;
  title: string;
  labId: LabId;
  difficulty: AssignmentDifficulty;
  summary: string;
  instructions: string;
  maxScore: number;
  allowedAttempts: number;
  isCustom?: boolean;
  accountingConfig?: AccountingAssignmentConfig;
  marketingConfig?: MarketingAssignmentConfig;
  managementConfig?: ManagementAssignmentConfig;
  pythonConfig?: PythonAssignmentConfig;
}

export interface AutoGradeCriterionResult {
  criterion: string;
  passed: boolean;
  earnedPoints: number;
  maxPoints: number;
  explanation: string;
  errorTag?: string;
}

export interface AutoGradeReport {
  autoScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  summaryFeedback: string;
  criteriaBreakdown: AutoGradeCriterionResult[];
  detectedErrorTags: string[];
}

export interface StudentSubmissionPayload {
  accountingEntries?: AccountingJournalEntryLine[];
  marketingSolution?: {
    channelId: 'search_seo' | 'social_ads' | 'influencers' | 'email_content';
    productPrice: number;
    adBudget: number;
  };
  managementSolution?: {
    studentBreakEvenUnits: number;
    studentContributionMargin: number;
    assignedFixedCosts: number;
    assignedVariableCost: number;
    assignedPrice: number;
    swotCounts?: {
      strengths: number;
      weaknesses: number;
      opportunities: number;
      threats: number;
    };
    swotNotes?: string;
  };
  pythonSolution?: {
    code: string;
    stdout: string;
  };
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  labId: LabId;
  classId: string;
  studentUsername: string;
  studentName: string;
  university: string;
  status: SubmissionStatus;
  attemptsUsed: number;
  timeSpentMinutes: number;
  submittedAt?: string;
  autoGrade: AutoGradeReport | null;
  manualScoreOverride?: number;
  teacherFeedback?: string;
  reviewedAt?: string;
  payload: StudentSubmissionPayload;
}

export interface ClassSection {
  id: string;
  courseName: string;
  courseCode: string;
  semester: string;
  university: string;
  joinCode: string;
  teacherId: string;
  teacherName: string;
  studentUsernames: string[];
  createdAt: string;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all' | 'students' | 'teachers' | 'companies' | string; // or classId
  authorName: string;
  authorRole: UserRole;
  scheduledAt: string;
  active: boolean;
}

export interface ApprovalRequestItem {
  id: string;
  applicantName: string;
  applicantEmail: string;
  role: 'teacher' | 'company';
  organizationOrUniversity: string;
  departmentOrCommercialReg: string;
  submittedAt: string;
  status: 'قيد المراجعة' | 'مقبول' | 'مرفوض';
  rejectionReason?: string;
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: UserRole;
  actionType:
    | 'تسجيل دخول'
    | 'تغيير دور'
    | 'حذف مستخدم'
    | 'تعليق حساب'
    | 'موافقة طلب'
    | 'رفض طلب'
    | 'إنشاء واجب'
    | 'تحديث إعدادات';
  targetLabel: string;
  timestamp: string;
  ipAddress: string;
}
