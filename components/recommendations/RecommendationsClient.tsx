'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { generateRecommendations } from '@/features/recommendations';
import { fetchRecentAnalyses } from '@/features/food-analysis';
import { fetchMedicalReports } from '@/features/medical-reports';
import ConditionFilter from './ConditionFilter';
import RecommendationGrid from './RecommendationGrid';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

export default function RecommendationsClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, generated } = useSelector((state: RootState) => state.recommendations);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const foodAnalyses = useSelector((state: RootState) => state.foodAnalysis?.recentAnalyses?.data ?? []);
  const medicalReports = useSelector((state: RootState) => state.medicalReports?.reports ?? []);

  const [selectedCondition, setSelectedCondition] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchRecentAnalyses());
    dispatch(fetchMedicalReports());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const hasData = foodAnalyses.length > 0 || medicalReports.length > 0;
    if (hasData && !generated && items.length === 0 && !loading) {
      dispatch(generateRecommendations());
    }
  }, [isAuthenticated, generated, items.length, loading, foodAnalyses, medicalReports, dispatch]);

  if (!isAuthenticated) {
    return <EmptyState type="not-authenticated" />;
  }

  const hasData = foodAnalyses.length > 0 || medicalReports.length > 0;
  if (!hasData && !loading) {
    return <EmptyState type="no-data" />;
  }

  const filteredItems = selectedCondition === 'all'
    ? items
    : items.filter(item => item.condition.toLowerCase() === selectedCondition.toLowerCase());

  const conditions = ['all', ...new Set(items.map(item => item.condition))];

  return (
    <div className="space-y-8">
      {error && <ErrorState message={error} />}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <ConditionFilter
          conditions={conditions}
          selectedCondition={selectedCondition}
          onConditionChange={setSelectedCondition}
        />

        <button
          onClick={() => dispatch(generateRecommendations())}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition font-semibold"
        >
          {loading ? 'Generating...' : 'Refresh'}
        </button>
      </div>

      {loading && items.length === 0 ? (
        <LoadingState />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No recommendations found for this filter</p>
        </div>
      ) : (
        <RecommendationGrid items={filteredItems} />
      )}
    </div>
  );
}
