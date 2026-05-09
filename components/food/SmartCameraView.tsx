'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

interface DetectedItem {
  name: string;
  confidence: number;
  bbox?: number[];
}

interface Props {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const ANGLE_STEPS = [
  { icon: '📸', title: 'Front View', desc: 'Point camera directly at your food from above' },
  { icon: '↔️', title: 'Side View', desc: 'Tilt to show the height and layers of your food' },
  { icon: '🔍', title: 'Close-up', desc: 'Move closer to capture fine details' },
];

export default function SmartCameraView({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [instructionStep, setInstructionStep] = useState(0);
  const [scanLineY, setScanLineY] = useState(0);
  const [isAutoCapturing, setIsAutoCapturing] = useState(true);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        alert('Could not access camera');
        onClose();
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [onClose]);

  // Set canvas size when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoWidth(video.videoWidth);
      setVideoHeight(video.videoHeight);

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, []);

  // Draw canvas overlay (frame + boxes + scan line)
  useEffect(() => {
    const drawOverlay = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || videoWidth === 0) return;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw corner brackets
      const bracketLength = 40;
      const bracketWidth = 3;
      const color = '#10b981';

      ctx.strokeStyle = color;
      ctx.lineWidth = bracketWidth;
      ctx.lineCap = 'round';

      // Top-left
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(20 + bracketLength, 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(20, 20 + bracketLength);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 20, 20);
      ctx.lineTo(canvas.width - 20 - bracketLength, 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width - 20, 20);
      ctx.lineTo(canvas.width - 20, 20 + bracketLength);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 20);
      ctx.lineTo(20 + bracketLength, canvas.height - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 20);
      ctx.lineTo(20, canvas.height - 20 - bracketLength);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 20, canvas.height - 20);
      ctx.lineTo(canvas.width - 20 - bracketLength, canvas.height - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width - 20, canvas.height - 20);
      ctx.lineTo(canvas.width - 20, canvas.height - 20 - bracketLength);
      ctx.stroke();

      // Draw center crosshair
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw center dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw animated scan line
      ctx.strokeStyle = `rgba(16, 185, 129, 0.3)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(canvas.width, scanLineY);
      ctx.stroke();

      // Draw bounding boxes
      if (detectedItems.length > 0) {
        detectedItems.forEach((item) => {
          if (item.bbox) {
            const [x1, y1, x2, y2] = item.bbox;
            const w = x2 - x1;
            const h = y2 - y1;

            ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
            ctx.fillRect(x1, y1, w, h);

            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(x1, y1, w, h);

            // Label
            ctx.fillStyle = '#10b981';
            ctx.font = '14px sans-serif';
            ctx.fillText(
              `${item.name} ${(item.confidence * 100).toFixed(0)}%`,
              x1,
              y1 - 5
            );
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(drawOverlay);
    };

    animationFrameRef.current = requestAnimationFrame(drawOverlay);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scanLineY, detectedItems, videoWidth, videoHeight]);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLineY((prev) => (prev + 3) % videoHeight);
    }, 30);

    return () => clearInterval(interval);
  }, [videoHeight]);

  // Poll for detection every 2 seconds
  useEffect(() => {
    const pollDetection = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        // Snapshot at low resolution
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 320;
        tempCanvas.height = 240;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(videoRef.current, 0, 0, 320, 240);

        tempCanvas.toBlob(async (blob) => {
          if (!blob) return;

          const formData = new FormData();
          formData.append('image', blob, 'detect.jpg');

          const response = await fetch('http://localhost:8000/api/food/analysis/detect/', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });

          if (!response.ok) return;

          const data = await response.json();
          setDetectedItems(data.items || []);

          // Auto-capture if high confidence
          if (isAutoCapturing && data.detected && data.confidence_score > 0.65 && countdown === null) {
            setCountdown(3);
          }
        }, 'image/jpeg', 0.6);
      } catch (error) {
        console.error('Detection error:', error);
      }
    };

    if (isScanning) {
      pollDetectionImmediately();
      pollIntervalRef.current = setInterval(pollDetection, 2000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isScanning, isAutoCapturing, countdown]);

  const pollDetectionImmediately = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 320;
      tempCanvas.height = 240;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(videoRef.current, 0, 0, 320, 240);

      tempCanvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append('image', blob, 'detect.jpg');

        const response = await fetch('http://localhost:8000/api/food/analysis/detect/', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) return;

        const data = await response.json();
        setDetectedItems(data.items || []);
      }, 'image/jpeg', 0.6);
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      captureAtFullResolution();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const captureAtFullResolution = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setCountdown(null);
    setIsScanning(false);

    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = videoRef.current.videoWidth;
    fullCanvas.height = videoRef.current.videoHeight;
    const fullCtx = fullCanvas.getContext('2d');
    if (!fullCtx) return;

    fullCtx.drawImage(videoRef.current, 0, 0);

    fullCanvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-angle-${instructionStep}.jpg`, {
        type: 'image/jpeg',
      });
      onCapture(file);

      // Advance instruction step
      if (instructionStep < ANGLE_STEPS.length - 1) {
        setInstructionStep(instructionStep + 1);
        setDetectedItems([]);
        setCountdown(null);
        setIsScanning(true);
      } else {
        onClose();
      }
    }, 'image/jpeg', 0.95);
  };

  const manualCapture = () => {
    captureAtFullResolution();
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-500 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-96 object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Status badge */}
      <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/70 text-white text-sm font-semibold">
        {countdown !== null ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
              {countdown}
            </div>
            Capturing...
          </div>
        ) : detectedItems.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Food Detected!
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Scanning...
          </div>
        )}
      </div>

      {/* Instruction banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{ANGLE_STEPS[instructionStep].icon}</span>
          <div>
            <h3 className="font-semibold">{ANGLE_STEPS[instructionStep].title}</h3>
            <p className="text-sm text-gray-300">{ANGLE_STEPS[instructionStep].desc}</p>
            <p className="text-xs text-gray-400 mt-1">Angle {instructionStep + 1} of 3</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={manualCapture}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
        >
          <Camera size={24} />
          Capture
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
