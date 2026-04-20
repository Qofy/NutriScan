import FoodUploadZone from '@/components/food/FoodUploadZone';
import { Camera } from 'lucide-react';

export default function FoodAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex gap-1.5">
            Scan Food <Camera size={40} fill='true' color='green'/>
          </h1>
          <p className="text-gray-600 mt-2">
            Upload or capture a food image to analyze its nutritional value and health suitability
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
          <FoodUploadZone />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-blue-50 p-6 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">📝 How it works</h3>
            <p className="text-sm text-blue-800">
              Take a clear photo of your food. Our AI will identify items and analyze their nutritional content.
            </p>
          </div>
          <div className="rounded-2xl bg-green-50 p-6 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-2">✅ Best practices</h3>
            <p className="text-sm text-green-800">
              Good lighting and clear angles help our system identify foods more accurately.
            </p>
          </div>
          <div className="rounded-2xl bg-purple-50 p-6 border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">🔍 Multiple items</h3>
            <p className="text-sm text-purple-800">
              You can scan meals with multiple items. We'll analyze each ingredient separately.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-6 border border-emerald-100">
          <h2 className="font-bold text-emerald-900 mb-4">Recent Scans</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <div>
                <p className="font-medium text-gray-900">🍎 Apple</p>
                <p className="text-sm text-gray-600">Today at 2:30 PM</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                ✅ Safe
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <div>
                <p className="font-medium text-gray-900">🍔 Cheeseburger</p>
                <p className="text-sm text-gray-600">Yesterday at 6:15 PM</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                ⚠️ Caution
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <div>
                <p className="font-medium text-gray-900">🥗 Salad</p>
                <p className="text-sm text-gray-600">2 days ago</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                ✅ Safe
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
