import {
  ApprovalRequestItem,
  AssignmentSubmission,
  AssignmentTemplate,
  AuditLogEntry,
  ClassSection,
  LabAssignment,
  PlatformAnnouncement,
  UserRole,
} from '@/types';
import { OnboardingStep, DashboardNotification } from './dashboard-mock-data';

/* =========================================================
   1. TEACHER ONBOARDING & NOTIFICATIONS
   ========================================================= */
export const INITIAL_TEACHER_CHECKLIST: OnboardingStep[] = [
  {
    id: 't-step-class',
    title: 'أنشئ شعبتك الجامعية الأولى',
    description: 'حدد اسم المساق والفصل الدراسي لتوليد كود انضمام فريد لطلابك.',
    href: '/teacher/classes',
    actionLabel: 'إدارة الشعب',
    completed: true,
  },
  {
    id: 't-step-students',
    title: 'أضف طلاباً أو شارك كود الانضمام',
    description: 'انسخ كود الشعبة أو رابط الدعوة المباشر لانضمام الطلاب.',
    href: '/teacher/classes',
    actionLabel: 'عرض كود الشعبة',
    completed: true,
  },
  {
    id: 't-step-assign',
    title: 'أنشئ أول واجب عملي مرتبط بمختبر',
    description: 'اختر من مكتبة القوالب الجاهزة أو صمم مهمة بمعايير تصحيح آلي.',
    href: '/teacher/assignments/new',
    actionLabel: 'إنشاء واجب جديد',
    completed: false,
  },
  {
    id: 't-step-review',
    title: 'راجع تسليمات الطلاب واعتمد العلامات',
    description: 'افحص خطوات الحل والتصحيح التلقائي وأضف ملاحظاتك الأكاديمية.',
    href: '/teacher/assignments/asg-acc-1',
    actionLabel: 'مراجعة التسليمات',
    completed: false,
  },
];

export const INITIAL_TEACHER_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: 't-notif-1',
    title: 'تسليم جديد: يزن النابلسي',
    description: 'أكمل واجب تسوية قيود الرواتب والمصاريف المستحقة وحصل على 92/100 آلياً.',
    timeAgo: 'منذ 15 دقيقة',
    read: false,
    href: '/teacher/assignments/asg-acc-1',
  },
  {
    id: 't-notif-2',
    title: 'تنبيه تعثر مبكر في شعبة المحاسبة',
    description: 'طالبان استنفدا محاولتين في واجب توازن الميزانية مع خطأ قيد دائن مقلوب.',
    timeAgo: 'منذ ساعتين',
    read: false,
    href: '/teacher/analytics',
  },
  {
    id: 't-notif-3',
    title: 'انضمام 3 طلاب جدد للشعبة',
    description: 'انضم طارق المجالي ودانا حداد إلى شعبة برمجة الأعمال (JU-PY-102).',
    timeAgo: 'أمس',
    read: true,
    href: '/teacher/classes',
  },
];

/* =========================================================
   2. CLASSES (الشعب الجامعية)
   ========================================================= */
export const INITIAL_CLASSES: ClassSection[] = [
  {
    id: 'cls-ju-acc-101',
    courseName: 'مبادئ المحاسبة المالية وتطبيقاتها',
    courseCode: 'ACC-101',
    semester: 'الفصل الأول 2026/2027',
    university: 'الجامعة الأردنية',
    joinCode: 'JU-ACC-27',
    teacherId: 'usr-teacher-1',
    teacherName: 'د. أحمد خليل العساف',
    studentUsernames: [
      'yazan-nabulsi',
      'razan-abdallat',
      'tariq-majali',
      'hamza-zoubi',
      'khaled-momani',
    ],
    createdAt: '2026-09-15',
  },
  {
    id: 'cls-ju-py-204',
    courseName: 'برمجة الأعمال وتحليل البيانات بـ Python',
    courseCode: 'MIS-204',
    semester: 'الفصل الأول 2026/2027',
    university: 'الجامعة الأردنية',
    joinCode: 'JU-PY-204',
    teacherId: 'usr-teacher-1',
    teacherName: 'د. أحمد خليل العساف',
    studentUsernames: [
      'yazan-nabulsi',
      'omar-khasawneh',
      'dana-haddad',
      'sara-otaibi',
    ],
    createdAt: '2026-09-18',
  },
  {
    id: 'cls-psut-mkt-301',
    courseName: 'التسويق الرقمي واقتصاديات الوحدة',
    courseCode: 'MKT-301',
    semester: 'الفصل الأول 2026/2027',
    university: 'جامعة الأميرة سمية للتكنولوجيا',
    joinCode: 'PSUT-MKT-31',
    teacherId: 'usr-teacher-1',
    teacherName: 'د. أحمد خليل العساف',
    studentUsernames: [
      'yazan-nabulsi',
      'leen-abughazaleh',
      'razan-abdallat',
      'dana-haddad',
    ],
    createdAt: '2026-09-22',
  },
];

/* =========================================================
   3. ACTIVE LAB ASSIGNMENTS (الواجبات العملية المنشورة)
   ========================================================= */
