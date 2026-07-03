'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Apple, TriangleAlert, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchRecentAnalyses } from '@/features/food-analysis';
import { AppDispatch, RootState } from '@/store';

export default function RecentActivity() {
  const dispatch = useDispatch<AppDispatch>();
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: recentAnalyses } = useSelector((state: RootState) => state.foodAnalysis.recentAnalyses);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    dispatch(fetchRecentAnalyses(10));
  }, [dispatch]);

  const getActivityIcon = (safetyLevel: string) => {
    switch (safetyLevel) {
      case 'safe':
        return <CheckCircle color="green" size={24} />;
      case 'caution':
        return <AlertCircle color="orange" size={24} />;
      case 'danger':
        return <TriangleAlert color="red" size={24} />;
      default:
        return <Apple color="green" size={24} />;
    }
  };

  const getSafetyDescription = (safetyLevel: string, confidenceScore: number) => {
    const confidence = Math.round(confidenceScore * 100);
    switch (safetyLevel) {
      case 'safe':
        return `Safe to eat (${confidence}% confidence)`;
      case 'caution':
        return `Caution advised (${confidence}% confidence)`;
      case 'danger':
        return `Not recommended (${confidence}% confidence)`;
      default:
        return `Analyzed (${confidence}% confidence)`;
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (recentAnalyses.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <Apple color="green" size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-slate-600">No food scans yet</p>
          <p className="text-sm text-gray-500 mt-1">Start by scanning some food to see your activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentAnalyses.map((analysis) => {
          const foodItems = analysis.recognized_items
            .map((item) => item.name)
            .join(', ');

          return (
            <div
              key={analysis.id}
              className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0"
            >
              <div className="flex-shrink-0">
                {getActivityIcon(analysis.safety_level)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {foodItems}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {getSafetyDescription(
                    analysis.safety_level,
                    analysis.confidence_score
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {isHydrated ? formatTimestamp(analysis.uploaded_at) : 'Just now'}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                  analysis.safety_level === 'safe'
                    ? 'bg-orange-100 text-orange-800'
                    : analysis.safety_level === 'caution'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {analysis.safety_level.charAt(0).toUpperCase() +
                  analysis.safety_level.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
