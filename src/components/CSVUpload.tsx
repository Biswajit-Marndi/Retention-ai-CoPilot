import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { AccountData } from '../types';

interface CSVUploadProps {
  onDataLoaded: (data: AccountData[]) => void;
}

export function CSVUpload({ onDataLoaded }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseCSV = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: AccountData[] = (results.data as Record<string, string>[]).map((row, index) => ({
            id: `acc-${index + 1}`,
            accountName: row['Account Name'] || row.accountName || row.account_name || `Account ${index + 1}`,
            monthlyLogins: parseFloat(row['Monthly Logins'] || row.monthlyLogins || row.monthly_logins || '0'),
            supportTickets: parseFloat(row['Support Tickets'] || row.supportTickets || row.support_tickets || '0'),
            featureUsageChange: parseFloat(row['Feature Usage Change %'] || row.featureUsageChange || row.feature_usage_change || '0'),
            npsScore: parseFloat(row['NPS Score'] || row.npsScore || row.nps_score || '0'),
          }));

          if (data.length === 0) {
            setError('CSV file is empty. Please upload a file with account data.');
            setIsLoading(false);
            return;
          }

          onDataLoaded(data);
          setFileName(file.name);
          setIsLoading(false);
        } catch (err) {
          setError('Failed to parse CSV data. Please check the format.');
          setIsLoading(false);
        }
      },
      error: () => {
        setError('Failed to read CSV file. Please try again.');
        setIsLoading(false);
      },
    });
  }, [onDataLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      parseCSV(file);
    } else if (file && file.name.endsWith('.csv')) {
      parseCSV(file);
    } else {
      setError('Please upload a valid CSV file.');
    }
  }, [parseCSV]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseCSV(file);
    }
  }, [parseCSV]);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-slate-100'
        } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className={`rounded-full p-4 ${isDragging ? 'bg-blue-100' : 'bg-slate-200'}`}>
          {fileName ? (
            <FileText className="h-8 w-8 text-blue-600" />
          ) : (
            <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
          )}
        </div>

        <div className="mt-4 text-center">
          {fileName ? (
            <>
              <p className="text-sm font-medium text-slate-900">{fileName}</p>
              <p className="mt-1 text-xs text-slate-500">Click or drag to replace</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-900">
                Drop your CSV file here
              </p>
              <p className="mt-1 text-xs text-slate-500">
                or click to browse
              </p>
            </>
          )}
        </div>

        <div className="mt-4 max-w-md text-center">
          <p className="text-xs text-slate-400">
            Expected columns: Account Name, Monthly Logins, Support Tickets, Feature Usage Change %, NPS Score
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-3 text-center text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing file...
          </span>
        </div>
      )}
    </div>
  );
}
