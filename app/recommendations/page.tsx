'use client';

import { useState } from 'react';
import RecommendationCard from '@/components/recommendations/RecommendationCard';

export default function RecommendationsPage() {
  const [selectedCondition, setSelectedCondition] = useState('all');

  const conditions = [
    { id: 'all', label: 'All Conditions' },
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'allergies', label: 'Allergies' },
  ];

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

        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Filter by Condition
          </h2>
          <div className="flex flex-wrap gap-3">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => setSelectedCondition(condition.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCondition === condition.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {condition.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecommendationCard
            icon="🥕"
            title="Carrots"
            description="Rich in beta-carotene and vitamin A. Excellent for eye health and immune function."
            condition="Diabetes Management"
            benefit="Low glycemic index helps maintain stable blood sugar levels"
            severity="safe"
          />

          <RecommendationCard
            icon="🥬"
            title="Spinach"
            description="Nutrient-dense leafy green with excellent mineral content and low calories."
            condition="Hypertension & Diabetes"
            benefit="High in potassium which helps regulate blood pressure"
            severity="safe"
          />

          <RecommendationCard
            icon="🍇"
            title="Blueberries"
            description="Packed with antioxidants and polyphenols for cardiovascular health."
            condition="Hypertension"
            benefit="Anthocyanins help improve blood vessel function"
            severity="safe"
          />

          <RecommendationCard
            icon="🐟"
            title="Salmon"
            description="Rich in omega-3 fatty acids that support heart and brain health."
            condition="All Conditions"
            benefit="Reduces inflammation and supports healthy cholesterol levels"
            severity="safe"
          />

          <RecommendationCard
            icon="🥜"
            title="Peanuts"
            description="Good protein source with healthy fats, but caution for allergy sufferers."
            condition="Allergies"
            benefit="Contains aflatoxins - avoid if you have peanut allergies"
            severity="danger"
          />

          <RecommendationCard
            icon="🍕"
            title="Pizza"
            description="High sodium and saturated fat content, not ideal for certain conditions."
            condition="Hypertension & Diabetes"
            benefit="Occasional consumption only - high sodium affects blood pressure"
            severity="caution"
          />

          <RecommendationCard
            icon="🍎"
            title="Apples"
            description="Excellent source of fiber and vitamin C with natural sweetness."
            condition="Diabetes"
            benefit="Soluble fiber helps regulate blood sugar and cholesterol"
            severity="safe"
          />

          <RecommendationCard
            icon="🥦"
            title="Broccoli"
            description="Cruciferous vegetable rich in vitamins C, K, and fiber."
            condition="All Conditions"
            benefit="Supports cardiovascular and metabolic health"
            severity="safe"
          />

          <RecommendationCard
            icon="🍌"
            title="Bananas"
            description="Natural source of potassium and B vitamins for energy."
            condition="Hypertension"
            benefit="High potassium content helps regulate blood pressure naturally"
            severity="safe"
          />
        </div>

        <div className="mt-12 rounded-2xl bg-linear-to-r from-blue-50 to-purple-50 p-6 sm:p-8 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-4">💡 Personalization Tips</h2>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="text-lg">✓</span>
              <span>
                <strong>Portion Control:</strong> Even healthy foods require proper portions to maintain balanced nutrition.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">✓</span>
              <span>
                <strong>Variety:</strong> Include a diverse range of foods from different food groups.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">✓</span>
              <span>
                <strong>Preparation:</strong> Steaming, baking, or grilling is better than deep frying.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">✓</span>
              <span>
                <strong>Frequency:</strong> Track how often you eat certain foods and adjust patterns accordingly.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
