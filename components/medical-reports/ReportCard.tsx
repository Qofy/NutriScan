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
      return 'bg-emerald-50 text-emerald-700';
    case 'processing':
      return 'bg-blue-50 text-blue-700';
    case 'error':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

export default function ReportCard({ report, onView, onDelete }: ReportCardProps) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-3xl">📄</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {report.document?.split('/').pop() || 'Medical Report'}
            </h3>
            <p className="text-sm text-gray-600">
              Uploaded on{' '}
              {new Date(report.uploaded_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {report.status === 'completed' && (
            <button
              onClick={() => onView(report)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-2"
              title="View summary"
            >
              <Eye size={20} />
            </button>
          )}
          <button
            onClick={() => onDelete(report.id)}
            className="text-gray-400 hover:text-red-600 transition-colors p-2"
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
              <span key={idx} className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                {restriction.restriction}
              </span>
            ))}
          </>
        )}
      </div>

      {report.status === 'processing' && (
        <p className="text-sm text-gray-600">Processing your report. Please wait...</p>
      )}

      {report.status === 'error' && (
        <p className="text-sm text-red-600">Error processing report. Please try again.</p>
      )}
    </div>
  );
}
