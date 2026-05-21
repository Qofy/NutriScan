'use client';

import { Eye, Trash2 } from 'lucide-react';
import { MedicalReport } from '@/features/medical-reports';

interface ReportCardProps {
  report: MedicalReport;
  onView: (report: MedicalReport) => void;
  onDelete: (reportId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-orange-50 text-orange-700';
    case 'processing':
      return 'bg-red-50 text-red-700';
    case 'error':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-slate-700';
  }
};

export default function ReportCard({ report, onView, onDelete }: ReportCardProps) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="text-2xl sm:text-3xl flex-shrink-0">📄</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 break-words text-sm sm:text-base">
              {report.document?.split('/').pop() || 'Medical Report'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Uploaded on{' '}
              {new Date(report.uploaded_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          {report.status === 'completed' && (
            <button
              onClick={() => onView(report)}
              className="text-slate-400 hover:text-red-600 transition-colors p-2.5 hover:bg-red-50 rounded-lg"
              title="View summary"
            >
              <Eye size={20} />
            </button>
          )}
          <button
            onClick={() => onDelete(report.id)}
            className="text-slate-400 hover:text-red-600 transition-colors p-2.5 hover:bg-red-50 rounded-lg"
            title="Delete report"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </span>

        {report.status === 'completed' && report.extracted_data && (
          <>
            {report.extracted_data.conditions?.map((condition: any, idx: number) => (
              <span key={idx} className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                {condition.condition}
              </span>
            ))}

            {report.extracted_data.allergens?.map((allergen: any, idx: number) => (
              <span key={idx} className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full">
                {allergen.allergen}
              </span>
            ))}

            {report.extracted_data.dietary_restrictions?.map((restriction: any, idx: number) => (
              <span key={idx} className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                {restriction.restriction}
              </span>
            ))}
          </>
        )}
      </div>

      {report.status === 'processing' && (
        <p className="text-sm text-slate-600">Processing your report. Please wait...</p>
      )}

      {report.status === 'error' && (
        <p className="text-sm text-red-600">Error processing report. Please try again.</p>
      )}
    </div>
  );
}
