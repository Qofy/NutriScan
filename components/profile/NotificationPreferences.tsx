'use client';

const NOTIFICATION_PREFS = [
  { label: 'Daily health tips' },
  { label: 'Meal recommendations' },
  { label: 'Lab result alerts' },
  { label: 'Weekly progress summary' },
];

export default function NotificationPreferences() {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

      <div className="space-y-4">
        {NOTIFICATION_PREFS.map((pref) => (
          <label key={pref.label} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-emerald-500 cursor-pointer"
            />
            <span className="font-medium text-gray-700">{pref.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
