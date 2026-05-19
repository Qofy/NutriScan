'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Filter } from 'lucide-react';
import { fetchAdminScans, AdminScan } from '@/features/admin';

export default function ScansOverview() {
  const [scans, setScans] = useState<AdminScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [safetyFilter, setSafetyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    loadScans();
  }, [safetyFilter, typeFilter]);

  const loadScans = async () => {
    try {
      setLoading(true);
      const manual = typeFilter ? typeFilter === 'manual' : undefined;
      const data = await fetchAdminScans(safetyFilter || undefined, manual);
      setScans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-gray-600">Loading scans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-red-800">
          <div className="flex gap-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Food Scans Overview</h1>
        <p className="text-gray-600 mt-2">All food scans across all users</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-50 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safety Level</label>
            <select
              value={safetyFilter}
              onChange={(e) => setSafetyFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="safe">Safe</option>
              <option value="caution">Caution</option>
              <option value="danger">Danger</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scan Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="manual">Manual</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-slate-50 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Food Items</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Safety</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Confidence</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{scan.user__username}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {Array.isArray(scan.recognized_items) && scan.recognized_items.length > 0
                      ? scan.recognized_items.slice(0, 2).join(', ') +
                        (scan.recognized_items.length > 2 ? ` +${scan.recognized_items.length - 2}` : '')
                      : 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        scan.safety_level === 'safe'
                          ? 'bg-green-100 text-green-800'
                          : scan.safety_level === 'caution'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {scan.safety_level}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        scan.is_manual ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {scan.is_manual ? '📝 Manual' : 'Camera'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {(scan.confidence_score * 100).toFixed(0)}%
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {new Date(scan.uploaded_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {scans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No scans found matching your filters.</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing {scans.length} scans
      </div>
    </div>
  );
}
