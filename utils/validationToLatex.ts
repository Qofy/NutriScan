/**
 * Convert YOLO validation JSON to LaTeX tables for thesis
 */

interface DetectedItem {
  name: string;
  confidence: number;
  bbox?: number[];
}

interface ValidationResult {
  angle: string;
  timestamp: string;
  detected_items: DetectedItem[];
  latency_ms: number;
  confidence_score: number;
}

interface ValidationJSON {
  metadata: {
    timestamp: string;
    framework: string;
    hardware: string;
    test_count: number;
    total_detections: number;
  };
  validation_results: ValidationResult[];
}

export function jsonToLatex(jsonData: ValidationJSON): string {
  const results = jsonData.validation_results;

  // Group by food item
  const foodStats: {
    [key: string]: { count: number; totalConfidence: number; angles: string[] };
  } = {};

  results.forEach((result) => {
    result.detected_items.forEach((item) => {
      const foodName = item.name.toLowerCase().replace(/\s+/g, '_');
      if (!foodStats[foodName]) {
        foodStats[foodName] = { count: 0, totalConfidence: 0, angles: [] };
      }
      foodStats[foodName].count++;
      foodStats[foodName].totalConfidence += item.confidence;
      foodStats[foodName].angles.push(result.angle);
    });
  });

  // Calculate latency statistics
  const latencies = results.map((r) => r.latency_ms);
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
  const p95Latency = percentile(latencies, 95).toFixed(1);
  const p99Latency = percentile(latencies, 99).toFixed(1);
  const fps = (1000 / parseFloat(avgLatency)).toFixed(2);

  // Overall accuracy (if ground truth exists - currently all detected = positive)
  const totalTests = results.length;
  const totalDetections = jsonData.metadata.total_detections;
  const avgDetections = (totalDetections / totalTests).toFixed(2);

  let latex = '';

  // Table 1: Per-Angle Performance
  latex += generateAngleTable(results);

  latex += '\n\n';

  // Table 2: Latency Performance
  latex += generateLatencyTable(avgLatency, p95Latency, p99Latency, fps);

  latex += '\n\n';

  // Table 3: Detected Items Summary
  latex += generateDetectionSummary(foodStats, totalTests);

  return latex;
}

function generateAngleTable(results: ValidationResult[]): string {
  let latex = `\\begin{table}[htbp]
\\centering
\\caption{\\textbf{YOLO Detection Results by Viewing Angle}}
\\label{tab:yolo_angle_performance}
\\vspace{4pt}
\\begin{tabular}{L{3.5cm} C{2.5cm} C{3cm} C{2.5cm}}
\\toprule
\\rowcolor{headerblue}
\\textcolor{white}{\\bfseries Viewing Angle} &
\\textcolor{white}{\\bfseries Items Detected} &
\\textcolor{white}{\\bfseries Avg Confidence} &
\\textcolor{white}{\\bfseries Latency (ms)} \\\\
\\midrule
`;

  results.forEach((result, idx) => {
    const angleLabel = {
      front: 'Front View',
      side: 'Side View',
      closeup: 'Close-up',
    }[result.angle] || result.angle;

    const avgConf = (
      result.detected_items.reduce((a, b) => a + b.confidence, 0) / result.detected_items.length
    ).toFixed(3);

    const rowColor = idx % 2 === 1 ? '\\rowcolor{rowgray}' : '';

    latex += `
${rowColor}
${angleLabel} & ${result.detected_items.length} & ${avgConf} & ${result.latency_ms.toFixed(0)} \\\\
`;
  });

  latex += `\\bottomrule
\\end{tabular}

\\vspace{4pt}
{\\footnotesize\\textit{Results from real-time YOLO detection system deployed on production.}}
\\end{table}`;

  return latex;
}

function generateLatencyTable(
  avgLatency: string,
  p95Latency: string,
  p99Latency: string,
  fps: string
): string {
  return `\\begin{table}[htbp]
\\centering
\\caption{\\textbf{Real-Time YOLO Performance Metrics}}
\\label{tab:yolo_latency}
\\vspace{4pt}
\\begin{tabular}{L{5cm} C{2.5cm} L{4.5cm}}
\\toprule
\\rowcolor{headerblue}
\\textcolor{white}{\\bfseries Metric} &
\\textcolor{white}{\\bfseries Value} &
\\textcolor{white}{\\bfseries Notes} \\\\
\\midrule
Average Latency & ${avgLatency} ms & Per-image detection time \\\\
\\rowcolor{rowgray}
P95 Latency & ${p95Latency} ms & 95th percentile response time \\\\
P99 Latency & ${p99Latency} ms & 99th percentile response time \\\\
\\rowcolor{rowgray}
Throughput & ${fps} FPS & Real-time camera processing rate \\\\
\\bottomrule
\\end{tabular}

\\vspace{4pt}
{\\footnotesize\\textit{Performance measured on deployed system during validation testing.}}
\\end{table}`;
}

function generateDetectionSummary(
  foodStats: { [key: string]: { count: number; totalConfidence: number; angles: string[] } },
  totalTests: number
): string {
  const entries = Object.entries(foodStats).sort((a, b) => b[1].count - a[1].count);

  let latex = `\\begin{table}[htbp]
\\centering
\\caption{\\textbf{Detected Food Items Summary}}
\\label{tab:yolo_detections}
\\vspace{4pt}
\\begin{tabular}{L{3.5cm} C{2cm} C{2.5cm} L{4cm}}
\\toprule
\\rowcolor{headerblue}
\\textcolor{white}{\\bfseries Food Item} &
\\textcolor{white}{\\bfseries Count} &
\\textcolor{white}{\\bfseries Avg Conf} &
\\textcolor{white}{\\bfseries Captured From} \\\\
\\midrule
`;

  entries.forEach((entry, idx) => {
    const [foodName, stats] = entry;
    const displayName = foodName.replace(/_/g, ' ').toUpperCase();
    const avgConf = (stats.totalConfidence / stats.count).toFixed(3);
    const angles = [...new Set(stats.angles)].join(', ');

    const rowColor = idx % 2 === 1 ? '\\rowcolor{rowgray}' : '';

    latex += `
${rowColor}
${displayName} & ${stats.count} & ${avgConf} & ${angles} \\\\
`;
  });

  latex += `\\bottomrule
\\end{tabular}

\\vspace{4pt}
{\\footnotesize\\textit{Multi-angle validation testing with ${totalTests} images across different viewing angles.}}
\\end{table}`;

  return latex;
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}
