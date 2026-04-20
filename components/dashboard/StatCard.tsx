interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  bgColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  subtext,
  bgColor = 'bg-emerald-50',
}: StatCardProps) {
  return (
    <div className={`rounded-2xl ${bgColor} p-6 border border-gray-100 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
