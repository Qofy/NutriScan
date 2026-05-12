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
          {/* Mock Data Warning */}
          {report.extracted_data?.is_mock && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold text-sm">
                ⚠️ Unable to extract data from this file
              </p>
              <p className="text-red-700 text-xs mt-1">
                We couldn't read the content from your uploaded file. Please ensure it's a valid PDF or text file with medical information.
              </p>
            </div>
          )}

          {/* Extraction Method Info */}
          {report.extracted_data?.extraction_method && !report.extracted_data?.is_mock && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-xs">
                🔍 Extraction method: <span className="font-semibold capitalize">{report.extracted_data.extraction_method}</span>
              </p>
            </div>
          )}

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

          {/* Report Analysis Summary */}
          {report.extracted_data && report.extracted_data.extracted_summary && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Extracted Summary</h3>
              <p className="text-blue-800 text-sm whitespace-pre-wrap">
                {report.extracted_data.extracted_summary}
              </p>
            </div>
          )}

          {/* Fallback: Show detected items if no AI summary */}
          {report.extracted_data &&
            !report.extracted_data.extracted_summary &&
            (report.extracted_data.conditions?.length > 0 ||
              report.extracted_data.allergens?.length > 0) && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Detected Health Information</h3>
                <p className="text-blue-800 text-sm">
                  From our extraction, we found:{' '}
                  <span className="font-semibold">
                    {[
                      ...(report.extracted_data?.conditions?.map((c: any) => c.condition) || []),
                      ...(report.extracted_data?.allergens?.map((a: any) => `${a.allergen}`) || []),
                    ].join(', ')}
                  </span>
                </p>
              </div>
            )}

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
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800 font-semibold">⚠️ No data extracted</p>
                    <p className="text-yellow-700 text-sm mt-2">
                      We couldn't extract health information from this report. Please ensure the document contains clear medical data.
                    </p>
                  </div>
                )}
            </>
          )}

          {!report.extracted_data && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 font-semibold">⚠️ Extraction pending</p>
              <p className="text-yellow-700 text-sm mt-2">
                We're still processing this report. Please refresh in a moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
