'use client';

import { useSelector } from 'react-redux';
import { selectCurrentAnalysis, selectImagePreview } from '@/features/food-analysis';
import Image from 'next/image';

export default function AnalysisResults() {
  const { data } = useSelector(selectCurrentAnalysis);
  const imagePreview = useSelector(selectImagePreview);

  if (!data) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imagePreview && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={imagePreview}
              alt="Analyzed food"
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Identified Items
            </h3>
            <div className="space-y-3">
              {data.recognized_items.map((item: { name: string; confidence: number }, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-slate-900 font-medium">{item.name}</span>
                  <span className="text-sm text-slate-600">
                    {(item.confidence * 100).toFixed(1)}% confident
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl p-6 border-2 ${
            data.safety_level === 'safe'
              ? 'bg-orange-50 border-orange-200'
              : data.safety_level === 'caution'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">
                {data.safety_level === 'safe'
                  ? '✅'
                  : data.safety_level === 'caution'
                  ? '⚠️'
                  : '⛔'}
              </span>
              <h3 className={`text-lg font-semibold ${
                data.safety_level === 'safe'
                  ? 'text-orange-900'
                  : data.safety_level === 'caution'
                  ? 'text-amber-900'
                  : 'text-red-900'
              }`}>
                {data.safety_level.charAt(0).toUpperCase() + data.safety_level.slice(1)}
              </h3>
            </div>
            <p className={`text-sm ${
              data.safety_level === 'safe'
                ? 'text-orange-800'
                : data.safety_level === 'caution'
                ? 'text-amber-800'
                : 'text-red-800'
            }`}>
              Confidence Score: {((data.confidence_score ?? 0.85) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Nutritional Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(data.nutritional_info).map(([foodName, nutrition]: [string, any]) => (
            <div key={foodName} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 text-sm mb-2">
                {foodName}
              </h4>
              <div className="space-y-1 text-xs text-slate-600">
                {nutrition.calories && (
                  <p>Calories: <span className="font-semibold">{nutrition.calories}</span></p>
                )}
                {nutrition.protein && (
                  <p>Protein: <span className="font-semibold">{nutrition.protein}g</span></p>
                )}
                {nutrition.carbs && (
                  <p>Carbs: <span className="font-semibold">{nutrition.carbs}g</span></p>
                )}
                {nutrition.fat && (
                  <p>Fat: <span className="font-semibold">{nutrition.fat}g</span></p>
                )}
                {nutrition.fiber && (
                  <p>Fiber: <span className="font-semibold">{nutrition.fiber}g</span></p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