export const INITIAL_ASSIGNMENTS: LabAssignment[] = [
  {
    id: 'asg-acc-1',
    title: 'واجب عملي 1: تسجيل قيود التأسيس وشراء المعدات بالأجل',
    labId: 'accounting',
    instructions:
      'قم بتسجيل القيدين الماليين التاليين في دفتر اليومية العام للشركة الافتراضية، مع التأكد من مطابقة الحسابات المدينة والدائنة وتوازن المعادلة المحاسبية بالكامل.',
    difficulty: 'متوسط',
    maxScore: 100,
    dueDate: '2026-11-22',
    allowedAttempts: 3,
    showModelAnswerAfterSubmit: true,
    targetClassId: 'cls-ju-acc-101',
    targetStudentUsernames: [],
    status: 'منشور',
    createdByTeacherId: 'usr-teacher-1',
    createdByTeacherName: 'د. أحمد خليل العساف',
    createdAt: '2026-11-01',
    accountingConfig: {
      operationsPrompt: [
        'العملية (1): إيداع رأس مال نقدي إضافي في البنك بقيمة 10,000 دينار أردني.',
        'العملية (2): شراء أجهزة حاسوب ومعدات مكتبية بقيمة 3,500 دينار نقداً من الحساب البنكي.',
      ],
      availableAccounts: [
        'النقدية والبنك',
        'رأس المال المساهم',
        'المعدات والأجهزة المكتبية',
        'الذمم الدائنة (الموردون)',
        'إيرادات المبيعات',
        'مصروف الإيجار',
      ],
      modelEntries: [
        {
          id: 'mod-1',
          description: 'إيداع رأس مال نقدي إضافي',
          debitAccount: 'النقدية والبنك',
          creditAccount: 'رأس المال المساهم',
          debitAmount: 10000,
          creditAmount: 10000,
        },
        {
          id: 'mod-2',
          description: 'شراء معدات وأجهزة مكتبية نقداً',
          debitAccount: 'المعدات والأجهزة المكتبية',
          creditAccount: 'النقدية والبنك',
          debitAmount: 3500,
          creditAmount: 3500,
        },
      ],
    },
  },
  {
    id: 'asg-py-1',
    title: 'واجب عملي 2: برمجة دالة حساب صافي الربح بعد الضريبة',
    labId: 'python',
    instructions:
      'اكتب دالة Python باسم calculate_net_profit(revenue, expenses, tax_rate=0.15) تحسب صافي الربح بعد خصم المصاريف والضريبة (تُفرض الضريبة فقط إذا كان الربح قبل الضريبة موجباً)، مع تقريب النتيجة لمنزلتين عشريتين.',
    difficulty: 'متقدم',
    maxScore: 100,
    dueDate: '2026-11-25',
    allowedAttempts: 4,
    showModelAnswerAfterSubmit: false,
    targetClassId: 'cls-ju-py-204',
    targetStudentUsernames: [],
    status: 'منشور',
    createdByTeacherId: 'usr-teacher-1',
    createdByTeacherName: 'د. أحمد خليل العساف',
    createdAt: '2026-11-03',
    pythonConfig: {
      functionName: 'calculate_net_profit',
      starterCode: `def calculate_net_profit(revenue, expenses, tax_rate=0.15):\n    # احسب الربح التشغيلي ثم اخصم الضريبة إن وجد ربح موجب\n    gross = revenue - expenses\n    if gross <= 0:\n        return round(gross, 2)\n    return round(gross * (1 - tax_rate), 2)\n`,
      referenceSolution: `def calculate_net_profit(revenue, expenses, tax_rate=0.15):\n    gross = revenue - expenses\n    if gross <= 0:\n        return round(gross, 2)\n    return round(gross * (1 - tax_rate), 2)`,
      timeoutMs: 3500,
      testCases: [
        {
          id: 'tc-py-1',
          label: 'ربح تشغيلي موجب مع ضريبة 15%',
          inputExpr: 'calculate_net_profit(10000, 6000, 0.15)',
          expectedOutput: '3400.0',
          isHidden: false,
          weight: 35,
        },
        {
          id: 'tc-py-2',
          label: 'حالة خسارة (لا تفرض ضريبة إضافية)',
          inputExpr: 'calculate_net_profit(4000, 5200, 0.15)',
          expectedOutput: '-1200',
          isHidden: false,
          weight: 35,
        },
        {
          id: 'tc-py-3',
          label: 'اختبار الكسور العشرية الدقيقة',
          inputExpr: 'calculate_net_profit(7550.5, 2120.25, 0.12)',
          expectedOutput: '4778.62',
          isHidden: true,
          weight: 30,
        },
      ],
    },
  },
  {
    id: 'asg-mkt-1',
    title: 'واجب عملي 3: تحسين حملة الاستحواذ الرقمي تحت سقف ميزانية 1,400 دينار',
    labId: 'marketing',
    instructions:
      'اضبط قناة التسويق وسعر الاشتراك الشهري والميزانية الإعلانية في مختبر التسويق لتحقيق عائد استثمار (ROI) لا يقل عن 140%، وتكلفة استحواذ عميل (CAC) أقل من 22 ديناراً، واستقطاب 45 عميلاً على الأقل.',
    difficulty: 'متوسط',
    maxScore: 100,
    dueDate: '2026-11-28',
    allowedAttempts: 3,
    showModelAnswerAfterSubmit: true,
    targetClassId: 'cls-psut-mkt-301',
    targetStudentUsernames: [],
    status: 'منشور',
    createdByTeacherId: 'usr-teacher-1',
    createdByTeacherName: 'د. أحمد خليل العساف',
    createdAt: '2026-11-05',
    marketingConfig: {
      scenarioContext: 'شركة SaaS ناشئة تطلق خطة اشتراك للأعمال الصغيرة في عمّان والرياض.',
      maxBudgetJod: 1400,
      minRoiPercent: 140,
      maxCacJod: 22,
      minCustomers: 45,
      recommendedChannel: 'search_seo',
    },
  },
  {
    id: 'asg-mgmt-1',
    title: 'واجب عملي 4: حساب نقطة التعادل التشغيلية بأرقام فردية مخصصة',
    labId: 'management',
    instructions:
      'يعرض لك النظام أرقاماً مالية مخصصة لحسابك (التكاليف الثابتة، التكلفة المتغيرة للوحدة، وسعر البيع). احسب هامش المساهمة للوحدة وعدد وحدات التعادل بدقة ضمن هامش خطأ مسموح ±5%.',
    difficulty: 'متقدم',
    maxScore: 100,
    dueDate: '2026-11-10',
    allowedAttempts: 2,
    showModelAnswerAfterSubmit: true,
    targetClassId: 'cls-ju-acc-101',
    targetStudentUsernames: [],
    status: 'منشور',
    createdByTeacherId: 'usr-teacher-1',
    createdByTeacherName: 'د. أحمد خليل العساف',
    createdAt: '2026-10-28',
    managementConfig: {
      mode: 'breakeven',
      baseFixedCosts: 15000,
      baseVariableCostPerUnit: 18,
      baseSellingPricePerUnit: 48,
      randomizePerStudent: true,
      tolerancePercent: 5,
      swotMinItemsPerQuadrant: 2,
      swotRequiredKeywords: ['تكلفة', 'توسع'],
    },
  },
];

