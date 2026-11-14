export interface BreakEvenInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
}

export interface BreakEvenPointData {
  units: number;
  fixedCost: number;
  totalCost: number;
  totalRevenue: number;
  profit: number;
}

export interface BreakEvenAnalysisResult {
  isValid: boolean;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  chartData: BreakEvenPointData[];
  explanation: string;
}

export type SwotCategory = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

export interface SwotItem {
  id: string;
  category: SwotCategory;
  text: string;
}

export interface ManagementDecisionScenario {
  id: string;
  title: string;
  situation: string;
  options: {
    id: string;
    label: string;
    capitalImpact: number;
    reputationImpact: number;
    customersImpact: number;
    feedback: string;
    isOptimal: boolean;
  }[];
  xpReward: number;
}

export const INITIAL_SWOT_ITEMS: SwotItem[] = [
  {
    id: 'swot-1',
    category: 'strengths',
    text: 'فريق تقني شاب يتقن أتمتة العمليات وتطوير الحلول السحابية بسرعة',
  },
  {
    id: 'swot-2',
    category: 'strengths',
    text: 'تكاليف تشغيلية ثابتة منخفضة مقارنة بالمنافسين التقليديين',
  },
  {
    id: 'swot-3',
    category: 'weaknesses',
    text: 'محدودية ميزانية التسويق الأولية وضعف الوعي بالعلامة التجارية الجديدة',
  },
  {
    id: 'swot-4',
    category: 'opportunities',
    text: 'تزايد طلب الشركات الصغيرة في الأردن والخليج على أنظمة الإدارة السحابية',
  },
  {
    id: 'swot-5',
    category: 'threats',
    text: 'دخول منافسين إقليميين بأسعار اشتراك مخفضة خلال السنة الأولى',
  },
];

export const MANAGEMENT_DECISION_SCENARIOS: ManagementDecisionScenario[] = [
  {
    id: 'mgmt-dec-1',
    title: 'أزمة تأخر تسليم منتج رئيسي لعميل مؤسسي',
    situation:
      'اكتشف فريق الجودة خللاً برمجياً قبل يومين من موعد التسليم الرسمي لعقد قيمته 4,000 دينار. كيف تتصرف كمدير تنفيذي؟',
    options: [
      {
        id: 'opt-a',
        label:
          'مصارحة العميل فوراً، طلب تمديد 5 أيام لإصلاح الخلل جذرياً، وتقديم شهر دعم مجاني كتعويض',
        capitalImpact: -300,
        reputationImpact: 12,
        customersImpact: 5,
        feedback:
          'قرار قيادي حكيم! الشفافية وتحمل المسؤولية رفعت سمعة الشركة وحافظت على العقد طويل الأمد رغم تكلفة الدعم الإضافية البسيطة.',
        isOptimal: true,
      },
      {
        id: 'opt-b',
        label: 'تسليم النظام في الموعد مع إخفاء الخلل على أمل إصلاحه لاحقاً دون علم العميل',
        capitalImpact: -1800,
        reputationImpact: -18,
        customersImpact: -10,
        feedback:
          'قرار عالي المخاطر؛ اكتشف العميل العطل في أول يوم تشغيل مما أدى لشرط جزائي وتراجع الثقة.',
        isOptimal: false,
      },
      {
        id: 'opt-c',
        label: 'إلغاء العقد لتجنب الإحراج وإعادة الدفعة المقدمة',
        capitalImpact: -2000,
        reputationImpact: -8,
        customersImpact: -4,
        feedback:
          'خسرت الشركة إيراداً مهماً وفرصة لإثبات كفاءتها في إدارة الأزمات.',
        isOptimal: false,
      },
    ],
    xpReward: 70,
  },
  {
    id: 'mgmt-dec-2',
    title: 'توظيف وتدريب الخريجين الجدد مقابل استقطاب خبرات مرتفعة التكلفة',
    situation:
      'تحتاج الشركة لتوسيع قسم خدمة العملاء والتحليل المالي بميزانية سنوية محدودة.',
    options: [
      {
        id: 'opt-a',
        label:
          'بناء برنامج تدريب عملي منظم لـ 3 خريجين متميزين بإشراف قائد فريق خبير',
        capitalImpact: 1500,
        reputationImpact: 10,
        customersImpact: 18,
        feedback:
          'اختيار استراتيجي ممتاز! حققت توازناً بين ضبط التكاليف ونقل الخبرة ورفع الطاقة الإنتاجية للشركة.',
        isOptimal: true,
      },
      {
        id: 'opt-b',
        label: 'تجميد التوسع بالكامل وتحميل الموظفين الحاليين ساعات عمل إضافية دون مقابل',
        capitalImpact: -600,
        reputationImpact: -12,
        customersImpact: -8,
        feedback:
          'أدى الإرهاق الوظيفي إلى تراجع جودة خدمة العملاء وارتفاع معدل دوران الموظفين.',
        isOptimal: false,
      },
    ],
    xpReward: 70,
  },
];

export function calculateBreakEven(
  input: BreakEvenInput
): BreakEvenAnalysisResult {
  const fixedCosts = Math.max(100, input.fixedCosts);
  const variableCost = Math.max(1, input.variableCostPerUnit);
  const sellingPrice = Math.max(1, input.sellingPricePerUnit);

  const contributionMarginPerUnit = sellingPrice - variableCost;

  if (contributionMarginPerUnit <= 0) {
    return {
      isValid: false,
      contributionMarginPerUnit,
      contributionMarginRatio: 0,
      breakEvenUnits: 0,
      breakEvenRevenue: 0,
      chartData: [],
      explanation:
        'تنبيه إداري: سعر بيع الوحدة يجب أن يكون أعلى من التكلفة المتغيرة للوحدة لتحقيق هامش مساهمة موجب يغطي التكاليف الثابتة.',
    };
  }

  const breakEvenUnits = Math.ceil(fixedCosts / contributionMarginPerUnit);
  const breakEvenRevenue = breakEvenUnits * sellingPrice;
  const contributionMarginRatio = Number(
    ((contributionMarginPerUnit / sellingPrice) * 100).toFixed(1)
  );

  const maxUnits = Math.max(20, Math.ceil(breakEvenUnits * 1.8));
  const step = Math.max(1, Math.round(maxUnits / 8));
  const chartData: BreakEvenPointData[] = [];

  for (let u = 0; u <= maxUnits; u += step) {
    const totalCost = fixedCosts + u * variableCost;
    const totalRevenue = u * sellingPrice;
    chartData.push({
      units: u,
      fixedCost: fixedCosts,
      totalCost,
      totalRevenue,
      profit: totalRevenue - totalCost,
    });
  }

  return {
    isValid: true,
    contributionMarginPerUnit,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
    chartData,
    explanation: `تساهم كل وحدة مباعة بمبلغ ${contributionMarginPerUnit} دينار في تغطية التكاليف الثابتة. عند بيع ${breakEvenUnits} وحدة تتساوى الإيرادات الكلية (${breakEvenRevenue.toLocaleString('en-US')} د.أ) مع التكاليف الكلية، وبعدها تبدأ منطقة الربح الصافي.`,
  };
}
