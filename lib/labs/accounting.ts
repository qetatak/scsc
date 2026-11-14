export interface AccountingScenario {
  id: string;
  title: string;
  category: string;
  defaultAmount: number;
  assetsDeltaMultiplier: number;
  liabilitiesDeltaMultiplier: number;
  equityDeltaMultiplier: number;
  revenueDeltaMultiplier?: number;
  expenseDeltaMultiplier?: number;
  debitAccount: string;
  creditAccount: string;
  whyExplanation: string;
  xpReward: number;
}

export interface JournalEntryResult {
  scenarioId: string;
  title: string;
  amount: number;
  debitLine: string;
  creditLine: string;
  assetsDelta: number;
  liabilitiesDelta: number;
  equityDelta: number;
  newAssets: number;
  newLiabilities: number;
  newEquity: number;
  isBalanced: boolean;
  whyExplanation: string;
}

export interface AccountingQuizQuestion {
  id: string;
  prompt: string;
  amount: number;
  options: {
    id: string;
    debit: string;
    credit: string;
  }[];
  correctOptionId: string;
  explanation: string;
  xpReward: number;
}

export const ACCOUNTING_SCENARIOS: AccountingScenario[] = [
  {
    id: 'acc-invest-capital',
    title: 'استثمار رأس مال نقدي في الشركة',
    category: 'تمويل وتأسيس',
    defaultAmount: 10000,
    assetsDeltaMultiplier: 1,
    liabilitiesDeltaMultiplier: 0,
    equityDeltaMultiplier: 1,
    debitAccount: 'ح/ الصندوق والبنك (أصول متداولة)',
    creditAccount: 'ح/ رأس المال (حقوق الملكية)',
    whyExplanation:
      'زاد النقد في البنك (وهو أصل طبيعته مدينة فيزيد بالمدين)، وفي المقابل زادت حقوق الملاك في الشركة بنفس القيمة (طبيعتها دائنة فتزيد بالدائن)، فبقيت معادلة الميزانية متوازنة تماماً.',
    xpReward: 40,
  },
  {
    id: 'acc-buy-equipment-credit',
    title: 'شراء أجهزة ومعدات مكتبية على الحساب (بالآجل)',
    category: 'أصول والتزامات',
    defaultAmount: 3500,
    assetsDeltaMultiplier: 1,
    liabilitiesDeltaMultiplier: 1,
    equityDeltaMultiplier: 0,
    debitAccount: 'ح/ الأجهزة والمعدات (أصول ثابتة)',
    creditAccount: 'ح/ الدائنين - الموردين (التزامات)',
    whyExplanation:
      'حصلت الشركة على أجهزة جديدة فزادت الأصول (مدين)، ولأن الدفع سيتم لاحقاً نشأ التزام تجاه الموردين فزادت الالتزامات (دائن) بنفس المبلغ دون المساس بحقوق الملكية.',
    xpReward: 45,
  },
  {
    id: 'acc-collect-cash-revenue',
    title: 'تحصيل إيراد خدمات استشارية نقداً',
    category: 'إيرادات تشغيلية',
    defaultAmount: 2800,
    assetsDeltaMultiplier: 1,
    liabilitiesDeltaMultiplier: 0,
    equityDeltaMultiplier: 1,
    revenueDeltaMultiplier: 1,
    debitAccount: 'ح/ النقدية بالبنك (أصول)',
    creditAccount: 'ح/ إيرادات المبيعات والخدمات (حقوق ملكية)',
    whyExplanation:
      'تحصيل الإيراد النقدي يرفع رصيد النقدية في الأصول (مدين)، وتزيد الإيرادات من صافي الربح الذي يصب مباشرة في زيادة حقوق الملكية (دائن).',
    xpReward: 50,
  },
  {
    id: 'acc-pay-rent-expense',
    title: 'دفع إيجار المقر ومصاريف التشغيل نقداً',
    category: 'مصروفات تشغيلية',
    defaultAmount: 1200,
    assetsDeltaMultiplier: -1,
    liabilitiesDeltaMultiplier: 0,
    equityDeltaMultiplier: -1,
    expenseDeltaMultiplier: 1,
    debitAccount: 'ح/ مصروف الإيجار والتشغيل (تخفيض حقوق الملكية)',
    creditAccount: 'ح/ النقدية بالبنك (أصول)',
    whyExplanation:
      'المصروفات تخفض الأرباح وبالتالي تخفض حقوق الملكية (تُسجل مدينة)، وخروج النقد من البنك يخفض الأصول (يُسجل دائناً)، فيتساوى الانخفاض في طرفي المعادلة.',
    xpReward: 45,
  },
  {
    id: 'acc-buy-inventory-cash',
    title: 'شراء بضاعة للمخزون نقداً',
    category: 'تبادل أصول',
    defaultAmount: 2000,
    assetsDeltaMultiplier: 0,
    liabilitiesDeltaMultiplier: 0,
    equityDeltaMultiplier: 0,
    debitAccount: 'ح/ مخزون البضاعة (أصول متداولة +)',
    creditAccount: 'ح/ النقدية بالبنك (أصول متداولة -)',
    whyExplanation:
      'هذه عملية تبادل داخل جانب الأصول نفسه: زاد أصل (المخزون) ونقص أصل آخر (النقدية) بنفس القيمة، ولذلك لم يتغير إجمالي الأصول ولا الالتزامات ولا حقوق الملكية.',
    xpReward: 50,
  },
  {
    id: 'acc-owner-withdrawal',
    title: 'سحب شخصي نقدي من قِبل المالك',
    category: 'حقوق الملكية',
    defaultAmount: 800,
    assetsDeltaMultiplier: -1,
    liabilitiesDeltaMultiplier: 0,
    equityDeltaMultiplier: -1,
    debitAccount: 'ح/ المسحوبات الشخصية (تخفيض حقوق الملكية)',
    creditAccount: 'ح/ النقدية بالبنك (أصول)',
    whyExplanation:
      'المسحوبات الشخصية تخفض نصيب المالك في حقوق الملكية (مدين) وتخفض النقدية في الأصول (دائن) بنفس القيمة.',
    xpReward: 45,
  },
  {
    id: 'acc-pay-liability',
    title: 'سداد دفعة للموردين (الدائنين) نقداً',
    category: 'سداد التزامات',
    defaultAmount: 1500,
    assetsDeltaMultiplier: -1,
    liabilitiesDeltaMultiplier: -1,
    equityDeltaMultiplier: 0,
    debitAccount: 'ح/ الدائنين - الموردين (التزامات)',
    creditAccount: 'ح/ النقدية بالبنك (أصول)',
    whyExplanation:
      'عند سداد الدين ينخفض الالتزام على الشركة (والالتزام طبيعته دائنة فينقص بالمدين) وتنخفض النقدية في الأصول (دائن) بنفس القيمة.',
    xpReward: 55,
  },
];