/* =========================================================
   4. STUDENT SUBMISSIONS (تسليمات الطلاب)
   ========================================================= */
export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-acc-1',
    assignmentTitle: 'واجب عملي 1: تسجيل قيود التأسيس وشراء المعدات بالأجل',
    labId: 'accounting',
    classId: 'cls-ju-acc-101',
    studentUsername: 'yazan-nabulsi',
    studentName: 'يزن النابلسي',
    university: 'الجامعة الأردنية',
    status: 'تمت المراجعة',
    attemptsUsed: 1,
    timeSpentMinutes: 14,
    submittedAt: '2026-11-11',
    reviewedAt: '2026-11-12',
    manualScoreOverride: 100,
    teacherFeedback: 'قيود دقيقة ومتوازنة بالكامل من المحاولة الأولى. أحسنت يا يزن.',
    autoGrade: {
      autoScore: 100,
      maxScore: 100,
      percentage: 100,
      passed: true,
      summaryFeedback: 'أحسنت! قيود اليومية متوازنة وتوجيه الحسابات يحقق المعايير المحاسبية المطلوبة.',
      detectedErrorTags: [],
      criteriaBreakdown: [
        {
          criterion: 'توازن المعادلة المحاسبية ومجموع القيود',
          passed: true,
          earnedPoints: 20,
          maxPoints: 20,
          explanation: 'إجمالي المدين (13,500 JOD) يطابق إجمالي الدائن (13,500 JOD).',
        },
        {
          criterion: 'القيد #1: إيداع رأس مال نقدي إضافي',
          passed: true,
          earnedPoints: 40,
          maxPoints: 40,
          explanation: 'حساب المدين صحيح · حساب الدائن صحيح · المبلغ (10000 JOD) مطابق',
        },
        {
          criterion: 'القيد #2: شراء معدات وأجهزة مكتبية نقداً',
          passed: true,
          earnedPoints: 40,
          maxPoints: 40,
          explanation: 'حساب المدين صحيح · حساب الدائن صحيح · المبلغ (3500 JOD) مطابق',
        },
      ],
    },
    payload: {
      accountingEntries: [
        {
          id: 'mod-1',
          description: 'إيداع رأس مال نقدي إضافي',
          debitAccount: 'النقدية والبنك',
          creditAccount: 'رأس المال المساهم',
          debitAmount: 10000,
          creditAmount: 10000,
        },
        {
          id: 'mod-2',
          description: 'شراء معدات وأجهزة مكتبية نقداً',
          debitAccount: 'المعدات والأجهزة المكتبية',
          creditAccount: 'النقدية والبنك',
          debitAmount: 3500,
          creditAmount: 3500,
        },
      ],
    },
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-acc-1',
    assignmentTitle: 'واجب عملي 1: تسجيل قيود التأسيس وشراء المعدات بالأجل',
    labId: 'accounting',
    classId: 'cls-ju-acc-101',
    studentUsername: 'razan-abdallat',
    studentName: 'رزان العبداللات',
    university: 'جامعة الأميرة سمية للتكنولوجيا',
    status: 'مُصحَّح آلياً',
    attemptsUsed: 1,
    timeSpentMinutes: 18,
    submittedAt: '2026-11-11',
    autoGrade: {
      autoScore: 100,
      maxScore: 100,
      percentage: 100,
      passed: true,
      summaryFeedback: 'جميع قيود اليومية مطابقة ومتوازنة.',
      detectedErrorTags: [],
      criteriaBreakdown: [
        {
          criterion: 'توازن المعادلة المحاسبية ومجموع القيود',
          passed: true,
          earnedPoints: 20,
          maxPoints: 20,
          explanation: 'توازن تام بين الطرفين.',
        },
        {
          criterion: 'القيد #1: إيداع رأس مال نقدي إضافي',
          passed: true,
          earnedPoints: 40,
          maxPoints: 40,
          explanation: 'مطابق للنموذج.',
        },
        {
          criterion: 'القيد #2: شراء معدات وأجهزة مكتبية نقداً',
          passed: true,
          earnedPoints: 40,
          maxPoints: 40,
          explanation: 'مطابق للنموذج.',
        },
      ],
    },
    payload: {
      accountingEntries: [
        {
          id: 'mod-1',
          description: 'إيداع رأس مال نقدي إضافي',
          debitAccount: 'النقدية والبنك',
          creditAccount: 'رأس المال المساهم',
          debitAmount: 10000,
          creditAmount: 10000,
        },
        {
          id: 'mod-2',
          description: 'شراء معدات وأجهزة مكتبية نقداً',
          debitAccount: 'المعدات والأجهزة المكتبية',
          creditAccount: 'النقدية والبنك',
          debitAmount: 3500,
          creditAmount: 3500,
        },
      ],
    },
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-acc-1',
    assignmentTitle: 'واجب عملي 1: تسجيل قيود التأسيس وشراء المعدات بالأجل',
    labId: 'accounting',
    classId: 'cls-ju-acc-101',
    studentUsername: 'khaled-momani',
    studentName: 'خالد المومني',
    university: 'الجامعة الهاشمية',
    status: 'مُصحَّح آلياً',
    attemptsUsed: 2,
    timeSpentMinutes: 27,
    submittedAt: '2026-11-12',
    autoGrade: {
      autoScore: 52,
      maxScore: 100,
      percentage: 52,
      passed: false,
      summaryFeedback: 'القيد الثاني يحتوي على قلب بين الحساب المدين والدائن.',
      detectedErrorTags: ['قيد دائن مقلوب'],
      criteriaBreakdown: [
        {
          criterion: 'توازن المعادلة المحاسبية ومجموع القيود',
          passed: true,
          earnedPoints: 20,
          maxPoints: 20,
          explanation: 'المبالغ متساوية ولكن التوجيه معكوس في القيد الثاني.',
        },
        {
          criterion: 'القيد #1: إيداع رأس مال نقدي إضافي',
          passed: true,
          earnedPoints: 20,
          maxPoints: 40,
          explanation: 'توجيه الحسابات صحيح مع اختلاف جزئي في المبلغ.',
        },
        {
          criterion: 'القيد #2: شراء معدات وأجهزة مكتبية نقداً',
          passed: false,
          earnedPoints: 12,
          maxPoints: 40,
          explanation: 'تم قلب الطرف المدين مع الطرف الدائن · المبلغ (3500 JOD) مطابق',
          errorTag: 'قيد دائن مقلوب',
        },
      ],
    },
    payload: {
      accountingEntries: [
        {
          id: 'mod-1',
          description: 'إيداع رأس مال نقدي إضافي',
          debitAccount: 'النقدية والبنك',
          creditAccount: 'رأس المال المساهم',
          debitAmount: 10000,
          creditAmount: 10000,
        },
        {
          id: 'mod-2',
          description: 'شراء معدات وأجهزة مكتبية نقداً',
          debitAccount: 'النقدية والبنك',
          creditAccount: 'المعدات والأجهزة المكتبية',
          debitAmount: 3500,
          creditAmount: 3500,
        },
      ],
    },
  },
  {
    id: 'sub-4',
    assignmentId: 'asg-py-1',
    assignmentTitle: 'واجب عملي 2: برمجة دالة حساب صافي الربح بعد الضريبة',
    labId: 'python',
    classId: 'cls-ju-py-204',
    studentUsername: 'yazan-nabulsi',
    studentName: 'يزن النابلسي',
    university: 'الجامعة الأردنية',
    status: 'قيد الحل',
    attemptsUsed: 0,
    timeSpentMinutes: 6,
    autoGrade: null,
    payload: {
      pythonSolution: {
        code: `def calculate_net_profit(revenue, expenses, tax_rate=0.15):\n    gross = revenue - expenses\n    if gross <= 0:\n        return round(gross, 2)\n    return round(gross * (1 - tax_rate), 2)\n`,
        stdout: '',
      },
    },
  },
  {
    id: 'sub-5',
    assignmentId: 'asg-mkt-1',
    assignmentTitle: 'واجب عملي 3: تحسين حملة الاستحواذ الرقمي تحت سقف ميزانية 1,400 دينار',
    labId: 'marketing',
    classId: 'cls-psut-mkt-301',
    studentUsername: 'yazan-nabulsi',
    studentName: 'يزن النابلسي',
    university: 'الجامعة الأردنية',
    status: 'لم يبدأ',
    attemptsUsed: 0,
    timeSpentMinutes: 0,
    autoGrade: null,
    payload: {},
  },
  {
    id: 'sub-6',
    assignmentId: 'asg-mgmt-1',
    assignmentTitle: 'واجب عملي 4: حساب نقطة التعادل التشغيلية بأرقام فردية مخصصة',
    labId: 'management',
    classId: 'cls-ju-acc-101',
    studentUsername: 'yazan-nabulsi',
    studentName: 'يزن النابلسي',
    university: 'الجامعة الأردنية',
    status: 'متأخر',
    attemptsUsed: 0,
    timeSpentMinutes: 0,
    autoGrade: null,
    payload: {},
  },
  {
    id: 'sub-7',
    assignmentId: 'asg-py-1',
    assignmentTitle: 'واجب عملي 2: برمجة دالة حساب صافي الربح بعد الضريبة',
    labId: 'python',
    classId: 'cls-ju-py-204',
    studentUsername: 'omar-khasawneh',
    studentName: 'عمر الخصاونة',
    university: 'جامعة العلوم والتكنولوجيا الأردنية',
    status: 'مُصحَّح آلياً',
    attemptsUsed: 1,
    timeSpentMinutes: 21,
    submittedAt: '2026-11-11',
    autoGrade: {
      autoScore: 100,
      maxScore: 100,
      percentage: 100,
      passed: true,
      summaryFeedback: 'اجتاز الكود 3 من أصل 3 حالات اختبار بنجاح.',
      detectedErrorTags: [],
      criteriaBreakdown: [
        {
          criterion: 'ربح تشغيلي موجب مع ضريبة 15%',
          passed: true,
          earnedPoints: 35,
          maxPoints: 35,
          explanation: 'المخرج الفعلي يطابق المتوقع.',
        },
        {
          criterion: 'حالة خسارة (لا تفرض ضريبة إضافية)',
          passed: true,
          earnedPoints: 35,
          maxPoints: 35,
          explanation: 'المخرج الفعلي يطابق المتوقع.',
        },
        {
          criterion: 'اختبار الكسور العشرية الدقيقة (اختبار مخفي — حالة حدية)',
          passed: true,
          earnedPoints: 30,
          maxPoints: 30,
          explanation: 'اجتاز الكود حالة الاختبار المخفية بنجاح.',
        },
      ],
    },
    payload: {
      pythonSolution: {
        code: `def calculate_net_profit(revenue, expenses, tax_rate=0.15):\n    gross = revenue - expenses\n    return round(gross if gross <= 0 else gross * (1 - tax_rate), 2)`,
        stdout: '3400.0\n-1200\n4778.62',
      },
    },
  },
];

