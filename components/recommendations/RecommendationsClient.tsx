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
  const [isHydrated, setIsHydrated] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [moreFilterType, setMoreFilterType] = useState<'local' | 'continental' | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  // Show loading state during hydration to prevent mismatch
  if (!isHydrated) {
    return <LoadingState />;
  }

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

  // Split recommendations: first 3 are local, next 3 are continental
  const localRecommendations = filteredItems.slice(0, 3);
  const continentalRecommendations = filteredItems.slice(3, 6);
  const moreLocalRecommendations = filteredItems.slice(6);

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
        <div className="space-y-8">
          {localRecommendations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">🌍 Local Cuisine</h2>
              <RecommendationGrid items={localRecommendations} />
            </div>
          )}

          {continentalRecommendations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">🌐 Continental & International</h2>
              <RecommendationGrid items={continentalRecommendations} />
            </div>
          )}

          {(localRecommendations.length > 0 || continentalRecommendations.length > 0) && (
            <div className="text-center pt-6">
              <button
                onClick={() => setShowMoreModal(true)}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-8 py-3 rounded-lg transition font-semibold inline-flex items-center gap-2"
              >
                ➕ More Recommendations
              </button>
            </div>
          )}

          {showMoreModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What type of recommendations?</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setMoreFilterType('local');
                      setShowMoreModal(false);
                    }}
                    className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg transition font-semibold text-left"
                  >
                    🌍 More Local Recommendations
                  </button>
                  <button
                    onClick={() => {
                      setMoreFilterType('continental');
                      setShowMoreModal(false);
                    }}
                    className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 px-4 py-3 rounded-lg transition font-semibold text-left"
                  >
                    🌐 More Continental Recommendations
                  </button>
                  <button
                    onClick={() => setShowMoreModal(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {moreLocalRecommendations.length > 0 && moreFilterType === 'local' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">🌍 Additional Local Options</h2>
              <RecommendationGrid items={moreLocalRecommendations} />
              <div className="text-center pt-4">
                <button
                  onClick={() => setMoreFilterType(null)}
                  className="text-gray-600 hover:text-gray-900 font-semibold"
                >
                  ← Back to main recommendations
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
