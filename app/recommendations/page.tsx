import RecommendationsClient from '@/components/recommendations/RecommendationsClient';
import InfoSection from '@/components/recommendations/InfoSection';

export const metadata = {
  title: 'Recommendations - NutriScan',
  description: 'Get personalized nutrition recommendations based on your health profile',
};

export default function RecommendationsPage() {
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

        <RecommendationsClient />

        <div className="mt-12">
          <InfoSection />
        </div>
      </div>
    </div>
  );
}
