import { RiskAnalysis } from '../types';
import { RiskCard } from './RiskCard';
import { AlertTriangle, AlertCircle, CheckCircle, Filter, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface AnalysisResultsProps {
  analyses: RiskAnalysis[];
}

type RiskFilter = 'all' | 'High' | 'Medium' | 'Low';

export function AnalysisResults({ analyses }: AnalysisResultsProps) {
  const [filter, setFilter] = useState<RiskFilter>('all');

  const stats = {
    total: analyses.length,
    high: analyses.filter(a => a.riskLevel === 'High').length,
    medium: analyses.filter(a => a.riskLevel === 'Medium').length,
    low: analyses.filter(a => a.riskLevel === 'Low').length,
  };

  const highPct = stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0;
  const medPct = stats.total > 0 ? Math.round((stats.medium / stats.total) * 100) : 0;
  const lowPct = stats.total > 0 ? Math.round((stats.low / stats.total) * 100) : 0;
  const avgConfidence = stats.total > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.confidenceScore, 0) / stats.total)
    : 0;

  const filteredAnalyses = filter === 'all'
    ? analyses
    : analyses.filter(a => a.riskLevel === filter);

  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.riskLevel] - order[b.riskLevel];
  });

  const metrics = [
    {
      key: 'all' as RiskFilter,
      label: 'Total Accounts',
      value: stats.total,
      pct: null,
      icon: Users,
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      activeBg: 'bg-slate-900',
      activeBorder: 'border-slate-900',
      activeColor: 'text-white',
      hoverBorder: 'hover:border-slate-400',
    },
    {
      key: 'High' as RiskFilter,
      label: 'High Risk',
      value: stats.high,
      pct: highPct,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      activeBg: 'bg-red-600',
      activeBorder: 'border-red-600',
      activeColor: 'text-white',
      hoverBorder: 'hover:border-red-300',
    },
    {
      key: 'Medium' as RiskFilter,
      label: 'Medium Risk',
      value: stats.medium,
      pct: medPct,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      activeBg: 'bg-amber-500',
      activeBorder: 'border-amber-500',
      activeColor: 'text-white',
      hoverBorder: 'hover:border-amber-300',
    },
    {
      key: 'Low' as RiskFilter,
      label: 'Low Risk',
      value: stats.low,
      pct: lowPct,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      activeBg: 'bg-emerald-600',
      activeBorder: 'border-emerald-600',
      activeColor: 'text-white',
      hoverBorder: 'hover:border-emerald-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Dashboard */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="h-5 w-5 text-slate-700" />
          <h3 className="text-base font-semibold text-slate-900">Portfolio Summary</h3>
          <span className="ml-auto text-xs text-slate-400 font-medium">Avg. confidence: {avgConfidence}%</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m) => {
            const isActive = filter === m.key;
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => setFilter(m.key)}
                className={`relative rounded-xl border p-5 text-left transition-all duration-200 ${
                  isActive
                    ? `${m.activeBg} ${m.activeBorder} text-white shadow-md`
                    : `border-slate-200 bg-white ${m.hoverBorder} hover:shadow-sm`
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`rounded-lg p-2 ${isActive ? 'bg-white/20' : m.bg}`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : m.color}`} />
                  </div>
                  {m.pct !== null && (
                    <span className={`text-xs font-semibold ${
                      isActive ? 'text-white/80' : 'text-slate-400'
                    }`}>
                      {m.pct}%
                    </span>
                  )}
                </div>
                <p className={`text-3xl font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {m.value}
                </p>
                <p className={`text-sm mt-1 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                  {m.label}
                </p>
                {m.pct !== null && !isActive && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        m.key === 'High' ? 'bg-red-500' :
                        m.key === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                )}
                {m.pct !== null && isActive && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/60 transition-all duration-700"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Distribution bar */}
        <div className="mt-5 flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium w-24 shrink-0">Distribution</span>
          <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
            {stats.high > 0 && (
              <div className="bg-red-500 h-full transition-all duration-700" style={{ width: `${highPct}%` }} />
            )}
            {stats.medium > 0 && (
              <div className="bg-amber-500 h-full transition-all duration-700" style={{ width: `${medPct}%` }} />
            )}
            {stats.low > 0 && (
              <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${lowPct}%` }} />
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-5 ml-24">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-red-500" /> High
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low
          </span>
        </div>
      </div>

      {/* Filter indicator */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Filter className="h-4 w-4" />
        <span>
          Showing {sortedAnalyses.length} account{sortedAnalyses.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` with ${filter} risk`}
        </span>
      </div>

      {/* Cards Grid */}
      {sortedAnalyses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {sortedAnalyses.map((analysis) => (
            <RiskCard key={analysis.accountId} analysis={analysis} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-slate-500">No accounts match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
