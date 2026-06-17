import { useState } from 'react';
import { BarChart3, Sparkles, FileSpreadsheet, AlertTriangle, AlertCircle, Zap } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CSVUpload } from './components/CSVUpload';
import { DataTable } from './components/DataTable';
import { AnalysisResults } from './components/AnalysisResults';
import { AccountData, RiskAnalysis } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const SAMPLE_DATA: AccountData[] = [
  {
    id: '1',
    accountName: 'Acme Corp',
    monthlyLogins: 5,
    featureUsageChange: 30,
    supportTickets: 12,
    npsScore: 4,
  },
];

function App() {
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [analyses, setAnalyses] = useState<RiskAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadSampleData = () => {
    setAccountData(SAMPLE_DATA);
    setError(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-churn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accounts: accountData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze accounts');
      }

      const data = await response.json();
      setAnalyses(data.analyses);
      setHasAnalyzed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAccountData([]);
    setAnalyses([]);
    setHasAnalyzed(false);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title="Churn Risk Analysis"
          subtitle="Upload customer data to identify at-risk accounts"
        />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Upload / Preview / Analyze Section */}
            {!hasAnalyzed && (
              <div className="space-y-6">
                {/* Upload Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Upload Customer Data</h2>
                  </div>
                  <CSVUpload onDataLoaded={setAccountData} />

                  {accountData.length === 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 p-4 border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-700">No data available?</p>
                        <p className="text-xs text-slate-500">Load sample customer data to test the analysis</p>
                      </div>
                      <button
                        onClick={handleLoadSampleData}
                        className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        <Zap className="h-4 w-4 text-amber-500" />
                        Load Sample Data
                      </button>
                    </div>
                  )}
                </div>

                {/* Data Preview */}
                {accountData.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-slate-600" />
                        <h2 className="text-lg font-semibold text-slate-900">Data Preview</h2>
                      </div>
                      <span className="text-sm text-slate-500">
                        {accountData.length} account{accountData.length !== 1 ? 's' : ''} loaded
                      </span>
                    </div>
                    <DataTable data={accountData} />
                  </div>
                )}

                {/* Analyze Button */}
                {accountData.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="font-medium text-slate-900">Ready to analyze</p>
                          <p className="text-sm text-slate-500">
                            Generate AI-powered churn risk explanations for {accountData.length} accounts
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      >
                        {isAnalyzing ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Analyze Accounts
                          </>
                        )}
                      </button>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Analysis Error</p>
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Results Section */}
            {hasAnalyzed && analyses.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Risk Analysis Results</h2>
                    <p className="text-sm text-slate-500">
                      AI-powered churn risk assessment complete
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Upload New Data
                  </button>
                </div>

                <AnalysisResults analyses={analyses} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
