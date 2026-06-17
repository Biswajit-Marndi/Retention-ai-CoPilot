export interface AccountData {
  id: string;
  accountName: string;
  monthlyLogins: number;
  supportTickets: number;
  featureUsageChange: number;
  npsScore: number;
}

export interface RiskAnalysis {
  accountId: string;
  accountName: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  evidence: string[];
  churnExplanation: string;
  topRiskFactors: string[];
  interventions: string[];
  recommendedAction: string;
  confidenceScore: number;
}

export type RiskLevel = 'High' | 'Medium' | 'Low';
