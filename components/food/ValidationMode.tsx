'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Download, Copy, Trash2, Play, RotateCcw } from 'lucide-react';
import SmartCameraView from './SmartCameraView';
import { getAuthHeaders } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ValidationResult {
  angle: string;
  timestamp: string;
  image: string;
  detected_items: any[];
  latency_ms: number;
  confidence_score: number;
}

interface ValidationSession {
  session_id: string;
  start_time: string;
  results: ValidationResult[];
  total_detections: number;
}

const ANGLES = [
  { id: 'front', title: '📸 Front View', desc: 'Point camera directly at your food from above' },
  { id: 'side', title: '↔️ Side View', desc: 'Tilt to show the height and layers' },
  { id: 'closeup', title: '🔍 Close-up', desc: 'Move closer to capture fine details' },
];

export default function ValidationMode() {
  const [session, setSession] = useState<ValidationSession | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  const log = (message: string, type: 'info' | 'success' | 'error' | 'data' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      data: '📊',
    }[type];

    const fullMessage = `[${timestamp}] ${prefix} ${message}`;
    setConsoleOutput((prev) => [...prev, fullMessage]);

    // Auto-scroll console
    setTimeout(() => {
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
    }, 0);
  };

  const startValidation = () => {
    const sessionId = `validation_${Date.now()}`;
    const newSession: ValidationSession = {
      session_id: sessionId,
      start_time: new Date().toISOString(),
      results: [],
      total_detections: 0,
    };

    setSession(newSession);
    setConsoleOutput([]);
    setCurrentAngle(0);
    setShowCamera(true);

    log('YOLO Validation Session Started', 'success');
    log(`Session ID: ${sessionId}`, 'info');
    log(`Testing ${ANGLES.length} angles for multi-view analysis`, 'info');
    log(`Ready for Angle 1: ${ANGLES[0].title}`, 'info');
  };

  const handleCapture = async (file: File) => {
    if (!session) return;

    const angle = ANGLES[currentAngle];
    log(`Capturing ${angle.title}...`, 'info');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageBase64 = reader.result as string;

        log('Sending to YOLO for detection...', 'info');
        const startTime = performance.now();

        // Create FormData with the image
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/api/food/analysis/analyze/`, {
          method: 'POST',
          headers: getAuthHeaders(localStorage.getItem('auth_token')),
          body: formData,
        });

        const latency = performance.now() - startTime;

        if (response.ok) {
          const result = await response.json();

          const detectedItems = result.recognized_items || [];
          const confidence = result.confidence_score || 0;

          log(`✓ Detection complete (${latency.toFixed(0)}ms)`, 'success');
          log(`Detected ${detectedItems.length} items`, 'data');

          detectedItems.forEach((item: any, idx: number) => {
            log(`  [${idx + 1}] ${item.name} (confidence: ${(item.confidence * 100).toFixed(1)}%)`, 'data');
          });

          // Add to session
          const validationResult: ValidationResult = {
            angle: angle.id,
            timestamp: new Date().toISOString(),
            image: imageBase64,
            detected_items: detectedItems,
            latency_ms: latency,
            confidence_score: confidence,
          };

          setSession((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              results: [...prev.results, validationResult],
              total_detections: prev.total_detections + detectedItems.length,
            };
          });

          // Move to next angle or finish
          if (currentAngle < ANGLES.length - 1) {
            setCurrentAngle(currentAngle + 1);
            log(`Ready for Angle ${currentAngle + 2}: ${ANGLES[currentAngle + 1].title}`, 'info');
          } else {
            log('All angles captured! Session complete.', 'success');
            log('Use Export buttons below to save results.', 'info');
            setShowCamera(false);
          }
        } else {
          log(`Detection failed: ${response.status}`, 'error');
          setShowCamera(false);
        }
      } catch (error) {
        log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        setShowCamera(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const exportJSON = () => {
    if (!session) return;

    const jsonData = {
      metadata: {
        timestamp: session.start_time,
        framework: 'YOLOv8 Nano',
        hardware: 'Deployed on Fly.io',
        test_count: session.results.length,
        total_detections: session.total_detections,
      },
      validation_results: session.results.map((r) => ({
        angle: r.angle,
        timestamp: r.timestamp,
        detected_items: r.detected_items,
        latency_ms: r.latency_ms,
        confidence_score: r.confidence_score,
      })),
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    setConsoleOutput((prev) => [
      ...prev,
      '',
      '═══════════════════════════════════════',
      'JSON EXPORT:',
      '═══════════════════════════════════════',
      jsonString,
      '═══════════════════════════════════════',
    ]);

    // Copy to clipboard
    navigator.clipboard.writeText(jsonString);
    log('JSON copied to clipboard!', 'success');
  };

  const exportConsole = () => {
    const text = consoleOutput.join('\n');
    navigator.clipboard.writeText(text);
    log('Console output copied to clipboard!', 'success');
  };

  const clearSession = () => {
    setSession(null);
    setConsoleOutput([]);
    setCurrentAngle(0);
    setShowCamera(false);
  };

  return (
    <div className="space-y-6">
      {!session ? (
        <button
          onClick={startValidation}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <Play size={20} />
          Start Validation Session
        </button>
      ) : (
        <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg">Session: {session.session_id}</h3>
              <p className="text-sm text-slate-600">
                Captured: {session.results.length}/{ANGLES.length} angles
              </p>
            </div>
            <button
              onClick={clearSession}
              className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {showCamera && (
            <div className="bg-slate-100 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">{ANGLES[currentAngle].title}</h4>
              <p className="text-sm text-slate-600 mb-4">{ANGLES[currentAngle].desc}</p>
              <SmartCameraView onCapture={handleCapture} onClose={() => setShowCamera(false)} />
            </div>
          )}

          {!showCamera && session.results.length === ANGLES.length && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={exportJSON}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export JSON
              </button>
              <button
                onClick={exportConsole}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Copy size={16} />
                Copy Console
              </button>
            </div>
          )}
        </div>
      )}

      {/* Console Output */}
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 font-mono text-sm text-green-400 flex justify-between items-center">
          <span>📡 YOLO Validation Console</span>
          {session && (
            <span className="text-xs text-slate-500">
              {session.results.length} captures • {session.total_detections} detections
            </span>
          )}
        </div>
        <div
          ref={consoleRef}
          className="p-4 h-96 overflow-y-auto font-mono text-sm text-green-400 space-y-1"
        >
          {consoleOutput.length === 0 ? (
            <div className="text-slate-500">Ready to start validation...</div>
          ) : (
            consoleOutput.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap break-words">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
