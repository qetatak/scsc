import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  gradeAccountingAssignment,
  gradeMarketingAssignment,
  gradeManagementAssignment,
  generateStudentManagementVariables,
  gradePythonAssignment,
} from './index';

describe('Auto-Grading Pure Engine (lib/grading)', () => {
  it('grades accounting journal entries with partial credit and detects reversed accounts', () => {
    const config = {
      operationsPrompt: ['شراء معدات مكتبية نقداً بقيمة 2500 دينار'],
      availableAccounts: ['المعدات المكتبية', 'النقدية والبنك', 'حسابات الدائنين'],
      modelEntries: [
        {
          id: 'e1',
          description: 'شراء معدات نقداً',
          debitAccount: 'المعدات المكتبية',
          creditAccount: 'النقدية والبنك',
          debitAmount: 2500,
          creditAmount: 2500,
        },
      ],
    };

    // Perfect submission
    const perfect = gradeAccountingAssignment(
      config,
      [
        {
          id: 's1',
          description: 'شراء معدات نقداً',
          debitAccount: 'المعدات المكتبية',
          creditAccount: 'النقدية والبنك',
          debitAmount: 2500,
          creditAmount: 2500,
        },
      ],
      100
    );
    assert.equal(perfect.autoScore, 100);
    assert.equal(perfect.passed, true);
    assert.equal(perfect.detectedErrorTags.length, 0);

    // Reversed debit/credit accounts
    const reversed = gradeAccountingAssignment(
      config,
      [
        {
          id: 's1',
          description: 'شراء معدات نقداً',
          debitAccount: 'النقدية والبنك',
          creditAccount: 'المعدات المكتبية',
          debitAmount: 2500,
          creditAmount: 2500,
        },
      ],
      100
    );
    assert.ok(reversed.detectedErrorTags.includes('قيد دائن مقلوب'));
    assert.ok(reversed.autoScore > 0 && reversed.autoScore < 60);
  });

  it('grades marketing campaigns against ROI, CAC, and budget targets', () => {
    const config = {
      scenarioContext: 'إطلاق حملة تسويق رقمي لشركة برمجيات',
      maxBudgetJod: 1500,
      minRoiPercent: 40,
      maxCacJod: 35,
      minCustomers: 30,
    };

    const passingResult = gradeMarketingAssignment(
      config,
      {
        channelId: 'search_seo',
        productPrice: 55,
        adBudget: 1200,
      },
      100
    );
    assert.equal(passingResult.passed, true);
    assert.equal(passingResult.autoScore, 100);
  });

  it('generates randomized break-even variables per student and grades within tolerance', () => {
    const config = {
      mode: 'breakeven' as const,
      baseFixedCosts: 12000,
      baseVariableCostPerUnit: 20,
      baseSellingPricePerUnit: 50,
      randomizePerStudent: true,
      tolerancePercent: 5,
      swotMinItemsPerQuadrant: 2,
      swotRequiredKeywords: [],
    };

    const varsA = generateStudentManagementVariables('yazan-nabulsi', config);
    const varsB = generateStudentManagementVariables('razan-abdallat', config);
    assert.notDeepEqual(varsA, varsB);

    const exactMargin = varsA.sellingPricePerUnit - varsA.variableCostPerUnit;
    const exactUnits = Math.ceil(varsA.fixedCosts / exactMargin);

    const report = gradeManagementAssignment(
      config,
      {
        studentBreakEvenUnits: exactUnits,
        studentContributionMargin: exactMargin,
        assignedFixedCosts: varsA.fixedCosts,
        assignedVariableCost: varsA.variableCostPerUnit,
        assignedPrice: varsA.sellingPricePerUnit,
      },
      100
    );
    assert.equal(report.autoScore, 100);
    assert.equal(report.passed, true);
  });

  it('grades Python code against visible and hidden test cases', () => {
    const config = {
      functionName: 'calculate_net_profit',
      starterCode: 'def calculate_net_profit(rev, exp):\n    pass',
      referenceSolution: 'def calculate_net_profit(rev, exp):\n    return round(rev - exp, 2)',
      timeoutMs: 3000,
      testCases: [
        {
          id: 'tc1',
          label: 'حساب صافي الربح الأساسي',
          inputExpr: 'calculate_net_profit(10000, 6500)',
          expectedOutput: '3500',
          isHidden: false,
          weight: 50,
        },
        {
          id: 'tc2',
          label: 'التعامل مع الكسور العشرية',
          inputExpr: 'calculate_net_profit(500.755, 200.25)',
          expectedOutput: '300.51',
          isHidden: true,
          weight: 50,
        },
      ],
    };

    const goodCode = `def calculate_net_profit(rev, exp):\n    return round(rev - exp, 2)`;
    const passReport = gradePythonAssignment(config, goodCode, 100);
    assert.equal(passReport.autoScore, 100);
    assert.equal(passReport.passed, true);
  });
});
