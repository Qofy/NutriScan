'use client';

interface ActionButtonsProps {
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function ActionButtons({ loading, onSave, onCancel }: ActionButtonsProps) {
  return (
    <div className="flex gap-4 pb-8">
      <button
        onClick={onSave}
        disabled={loading}
        className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
      <button
        onClick={onCancel}
        disabled={loading}
        className="flex-1 sm:flex-initial px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
