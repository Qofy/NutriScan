# Smart Camera Detection Guide

## Overview
The camera scanning feature includes **real-time food detection** that shows you what the camera sees while you're positioning your food. This guide explains how it works and how to configure it for different environments.

---

## How It Works

### Camera Detection Flow

1. **User opens camera** → SmartCameraView component initializes
2. **Video stream starts** → Camera feed displays in browser
3. **Detection polling begins** → Every 2 seconds, a low-resolution snapshot is sent to backend
4. **Backend detects food** → YOLO model identifies items in the snapshot
5. **Detection boxes drawn** → Green bounding boxes appear around detected foods in real-time
6. **Auto-capture ready** → When confidence > 65%, countdown to auto-capture starts
7. **Full resolution capture** → User captures at 95% quality for analysis

### What You'll See

**Before Detection:**
- Red pulsing dot: "Scanning..."
- Empty canvas with green corner brackets
- 3 angle instructions (Front View → Side View → Close-up)

**During Detection:**
- Orange pulsing dot: "Food Detected!"
- Green bounding boxes around detected items
- Food names with confidence percentages
- "Capturing in 3..." countdown (auto-capture)

**After Capture:**
- Next angle's instructions appear
- Process repeats for remaining angles
- After 3 angles → recommendations page

---

## Environment Configuration

### For Local Development (Backend on localhost:8000)

**File:** `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Your backend must be running:**
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### For Deployed Environments (Railway, Vercel, etc.)

**File:** `.env.local` or `.env.production`
```
NEXT_PUBLIC_API_URL=https://web-production-cc1b9.up.railway.app
```

Or use your staging/production URL:
```
NEXT_PUBLIC_API_URL=https://your-deployed-backend.com
```

### Environment Priority

The app checks URLs in this order:
1. `NEXT_PUBLIC_API_URL` environment variable (if set)
2. `https://web-production-cc1b9.up.railway.app` (default fallback)

---

## Camera Detection Endpoints

### Detection Polling
```
POST {NEXT_PUBLIC_API_URL}/api/food/analysis/detect/
```

**What it does:**
- Accepts a low-resolution JPEG (320x240, 60% quality)
- Runs YOLO food detection model
- Returns detected items with bounding boxes and confidence

**Request:**
```
FormData:
  image: Blob (JPEG)
```

**Response:**
```json
{
  "items": [
    {
      "name": "Rice",
      "confidence": 0.87,
      "bbox": [50, 60, 200, 250]
    },
    {
      "name": "Chicken",
      "confidence": 0.92,
      "bbox": [180, 80, 380, 280]
    }
  ],
  "detected": true,
  "confidence_score": 0.895
}
```

### Full Analysis
```
POST {NEXT_PUBLIC_API_URL}/api/food/analysis/
```

**What it does:**
- Accepts 3 high-resolution captures (front, side, close-up)
- Analyzes with food recognition model
- Generates health assessment against user's conditions/allergens

---

## Troubleshooting

### Error: "NetworkError when attempting to fetch resource"

**Cause:** Backend URL is wrong or backend isn't running

**Fix:**
1. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Verify backend is running: `curl http://localhost:8000/api/health/`
3. Check CORS headers on backend (should allow frontend origin)

**Example Fix:**
```bash
# Verify backend is running on port 8000
curl -v http://localhost:8000/api/health/

# Restart backend if needed
cd backend && python manage.py runserver 0.0.0.0:8000
```

### Error: "CORS request failed"

**Cause:** Backend isn't configured to accept requests from your frontend origin

**Fix:** Backend Django settings should have:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # local Next.js
    "https://your-frontend-domain.com",  # production
]
```

### Detection says "Scanning..." forever

**Cause:** Detection API is unavailable but app continues gracefully

**Fix:**
- The app won't crash - you can still manually capture
- Check backend is running and responding to POST requests
- Verify network in browser DevTools (check Network tab)

### Camera Permission Denied

**Cause:** Browser doesn't have permission to access camera

**Fix:**
- Mac: System Preferences → Security & Privacy → Camera → Allow browser
- Windows: Settings → Privacy → Camera → Allow browser
- Allow permission when browser asks

---

## Monitoring Detection in Browser Console

When you use the camera, you'll see console logs showing the feature working:

```javascript
// Camera logs
🍽️  [FOOD] Food image upload started
📷 [FOOD] File details: {name, size, type}
✅ [FOOD] Image loaded into preview
📊 [FOOD] Extracting health profile from medical reports...
✅ [FOOD] Health profile extracted: {conditions, allergens}

// Thesis metrics
📚 [THESIS VERIFICATION - RQ1] Food Recognition Accuracy
RQ1 Claim: 90.4% detection accuracy, 520ms latency
✅ [THESIS VERIFICATION] Overall Accuracy (%): Claim=90.4, Actual=90.4 ✓ MATCH
```

If detection API calls fail, you'll see:
```
Detection API unavailable, continuing without live preview: NetworkError...
```

This is non-fatal - you can still manually capture photos.

---

## Architecture

### SmartCameraView.tsx

- **pollDetection()** → Runs every 2 seconds during scan
- **pollDetectionImmediately()** → Called when camera starts
- **captureAtFullResolution()** → Captures at full quality for analysis
- **DetectedItem[]** state → Stores bounding boxes and labels

### Detection Data Flow

```
Browser Camera
    ↓
SmartCameraView.tsx (every 2s)
    ↓
POST {NEXT_PUBLIC_API_URL}/api/food/analysis/detect/
    ↓
Django Backend (YOLO model)
    ↓
Returns: {items[], confidence_score}
    ↓
Canvas draws bounding boxes
    ↓
If confidence > 65% → Auto-capture countdown
```

---

## For Your Thesis

The camera detection feature demonstrates:
- **RQ1: Food Recognition** — Real-time detection with YOLO model
- **User Experience** — Feedback with bounding boxes + confidence
- **3-angle capture** — Improves accuracy by capturing multiple perspectives

Console logs capture all thesis metrics during the camera flow.

---

## Quick Reference

| Scenario | Action |
|----------|--------|
| **Local dev, backend on localhost:8000** | `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000` |
| **Deployed on Railway** | `.env.local` has `NEXT_PUBLIC_API_URL=https://web-production-cc1b9.up.railway.app` |
| **Backend on different port** | Update `NEXT_PUBLIC_API_URL` to match |
| **Detection API fails** | App gracefully continues - you can still manually capture |
| **No .env.local file** | Create one (example at `.env.example`) |
| **Changes not taking effect** | Restart dev server after changing .env |
