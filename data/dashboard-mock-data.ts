import { LabId } from '@/types';

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  href: string;
}

export interface OnboardingChecklistItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  completed: boolean;
}

export type OnboardingStep = OnboardingChecklistItem;

export interface StudentActivityRow {
  id: string;
  title: string;
  labName: string;
  labId: LabId;
  xpEarned: number;
  scorePct: number;
  completedAt: string;
  status: 'مكتمل' | 'قيد المراجعة';
}

export interface StudentProjectItem {
  id: string;
  title: string;
  labName: string;
  summary: string;
  metricsText: string;
  date: string;
  link: string;
}

export interface StudentCertificateItem {
  id: string;
  labId: LabId;
  title: string;
  issueDate: string;
  verificationCode: string;
  gradePct: number;
  skillsCovered: string[];
}

export interface ShortlistCandidateEntry {
  username: string;
  folderId: string;
  addedAt: string;
  note: string;
  stage: 'تقييم أولي' | 'مقابلة تقنية' | 'عرض مبدئي';
}

export interface ShortlistFolder {
  id: string;
  name: string;
  description: string;
}

export interface SavedTalentSearch {
  id: string;
  name: string;
  labFilter: LabId | 'all';
  minLevel: string;
  minXp: number;
  university: string;
  city: string;
}

export interface CompanyMessageTemplate {
  id: string;
  title: string;
  roleType: string;
  subject: string;
  body: string;
}

export interface CompanyTeamMember {
  id: string;
  name: string;
  email: string;
  role: 'مدير الحساب' | 'مسؤول توظيف' | 'مراجع تقني';
  department: string;
  status: 'نشط' | 'دعوة معلقة';
  joinedAt: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amountJod: number;
  planName: string;
  status: 'مدفوعة' | 'قيد المعالجة';
}

export interface CompanyProfileData {
  companyName: string;
  legalName: string;
  industry: string;
  city: string;
  country: string;
  website: string;
  employeesCount: string;
  foundedYear: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  isVerified: boolean;
  commercialRegNumber: string;
}

// ==========================================
// 1. STUDENT DASHBOARD MOCK DATA
// ==========================================

export const INITIAL_STUDENT_CHECKLIST: OnboardingChecklistItem[] = [
  {
    id: 'step-edu',
    title: 'أكمل بياناتك التعليمية والجامعية',
    description: 'حدد الجامعة والتخصص وسنة التخرج المتوقعة لتظهر في ملفك.',
    actionLabel: 'تحديث التعليم',
    href: '/student/profile',
    completed: true,
  },
  {
    id: 'step-lab',
    title: 'أنهِ أول تمرين عملي في المختبرات',
    description: 'أكمل سيناريو محاسبي أو تسويقي لتوثيق أول نقاط خبرة لك.',
    actionLabel: 'دخول المختبرات',
    href: '/labs/accounting',
    completed: true,
  },
  {
    id: 'step-public',
    title: 'افتح بروفايلك المهني للشركات',
    description: 'اسمح لفرق التوظيف باستعراض نتائجك وإرسال عروض المقابلات.',
    actionLabel: 'إعدادات الظهور',
    href: '/student/profile',
    completed: false,
  },
  {
    id: 'step-links',
    title: 'أضف روابط حساباتك المهنية ومشاريعك',
    description: 'اربط حساب GitHub أو LinkedIn وأضف مشروعاً تطبيقياً واحداً.',
    actionLabel: 'إضافة الروابط',
    href: '/student/profile',
    completed: false,
  },
];

export const STUDENT_WEEKLY_ACTIVITY = [
  { day: 'السبت', xp: 120, exercises: 2 },
  { day: 'الأحد', xp: 180, exercises: 3 },
  { day: 'الاثنين', xp: 90, exercises: 1 },
  { day: 'الثلاثاء', xp: 240, exercises: 4 },
  { day: 'الأربعاء', xp: 160, exercises: 2 },
  { day: 'الخميس', xp: 290, exercises: 5 },
  { day: 'الجمعة', xp: 210, exercises: 3 },
];

