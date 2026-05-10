'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Apple, Camera, Folder, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { analyzeFood, setImagePreview, selectCurrentAnalysis } from '@/features/food-analysis';
// import { selectAuth } from '@/features/auth';
import { AppDispatch, RootState } from '@/store';
import SmartCameraView from './SmartCameraView';

export default function FoodUploadZone() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectCurrentAnalysis);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualFoods, setManualFoods] = useState<string>('');
  const [manualLoading, setManualLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(setImagePreview(reader.result as string));
    };
    reader.readAsDataURL(file);

    dispatch(analyzeFood(file));
    setShowCamera(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualFoods.trim()) return;

    setManualLoading(true);
    try {
      const foodList = manualFoods
        .split(',')
        .map(f => ({
          name: f.trim(),
          confidence: 1.0
        }))
        .filter(f => f.name.length > 0);

      const response = await fetch('http://localhost:8000/api/food/analysis/manual-analyze/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food_items: foodList, health_profile: {} }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze foods');
      }

      const data = await response.json();
      setManualFoods('');
      setShowManualEntry(false);
      // Trigger a refresh of food scans by dispatching analyzeFood action's success effect
      // For now, we'll just show a success message
      alert('Foods added successfully!');
    } catch (error) {
      alert('Error adding foods: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isAuthenticated ? (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-green-900">
              Welcome back, {user?.first_name || user?.username}! 👋
            </p>
            <p className="text-sm text-green-800 mt-1">
              Your food scans and analyses are automatically saved to your profile.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-blue-900">
              💡 Log in to save your food history
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Create an account or sign in to automatically save all your food scans and track your nutrition over time.
            </p>
            <Link href="/login" className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
              Login Now
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-blue-800">
          Analyzing food image...
        </div>
      )}

      {showManualEntry ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Foods Manually</h3>
              <button
                onClick={() => setShowManualEntry(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Couldn't detect your food? Type the food names separated by commas (e.g., Fufu, Jollof rice, Plantain)
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <textarea
                value={manualFoods}
                onChange={(e) => setManualFoods(e.currentTarget.value)}
                placeholder="e.g., Fufu, Spaghetti, Jollof rice, Grilled fish"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                rows={4}
                disabled={manualLoading}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowManualEntry(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualLoading || !manualFoods.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {manualLoading ? 'Adding...' : 'Add Foods'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showCamera ? (
        <SmartCameraView onCapture={handleFile} onClose={() => setShowCamera(false)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setShowCamera(true)}
            disabled={loading}
            className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-8 hover:bg-emerald-100 disabled:opacity-50 transition-colors text-center"
          >
            <Camera size={40} className="block mx-auto mb-2" color="green" />
            <p className="font-semibold text-emerald-900">Use Camera</p>
            <p className="text-sm text-emerald-700 mt-1">
              Scan food with device camera
            </p>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="rounded-2xl border-2 border-teal-500 bg-teal-50 p-8 hover:bg-teal-100 disabled:opacity-50 transition-colors"
          >
            <Folder size={40} color="green" className="block mx-auto mb-2" />
            <p className="font-semibold text-teal-900">Upload Image</p>
            <p className="text-sm text-teal-700 mt-1">
              Choose from your device
            </p>
          </button>

          <button
            onClick={() => setShowManualEntry(true)}
            disabled={loading}
            className="rounded-2xl border-2 border-blue-500 bg-blue-50 p-8 hover:bg-blue-100 disabled:opacity-50 transition-colors"
          >
            <Plus size={40} color="blue" className="block mx-auto mb-2" />
            <p className="font-semibold text-blue-900">Manual Entry</p>
            <p className="text-sm text-blue-700 mt-1">
              Type food names directly
            </p>
          </button>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <Apple size={30} color="green" className="block mx-auto mb-2" />
        <p className="font-semibold text-gray-900">Drag & drop food images</p>
        <p className="text-sm text-gray-600 mt-1">or click to browse files</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const files = e.currentTarget.files;
          if (files && files.length > 0) {
            handleFile(files[0]);
          }
        }}
      />
    </div>
  );
}
