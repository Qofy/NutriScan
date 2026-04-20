'use client';

import { useState } from 'react';

export default function MedicalReportsPage() {
  const [isDragging, setIsDragging] = useState(false);

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
  };

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
              Upload medical reports
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Drag & drop PDF or image files here
            </p>
            <button className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors">
              Choose Files
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Reports</h2>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📑</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Blood Work Report
                    </h3>
                    <p className="text-sm text-gray-600">
                      Uploaded on April 15, 2026
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                  Diabetes Risk
                </span>
                <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full">
                  High Cholesterol
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  Processed
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📋</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Allergy Test Results
                    </h3>
                    <p className="text-sm text-gray-600">
                      Uploaded on April 10, 2026
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                  Peanut Allergy
                </span>
                <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                  Shellfish Allergy
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  Processed
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">❤️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Hypertension Report
                    </h3>
                    <p className="text-sm text-gray-600">
                      Uploaded on March 28, 2026
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full">
                  Stage 1 Hypertension
                </span>
                <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full">
                  Low Sodium Diet
                </span>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  Processed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
