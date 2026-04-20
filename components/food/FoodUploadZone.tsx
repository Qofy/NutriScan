'use client';

import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

export default function FoodUploadZone() {
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
    // Handle dropped files
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
        // In a real app, send canvas data to backend
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
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
               <Camera size={40} fill='true' color='green'/>
            </button>
            <button
              onClick={() => {
                setShowCamera(false);
                stopCamera();
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={startCamera}
            className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-8 hover:bg-emerald-100 transition-colors"
          >
            <span className="text-4xl block mb-2">📷</span>
            <p className="font-semibold text-emerald-900">Use Camera</p>
            <p className="text-sm text-emerald-700 mt-1">
              Scan food with device camera
            </p>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border-2 border-teal-500 bg-teal-50 p-8 hover:bg-teal-100 transition-colors"
          >
            <span className="text-4xl block mb-2">📁</span>
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
        <p className="text-2xl mb-2">🍎</p>
        <p className="font-semibold text-gray-900">Drag & drop food images</p>
        <p className="text-sm text-gray-600 mt-1">or click to browse files</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          // Handle file selection
        }}
      />
    </div>
  );
}
