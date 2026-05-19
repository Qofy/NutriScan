import type { ReactNode } from 'react';
import { CheckCircle2, TriangleAlert, XCircle, Pin, Lightbulb } from 'lucide-react';

interface RecommendationCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  condition: string;
  benefit: string;
  severity?: 'safe' | 'caution' | 'danger';
}

const severityStyles = {
  safe: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
    icon: <CheckCircle2 size={13} />,
  },
  caution: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    icon: <TriangleAlert size={13} />,
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
    icon: <XCircle size={13} />,
  },
};

export default function RecommendationCard({
  icon,
  title,
  description,
  condition,
  benefit,
  severity = 'safe',
}: RecommendationCardProps) {
  const styles = severityStyles[severity];

  return (
    <div
      className={`rounded-2xl border ${styles.border} ${styles.bg} p-6 shadow-sm`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <span className={`${styles.badge} inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold`}>
          {styles.icon} {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-700 mb-4">{description}</p>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
        <span className="text-slate-400"><Pin size={14} /></span>
          <div>
            <p className="text-xs font-semibold text-slate-600">Condition</p>
            <p className="text-sm text-slate-900">{condition}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-slate-400"><Lightbulb size={14} /></span>
          <div>
            <p className="text-xs font-semibold text-slate-600">Benefit</p>
            <p className="text-sm text-slate-900">{benefit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