/* =========================================================
   5. 40 READY-TO-USE ASSIGNMENT TEMPLATES (10 PER LAB)
   ========================================================= */
function buildTemplates(): AssignmentTemplate[] {
  const accountingTitles: [string, 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير', string][] = [
    ['قالب 1: إيداع رأس المال التأسيسي وشراء الأصول الثابتة', 'مبتدئ', 'تسجيل قيدي التأسيس النقدي وشراء أجهزة الحاسوب ومطابقة طرفي الميزانية.'],
    ['قالب 2: معالجة المبيعات الآجلة وتحصيل الذمم المدينة', 'مبتدئ', 'إثبات إيراد مبيعات بالآجل ثم تحصيل الدفعة نقداً في البنك.'],
    ['قالب 3: سداد الرواتب والأجور والمستحقات الشهرية', 'متوسط', 'تسجيل مصروف الرواتب الشهرية والضمان الاجتماعي المستحق.'],
    ['قالب 4: شراء بضاعة على الحساب مع خصم مكتسب', 'متوسط', 'إثبات مشتريات المخزون بالآجل وتسجيل سداد الموردين.'],
    ['قالب 5: تسوية المصروفات المدفوعة مقدماً (الإيجار والتأمين)', 'متوسط', 'قيود التسوية الجردية لنهاية الفترة المالية لمصروف الإيجار المقدم.'],
    ['قالب 6: تسوية الإيرادات المقبوضة مقدماً من عقود البرمجيات', 'متقدم', 'تحويل الدفعات المقدمة من العملاء إلى إيرادات محققة عند تقديم الخدمة.'],
    ['قالب 7: احتساب قسط الإهلاك السنوي للمعدات والآلات', 'متقدم', 'تسجيل مصروف الإهلاك ومجمع الإهلاك بطريقة القسط الثابت.'],
    ['قالب 8: معالجة القروض البنكية وفوائد التمويل المستحقة', 'متقدم', 'إثبات استلام القرض البنكي وتسجيل قسط السداد والفائدة التمويلية.'],
    ['قالب 9: تكوين مخصص الديون المشكوك في تحصيلها', 'خبير', 'تقييم الذمم المدينة وتكوين مخصص الائتمان المتوقع وفق معيار IFRS 9.'],
    ['قالب 10: قيود الإقفال الختامية وترحيل صافي الربح للأرباح المدورة', 'خبير', 'إقفال حسابات الإيرادات والمصروفات في ملخص الدخل والأرباح المحتجزة.'],
  ];

  const marketingTitles: [string, 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير', string][] = [
    ['قالب 1: إطلاق حملة محركات البحث (SEO & SEM) بميزانية محدودة', 'مبتدئ', 'تحقيق عائد استثمار موجب 100% بميزانية لا تتجاوز 1,000 دينار.'],
    ['قالب 2: خفض تكلفة الاستحواذ CAC عبر التسويق بالمحتوى', 'مبتدئ', 'الوصول إلى تكلفة استحواذ أقل من 15 ديناراً للعميل الواحد.'],
    ['قالب 3: موازنة تسعير الاشتراك الشهري مع مرونة الطلب', 'متوسط', 'اختبار نقطة التسعير المثلى لتعظيم صافي ربح الحملة التسويقية.'],
    ['قالب 4: حملة منصات التواصل المرئية لاكتساب 80 عميلاً جديداً', 'متوسط', 'توسيع قاعدة المستخدمين مع الحفاظ على هامش ربح تشغيلي موجب.'],
    ['قالب 5: استراتيجية التسويق عبر المؤثرين لمنتج مرتفع القيمة', 'متوسط', 'تبرير التسعير المرتفع عبر قنوات الثقة وتحقيق ROI فوق 130%.'],
    ['قالب 6: تحسين اقتصاديات الوحدة (LTV / CAC Ratio)', 'متقدم', 'ضبط معادلة القيمة الدائمة للعميل مقابل تكلفة الاستحواذ تحت ضغط الميزانية.'],
    ['قالب 7: إدارة ميزانية ربع سنوية 3,500 دينار بعائد 160%', 'متقدم', 'تخصيص الميزانية لتحقيق أعلى صافي تدفق نقدي للشركة الافتراضية.'],
    ['قالب 8: حملة اختراق سوق جديد بحساسية سعرية عالية', 'متقدم', 'تحقيق 100 عميل جديد دون كسر سقف الميزانية الإعلانية.'],
    ['قالب 9: تعظيم العائد الإعلاني ROAS في موسم الذروة', 'خبير', 'الوصول إلى عائد استثمار 180%+ عبر الضبط الدقيق للسعر والقناة.'],
    ['قالب 10: محاكاة نمو متكاملة لشركة تقنية مالية (FinTech Growth)', 'خبير', 'تحقيق توازن صارم بين CAC منخفض وحجم عملاء مرتفع وربحية صافية.'],
  ];

  const managementTitles: [string, 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير', string][] = [
    ['قالب 1: حساب نقطة التعادل الأساسية لخط إنتاج واحد', 'مبتدئ', 'حساب هامش المساهمة وعدد الوحدات اللازمة لتغطية التكاليف الثابتة.'],
    ['قالب 2: تحليل أثر ارتفاع التكاليف الثابتة على نقطة التعادل', 'مبتدئ', 'قياس التغير في وحدات التعادل بعد استئجار مقر إضافي للشركة.'],
    ['قالب 3: محاكاة تخفيض التكلفة المتغيرة للوحدة عبر أتمتة العمليات', 'متوسط', 'حساب الوفر في وحدات التعادل عند خفض تكلفة الوحدة المتغيرة.'],
    ['قالب 4: تسعير منتج جديد لتحقيق نقطة تعادل تحت 400 وحدة', 'متوسط', 'تحديد هامش المساهمة المطلوب للوصول إلى التعادل السريع.'],
    ['قالب 5: تحليل SWOT الرباعي لشركة تجارة إلكترونية ناشئة', 'متوسط', 'بناء مصفوفة نقاط القوة والضعف والفرص والتهديدات بمعايير قياسية.'],
    ['قالب 6: حساب حجم المبيعات المستهدف لتحقيق ربح تشغيلي محدد', 'متقدم', 'تطبيق معادلة الوحدات المستهدفة بأرقام عشوائية لكل طالب.'],
    ['قالب 7: تقييم هامش الأمان التشغيلي (Margin of Safety)', 'متقدم', 'قياس قدرة الشركة على تحمل تراجع المبيعات قبل الدخول في منطقة الخسارة.'],
    ['قالب 8: المفاضلة بين الرافعة التشغيلية العالية والمنخفضة', 'متقدم', 'مقارنة هيكل تكاليف ثابتة مرتفعة مقابل تكاليف متغيرة مرنة.'],
    ['قالب 9: إدارة أزمة سلاسل الإمداد وارتفاع تكلفة المواد الخام', 'خبير', 'إعادة ضبط التسعير ونقطة التعادل تحت ضغط تضخم التكاليف المتغيرة.'],
    ['قالب 10: دراسة جدوى توسع إقليمي شاملة (تعادل + SWOT)', 'خبير', 'تقييم متكامل للربحية التشغيلية والمخاطر الاستراتيجية بأرقام فردية.'],
  ];

  const pythonTitles: [string, 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير', string][] = [
    ['قالب 1: دالة حساب صافي الربح وهامش الربح المئوي', 'مبتدئ', 'كتابة دالة calculate_net_profit مع حالات اختبار للأرباح والخسائر.'],
    ['قالب 2: دالة حساب ضريبة المبيعات المضافة (VAT 16%)', 'مبتدئ', 'برمجة دالة calculate_tax لحساب السعر الشامل للضريبة بدقة عشرية.'],
    ['قالب 3: أتمتة حساب عمولات مندوبي المبيعات المتدرجة', 'متوسط', 'دالة calculate_commission تطبق شرائح عمولة مختلفة حسب حجم المبيعات.'],
    ['قالب 4: تصفية الفواتير المتأخرة وحساب إجمالي الذمم', 'متوسط', 'معالجة قائمة فواتير واستخراج المبالغ المستحقة.'],
    ['قالب 5: حساب متوسط قيمة الطلب (AOV) مع حماية القسمة على صفر', 'متوسط', 'برمجة دالة calculate_average_order تتعامل مع الحالات الحدية.'],
    ['قالب 6: دالة حساب العائد على الاستثمار ROI وتكلفة الاستحواذ CAC', 'متقدم', 'أتمتة مؤشرات التسويق الرقمي والتحقق من الكسور العشرية.'],
    ['قالب 7: حساب قسط القرض الشهري والفائدة المركبة', 'متقدم', 'تطبيق المعادلة المالية للفائدة المركبة في Python.'],
    ['قالب 8: تحليل نقطة التعادل البرمجي وتنبيه الخسارة', 'متقدم', 'كتابة دالة تحسب وحدات التعادل وترجع تنبيهاً إذا كان السعر أقل من التكلفة.'],
    ['قالب 9: تنظيف بيانات المبيعات واستبعاد القيم الشاذة (Outliers)', 'خبير', 'معالجة مصفوفة بيانات مالية وحساب المتوسط الموزون.'],
    ['قالب 10: محرك تسعير ديناميكي حسب الطلب والمخزون المتبقي', 'خبير', 'خوارزمية تسعير ذكية تجتاز حالات الاختبار الظاهرة والمخفية.'],
  ];

  const templates: AssignmentTemplate[] = [];

  accountingTitles.forEach(([title, difficulty, summary], idx) => {
    const baseAmt = (idx + 2) * 1500;
    templates.push({
      id: `tpl-acc-${idx + 1}`,
      title,
      labId: 'accounting',
      difficulty,
      summary,
      instructions: `${summary} سجل القيود اللازمة في دفتر اليومية وتأكد من توازن الطرفين المدين والدائن.`,
      maxScore: 100,
      allowedAttempts: 3,
      accountingConfig: {
        operationsPrompt: [
          `تنفيذ العملية المالية الأساسية رقم (${idx + 1}) بقيمة ${baseAmt.toLocaleString('en-US')} دينار أردني.`,
        ],
        availableAccounts: [
          'النقدية والبنك',
          'رأس المال المساهم',
          'المعدات والأجهزة المكتبية',
          'الذمم الدائنة (الموردون)',
          'إيرادات المبيعات',
          'مصروف الرواتب والأجور',
        ],
        modelEntries: [
          {
            id: `tpl-acc-e-${idx + 1}`,
            description: title,
            debitAccount: 'النقدية والبنك',
            creditAccount: 'إيرادات المبيعات',
            debitAmount: baseAmt,
            creditAmount: baseAmt,
          },
        ],
      },
    });
  });

  marketingTitles.forEach(([title, difficulty, summary], idx) => {
    templates.push({
      id: `tpl-mkt-${idx + 1}`,
      title,
      labId: 'marketing',
      difficulty,
      summary,
      instructions: `${summary} اضبط القناة الإعلانية وسعر المنتج والميزانية لتحقيق الأهداف المطلوبة.`,
      maxScore: 100,
      allowedAttempts: 3,
      marketingConfig: {
        scenarioContext: summary,
        maxBudgetJod: 1200 + idx * 250,
        minRoiPercent: 100 + idx * 10,
        maxCacJod: Math.max(14, 28 - idx),
        minCustomers: 35 + idx * 6,
        recommendedChannel: idx % 2 === 0 ? 'search_seo' : 'email_content',
      },
    });
  });

  managementTitles.forEach(([title, difficulty, summary], idx) => {
    templates.push({
      id: `tpl-mgmt-${idx + 1}`,
      title,
      labId: 'management',
      difficulty,
      summary,
      instructions: `${summary} استخدم المتغيرات المالية المخصصة لحسابك لاستخراج نقطة التعادل وهامش المساهمة.`,
      maxScore: 100,
      allowedAttempts: 3,
      managementConfig: {
        mode: 'breakeven',
        baseFixedCosts: 10000 + idx * 2000,
        baseVariableCostPerUnit: 15 + idx * 2,
        baseSellingPricePerUnit: 40 + idx * 4,
        randomizePerStudent: true,
        tolerancePercent: 5,
        swotMinItemsPerQuadrant: 2,
        swotRequiredKeywords: ['نمو', 'تكلفة'],
      },
    });
  });

  pythonTitles.forEach(([title, difficulty, summary], idx) => {
    templates.push({
      id: `tpl-py-${idx + 1}`,
      title,
      labId: 'python',
      difficulty,
      summary,
      instructions: `${summary} اكتب كود Python نظيفاً يجتاز حالات الاختبار الظاهرة والمخفية ضمن المهلة الزمنية.`,
      maxScore: 100,
      allowedAttempts: 4,
      pythonConfig: {
        functionName: 'calculate_net_profit',
        starterCode: `def calculate_net_profit(revenue, expenses, tax_rate=0.15):\n    gross = revenue - expenses\n    return round(gross if gross <= 0 else gross * (1 - tax_rate), 2)\n`,
        referenceSolution: `def calculate_net_profit(revenue, expenses, tax_rate=0.15):\n    gross = revenue - expenses\n    return round(gross if gross <= 0 else gross * (1 - tax_rate), 2)`,
        timeoutMs: 3500,
        testCases: [
          {
            id: `tpl-py-tc1-${idx}`,
            label: 'الحالة القياسية الأولى',
            inputExpr: 'calculate_net_profit(10000, 6000, 0.15)',
            expectedOutput: '3400.0',
            isHidden: false,
            weight: 50,
          },
          {
            id: `tpl-py-tc2-${idx}`,
            label: 'الحالة الحدية المخفية',
            inputExpr: 'calculate_net_profit(3000, 4500, 0.15)',
            expectedOutput: '-1500',
            isHidden: true,
            weight: 50,
          },
        ],
      },
    });
  });

  return templates;
}

