'use client';

import { ClipboardList, Upload, Loader2 } from 'lucide-react';
interface UploadSectionProps {
  isDragging: boolean;
  uploading: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onChooseFiles: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadSection({
  isDragging,
  uploading,
  onDragOver,
  onDragLeave,
  onDrop,
  onChooseFiles,
  fileInputRef,
  onFileInputChange,
}: UploadSectionProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragging
            ? 'border-teal-500 bg-orange-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <ClipboardList className="mx-auto mb-4 text-teal-500" size={48} />
        <p className="font-semibold text-slate-900 mb-2">
          {uploading ? 'Uploading...' : 'Upload medical reports'}
        </p>
        <p className="text-sm text-slate-600 mb-4">Drag & drop PDF or image files here</p>
        <button
          onClick={onChooseFiles}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {uploading
            ? <><Loader2 size={16} className="animate-spin" /> Uploading...</>
            : <><Upload size={16} /> Choose Files</>}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onFileInputChange}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-4">
          Supported formats: PDF, JPG, PNG (Max 10MB)
        </p>
      </div>
    </div>
  );
}