export const ACCOUNTING_QUIZ_QUESTIONS: AccountingQuizQuestion[] = [
  {
    id: 'quiz-acc-1',
    prompt:
      'قامت الشركة الافتراضية بتقديم خدمة برمجية لعميل وحصلت على 1,800 دينار نقداً في الحساب البنكي. ما هو القيد المحاسبي الصحيح؟',
    amount: 1800,
    options: [
      {
        id: 'opt-1',
        debit: 'من ح/ النقدية بالبنك (1,800)',
        credit: 'إلى ح/ إيرادات الخدمات (1,800)',
      },
      {
        id: 'opt-2',
        debit: 'من ح/ إيرادات الخدمات (1,800)',
        credit: 'إلى ح/ النقدية بالبنك (1,800)',
      },
      {
        id: 'opt-3',
        debit: 'من ح/ الدائنين (1,800)',
        credit: 'إلى ح/ رأس المال (1,800)',
      },
    ],
    correctOptionId: 'opt-1',
    explanation:
      'النقدية أصل زاد فيُسجل في الطرف المدين، وإيرادات الخدمات تزيد حقوق الملكية فتُسجل في الطرف الدائن.',
    xpReward: 75,
  },
  {
    id: 'quiz-acc-2',
    prompt:
      'اشترت الشركة خوادم سحابية ومعدات بقيمة 4,200 دينار بالأجل (على الحساب) من شركة توريد تقنية. كيف يُسجل القيد؟',
    amount: 4200,
    options: [
      {
        id: 'opt-1',
        debit: 'من ح/ الدائنين (4,200)',
        credit: 'إلى ح/ المعدات والأجهزة (4,200)',
      },
      {
        id: 'opt-2',
        debit: 'من ح/ المعدات والأجهزة (4,200)',
        credit: 'إلى ح/ الدائنين - الموردين (4,200)',
      },
      {
        id: 'opt-3',
        debit: 'من ح/ مصروف التشغيل (4,200)',
        credit: 'إلى ح/ النقدية (4,200)',
      },
    ],
    correctOptionId: 'opt-2',
    explanation:
      'المعدات أصل ثابت زاد فيُجعل مديناً، والشراء على الحساب أنشأ التزاماً للموردين (الدائنين) فيُجعل دائناً.',
    xpReward: 75,
  },
  {
    id: 'quiz-acc-3',
    prompt:
      'سدّدت الشركة مبلغ 1,000 دينار نقداً من الرصيد المستحق عليها للموردين. ما هو القيد الصحيح؟',
    amount: 1000,
    options: [
      {
        id: 'opt-1',
        debit: 'من ح/ النقدية بالبنك (1,000)',
        credit: 'إلى ح/ الدائنين (1,000)',
      },
      {
        id: 'opt-2',
        debit: 'من ح/ المسحوبات الشخصية (1,000)',
        credit: 'إلى ح/ رأس المال (1,000)',
      },
      {
        id: 'opt-3',
        debit: 'من ح/ الدائنين - الموردين (1,000)',
        credit: 'إلى ح/ النقدية بالبنك (1,000)',
      },
    ],
    correctOptionId: 'opt-3',
    explanation:
      'تخفيض الالتزام (الدائنين) يكون بجعله مديناً، وخروج النقدية من البنك يخفض الأصل فيكون دائناً.',
    xpReward: 80,
  },
];

export function applyAccountingScenario(
  current: { assets: number; liabilities: number; equity: number },
  scenario: AccountingScenario,
  customAmount?: number
): JournalEntryResult {
  const amount = Math.max(100, Math.round(customAmount ?? scenario.defaultAmount));
  const assetsDelta = amount * scenario.assetsDeltaMultiplier;
  const liabilitiesDelta = amount * scenario.liabilitiesDeltaMultiplier;
  const equityDelta = amount * scenario.equityDeltaMultiplier;

  const newAssets = current.assets + assetsDelta;
  const newLiabilities = current.liabilities + liabilitiesDelta;
  const newEquity = current.equity + equityDelta;

  return {
    scenarioId: scenario.id,
    title: scenario.title,
    amount,
    debitLine: `${ amount.toLocaleString('en-US') } د.أ — من ${ scenario.debitAccount }`,
    creditLine: `${ amount.toLocaleString('en-US') } د.أ — إلى ${ scenario.creditAccount }`,
    assetsDelta,
    liabilitiesDelta,
    equityDelta,
    newAssets,
    newLiabilities,
    newEquity,
    isBalanced: newAssets === newLiabilities + newEquity,
    whyExplanation: scenario.whyExplanation,
  };
}
