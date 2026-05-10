'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { uploadMedicalReport, fetchMedicalReports, deleteMedicalReport } from '@/features/medical-reports';
import { Trash2, Eye, X } from 'lucide-react';
import { MedicalReport } from '@/features/medical-reports';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function MedicalReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isDragging, setIsDragging] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { reports, uploading, error, loading } = useSelector((state: RootState) => state.medicalReports);

  useEffect(() => {
    const id = window.setTimeout(() => setIsHydrated(true), 0);
    dispatch(fetchMedicalReports());
    return () => clearTimeout(id);
  }, [dispatch]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload PDF, JPG, or PNG.';
    }
    if (file.size > MAX_SIZE) {
      return 'File size exceeds 10MB limit.';
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    try {
      await dispatch(uploadMedicalReport(file) as any);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDelete = async (reportId: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      await dispatch(deleteMedicalReport(reportId) as any);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

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

  if (!isHydrated) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full">
          <div className="mb-8 h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="rounded-2xl p-6 h-40 bg-gray-100 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Medical Reports 📄
          </h1>
          <p className="text-gray-600 mt-2">
            Upload your medical reports for analysis and health insights
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <p className="text-4xl mb-4">📋</p>
            <p className="font-semibold text-gray-900 mb-2">
              {uploading ? 'Uploading...' : 'Upload medical reports'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Drag & drop PDF or image files here
            </p>
            <button
              onClick={handleChooseFiles}
              disabled={uploading}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Reports ({isHydrated ? reports.length : 0})
          </h2>

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
                <div
                  key={report.id}
                  className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
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
                          onClick={() => setSelectedReport(report)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                          title="View summary"
                        >
                          <Eye size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(report.id)}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Extracted Summary</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Report Name</h3>
                <p className="text-gray-700">{selectedReport.document?.split('/').pop() || 'Medical Report'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Date</h3>
                <p className="text-gray-700">
                  {new Date(selectedReport.uploaded_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {selectedReport.extracted_data && (
                <>
                  {selectedReport.extracted_data.conditions && selectedReport.extracted_data.conditions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">🏥 Conditions</h3>
                      <div className="space-y-2">
                        {selectedReport.extracted_data.conditions.map((condition: any, idx: number) => (
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

                  {selectedReport.extracted_data.allergens && selectedReport.extracted_data.allergens.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">⚠️ Allergens</h3>
                      <div className="space-y-2">
                        {selectedReport.extracted_data.allergens.map((allergen: any, idx: number) => (
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

                  {selectedReport.extracted_data.dietary_restrictions && selectedReport.extracted_data.dietary_restrictions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">🍽️ Dietary Restrictions</h3>
                      <div className="space-y-2">
                        {selectedReport.extracted_data.dietary_restrictions.map((restriction: any, idx: number) => (
                          <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="font-medium text-blue-900">{restriction.restriction}</p>
                            {restriction.reason && (
                              <p className="text-sm text-blue-700 mt-1">Reason: {restriction.reason}</p>
                            )}
                            {restriction.recommendation && (
                              <p className="text-sm text-blue-700 mt-1">Recommendation: {restriction.recommendation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!selectedReport.extracted_data.conditions || selectedReport.extracted_data.conditions.length === 0) &&
                    (!selectedReport.extracted_data.allergens || selectedReport.extracted_data.allergens.length === 0) &&
                    (!selectedReport.extracted_data.dietary_restrictions ||
                      selectedReport.extracted_data.dietary_restrictions.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No extracted data available for this report.</p>
                      </div>
                    )}
                </>
              )}

              {!selectedReport.extracted_data && (
                <div className="text-center py-8 text-gray-500">
                  <p>No extracted data available for this report.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
