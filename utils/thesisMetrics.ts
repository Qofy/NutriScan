/**
 * Thesis metrics logging and tracking
 * Used for RQ1-RQ3 validation and evidence collection
 */

interface MetricEvent {
  timestamp: string;
  metric: string;
  value: number;
  expected?: number;
  unit?: string;
  status: 'pass' | 'fail' | 'warning';
}

const metrics: MetricEvent[] = [];

export function logMetric(
  metricName: string,
  actualValue: number,
  expectedValue?: number,
  unit: string = ''
): void {
  const status =
    expectedValue === undefined
      ? 'pass'
      : Math.abs(actualValue - expectedValue) / expectedValue < 0.1
        ? 'pass'
        : 'warning';

  const event: MetricEvent = {
    timestamp: new Date().toISOString(),
    metric: metricName,
    value: actualValue,
    expected: expectedValue,
    unit,
    status,
  };

  metrics.push(event);

  console.log(`📊 [THESIS METRIC] ${metricName}: ${actualValue}${unit}`, {
    expected: expectedValue,
    status,
  });
}

export function logThesisMetrics(
  research_question: string,
  metrics_data?: { [key: string]: number | string }
): void {
  console.log(`\n📚 [THESIS VERIFICATION] ${research_question}`);
  if (metrics_data) {
    Object.entries(metrics_data).forEach(([key, value]) => {
      console.log(`  ├─ ${key}: ${value}`);
    });
  }
}

export function getMetricsReport(): MetricEvent[] {
  return metrics;
}

export function clearMetrics(): void {
  metrics.length = 0;
}

export function exportMetricsJSON(): string {
  return JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      metrics_count: metrics.length,
      metrics,
    },
    null,
    2
  );
}
