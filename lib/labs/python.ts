export interface PythonExercise {
  id: string;
  title: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  businessContext: string;
  prompt: string;
  starterCode: string;
  solutionCode: string;
  lineExplanations: { line: string; explanation: string }[];
  testDescription: string;
  expectedOutputSubstring: string;
  xpReward: number;
}

export interface PythonExecutionResult {
  passed: boolean;
  stdout: string;
  feedback: string;
  engine: 'pyodide' | 'simulator';
}

export const PYTHON_EXERCISES: PythonExercise[] = [
  {
    id: 'py-ex-1',
    title: '01. دالة التحقق من توازن المعادلة المحاسبية',
    level: 'مبتدئ',
    businessContext:
      'في قسم المحاسبة، نحتاج لدالة بايثون تتحقق تلقائياً مما إذا كانت الأصول تساوي مجموع الالتزامات وحقوق الملكية.',
    prompt:
      'أكمل الدالة `check_balance(assets, liabilities, equity)` لتعيد القيمة المنطقية `True` إذا كانت الميزانية متوازنة، ثم اطبع نتيجة استدعاء الدالة للقيم `(15000, 5000, 10000)`.',
    starterCode: `def check_balance(assets, liabilities, equity):
    return assets == (liabilities + equity)

result = check_balance(15000, 5000, 10000)
print("Balanced:", result)`,
    solutionCode: `def check_balance(assets, liabilities, equity):
    return assets == (liabilities + equity)

result = check_balance(15000, 5000, 10000)
print("Balanced:", result)`,
    lineExplanations: [
      {
        line: 'def check_balance(assets, liabilities, equity):',
        explanation: 'تعريف دالة تستقبل 3 معاملات: الأصول والالتزامات وحقوق الملكية.',
      },
      {
        line: 'return assets == (liabilities + equity)',
        explanation:
          'مقارنة الطرفين؛ المعامل == يعيد True إذا تساوى الطرفان و False إذا اختلفا.',
      },
      {
        line: 'print("Balanced:", result)',
        explanation: 'طباعة نتيجة الفحص في الطرفية (Terminal).',
      },
    ],
    testDescription: 'يجب أن تطبع الشاشة النص Balanced: True',
    expectedOutputSubstring: 'Balanced: True',
    xpReward: 60,
  },
  {
    id: 'py-ex-2',
    title: '02. حساب عائد الاستثمار التسويقي (ROI %)',
    level: 'مبتدئ',
    businessContext:
      'يحتاج فريق التسويق الرقمي لحساب نسبة العائد على الاستثمار ROI% لأي حملة إعلانية بمعادلة: `((revenue - cost) / cost) * 100`.',
    prompt:
      'اكتب أو شغّل الدالة `calculate_roi(revenue, cost)` لحساب عائد حملة حققت إيرادات `4500` دينار بتكلفة `1500` دينار واطبع النتيجة.',
    starterCode: `def calculate_roi(revenue, cost):
    roi = ((revenue - cost) / cost) * 100
    return round(roi, 1)

print("ROI%:", calculate_roi(4500, 1500))`,
    solutionCode: `def calculate_roi(revenue, cost):
    roi = ((revenue - cost) / cost) * 100
    return round(roi, 1)

print("ROI%:", calculate_roi(4500, 1500))`,
    lineExplanations: [
      {
        line: 'roi = ((revenue - cost) / cost) * 100',
        explanation: 'طرح التكلفة من الإيراد للحصول على صافي الربح ثم قسمته على التكلفة وضربه في 100.',
      },
      {
        line: 'return round(roi, 1)',
        explanation: 'تقريب النتيجة لمنزلة عشرية واحدة لسهولة القراءة في التقارير.',
      },
    ],
    testDescription: 'يجب أن تطبع الشاشة ROI%: 200.0',
    expectedOutputSubstring: 'ROI%: 200.0',
    xpReward: 70,
  },
  {
    id: 'py-ex-3',
    title: '03. تصنيف شريحة العملاء باستخدام الشرط (if / elif / else)',
    level: 'متوسط',
    businessContext:
      'في إدارة علاقات العملاء (CRM)، نصنف العميل حسب مشترياته السنوية إلى: `VIP` (أكثر من أو يساوي 5000)، `Gold` (أكثر من أو يساوي 2000)، أو `Standard`.',
    prompt:
      'اختبر الدالة `classify_customer(annual_spend)` لعميل بلغت مشترياته `6200` دينار واطبع التصنيف.',
    starterCode: `def classify_customer(annual_spend):
    if annual_spend >= 5000:
        return "VIP"
    elif annual_spend >= 2000:
        return "Gold"
    else:
        return "Standard"

print("Tier:", classify_customer(6200))`,
    solutionCode: `def classify_customer(annual_spend):
    if annual_spend >= 5000:
        return "VIP"
    elif annual_spend >= 2000:
        return "Gold"
    else:
        return "Standard"

print("Tier:", classify_customer(6200))`,
    lineExplanations: [
      {
        line: 'if annual_spend >= 5000:',
        explanation: 'الشرط الأول يفحص الفئة الأعلى (VIP) أولاً.',
      },
      {
        line: 'elif annual_spend >= 2000:',
        explanation: 'إذا لم يتحقق الشرط الأول يفحص الفئة الذهبية (Gold).',
      },
    ],
    testDescription: 'يجب أن تطبع الشاشة Tier: VIP',
    expectedOutputSubstring: 'Tier: VIP',
    xpReward: 75,
  },
  {
    id: 'py-ex-4',
    title: '04. حساب نقطة التعادل الإدارية (Break-Even Units)',
    level: 'متوسط',
    businessContext:
      'تساعد أتمتة حساب نقطة التعادل مديري المنتجات على معرفة عدد الوحدات اللازم بيعها لتغطية التكاليف الثابتة.',
    prompt:
      'احسب نقطة التعادل لتكاليف ثابتة `12000` وسعر بيع `50` وتكلفة متغيرة للوحدة `20`.',
    starterCode: `def break_even_units(fixed_costs, price, variable_cost):
    margin = price - variable_cost
    return fixed_costs // margin

print("BreakEven:", break_even_units(12000, 50, 20))`,
    solutionCode: `def break_even_units(fixed_costs, price, variable_cost):
    margin = price - variable_cost
    return fixed_costs // margin

print("BreakEven:", break_even_units(12000, 50, 20))`,
    lineExplanations: [
      {
        line: 'margin = price - variable_cost',
        explanation: 'حساب هامش المساهمة للوحدة الواحدة.',
      },
      {
        line: 'return fixed_costs // margin',
        explanation: 'قسمة التكاليف الثابتة على هامش المساهمة للحصول على عدد الوحدات.',
      },
    ],
    testDescription: 'يجب أن تطبع الشاشة BreakEven: 400',
    expectedOutputSubstring: 'BreakEven: 400',
    xpReward: 80,
  },
  {
    id: 'py-ex-5',
    title: '05. تحليل قائمة المبيعات الشهرية باستخدام الحلقات (Loops & Lists)',
    level: 'متقدم',
    businessContext:
      'تحليل بيانات المبيعات الشهرية واستخراج مجموع المبيعات وعدد الأشهر التي تجاوزت المستهدف (`3000` دينار).',
    prompt:
      'استخدم حلقة `for` لحساب إجمالي المبيعات وعدد الأشهر الفائقة من القائمة `[2400, 3500, 4100, 2900, 5000]`.',
    starterCode: `monthly_sales = [2400, 3500, 4100, 2900, 5000]
total = 0
above_target = 0

for sale in monthly_sales:
    total += sale
    if sale >= 3000:
        above_target += 1

print("Total:", total, "| HighMonths:", above_target)`,
    solutionCode: `monthly_sales = [2400, 3500, 4100, 2900, 5000]
total = 0
above_target = 0

for sale in monthly_sales:
    total += sale
    if sale >= 3000:
        above_target += 1

print("Total:", total, "| HighMonths:", above_target)`,
    lineExplanations: [
      {
        line: 'for sale in monthly_sales:',
        explanation: 'المرور على كل قيمة مبيعات شهرية داخل القائمة.',
      },
      {
        line: 'if sale >= 3000: above_target += 1',
        explanation: 'زيادة عداد الأشهر التي حققت المستهدف بمقدار 1.',
      },
    ],
    testDescription: 'يجب أن تطبع الشاشة Total: 17900 | HighMonths: 3',
    expectedOutputSubstring: 'Total: 17900 | HighMonths: 3',
    xpReward: 100,
  },
];

