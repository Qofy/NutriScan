'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { generateRecommendations } from '@/features/recommendations';
import { fetchRecentAnalyses } from '@/features/food-analysis';
import { fetchMedicalReports } from '@/features/medical-reports';
import RecommendationCard from '@/components/recommendations/RecommendationCard';
import Link from 'next/link';

export default function RecommendationsPage() {
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
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Recommendations ✨</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-6">Sign in to get personalized nutrition recommendations</p>
            <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">Go to login</Link>
          </div>
        </div>
      </div>
    );
  }

  const hasData = foodAnalyses.length > 0 || medicalReports.length > 0;

  if (!hasData && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Recommendations ✨</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Get Personalized Recommendations</h2>
            <p className="text-blue-700 mb-6">To generate smart recommendations, we need:</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {foodAnalyses.length === 0 && (
                <Link href="/food-analysis" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                  Scan Food
                </Link>
              )}
              {medicalReports.length === 0 && (
                <Link href="/medical-reports" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
                  Upload Medical Report
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredItems = selectedCondition === 'all'
    ? items
    : items.filter(item => item.condition.toLowerCase() === selectedCondition.toLowerCase());

  const conditions = ['all', ...new Set(items.map(item => item.condition))];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Recommendations ✨
          </h1>
          <p className="text-gray-600 mt-2">
            Personalized dietary recommendations based on your health profile
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Filter by Condition
            </h2>
            <div className="flex flex-wrap gap-3">
              {conditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => setSelectedCondition(condition)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCondition === condition
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => dispatch(generateRecommendations())}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition font-semibold"
          >
            {loading ? 'Generating...' : 'Refresh'}
          </button>
        </div>

        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No recommendations found for this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(rec => (
              <RecommendationCard
                key={rec.id}
                icon={rec.food_item.substring(0, 1) + '🥗'}
                title={rec.food_item}
                description={rec.description}
                condition={rec.condition}
                benefit={rec.benefit}
                severity={rec.severity}
              />
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-linear-to-r from-blue-50 to-purple-50 p-6 sm:p-8 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-4">💡 How Smart Recommendations Work</h2>
          <p className="text-blue-800 mb-4">
            We analyze your food scans and medical reports to generate personalized nutrition recommendations.
            The AI considers your health conditions, allergens, and dietary restrictions along with your recent eating patterns
            to suggest foods that align with your health goals.
          </p>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="text-lg">📊</span>
              <span>
                <strong>Data-Driven:</strong> Based on your actual food scans and medical reports, not generic advice.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">🤖</span>
              <span>
                <strong>AI-Powered:</strong> Uses Claude AI to understand your unique health context.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">🎯</span>
              <span>
                <strong>Personalized:</strong> Recommendations change as you update your health profile and food history.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