export const INITIAL_ASSIGNMENT_TEMPLATES: AssignmentTemplate[] = buildTemplates();

/* =========================================================
   6. ANNOUNCEMENTS, APPROVALS, USERS & AUDIT LOG (للأدمن والمعلم)
   ========================================================= */
export const INITIAL_ANNOUNCEMENTS: PlatformAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'موعد تسليم الواجب العملي الأول في المحاسبة المالية',
    body: 'يرجى من جميع طلاب شعبة ACC-101 إتمام واجب قيود التأسيس قبل نهاية يوم الجمعة القادم.',
    targetAudience: 'cls-ju-acc-101',
    authorName: 'د. أحمد خليل العساف',
    authorRole: 'teacher',
    scheduledAt: '2026-11-12',
    active: true,
  },
  {
    id: 'ann-2',
    title: 'إطلاق نظام الواجبات التطبيقية والمصحح الآلي الفوري',
    body: 'بات بإمكان أعضاء هيئة التدريس إنشاء واجبات عملية مرتبطة بالمختبرات الأربعة مع تصحيح فوري وتخصيص المتغيرات لكل طالب.',
    targetAudience: 'all',
    authorName: 'مدير النظام العام',
    authorRole: 'admin',
    scheduledAt: '2026-11-10',
    active: true,
  },
];

