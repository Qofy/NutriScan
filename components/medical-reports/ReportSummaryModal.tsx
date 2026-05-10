'use client';

import { X } from 'lucide-react';
import { MedicalReport } from '@/features/medical-reports';

interface ReportSummaryModalProps {
  report: MedicalReport;
  onClose: () => void;
}

export default function ReportSummaryModal({ report, onClose }: ReportSummaryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Extracted Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Report Name</h3>
            <p className="text-gray-700">{report.document?.split('/').pop() || 'Medical Report'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Date</h3>
            <p className="text-gray-700">
              {new Date(report.uploaded_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {report.extracted_data && (
            <>
              {report.extracted_data.conditions && report.extracted_data.conditions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🏥 Conditions</h3>
                  <div className="space-y-2">
                    {report.extracted_data.conditions.map((condition: any, idx: number) => (
                      <div key={idx} className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <p className="font-medium text-red-900">{condition.condition}</p>
                        {condition.confidence && (
                          <p className="text-xs text-red-600 mt-1">
                            Confidence: {Math.round(condition.confidence * 100)}%
                          </p>
                        )}
                        {condition.severity && (
                          <p className="text-xs text-red-600 mt-1">Severity: {condition.severity}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.extracted_data.allergens && report.extracted_data.allergens.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">⚠️ Allergens</h3>
                  <div className="space-y-2">
                    {report.extracted_data.allergens.map((allergen: any, idx: number) => (
                      <div key={idx} className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <p className="font-medium text-yellow-900">{allergen.allergen}</p>
                        {allergen.confidence && (
                          <p className="text-xs text-yellow-600 mt-1">
                            Confidence: {Math.round(allergen.confidence * 100)}%
                          </p>
                        )}
                        {allergen.severity && (
                          <p className="text-xs text-yellow-600 mt-1">Severity: {allergen.severity}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.extracted_data.dietary_restrictions &&
                report.extracted_data.dietary_restrictions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">🍽️ Dietary Restrictions</h3>
                    <div className="space-y-2">
                      {report.extracted_data.dietary_restrictions.map((restriction: any, idx: number) => (
                        <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="font-medium text-blue-900">{restriction.restriction}</p>
                          {restriction.reason && (
                            <p className="text-sm text-blue-700 mt-1">Reason: {restriction.reason}</p>
                          )}
                          {restriction.recommendation && (
                            <p className="text-sm text-blue-700 mt-1">
                              Recommendation: {restriction.recommendation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(!report.extracted_data.conditions || report.extracted_data.conditions.length === 0) &&
                (!report.extracted_data.allergens || report.extracted_data.allergens.length === 0) &&
                (!report.extracted_data.dietary_restrictions ||
                  report.extracted_data.dietary_restrictions.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No extracted data available for this report.</p>
                  </div>
                )}
            </>
          )}

          {!report.extracted_data && (
            <div className="text-center py-8 text-gray-500">
              <p>No extracted data available for this report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
