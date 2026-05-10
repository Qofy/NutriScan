'use client';

interface ConditionFilterProps {
  conditions: string[];
  selectedCondition: string;
  onConditionChange: (condition: string) => void;
}

export default function ConditionFilter({
  conditions,
  selectedCondition,
  onConditionChange,
}: ConditionFilterProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        Filter by Condition
      </h2>
      <div className="flex flex-wrap gap-3">
        {conditions.map(condition => (
          <button
            key={condition}
            onClick={() => onConditionChange(condition)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCondition === condition
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
