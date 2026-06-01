'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { uploadMedicalReport, fetchMedicalReports, deleteMedicalReport } from '@/features/medical-reports';
import { MedicalReport } from '@/features/medical-reports';
import UploadSection from './UploadSection';
import ReportsListSection from './ReportsListSection';
import ReportSummaryModal from './ReportSummaryModal';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function MedicalReportsClient() {
  const dispatch = useDispatch<AppDispatch>();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { reports, uploading, error, loading } = useSelector((state: RootState) => state.medicalReports);

  useEffect(() => {
    dispatch(fetchMedicalReports());
  }, [dispatch]);

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
    console.log('📄 [MEDICAL] Medical report upload started');
    console.log('📋 [MEDICAL] File details:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
    });

    const validationError = validateFile(file);
    if (validationError) {
      console.error('❌ [MEDICAL] Validation failed:', validationError);
      alert(validationError);
      return;
    }

    try {
      console.log('⏳ [MEDICAL] Uploading to backend...');
      const startTime = performance.now();
      const result = await dispatch(uploadMedicalReport(file) as any);
      const endTime = performance.now();
      console.log(`✅ [MEDICAL] Upload successful! (${(endTime - startTime).toFixed(2)}ms)`);
      console.log('📊 [MEDICAL] Result:', result);
    } catch (err) {
      console.error('❌ [MEDICAL] Upload failed:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
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

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <UploadSection
        isDragging={isDragging}
        uploading={uploading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onChooseFiles={handleChooseFiles}
        fileInputRef={fileInputRef}
        onFileInputChange={handleFileInputChange}
      />

      <ReportsListSection
        reports={reports}
        loading={loading}
        onViewReport={setSelectedReport}
        onDeleteReport={handleDelete}
      />

      {selectedReport && (
        <ReportSummaryModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
