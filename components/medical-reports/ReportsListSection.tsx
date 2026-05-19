'use client';

import { useState, useEffect } from 'react';
import { MedicalReport } from '@/features/medical-reports';
import ReportCard from './ReportCard';

interface ReportsListSectionProps {
  reports: MedicalReport[];
  loading: boolean;
  onViewReport: (report: MedicalReport) => void;
  onDeleteReport: (reportId: number) => void;
}

export default function ReportsListSection({
  reports,
  loading,
  onViewReport,
  onDeleteReport,
}: ReportsListSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Reports (0)</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl bg-gray-200 h-32 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Your Reports ({reports.length})</h2>

      {loading && !reports.length && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl bg-gray-200 h-32 animate-pulse"></div>
          ))}
        </div>
      )}

      {!loading && reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No medical reports yet. Upload one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onView={onViewReport}
              onDelete={onDeleteReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