export const STUDENT_XP_HISTORY = [
  { month: 'يونيو', accounting: 120, marketing: 80, management: 90, python: 140, total: 430 },
  { month: 'يوليو', accounting: 210, marketing: 140, management: 160, python: 220, total: 730 },
  { month: 'أغسطس', accounting: 290, marketing: 210, management: 230, python: 310, total: 1040 },
  { month: 'سبتمبر', accounting: 360, marketing: 260, management: 310, python: 390, total: 1320 },
  { month: 'أكتوبر', accounting: 410, marketing: 300, management: 350, python: 440, total: 1500 },
  { month: 'نوفمبر', accounting: 460, marketing: 340, management: 390, python: 490, total: 1680 },
];

export const STUDENT_RECENT_ACTIVITIES: StudentActivityRow[] = [
  {
    id: 'act-1',
    title: 'تحليل إيرادات الفروع وأتمتة التقرير المالي بلغة Python',
    labName: 'مختبر البرمجة (Python)',
    labId: 'python',
    xpEarned: 110,
    scorePct: 98,
    completedAt: '2026-11-11',
    status: 'مكتمل',
  },
  {
    id: 'act-2',
    title: 'مطابقة معادلة الميزانية العمومية بعد شراء معدات بالأجل',
    labName: 'مختبر المحاسبة المالية',
    labId: 'accounting',
    xpEarned: 80,
    scorePct: 95,
    completedAt: '2026-11-10',
    status: 'مكتمل',
  },
  {
    id: 'act-3',
    title: 'حساب نقطة التعادل (Break-Even) لمنتج اشتراكات سحابي',
    labName: 'مختبر إدارة الأعمال',
    labId: 'management',
    xpEarned: 90,
    scorePct: 91,
    completedAt: '2026-11-08',
    status: 'مكتمل',
  },
  {
    id: 'act-4',
    title: 'ضبط تكلفة الاستحواذ (CAC) وحملة محركات البحث SEO',
    labName: 'مختبر التسويق الرقمي',
    labId: 'marketing',
    xpEarned: 85,
    scorePct: 88,
    completedAt: '2026-11-06',
    status: 'مكتمل',
  },
  {
    id: 'act-5',
    title: 'إعداد مصفوفة SWOT الرباعية لشركة تدريبك الافتراضية',
    labName: 'مختبر إدارة الأعمال',
    labId: 'management',
    xpEarned: 70,
    scorePct: 94,
    completedAt: '2026-11-04',
    status: 'مكتمل',
  },
  {
    id: 'act-6',
    title: 'تسجيل قيود الرواتب الشهرية ومصاريف التشغيل الإدارية',
    labName: 'مختبر المحاسبة المالية',
    labId: 'accounting',
    xpEarned: 75,
    scorePct: 92,
    completedAt: '2026-11-02',
    status: 'مكتمل',
  },
];

export const INITIAL_STUDENT_PROJECTS: StudentProjectItem[] = [
  {
    id: 'proj-1',
    title: 'محرك أتمتة التقارير المالية الشهرية بـ Python',
    labName: 'مختبر البرمجة للأعمال (Python)',
    summary: 'بناء سكربت يقوم بفرز فواتير المبيعات وحساب صافي الربح والضرائب تلقائياً مع تصدير ملخص تنفيذي.',
    metricsText: 'دقة 98% · تقليص وقت المراجعة بنسبة 70%',
    date: 'نوفمبر 2026',
    link: 'https://github.com/yazan-nabulsi/fintech-ledger-automation',
  },
  {
    id: 'proj-2',
    title: 'نموذج توازن الميزانية والتدفقات النقدية لشركة ناشئة',
    labName: 'مختبر المحاسبة المالية',
    summary: 'إغلاق 7 سيناريوهات محاسبية متتالية دون أي اختلال في معادلة الأصول والالتزامات وحقوق الملكية.',
    metricsText: 'توازن 100% · 460 نقطة خبرة موثقة',
    date: 'أكتوبر 2026',
    link: 'https://github.com/yazan-nabulsi/startup-balance-sheet',
  },
];

