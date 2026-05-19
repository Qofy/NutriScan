'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteAnalysis } from '@/features/food-analysis';
import { AppDispatch } from '@/store';
import type { AnalysisResult } from '@/features/food-analysis';

interface Props {
  analysis: AnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  canNavigate?: { prev: boolean; next: boolean };
}

export default function ScanDetailsModal({
  analysis,
  isOpen,
  onClose,
  onNavigate,
  canNavigate = { prev: false, next: false },
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !analysis) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteAnalysis(analysis.id) as any);
      onClose();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete this scan');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'text-green-600 bg-green-50';
      case 'caution':
        return 'text-yellow-600 bg-yellow-50';
      case 'danger':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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

  const totalCalories = Object.values(analysis.nutritional_info).reduce((sum, item) => {
    return sum + (typeof item === 'object' && item !== null && 'calories' in item ? (item.calories as number) : 0);
  }, 0);

  const totalProtein = Object.values(analysis.nutritional_info).reduce((sum, item) => {
    return sum + (typeof item === 'object' && item !== null && 'protein' in item ? (item.protein as number) : 0);
  }, 0);

  const totalCarbs = Object.values(analysis.nutritional_info).reduce((sum, item) => {
    return sum + (typeof item === 'object' && item !== null && 'carbs' in item ? (item.carbs as number) : 0);
  }, 0);

  const totalFat = Object.values(analysis.nutritional_info).reduce((sum, item) => {
    return sum + (typeof item === 'object' && item !== null && 'fat' in item ? (item.fat as number) : 0);
  }, 0);

  const totalFiber = Object.values(analysis.nutritional_info).reduce((sum, item) => {
    return sum + (typeof item === 'object' && item !== null && 'fiber' in item ? (item.fiber as number) : 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Scan Details</h2>
          </div>
          <div className="flex items-center gap-2">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('prev')}
                  disabled={!canNavigate.prev}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => onNavigate('next')}
                  disabled={!canNavigate.next}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {analysis.image && (
            <div className="rounded-lg overflow-hidden bg-gray-100 h-80">
              <img
                src={analysis.image}
                alt="Food scan"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Recognized Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recognized Items</h3>
            <div className="space-y-2">
              {analysis.recognized_items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[50px]">
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutritional Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">{Math.round(totalCalories)}</div>
                <div className="text-sm text-orange-700 mt-1">Calories</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{totalProtein.toFixed(1)}g</div>
                <div className="text-sm text-red-700 mt-1">Protein</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}g</div>
                <div className="text-sm text-yellow-700 mt-1">Carbs</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{totalFat.toFixed(1)}g</div>
                <div className="text-sm text-blue-700 mt-1">Fat</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{totalFiber.toFixed(1)}g</div>
                <div className="text-sm text-green-700 mt-1">Fiber</div>
              </div>
              <div className={`rounded-lg p-4 ${getSafetyColor(analysis.safety_level)}`}>
                <div className="text-2xl font-bold">{getSafetyIcon(analysis.safety_level)}</div>
                <div className="text-sm capitalize mt-1 font-semibold">{analysis.safety_level}</div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="text-sm text-gray-600 pt-4 border-t border-slate-200">
            <p>
              <span className="font-semibold text-gray-900">Scanned on:</span>{' '}
              {formatDate(analysis.uploaded_at)}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-gray-900">Confidence Score:</span>{' '}
              {(analysis.confidence_score * 100).toFixed(1)}%
            </p>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-800 font-semibold mb-3">
                Are you sure you want to delete this scan? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 font-semibold py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Delete Button */}
          {!showDeleteConfirm && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold rounded-lg transition disabled:opacity-50"
            >
              <Trash2 size={18} />
              Delete Scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
