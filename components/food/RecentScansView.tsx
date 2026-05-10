'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Calendar, AlertCircle } from 'lucide-react';
import ScanDetailsModal from './ScanDetailsModal';
import { fetchRecentAnalyses, selectCurrentAnalysis } from '@/features/food-analysis';
import { AppDispatch, RootState } from '@/store';
import type { AnalysisResult } from '@/features/food-analysis';

export default function RecentScansView() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: recentScans, loading, error } = useSelector(
    (state: RootState) => state.foodAnalysis.recentAnalyses
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    dispatch(fetchRecentAnalyses(50) as any);
  }, [dispatch]);

  const openScan = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeScan = () => {
    setIsModalOpen(false);
    setSelectedIndex(null);
  };

  const navigateScan = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;

    if (direction === 'prev' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (direction === 'next' && selectedIndex < recentScans.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'bg-green-100 text-green-800';
      case 'caution':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'safe':
        return '✓';
      case 'caution':
        return '⚠';
      case 'danger':
        return '✕';
      default:
        return '•';
    }
  };

  // Show neutral loading state during hydration to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading your scans...</div>
      </div>
    );
  }

  if (loading && recentScans.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading your scans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-red-800">
        <div className="flex gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to load scans</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (recentScans.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Eye size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 text-lg font-semibold">No scans yet</p>
        <p className="text-gray-500 mt-2">
          Start by scanning some food with the camera or uploading an image
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Scans</h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {recentScans.length} scans
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentScans.map((scan, index) => (
            <div
              key={scan.id}
              onClick={() => openScan(index)}
              className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-emerald-500 transition cursor-pointer bg-white"
            >
              {/* Image */}
              {scan.image && (
                <div className="w-full h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={scan.image}
                    alt="Food scan"
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Food Items */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {scan.recognized_items.length} item
                    {scan.recognized_items.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {scan.recognized_items.slice(0, 2).map((item, idx) => (
                      <p
                        key={idx}
                        className="text-sm font-medium text-gray-900 truncate"
                      >
                        • {item.name}
                      </p>
                    ))}
                    {scan.recognized_items.length > 2 && (
                      <p className="text-xs text-gray-600 italic">
                        +{scan.recognized_items.length - 2} more
                      </p>
                    )}
                  </div>
                </div>

                {/* Safety Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded capitalize ${getSafetyColor(
                      scan.safety_level
                    )}`}
                  >
                    {getSafetyIcon(scan.safety_level)} {scan.safety_level}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    {(scan.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar size={14} />
                  <span>{formatDate(scan.uploaded_at)}</span>
                </div>

                {/* View Button */}
                <button className="mt-4 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition flex items-center justify-center gap-2">
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <ScanDetailsModal
          analysis={recentScans[selectedIndex] || null}
          isOpen={isModalOpen}
          onClose={closeScan}
          onNavigate={navigateScan}
          canNavigate={{
            prev: selectedIndex > 0,
            next: selectedIndex < recentScans.length - 1,
          }}
        />
      )}
    </>
  );
}
