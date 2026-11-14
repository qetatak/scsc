import { LabId, SkillLevelName, StudentSkillMetric } from '@/types';

export function calculateSkillLevelFromXp(xp: number): {
  level: SkillLevelName;
  score: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const safeXp = Math.max(0, xp);
  const score = Math.min(100, Math.round((safeXp / 500) * 100));

  if (safeXp >= 450) {
    return {
      level: 'خبير',
      score: Math.min(100, Math.max(90, score)),
      nextLevelXp: 600,
      progressPercent: 100,
    };
  }
  if (safeXp >= 280) {
    return {
      level: 'متقدم',
      score: Math.max(72, score),
      nextLevelXp: 450,
      progressPercent: Math.round(((safeXp - 280) / (450 - 280)) * 100),
    };
  }
  if (safeXp >= 120) {
    return {
      level: 'متوسط',
      score: Math.max(45, score),
      nextLevelXp: 280,
      progressPercent: Math.round(((safeXp - 120) / (280 - 120)) * 100),
    };
  }
  return {
    level: 'مبتدئ',
    score: Math.max(20, score),
    nextLevelXp: 120,
    progressPercent: Math.round((safeXp / 120) * 100),
  };
}

export function generateStudentSkillMetrics(
  labXp: Record<LabId, number>
): StudentSkillMetric[] {
  const acc = calculateSkillLevelFromXp(labXp.accounting || 0);
  const mkt = calculateSkillLevelFromXp(labXp.marketing || 0);
  const mgmt = calculateSkillLevelFromXp(labXp.management || 0);
  const py = calculateSkillLevelFromXp(labXp.python || 0);

  return [
    {
      skillName: 'المحاسبة المالية وتوازن الميزانية',
      labId: 'accounting',
      score: acc.score,
      level: acc.level,
    },
    {
      skillName: 'التسويق الرقمي وتحليل العائد ROI',
      labId: 'marketing',
      score: mkt.score,
      level: mkt.level,
    },
    {
      skillName: 'إدارة الأعمال وتحليل SWOT والتعادل',
      labId: 'management',
      score: mgmt.score,
      level: mgmt.level,
    },
    {
      skillName: 'برمجة الأعمال وأتمتة البيانات بـ Python',
      labId: 'python',
      score: py.score,
      level: py.level,
    },
  ];
}

export function generateRadarChartAxes(labXp: Record<LabId, number>): {
  axis: string;
  value: number;
}[] {
  const acc = calculateSkillLevelFromXp(labXp.accounting || 0).score;
  const mkt = calculateSkillLevelFromXp(labXp.marketing || 0).score;
  const mgmt = calculateSkillLevelFromXp(labXp.management || 0).score;
  const py = calculateSkillLevelFromXp(labXp.python || 0).score;

  const analytical = Math.min(100, Math.round((acc + py) / 2));
  const strategic = Math.min(100, Math.round((mkt + mgmt) / 2));

  return [
    { axis: 'المحاسبة المالية', value: acc },
    { axis: 'التسويق والنمو', value: mkt },
    { axis: 'إدارة الأعمال', value: mgmt },
    { axis: 'برمجة Python', value: py },
    { axis: 'التحليل الرقمي', value: analytical },
    { axis: 'اتخاذ القرار', value: strategic },
  ];
}

export function calculateOverallCompetency(labXp: Record<LabId, number>): {
  overallScore: number;
  overallLevel: SkillLevelName;
} {
  const avgXp =
    ((labXp.accounting || 0) +
      (labXp.marketing || 0) +
      (labXp.management || 0) +
      (labXp.python || 0)) /
    4;
  const meta = calculateSkillLevelFromXp(avgXp);
  return {
    overallScore: meta.score,
    overallLevel: meta.level,
  };
}

