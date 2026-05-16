'use client';

import { LogOut } from 'lucide-react';

interface ActionButtonsProps {
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onLogout?: () => void;
}

export default function ActionButtons({ loading, onSave, onCancel, onLogout }: ActionButtonsProps) {
  return (
    <div className="space-y-4 pb-8">
      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={onSave}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      {onLogout && (
        <button
          onClick={onLogout}
          disabled={loading}
          className="w-full px-6 py-3 bg-red-50 hover:bg-red-100 disabled:bg-gray-300 text-red-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 md:w-auto"
        >
          <LogOut size={18} />
          Logout
        </button>
      )}
    </div>
  );
}
