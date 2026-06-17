import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AccountData } from '../types';

interface DataTableProps {
  data: AccountData[];
}

export function DataTable({ data }: DataTableProps) {
  if (data.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Account Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Monthly Logins
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Support Tickets
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Feature Usage Change
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                NPS Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 20).map((account) => (
              <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {account.accountName}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium ${
                      account.monthlyLogins >= 30
                        ? 'bg-green-100 text-green-700'
                        : account.monthlyLogins >= 15
                        ? 'bg-blue-100 text-blue-700'
                        : account.monthlyLogins >= 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {account.monthlyLogins}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      account.supportTickets > 10
                        ? 'bg-red-100 text-red-700'
                        : account.supportTickets > 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : account.supportTickets > 2
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {account.supportTickets}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {account.featureUsageChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : account.featureUsageChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-slate-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        account.featureUsageChange > 0
                          ? 'text-green-600'
                          : account.featureUsageChange < 0
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {account.featureUsageChange > 0 ? '+' : ''}
                      {account.featureUsageChange}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`font-medium ${
                      account.npsScore >= 9
                        ? 'text-green-600'
                        : account.npsScore >= 7
                        ? 'text-blue-600'
                        : account.npsScore >= 0
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {account.npsScore >= 9 ? 'Promoter' : account.npsScore >= 7 ? 'Passive' : 'Detractor'} ({account.npsScore})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 20 && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Showing 20 of {data.length} accounts
        </div>
      )}
    </div>
  );
}
