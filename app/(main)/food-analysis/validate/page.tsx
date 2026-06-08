'use client';

import ValidationMode from '@/components/food/ValidationMode';

export default function FoodValidationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            🧪 YOLO Validation Testing
          </h1>
          <p className="text-slate-600 mt-2">
            Test real food items with multi-angle capture. Watch detection results in real-time.
          </p>
        </div>

        <ValidationMode />
      </div>
    </div>
  );
}
