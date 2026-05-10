'use client';

export default function InfoSection() {
  return (
    <div className="rounded-2xl bg-linear-to-r from-blue-50 to-purple-50 p-6 sm:p-8 border border-blue-100">
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
  );
}