export const INITIAL_STUDENT_CERTIFICATES: StudentCertificateItem[] = [
  {
    id: 'cert-python',
    labId: 'python',
    title: 'شهادة إتمام مختبر البرمجة للأعمال وتحليل البيانات (Python)',
    issueDate: '2026-11-05',
    verificationCode: 'TDR-PY-2026-8841',
    gradePct: 98,
    skillsCovered: ['هياكل البيانات', 'أتمتة التقارير المالية', 'تحليل المبيعات البرمجي'],
  },
  {
    id: 'cert-accounting',
    labId: 'accounting',
    title: 'شهادة إتمام مختبر المحاسبة المالية والدورة المحاسبية',
    issueDate: '2026-10-22',
    verificationCode: 'TDR-ACC-2026-5190',
    gradePct: 94,
    skillsCovered: ['معادلة الميزانية', 'قيود اليومية المزدوجة', 'القوائم المالية'],
  },
];

export const INITIAL_STUDENT_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: 's-notif-1',
    title: 'رسالة توظيف جديدة من شركة تقنية المستقبل',
    description: 'أرسلت سارة الخطيب دعوة لمقابلة عمل لوظيفة محلل نظم وتقنية مالية.',
    timeAgo: 'منذ ساعتين',
    read: false,
    href: '/student/messages',
  },
  {
    id: 's-notif-2',
    title: 'استعراض بروفايلك المهني من 3 شركات',
    description: 'شاهدت فرق التوظيف في عمّان والرياض مخطط مهاراتك في مختبر Python.',
    timeAgo: 'منذ 5 ساعات',
    read: false,
    href: '/student/profile',
  },
  {
    id: 's-notif-3',
    title: 'اجتزت مستوى الخبير في مختبر البرمجة',
    description: 'وصل رصيدك في مختبر Python إلى 490 XP وتصدرت الترتيب العام.',
    timeAgo: 'أمس',
    read: true,
    href: '/student/progress',
  },
  {
    id: 's-notif-4',
    title: 'توصية باستكمال مختبر التسويق الرقمي',
    description: 'يتبقى لك 60 XP فقط للوصول إلى المستوى المتقدم في التسويق.',
    timeAgo: 'منذ يومين',
    read: true,
    href: '/labs/marketing',
  },
  {
    id: 's-notif-5',
    title: 'تم إصدار شهادتك الرقمية الموثقة',
    description: 'شهادة مختبر المحاسبة المالية جاهزة للتنزيل والمشاركة.',
    timeAgo: 'منذ 3 أيام',
    read: true,
    href: '/student/achievements',
  },
];

// ==========================================
// 2. COMPANY DASHBOARD MOCK DATA
// ==========================================

export const INITIAL_COMPANY_CHECKLIST: OnboardingChecklistItem[] = [
  {
    id: 'c-step-profile',
    title: 'أكمل ملف الشركة التعريفي',
    description: 'أضف نبذة عن بيئة العمل وقطاعات التوظيف المستهدفة.',
    actionLabel: 'تعديل ملف الشركة',
    href: '/company/profile',
    completed: true,
  },
  {
    id: 'c-step-verify',
    title: 'وثّق حساب الشركة الرسمي (Verification)',
    description: 'أدخل رقم السجل التجاري لتفعيل شارة الشركة الموثقة لدى الطلاب.',
    actionLabel: 'توثيق الحساب',
    href: '/company/profile',
    completed: false,
  },
  {
    id: 'c-step-search',
    title: 'ابحث عن أول موهبة واحفظ الفلتر',
    description: 'استخدم فلاتر المهارات والجامعات للوصول إلى المرشحين الأعلى أداءً.',
    actionLabel: 'البحث عن المواهب',
    href: '/company/talent',
    completed: true,
  },
  {
    id: 'c-step-msg',
    title: 'أرسل أول دعوة مقابلة لطالب متميز',
    description: 'تواصل مباشرة مع المرشحين عبر قوالب الرسائل الاحترافية.',
    actionLabel: 'إرسال رسالة',
    href: '/company/messages',
    completed: false,
  },
];

