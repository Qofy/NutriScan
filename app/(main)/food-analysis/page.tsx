import FoodUploadZone from '@/components/food/FoodUploadZone';
import AnalysisResults from '@/components/food/AnalysisResults';
import RecentScansView from '@/components/food/RecentScansView';
import { Camera, CircleCheck, FilePenLine, Search } from 'lucide-react';

export default function FoodAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex gap-1.5">
            Scan Food <Camera size={40} color="#FF6B4A" />
          </h1>
          <p className="text-slate-600 mt-2">
            Upload or capture a food image to analyze its nutritional value and health suitability
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <FoodUploadZone />
        </div>

        <AnalysisResults />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-fade-in">
          <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-orange-900 mb-2 flex gap-1.5">
              <FilePenLine color="#FF6B4A" /> How it works
            </h3>
            <p className="text-sm text-orange-800">
              Take a clear photo of your food. Our AI will identify items and analyze their nutritional content.
            </p>
          </div>
          <div className="rounded-2xl bg-red-50 p-6 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-red-900 mb-2 flex gap-1.5">
              <CircleCheck color="#FF6B4A" /> Best practices
            </h3>
            <p className="text-sm text-red-800">
              Good lighting and clear angles help our system identify foods more accurately.
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-amber-900 mb-2 flex gap-1.5">
              <Search color="#FF6B4A" /> Multiple items
            </h3>
            <p className="text-sm text-amber-800">
              You can scan meals with multiple items. We will analyze each ingredient separately.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <RecentScansView />
        </div>
      </div>
    </div>
  );
}
