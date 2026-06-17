import { AccountData, RiskAnalysis, RiskLevel } from '../types';

function calculateRiskScore(account: AccountData): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 0;

  // Monthly Logins analysis (lower is worse)
  if (account.monthlyLogins < 5) {
    score += 30;
    factors.push('Critical: Very low monthly login activity indicates disengagement');
  } else if (account.monthlyLogins < 15) {
    score += 20;
    factors.push('Below-average monthly login frequency detected');
  } else if (account.monthlyLogins < 30) {
    score += 10;
    factors.push('Moderate login activity - room for improvement');
  }

  // Support Tickets (high is concerning)
  if (account.supportTickets > 10) {
    score += 25;
    factors.push('High support ticket volume indicates significant friction');
  } else if (account.supportTickets > 5) {
    score += 15;
    factors.push('Elevated support requests detected');
  } else if (account.supportTickets > 2) {
    score += 5;
    factors.push('Some support tickets - monitor for escalation');
  }

  // Feature Usage Change % (negative is concerning)
  if (account.featureUsageChange < -30) {
    score += 30;
    factors.push('Critical: Significant decline in feature usage detected');
  } else if (account.featureUsageChange < -10) {
    score += 20;
    factors.push('Declining feature usage trend - intervention needed');
  } else if (account.featureUsageChange < 0) {
    score += 10;
    factors.push('Slight decrease in feature usage observed');
  } else if (account.featureUsageChange > 20) {
    score -= 5;
    factors.push('Positive feature adoption growth');
  }

  // NPS Score (lower is worse)
  if (account.npsScore < 0) {
    score += 30;
    factors.push('Detractor NPS score signals strong dissatisfaction');
  } else if (account.npsScore < 7) {
    score += 20;
    factors.push('Passive NPS score requires attention');
  } else if (account.npsScore < 9) {
    score += 5;
    factors.push('Good NPS but potential for improvement');
  }

  return { score: Math.max(0, Math.min(score, 100)), factors };
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 60) return 'High';
  if (score >= 35) return 'Medium';
  return 'Low';
}

function generateExplanation(account: AccountData, riskLevel: RiskLevel): string {
  const explanations: Record<RiskLevel, string[]> = {
    High: [
      `${account.accountName} shows critical warning signs requiring immediate intervention.`,
      'Multiple risk indicators suggest this account may churn within the next 90 days if no action is taken.',
      'The combination of low engagement metrics and support issues points to underlying satisfaction problems.',
    ],
    Medium: [
      `${account.accountName} exhibits concerning patterns that warrant proactive outreach.`,
      'Several metrics indicate potential dissatisfaction that could escalate without attention.',
      'Monitor this account closely as risk factors could increase.',
    ],
    Low: [
      `${account.accountName} demonstrates healthy engagement patterns.`,
      'Current metrics suggest strong product adoption and satisfaction.',
      'Continue monitoring to maintain positive trajectory.',
    ],
  };

  const levelExplanations = explanations[riskLevel];
  return levelExplanations[Math.floor(Math.random() * levelExplanations.length)];
}

function generateRecommendation(riskLevel: RiskLevel, factors: string[], account: AccountData): string {
  if (riskLevel === 'High') {
    if (factors.some(f => f.includes('login') || f.includes('Login'))) {
      return `Schedule an urgent executive business review with ${account.accountName} to understand engagement barriers and re-establish value.`;
    }
    if (factors.some(f => f.includes('support') || f.includes('Support'))) {
      return `Escalate support issues to engineering team and schedule follow-up call to resolve outstanding concerns.`;
    }
    if (factors.some(f => f.includes('feature') || f.includes('Feature'))) {
      return `Organize a product training session focusing on underutilized features that align with their use case.`;
    }
    return `Initiate immediate outreach to key stakeholders. Consider offering a success plan review and potential contract incentives.`;
  }

  if (riskLevel === 'Medium') {
    if (factors.some(f => f.includes('feature') || f.includes('Feature'))) {
      return `Send targeted feature guides and invite to upcoming product webinars to boost adoption.`;
    }
    if (factors.some(f => f.includes('NPS'))) {
      return `Conduct a feedback call to understand pain points and demonstrate responsiveness to their concerns.`;
    }
    return `Schedule a quarterly business review to reinforce value and identify expansion opportunities.`;
  }

  return `Continue proactive engagement. Consider this account for case study or referral program participation.`;
}

export function analyzeAccount(account: AccountData): RiskAnalysis {
  const { score, factors } = calculateRiskScore(account);
  const riskLevel = getRiskLevel(score);
  const topFactors = factors.slice(0, 3);

  // Pad factors if less than 3
  while (topFactors.length < 3) {
    topFactors.push('Standard monitoring recommended');
  }

  return {
    accountId: account.id,
    accountName: account.accountName,
    riskLevel,
    churnExplanation: generateExplanation(account, riskLevel),
    topRiskFactors: topFactors,
    recommendedAction: generateRecommendation(riskLevel, topFactors, account),
    confidenceScore: Math.floor(70 + Math.random() * 25),
  };
}

export function analyzeAllAccounts(accounts: AccountData[]): RiskAnalysis[] {
  return accounts.map(analyzeAccount);
}