export const COMPANY_FUNNEL_DATA = [
  { stage: 'مشاهدة البروفايل', count: 148, conversionPct: 100 },
  { stage: 'القائمة المختصرة', count: 42, conversionPct: 28 },
  { stage: 'دعوات مرسلة', count: 19, conversionPct: 13 },
  { stage: 'ردود وقبول مقابلة', count: 14, conversionPct: 9.5 },
];

export const COMPANY_SEARCHED_SKILLS = [
  { skill: 'برمجة Python للأعمال', searches: 86 },
  { skill: 'المحاسبة والميزانية', searches: 74 },
  { skill: 'تحليل نقطة التعادل', searches: 58 },
  { skill: 'إدارة حملات النمو', searches: 49 },
  { skill: 'التحليل المالي الرقمي', searches: 41 },
];

export const COMPANY_MONTHLY_ACTIVITY = [
  { month: 'يونيو', views: 65, shortlisted: 14, messages: 6, replies: 4 },
  { month: 'يوليو', views: 82, shortlisted: 19, messages: 9, replies: 7 },
  { month: 'أغسطس', views: 96, shortlisted: 24, messages: 11, replies: 8 },
  { month: 'سبتمبر', views: 115, shortlisted: 31, messages: 15, replies: 11 },
  { month: 'أكتوبر', views: 132, shortlisted: 36, messages: 17, replies: 13 },
  { month: 'نوفمبر', views: 148, shortlisted: 42, messages: 19, replies: 14 },
];

export const INITIAL_SHORTLIST_FOLDERS: ShortlistFolder[] = [
  {
    id: 'folder-fintech',
    name: 'مرشحو التقنية المالية و Python',
    description: 'الطلاب المتفوقون في مختبري البرمجة والمحاسبة المالية',
  },
  {
    id: 'folder-accounting',
    name: 'محاسبو الامتثال والميزانية',
    description: 'المرشحون ذوو الدقة العالية في الدورة المحاسبية',
  },
  {
    id: 'folder-growth',
    name: 'فريق النمو وإدارة الأعمال',
    description: 'الطلاب المتميزون في تحليل العائد على الاستثمار والتعادل',
  },
];

export const INITIAL_SHORTLIST_CANDIDATES: ShortlistCandidateEntry[] = [
  {
    username: 'yazan-nabulsi',
    folderId: 'folder-fintech',
    addedAt: '2026-11-10',
    note: 'أداء استثنائي في أتمتة التقارير المالية بـ Python (98%). مرشح أول لمقابلة الأسبوع القادم.',
    stage: 'مقابلة تقنية',
  },
  {
    username: 'dana-haddad',
    folderId: 'folder-fintech',
    addedAt: '2026-11-09',
    note: 'قوية جداً في هياكل البيانات وتحليل المبيعات البرمجي.',
    stage: 'تقييم أولي',
  },
  {
    username: 'razan-abdallat',
    folderId: 'folder-accounting',
    addedAt: '2026-11-08',
    note: 'المركز الأول في مختبر المحاسبة المالية برصيد 520 XP.',
    stage: 'عرض مبدئي',
  },
  {
    username: 'hamza-zoubi',
    folderId: 'folder-accounting',
    addedAt: '2026-11-06',
    note: 'سجل نظيف في مطابقة قيود اليومية والميزانية العمومية.',
    stage: 'تقييم أولي',
  },
  {
    username: 'omar-khasawneh',
    folderId: 'folder-growth',
    addedAt: '2026-11-05',
    note: 'مهارات ممتازة في حساب نقطة التعادل وإدارة العمليات.',
    stage: 'مقابلة تقنية',
  },
  {
    username: 'leen-abughazaleh',
    folderId: 'folder-growth',
    addedAt: '2026-11-03',
    note: 'الأعلى أداءً في مختبر التسويق الرقمي وتحسين CAC.',
    stage: 'تقييم أولي',
  },
];

