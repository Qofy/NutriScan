'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRecentAnalyses, fetchRecentAnalyses, AnalysisResult } from '@/features/food-analysis';
import { AppDispatch } from '@/store';

export default function RecentScans() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: analyses, loading } = useSelector(selectRecentAnalyses);

  useEffect(() => {
    dispatch(fetchRecentAnalyses(10));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-6 border border-emerald-100">
        <h2 className="font-bold text-emerald-900 mb-4">Recent Scans</h2>
        <div className="text-center text-emerald-700">Loading...</div>
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-6 border border-emerald-100">
        <h2 className="font-bold text-emerald-900 mb-4">Recent Scans</h2>
        <div className="text-center text-emerald-700">No scans yet. Try uploading a food image!</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-6 border border-emerald-100">
      <h2 className="font-bold text-emerald-900 mb-4">Recent Scans</h2>
      <div className="space-y-3">
        {analyses.map((analysis: AnalysisResult) => (
          <div
            key={analysis.id}
            className="flex items-center justify-between bg-slate-50 rounded-lg p-4"
          >
            <div>
              <p className="font-medium text-gray-900">
                {analysis.recognized_items.map((item) => item.name).join(', ')}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(analysis.uploaded_at).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                analysis.safety_level === 'safe'
                  ? 'bg-emerald-100 text-emerald-800'
                  : analysis.safety_level === 'caution'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {analysis.safety_level === 'safe'
                ? '✅ Safe'
                : analysis.safety_level === 'caution'
                ? '⚠️ Caution'
                : '⛔ Danger'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