export const INITIAL_APPROVAL_REQUESTS: ApprovalRequestItem[] = [
  {
    id: 'req-1',
    applicantName: 'د. ريم عبد الرحمن المجالي',
    applicantEmail: 'r.majali@psut.edu.jo',
    role: 'teacher',
    organizationOrUniversity: 'جامعة الأميرة سمية للتكنولوجيا',
    departmentOrCommercialReg: 'كلية الملك طلال لتكنولوجيا الأعمال — قسم المحاسبة',
    submittedAt: '2026-11-11',
    status: 'قيد المراجعة',
    notes: 'ترغب في فتح 3 شعب لمساق المحاسبة المالية المتقدمة وتطبيقات Python.',
  },
  {
    id: 'req-2',
    applicantName: 'د. سامر النمري',
    applicantEmail: 's.nimri@just.edu.jo',
    role: 'teacher',
    organizationOrUniversity: 'جامعة العلوم والتكنولوجيا الأردنية',
    departmentOrCommercialReg: 'كلية الهندسة وتقنية المعلومات',
    submittedAt: '2026-11-12',
    status: 'قيد المراجعة',
    notes: 'تدريس مساق برمجة الأعمال لطلاب السنة الثالثة.',
  },
  {
    id: 'req-3',
    applicantName: 'شركة دار الابتكار للحلول السحابية',
    applicantEmail: 'hr@dar-cloud.jo',
    role: 'company',
    organizationOrUniversity: 'شركة دار الابتكار للحلول السحابية',
    departmentOrCommercialReg: 'سجل تجاري رقم: 200194821 — عمّان',
    submittedAt: '2026-11-10',
    status: 'قيد المراجعة',
    notes: 'طلب توثيق حساب شركة لاستقطاب 8 خريجين في Python والمحاسبة.',
  },
];