export const INITIAL_SAVED_SEARCHES: SavedTalentSearch[] = [
  {
    id: 'sv-1',
    name: 'مهندسو Python والبيانات — عمّان',
    labFilter: 'python',
    minLevel: 'خبير',
    minXp: 1200,
    university: 'all',
    city: 'عمّان',
  },
  {
    id: 'sv-2',
    name: 'محاسبون ماليون — خريجو 2026',
    labFilter: 'accounting',
    minLevel: 'متقدم',
    minXp: 1100,
    university: 'all',
    city: 'all',
  },
];

export const INITIAL_MESSAGE_TEMPLATES: CompanyMessageTemplate[] = [
  {
    id: 'tpl-1',
    title: 'دعوة لمقابلة تقنية (دوام كامل)',
    roleType: 'وظيفة دوام كامل لحديثي التخرج',
    subject: 'دعوة لمقابلة تقنية — فريق التقنية المالية في شركة تقنية المستقبل',
    body: 'مرحباً، اطلعنا على نتائجك الموثقة في مختبرات تدريبك ونود دعوتك لمقابلة تقنية قصيرة لمناقشة انضمامك لفريقنا.',
  },
  {
    id: 'tpl-2',
    title: 'عرض برنامج تدريب تعاوني مدفوع',
    roleType: 'برنامج تدريب تعاوني مدفوع',
    subject: 'فرصة انضمام لبرنامج التدريب التعاوني المكثف',
    body: 'أهلاً بك، لفت انتباهنا تقدمك المستمر في مختبرات المحاكاة ويسعدنا ترشيحك لبرنامج التدريب التعاوني المدفوع لدينا.',
  },
  {
    id: 'tpl-3',
    title: 'استفسار عن مشروع تطبيقي في البروفايل',
    roleType: 'مشروع تجريبي مدفوع',
    subject: 'استفسار حول مشاريعك العملية على منصة تدريبك',
    body: 'تحية طيبة، أعجبنا أداؤك في حل سيناريوهات الشركة الافتراضية ونرغب في الترتيب لمكالمة تعارف سريعة.',
  },
];

export const INITIAL_COMPANY_PROFILE: CompanyProfileData = {
  companyName: 'شركة تقنية المستقبل',
  legalName: 'شركة تقنية المستقبل للحلول المالية الرقمية ذ.م.م',
  industry: 'التقنية المالية والبرمجيات السحابية (FinTech & SaaS)',
  city: 'عمّان',
  country: 'الأردن',
  website: 'https://futuretech.jo',
  employeesCount: '50 - 200 موظف',
  foundedYear: '2019',
  description:
    'نبني أنظمة مدفوعات ومحاسبة سحابية للمؤسسات المتوسطة والكبيرة في الشرق الأوسط، ونعتمد على استقطاب الخريجين المتميزين بناءً على الأداء العملي الموثق.',
  contactEmail: 'talent@futuretech.jo',
  contactPhone: '+962 6 580 1200',
  isVerified: true,
  commercialRegNumber: 'JO-AMM-2019-94821',
};

export const INITIAL_TEAM_MEMBERS: CompanyTeamMember[] = [
  {
    id: 'tm-1',
    name: 'سارة الخطيب',
    email: 'sara.khatib@futuretech.jo',
    role: 'مدير الحساب',
    department: 'استقطاب المواهب والموارد البشرية',
    status: 'نشط',
    joinedAt: '2026-01-15',
  },
  {
    id: 'tm-2',
    name: 'مهند العلي',
    email: 'mohanad.ali@futuretech.jo',
    role: 'مراجع تقني',
    department: 'هندسة البرمجيات والبيانات',
    status: 'نشط',
    joinedAt: '2026-03-10',
  },
  {
    id: 'tm-3',
    name: 'ديما المجالي',
    email: 'dima.majali@futuretech.jo',
    role: 'مسؤول توظيف',
    department: 'التوظيف الجامعي',
    status: 'نشط',
    joinedAt: '2026-06-22',
  },
];