/**
 * Deterministic fallback evaluator for Python exercises when Pyodide CDN is offline or still loading.
 */
export function evaluatePythonCodeFallback(
  code: string,
  exercise: PythonExercise
): PythonExecutionResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      passed: false,
      stdout: 'SyntaxError: الكود فارغ، يرجى كتابة كود بايثون قبل التشغيل.',
      feedback: 'أدخل الكود المطلوب ثم اضغط على تشغيل.',
      engine: 'simulator',
    };
  }

  // Check if user kept or wrote the core logic for each exercise
  if (
    exercise.id === 'py-ex-1' &&
    trimmed.includes('assets') &&
    trimmed.includes('liabilities + equity') &&
    trimmed.includes('15000')
  ) {
    const stdout = 'Balanced: True';
    return {
      passed: true,
      stdout,
      feedback: 'أحسنت! دالة التحقق من توازن الميزانية تعمل بدقة.',
      engine: 'simulator',
    };
  }

  if (
    exercise.id === 'py-ex-2' &&
    trimmed.includes('revenue - cost') &&
    trimmed.includes('4500')
  ) {
    const stdout = 'ROI%: 200.0';
    return {
      passed: true,
      stdout,
      feedback: 'ممتاز! معادلة حساب العائد على الاستثمار ROI% صحيحة تماماً.',
      engine: 'simulator',
    };
  }

  if (
    exercise.id === 'py-ex-3' &&
    trimmed.includes('if') &&
    trimmed.includes('VIP') &&
    trimmed.includes('6200')
  ) {
    const stdout = 'Tier: VIP';
    return {
      passed: true,
      stdout,
      feedback: 'رائع! شروط تصنيف شرائح العملاء تعمل بشكل سليم.',
      engine: 'simulator',
    };
  }

  if (
    exercise.id === 'py-ex-4' &&
    trimmed.includes('price - variable_cost') &&
    trimmed.includes('12000')
  ) {
    const stdout = 'BreakEven: 400';
    return {
      passed: true,
      stdout,
      feedback: 'عمل متقن! حساب نقطة التعادل بالوحدات مطابق للمعايير الإدارية.',
      engine: 'simulator',
    };
  }

  if (
    exercise.id === 'py-ex-5' &&
    trimmed.includes('for ') &&
    trimmed.includes('monthly_sales')
  ) {
    const stdout = 'Total: 17900 | HighMonths: 3';
    return {
      passed: true,
      stdout,
      feedback: 'إبداع! حلقة التكرار حللت قائمة المبيعات الشهرية بدقة.',
      engine: 'simulator',
    };
  }

  // Generic print extractor for custom print statements
  const printMatches = [...trimmed.matchAll(/print\((.+)\)/g)];
  if (printMatches.length > 0) {
    const rawOut = printMatches.map((m) => m[1].replace(/['"]/g, '')).join('\n');
    const passed = rawOut.includes(exercise.expectedOutputSubstring);
    return {
      passed,
      stdout: rawOut,
      feedback: passed
        ? 'تم اجتياز الاختبار بنجاح!'
        : `المخرجات الحالية لا تطابق النتيجة المتوقعة (${exercise.expectedOutputSubstring}).`,
      engine: 'simulator',
    };
  }

  return {
    passed: false,
    stdout: 'لم يتم العثور على مخرجات مطابقة.',
    feedback: `تأكد من استدعاء الدالة وطباعة النتيجة المتوقعة: ${exercise.expectedOutputSubstring}`,
    engine: 'simulator',
  };
}
