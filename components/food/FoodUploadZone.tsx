'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Apple, Camera, Folder } from 'lucide-react';
import { analyzeFood, setImagePreview, selectCurrentAnalysis } from '@/features/food-analysis';
import { AppDispatch } from '@/store';

export default function FoodUploadZone() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectCurrentAnalysis);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      alert(`Unable to access camera, due to ${error}`);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            handleFile(file);
          }
        }, 'image/jpeg');
        setShowCamera(false);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div className="space-y-6">
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
        <div className="rounded-2xl overflow-hidden border-2 border-emerald-500 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-96 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4 p-4 bg-gray-900">
            <button
              onClick={capturePhoto}
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              <Camera size={40} color="white" className="mx-auto" />
            </button>
            <button
              onClick={() => {
                setShowCamera(false);
                stopCamera();
              }}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={startCamera}
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