export const BILLING_PLANS = [
  {
    id: 'plan-starter',
    name: 'باقة الشركات الناشئة (Starter)',
    audience: 'للشركات الصغيرة التي توظف 1 إلى 5 خريجين سنوياً',
    priceJod: 0,
    period: 'مجاناً للأبد',
    features: [
      'استعراض جدول المواهب العام حتى 25 بروفايل شهرياً',
      'قائمة مختصرة واحدة (حتى 10 مرشحين)',
      '5 دعوات تواصل مباشرة شهرياً',
      'مقعد مستخدم واحد للفريق',
    ],
  },
  {
    id: 'plan-growth',
    name: 'باقة النمو والتوظيف النشط (Growth)',
    audience: 'لفرق التوظيف في الشركات المتوسطة والنامية',
    priceJod: 79,
    period: 'شهرياً (تُفوتر سنوياً أو شهرياً)',
    features: [
      'وصول غير محدود لجميع البروفايلات ومخططات المهارات',
      'قوائم مختصرة غير محدودة مع تصدير CSV وملاحظات خاصة',
      '50 دعوة مقابلة مباشرة شهرياً مع قوالب مخصصة',
      'حتى 5 مقاعد لأعضاء فريق التوظيف والمراجعين التقنيين',
    ],
  },
  {
    id: 'plan-enterprise',
    name: 'باقة المؤسسات الكبرى (Enterprise)',
    audience: 'للبنوك وشركات التقنية الكبرى وبرامج الخريجين',
    priceJod: 199,
    period: 'شهرياً',
    features: [
      'دعوات تواصل غير محدودة وتقارير أداء تفصيلية قابلة للتصدير',
      'مقاعد غير محدودة للفريق مع صلاحيات مخصصة',
      'ربط مباشر مع أنظمة تتبع المتقدمين (ATS API)',
      'مدير حساب مخصص لبرامج استقطاب الخريجين',
    ],
  },
];

export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-2026-11',
    invoiceNumber: 'INV-2026-1104',
    date: '2026-11-01',
    amountJod: 79,
    planName: 'باقة النمو والتوظيف النشط (Growth)',
    status: 'مدفوعة',
  },
  {
    id: 'inv-2026-10',
    invoiceNumber: 'INV-2026-1004',
    date: '2026-10-01',
    amountJod: 79,
    planName: 'باقة النمو والتوظيف النشط (Growth)',
    status: 'مدفوعة',
  },
  {
    id: 'inv-2026-09',
    invoiceNumber: 'INV-2026-0904',
    date: '2026-09-01',
    amountJod: 79,
    planName: 'باقة النمو والتوظيف النشط (Growth)',
    status: 'مدفوعة',
  },
];

export const INITIAL_COMPANY_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: 'c-notif-1',
    title: 'رد جديد من المرشح يزن النابلسي',
    description: 'قبل يزن النابلسي دعوة المقابلة التقنية واقترح موعدين هذا الأسبوع.',
    timeAgo: 'منذ ساعة',
    read: false,
    href: '/company/messages',
  },
  {
    id: 'c-notif-2',
    title: '3 مرشحين جدد طابقوا بحثك المحفوظ',
    description: 'انضم 3 طلاب لمستوى الخبير في فلتر "مهندسو Python والبيانات — عمّان".',
    timeAgo: 'منذ 4 ساعات',
    read: false,
    href: '/company/talent',
  },
  {
    id: 'c-notif-3',
    title: 'تحديث تقرير استقطاب المواهب لشهر نوفمبر',
    description: 'ارتفعت نسبة الردود على رسائل شركتك إلى 73.6% هذا الشهر.',
    timeAgo: 'أمس',
    read: true,
    href: '/company/reports',
  },
  {
    id: 'c-notif-4',
    title: 'تمت إضافة مرشح إلى قائمة التقنية المالية',
    description: 'أضاف مهند العلي المرشحة دانا حداد إلى القائمة المختصرة.',
    timeAgo: 'منذ يومين',
    read: true,
    href: '/company/shortlist',
  },
  {
    id: 'c-notif-5',
    title: 'صدور فاتورة اشتراك شهر نوفمبر',
    description: 'تم سداد الفاتورة رقم INV-2026-1104 بقيمة 79 د.أ بنجاح.',
    timeAgo: 'منذ 5 أيام',
    read: true,
    href: '/company/billing',
  },
];
