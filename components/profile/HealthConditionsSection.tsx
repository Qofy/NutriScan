'use client';

interface Conditions {
  diabetes: boolean;
  hypertension: boolean;
  allergies: boolean;
  heartDisease: boolean;
}

interface HealthConditionsSectionProps {
  conditions: Conditions;
  handleCheckboxChange: (condition: string) => void;
}

const CONDITION_LIST = [
  { key: 'diabetes', label: 'Type 2 Diabetes' },
  { key: 'hypertension', label: 'Hypertension (High Blood Pressure)' },
  { key: 'allergies', label: 'Food Allergies' },
  { key: 'heartDisease', label: 'Heart Disease' },
];

export default function HealthConditionsSection({
  conditions,
  handleCheckboxChange,
}: HealthConditionsSectionProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Health Conditions</h2>

      <div className="space-y-4">
        {CONDITION_LIST.map((condition) => (
          <label key={condition.key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={conditions[condition.key as keyof Conditions]}
              onChange={() => handleCheckboxChange(condition.key)}
              className="w-5 h-5 rounded border-gray-300 text-emerald-500 cursor-pointer"
            />
            <span className="font-medium text-gray-700">{condition.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
