'use client';

import { Lightbulb, BarChart2, Bot, Target } from 'lucide-react';

export default function InfoSection() {
  return (
    <div className="rounded-2xl bg-linear-to-r from-blue-50 to-purple-50 p-6 sm:p-8 border border-red-100">
      <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
        <Lightbulb size={22} className="text-red-600" /> How Smart Recommendations Work
      </h2>
      <p className="text-red-800 mb-4">
        We analyze your food scans and medical reports to generate personalized nutrition recommendations.
        The AI considers your health conditions, allergens, and dietary restrictions along with your recent eating patterns
        to suggest foods that align with your health goals.
      </p>
      <ul className="space-y-3 text-red-800">
        <li className="flex items-start gap-3">
          <BarChart2 size={20} className="mt-0.5 shrink-0 text-blue-500" />
          <span>
            <strong>Data-Driven:</strong> Based on your actual food scans and medical reports, not generic advice.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Bot size={20} className="mt-0.5 shrink-0 text-blue-500" />
          <span>
            <strong>AI-Powered:</strong> Uses Claude AI to understand your unique health context.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Target size={20} className="mt-0.5 shrink-0 text-blue-500" />
          <span>
            <strong>Personalized:</strong> Recommendations change as you update your health profile and food history.
          </span>
        </li>
      </ul>
    </div>
  );
}
