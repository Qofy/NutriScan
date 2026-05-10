'use client';

import Link from 'next/link';

interface EmptyStateProps {
  type: 'not-authenticated' | 'no-data';
}

export default function EmptyState({ type }: EmptyStateProps) {
  if (type === 'not-authenticated') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg mb-6">Sign in to get personalized nutrition recommendations</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">Get Personalized Recommendations</h2>
      <p className="text-blue-700 mb-6">To generate smart recommendations, we need:</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/food-analysis" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
          Scan Food
        </Link>
        <Link href="/medical-reports" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
          Upload Medical Report
        </Link>
      </div>
    </div>
  );
}