export interface PlatformUserRecord {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  universityOrOrg: string;
  status: 'نشط' | 'معلّق' | 'بانتظار الموافقة';
  joinedAt: string;
  xpOrMetric: string;
}

export const INITIAL_PLATFORM_USERS: PlatformUserRecord[] = [
  {
    id: 'usr-student-1',
    fullName: 'يزن النابلسي',
    username: 'yazan-nabulsi',
    email: 'yazan@students.ju.edu.jo',
    role: 'student',
    universityOrOrg: 'الجامعة الأردنية',
    status: 'نشط',
    joinedAt: '2026-09-01',
    xpOrMetric: '1,680 XP',
  },
  {
    id: 'usr-student-2',
    fullName: 'رزان العبداللات',
    username: 'razan-abdallat',
    email: 'razan@psut.edu.jo',
    role: 'student',
    universityOrOrg: 'جامعة الأميرة سمية للتكنولوجيا',
    status: 'نشط',
    joinedAt: '2026-09-04',
    xpOrMetric: '1,650 XP',
  },
  {
    id: 'usr-student-3',
    fullName: 'عمر الخصاونة',
    username: 'omar-khasawneh',
    email: 'omar@just.edu.jo',
    role: 'student',
    universityOrOrg: 'جامعة العلوم والتكنولوجيا الأردنية',
    status: 'نشط',
    joinedAt: '2026-09-10',
    xpOrMetric: '1,580 XP',
  },
  {
    id: 'usr-teacher-1',
    fullName: 'د. أحمد خليل العساف',
    username: 'dr-ahmad-khalil',
    email: 'a.khalil@ju.edu.jo',
    role: 'teacher',
    universityOrOrg: 'الجامعة الأردنية',
    status: 'نشط',
    joinedAt: '2026-08-25',
    xpOrMetric: '3 شعب · 4 واجبات',
  },
  {
    id: 'usr-teacher-2',
    fullName: 'د. ريم عبد الرحمن المجالي',
    username: 'dr-reem-majali',
    email: 'r.majali@psut.edu.jo',
    role: 'teacher',
    universityOrOrg: 'جامعة الأميرة سمية للتكنولوجيا',
    status: 'بانتظار الموافقة',
    joinedAt: '2026-11-11',
    xpOrMetric: 'طلب جديد',
  },
  {
    id: 'usr-company-1',
    fullName: 'سارة الخطيب (شركة تقنية المستقبل)',
    username: 'futuretech-hr',
    email: 'talent@futuretech.jo',
    role: 'company',
    universityOrOrg: 'شركة تقنية المستقبل',
    status: 'نشط',
    joinedAt: '2026-09-12',
    xpOrMetric: 'باقة الأعمال (Pro)',
  },
  {
    id: 'usr-admin-root',
    fullName: 'مدير النظام العام',
    username: 'admin',
    email: 'admin@tadreebak.com',
    role: 'admin',
    universityOrOrg: 'إدارة منصة تدريبك',
    status: 'نشط',
    joinedAt: '2026-01-01',
    xpOrMetric: 'صلاحيات كاملة',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    actorName: 'مدير النظام العام',
    actorRole: 'admin',
    actionType: 'موافقة طلب',
    targetLabel: 'تفعيل حساب المعلم: د. أحمد خليل العساف (الجامعة الأردنية)',
    timestamp: '2026-11-12 09:40',
    ipAddress: '10.24.0.12',
  },
  {
    id: 'aud-2',
    actorName: 'د. أحمد خليل العساف',
    actorRole: 'teacher',
    actionType: 'إنشاء واجب',
    targetLabel: 'نشر واجب: برمجة دالة حساب صافي الربح بعد الضريبة (شعبة MIS-204)',
    timestamp: '2026-11-11 14:15',
    ipAddress: '176.29.44.101',
  },
  {
    id: 'aud-3',
    actorName: 'مدير النظام العام',
    actorRole: 'admin',
    actionType: 'تحديث إعدادات',
    targetLabel: 'تفعيل ميزة المتغيرات العشوائية لمنع النسخ في واجبات الإدارة',
    timestamp: '2026-11-10 18:05',
    ipAddress: '10.24.0.12',
  },
  {
    id: 'aud-4',
    actorName: 'سارة الخطيب',
    actorRole: 'company',
    actionType: 'تسجيل دخول',
    targetLabel: 'دخول ناجح إلى بوابة التوظيف (شركة تقنية المستقبل)',
    timestamp: '2026-11-10 11:22',
    ipAddress: '94.142.38.19',
  },
];
