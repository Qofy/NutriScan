'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Apple, Camera, Folder, AlertCircle, CheckCircle } from 'lucide-react';
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

      {showCamera ? (
        <SmartCameraView onCapture={handleFile} onClose={() => setShowCamera(false)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
