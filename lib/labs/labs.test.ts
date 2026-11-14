import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCOUNTING_SCENARIOS,
  applyAccountingScenario,
} from './accounting';
import {
  simulateMarketingCampaign,
  evaluateMarketingChallenge,
  MARKETING_CHALLENGES,
} from './marketing';
import { calculateBreakEven } from './management';
import {
  PYTHON_EXERCISES,
  evaluatePythonCodeFallback,
} from './python';
import {
  calculateSkillLevelFromXp,
  generateRadarChartAxes,
} from './skill-calculator';

test('accounting equation remains balanced across all 7 scenarios', () => {
  let state = { assets: 50000, liabilities: 15000, equity: 35000 };
  for (const scenario of ACCOUNTING_SCENARIOS) {
    const res = applyAccountingScenario(state, scenario);
    assert.equal(res.isBalanced, true, `Scenario ${scenario.id} broke balance`);
    assert.equal(res.newAssets, res.newLiabilities + res.newEquity);
    state = {
      assets: res.newAssets,
      liabilities: res.newLiabilities,
      equity: res.newEquity,
    };
  }
});

test('marketing simulation calculates CAC, customers, and ROI% and evaluates challenges', () => {
  const res = simulateMarketingCampaign({
    productPrice: 45,
    adBudget: 1200,
    channelId: 'search_seo',
  });
  assert.ok(res.expectedCustomers > 40);
  assert.ok(res.roiPercentage > 150);
  assert.ok(res.cac > 0);

  const challenge1 = MARKETING_CHALLENGES[0];
  assert.equal(evaluateMarketingChallenge(res, challenge1), true);
});

test('management break-even analysis calculates exact break-even units and revenue', () => {
  const res = calculateBreakEven({
    fixedCosts: 12000,
    variableCostPerUnit: 20,
    sellingPricePerUnit: 50,
  });
  assert.equal(res.isValid, true);
  assert.equal(res.contributionMarginPerUnit, 30);
  assert.equal(res.breakEvenUnits, 400);
  assert.equal(res.breakEvenRevenue, 20000);
  assert.ok(res.chartData.length >= 5);
});

test('python exercise fallback evaluator passes starter/solution code for all 5 exercises', () => {
  for (const ex of PYTHON_EXERCISES) {
    const evaluation = evaluatePythonCodeFallback(ex.solutionCode, ex);
    assert.equal(evaluation.passed, true, `Failed exercise ${ex.id}`);
    assert.ok(evaluation.stdout.includes(ex.expectedOutputSubstring));
  }
});

test('skill calculator maps XP to beginner, intermediate, advanced, and expert levels', () => {
  assert.equal(calculateSkillLevelFromXp(50).level, 'مبتدئ');
  assert.equal(calculateSkillLevelFromXp(180).level, 'متوسط');
  assert.equal(calculateSkillLevelFromXp(320).level, 'متقدم');
  assert.equal(calculateSkillLevelFromXp(500).level, 'خبير');

  const radar = generateRadarChartAxes({
    accounting: 400,
    marketing: 300,
    management: 350,
    python: 460,
  });
  assert.equal(radar.length, 6);
});
