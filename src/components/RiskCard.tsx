import { AlertTriangle, AlertCircle, CheckCircle, ArrowRight, TrendingDown, Shield, Target, Lightbulb, MessageSquareWarning, FileSearch, ClipboardList } from 'lucide-react';
import { RiskAnalysis } from '../types';

interface RiskCardProps {
  analysis: RiskAnalysis;
}

export function RiskCard({ analysis }: RiskCardProps) {
  const riskConfig = {
    High: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      accentBar: 'bg-red-500',
      confidenceBg: 'bg-red-100',
    },
    Medium: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      accentBar: 'bg-amber-500',
      confidenceBg: 'bg-amber-100',
    },
    Low: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      accentBar: 'bg-emerald-500',
      confidenceBg: 'bg-emerald-100',
    },
  };

  const config = riskConfig[analysis.riskLevel];
  const Icon = config.icon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      {/* Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.accentBar}`} />

      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${config.bg} border ${config.border}`}>
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{analysis.accountName}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badge}`}>
                  <TrendingDown className="h-3 w-3" />
                  {analysis.riskLevel} Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Section */}
      {analysis.evidence && analysis.evidence.length > 0 && (
        <div className="px-5 pb-4">
          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <FileSearch className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2.5">
                Evidence
              </h4>
              <ul className="space-y-2">
                {analysis.evidence.map((item, index) => {
                  const [metric, reason] = item.includes(' — ') ? item.split(' — ') : [item, ''];
                  return (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                        analysis.riskLevel === 'High' ? 'bg-red-400' :
                        analysis.riskLevel === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <span>
                        <span className="font-medium text-slate-800">{metric}</span>
                        {reason && <span className="text-slate-500"> — {reason}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Confidence Meter */}
      <div className="px-5 pb-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <Target className={`h-4 w-4 ${
                analysis.confidenceScore >= 90 ? 'text-blue-600' :
                analysis.confidenceScore >= 70 ? 'text-amber-600' : 'text-slate-500'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Confidence</span>
                <span className="text-lg font-bold text-slate-900">{analysis.confidenceScore}%</span>
              </div>
            </div>
          </div>
          <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                analysis.confidenceScore >= 90 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                analysis.confidenceScore >= 70 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                'bg-gradient-to-r from-slate-400 to-slate-500'
              }`}
              style={{ width: `${analysis.confidenceScore}%` }}
            />
            {/* Threshold markers */}
            <div className="absolute top-0 bottom-0 left-[70%] w-px bg-slate-300/60" />
            <div className="absolute top-0 bottom-0 left-[90%] w-px bg-slate-300/60" />
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              analysis.confidenceScore >= 90 ? 'bg-blue-100 text-blue-700' :
              analysis.confidenceScore >= 70 ? 'bg-amber-100 text-amber-700' :
              'bg-slate-200 text-slate-600'
            }`}>
              {analysis.confidenceScore >= 90 ? 'High Confidence' :
               analysis.confidenceScore >= 70 ? 'Medium Confidence' : 'Low Confidence'}
            </span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span>Low &lt;70</span>
              <span>Med 70-89</span>
              <span>High 90+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors Section */}
      <div className="px-5 pb-4">
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <Shield className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Risk Factors
            </h4>
            <ul className="space-y-2">
              {analysis.topRiskFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    analysis.riskLevel === 'High' ? 'bg-red-400' :
                    analysis.riskLevel === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="px-5 pb-4">
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <MessageSquareWarning className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Explanation
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {analysis.churnExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Interventions Section */}
      {analysis.interventions && analysis.interventions.length > 0 && (
        <div className="px-5 pb-4">
          <div className={`flex items-start gap-3 rounded-xl border ${config.border} ${config.bg} p-4`}>
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <ClipboardList className={`h-4 w-4 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <h4 className={`text-xs font-semibold uppercase tracking-wide ${config.iconColor} mb-2.5`}>
                Recommended Interventions
              </h4>
              <ul className="space-y-2.5">
                {analysis.interventions.map((intervention, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      analysis.riskLevel === 'High' ? 'bg-red-200 text-red-700' :
                      analysis.riskLevel === 'Medium' ? 'bg-amber-200 text-amber-700' :
                      'bg-emerald-200 text-emerald-700'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{intervention}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Action Section */}
      <div className="px-5 pb-5">
        <div className={`flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4`}>
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <Lightbulb className={`h-4 w-4 ${config.iconColor}`} />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Summary Action
            </h4>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {analysis.recommendedAction}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-slate-100 bg-slate-50 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.98] transition-all">
          View Account Details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
