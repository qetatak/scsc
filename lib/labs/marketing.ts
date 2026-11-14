export type MarketingChannelId = 'social_ads' | 'search_seo' | 'influencers' | 'email_content';

export interface MarketingChannelConfig {
  id: MarketingChannelId;
  name: string;
  baseCpc: number;
  baseConversionRate: number;
  optimalPricePoint: number;
  description: string;
}

export interface MarketingSimulationInput {
  productPrice: number;
  adBudget: number;
  channelId: MarketingChannelId;
}

export interface MarketingSimulationResult {
  channelName: string;
  productPrice: number;
  adBudget: number;
  cac: number;
  expectedCustomers: number;
  expectedRevenue: number;
  netCampaignProfit: number;
  roiPercentage: number;
  priceElasticityNote: string;
}

export interface MarketingChallenge {
  id: string;
  title: string;
  description: string;
  maxBudget: number;
  minRoi: number;
  minCustomers: number;
  xpReward: number;
}

export const MARKETING_CHANNELS: MarketingChannelConfig[] = [
  {
    id: 'search_seo',
    name: 'إعلانات محركات البحث والكلمات المفتاحية (Search & SEO)',
    baseCpc: 0.85,
    baseConversionRate: 0.055,
    optimalPricePoint: 45,
    description:
      'تستهدف عملاء يبحثون فعلياً عن الحل، وتتميز بمعدل تحويل مرتفع وتكلفة استحواذ مستقرة.',
  },
  {
    id: 'social_ads',
    name: 'إعلانات منصات التواصل الاجتماعي المرئية (Social Paid Ads)',
    baseCpc: 0.45,
    baseConversionRate: 0.028,
    optimalPricePoint: 35,
    description:
      'وصول واسع وسريع للجمهور الشاب، لكنها حساسة جداً لسعر المنتج وجاذبية العرض.',
  },
  {
    id: 'influencers',
    name: 'التسويق عبر المؤثرين وصنّاع المحتوى المتخصصين',
    baseCpc: 1.1,
    baseConversionRate: 0.062,
    optimalPricePoint: 55,
    description:
      'يبني ثقة عالية بالمنتج ويسمح بالتسعير الأعلى، لكنه يتطلب ميزانية مدروسة.',
  },
  {
    id: 'email_content',
    name: 'التسويق بالمحتوى والنشرات البريدية (Content & CRM)',
    baseCpc: 0.3,
    baseConversionRate: 0.032,
    optimalPricePoint: 40,
    description:
      'الأقل تكلفة لكل نقرة ويحقق عائداً ممتازاً على الاستثمار للميزانيات الصغيرة والمتوسطة.',
  },
];

export const MARKETING_CHALLENGES: MarketingChallenge[] = [
  {
    id: 'mkt-challenge-1',
    title: 'تحدي المسوّق الذكي: عائد استثمار فوق 150% بميزانية محدودة',
    description:
      'اضبط سعر المنتج والقناة الإعلانية لتحقيق ROI أعلى من 150% مع ميزانية إعلانات لا تتجاوز 1,500 دينار واكتساب 40 عميلاً على الأقل.',
    maxBudget: 1500,
    minRoi: 150,
    minCustomers: 40,
    xpReward: 90,
  },
  {
    id: 'mkt-challenge-2',
    title: 'تحدي النمو السريع: اكتساب 120 عميلاً جديداً بربحية موجبة',
    description:
      'صمّم حملة توسع تجلب 120 عميلاً على الأقل مع الحفاظ على عائد استثمار (ROI) لا يقل عن 80%.',
    maxBudget: 5000,
    minRoi: 80,
    minCustomers: 120,
    xpReward: 85,
  },
];

export function simulateMarketingCampaign(
  input: MarketingSimulationInput
): MarketingSimulationResult {
  const channel =
    MARKETING_CHANNELS.find((c) => c.id === input.channelId) ||
    MARKETING_CHANNELS[0];

  const budget = Math.max(100, input.adBudget);
  const price = Math.max(10, input.productPrice);

  // Price sensitivity factor: higher price above optimal reduces conversion rate
  const priceRatio = price / channel.optimalPricePoint;
  const priceMultiplier = Math.max(
    0.28,
    Math.min(1.45, 1.35 - 0.35 * priceRatio)
  );

  // Diminishing returns on very high budgets
  const budgetEfficiency = budget > 3500 ? 0.92 : 1.0;

  const effectiveConversionRate =
    channel.baseConversionRate * priceMultiplier * budgetEfficiency;
  const clicks = budget / channel.baseCpc;
  const expectedCustomers = Math.max(1, Math.round(clicks * effectiveConversionRate));
  const cac = Number((budget / expectedCustomers).toFixed(2));
  const expectedRevenue = Math.round(expectedCustomers * price);
  const netCampaignProfit = expectedRevenue - budget;
  const roiPercentage = Number(
    (((expectedRevenue - budget) / budget) * 100).toFixed(1)
  );

  let priceElasticityNote =
    'السعر متوازن جداً مع القيمة المدركة للقناة التسويقية المختارة.';
  if (price > channel.optimalPricePoint * 1.25) {
    priceElasticityNote =
      'تنبيه تسعيري: السعر مرتفع نسبياً لهذه القناة مما خفّض نسبة التحويل وزاد تكلفة الاستحواذ (CAC).';
  } else if (price < channel.optimalPricePoint * 0.7) {
    priceElasticityNote =
      'ملاحظة تسعيرية: السعر منخفض ويجلب عدداً أكبر من العملاء، لكن هامش الإيراد لكل عميل أقل.';
  }

  return {
    channelName: channel.name,
    productPrice: price,
    adBudget: budget,
    cac,
    expectedCustomers,
    expectedRevenue,
    netCampaignProfit,
    roiPercentage,
    priceElasticityNote,
  };
}

export function evaluateMarketingChallenge(
  result: MarketingSimulationResult,
  challenge: MarketingChallenge
): boolean {
  return (
    result.adBudget <= challenge.maxBudget &&
    result.roiPercentage >= challenge.minRoi &&
    result.expectedCustomers >= challenge.minCustomers
  );
}
