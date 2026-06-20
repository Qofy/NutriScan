'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Apple, Camera, Folder, AlertCircle, CheckCircle, Plus, Hand, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { analyzeFood, setImagePreview, selectCurrentAnalysis, extractHealthProfileFromReports } from '@/features/food-analysis';
// import { selectAuth } from '@/features/auth';
import { AppDispatch, RootState } from '@/store';
import SmartCameraView from './SmartCameraView';
import ManualEntryModal from './ManualEntryModal';
import { logThesisMetrics, logMetric } from '@/utils/thesisMetrics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function FoodUploadZone() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectCurrentAnalysis);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { reports } = useSelector((state: RootState) => state.medicalReports);
  const [isDragging, setIsDragging] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const currentAnalysis = useSelector(selectCurrentAnalysis);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Log real metrics when analysis completes
  useEffect(() => {
    if (analysisStartTime && currentAnalysis.data && !currentAnalysis.loading) {
      const actualLatency = performance.now() - analysisStartTime;
      const detectedItems = currentAnalysis.data.recognized_items || [];
      const actualConfidence = currentAnalysis.data.confidence_score || 0;

      console.log(`✅ [FOOD] Analysis complete (${actualLatency.toFixed(0)}ms)`);
      console.log(`📊 [FOOD] Real detection results:`);
      console.log(`  - Items detected: ${detectedItems.length}`);
      detectedItems.forEach((item: any, idx: number) => {
        console.log(`    [${idx + 1}] ${item.name} (confidence: ${(item.confidence * 100).toFixed(1)}%)`);
      });

      // Log REAL thesis metrics for RQ1: Food Recognition
      console.log('\n📚 [THESIS VERIFICATION - RQ1] Food Recognition Accuracy');
      console.log(`Expected: 90.4% detection accuracy, 520ms latency`);
      console.log(`ACTUAL RESULTS:`);
      logMetric('Actual Latency (ms)', actualLatency, 520);
      logMetric('Actual Confidence Score (%)', actualConfidence * 100, 90.4);
      logMetric('Items Detected', detectedItems.length, 1);
      logThesisMetrics('rq1');

      setAnalysisStartTime(null);
    }
  }, [analysisStartTime, currentAnalysis.data, currentAnalysis.loading]);

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

  const handleFile = (file: File) => {
    console.log('🍽️  [FOOD] Food image upload started');
    console.log('📷 [FOOD] File details:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)}KB`,
      type: file.type,
      width: file.type.includes('image') ? 'detecting...' : 'N/A',
    });

    const reader = new FileReader();
    reader.onload = () => {
      console.log('✅ [FOOD] Image loaded into preview');
      dispatch(setImagePreview(reader.result as string));
    };
    reader.readAsDataURL(file);

    console.log('📊 [FOOD] Extracting health profile from medical reports...');
    const healthProfile = extractHealthProfileFromReports(reports);
    console.log('✅ [FOOD] Health profile extracted:', {
      conditions: healthProfile?.conditions?.length || 0,
      allergens: healthProfile?.allergens?.length || 0,
    });

    console.log('⏳ [FOOD] Starting food analysis...');
    setAnalysisStartTime(performance.now());
    dispatch(analyzeFood(file, healthProfile || undefined));

    setShowCamera(false);
  };


  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-200 h-24 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAuthenticated ? (
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 flex items-start gap-3">
          <CheckCircle className="text-orange-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-orange-900 flex items-center gap-2">
              Welcome back, {user?.first_name || user?.username}! <Hand size={16} className="text-orange-700" />
            </p>
            <p className="text-sm text-orange-800 mt-1">
              Your food scans and analyses are automatically saved to your profile.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-900 flex items-center gap-2">
              <Lightbulb size={16} className="text-red-600 shrink-0" /> Log in to save your food history
            </p>
            <p className="text-sm text-red-800 mt-1">
              Create an account or sign in to automatically save all your food scans and track your nutrition over time.
            </p>
            <Link href="/login" className="inline-block mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
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
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          Analyzing food image...
        </div>
      )}

      {showManualEntry && <ManualEntryModal onClose={() => setShowManualEntry(false)} />}

      {showCamera ? (
        <SmartCameraView onCapture={handleFile} onClose={() => setShowCamera(false)} />
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowCamera(true)}
            disabled={loading}
            className="w-56 rounded-2xl border-2 border-emerald-500 bg-orange-50 p-8 hover:bg-orange-100 disabled:opacity-50 transition-colors text-center"
          >
            <Camera size={40} className="block mx-auto mb-2" color="green" />
            <p className="font-semibold text-orange-900">Use Camera</p>
            <p className="text-sm text-orange-700 mt-1">
              Scan food with device camera
            </p>
          </button>

          {/* <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-56 rounded-2xl border-2 border-teal-500 bg-orange-50 p-8 hover:bg-teal-100 disabled:opacity-50 transition-colors text-center"
          >
            <Folder size={40} color="green" className="block mx-auto mb-2" />
            <p className="font-semibold text-teal-900">Upload Image</p>
            <p className="text-sm text-orange-700 mt-1">
              Choose from your device
            </p>
          </button> */}

          <button
            onClick={() => setShowManualEntry(true)}
            disabled={loading}
            className="w-56 rounded-2xl border-2 border-blue-500 bg-red-50 p-8 hover:bg-red-100 disabled:opacity-50 transition-colors text-center"
          >
            <Plus size={40} color="blue" className="block mx-auto mb-2" />
            <p className="font-semibold text-red-900">Manual Entry</p>
            <p className="text-sm text-red-700 mt-1">
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
            ? 'border-emerald-500 bg-orange-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <Apple size={30} color="green" className="block mx-auto mb-2" />
        <p className="font-semibold text-slate-900">Drag & drop food images</p>
        <p className="text-sm text-slate-600 mt-1">or click to browse files</p>
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
