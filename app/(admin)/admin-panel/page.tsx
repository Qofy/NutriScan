'use client';

import { useState, useEffect } from 'react';
import { Users, Eye, FileText, AlertCircle } from 'lucide-react';
import { fetchAdminStats, AdminStats } from '@/features/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-gray-600">Loading admin dashboard...</div>
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

  if (!stats) return null;

  const totalDanger = stats.safety_breakdown.danger;
  const safetyTotal = stats.safety_breakdown.safe + stats.safety_breakdown.caution + stats.safety_breakdown.danger;
  const safePercent = safetyTotal > 0 ? ((stats.safety_breakdown.safe / safetyTotal) * 100).toFixed(0) : 0;
  const cautionPercent = safetyTotal > 0 ? ((stats.safety_breakdown.caution / safetyTotal) * 100).toFixed(0) : 0;
  const dangerPercent = safetyTotal > 0 ? ((stats.safety_breakdown.danger / safetyTotal) * 100).toFixed(0) : 0;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Site-wide overview and statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total_users}</p>
            </div>
            <Users size={32} className="text-blue-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Scans</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.total_scans}</p>
            </div>
            <Eye size={32} className="text-indigo-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-violet-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Medical Reports</p>
              <p className="text-3xl font-bold text-violet-600 mt-2">{stats.total_reports}</p>
            </div>
            <FileText size={32} className="text-violet-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Danger Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{totalDanger}</p>
            </div>
            <AlertCircle size={32} className="text-red-300" />
          </div>
        </div>
      </div>

      {/* Safety Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Food Safety Breakdown</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Safe</span>
              <span className="text-sm font-medium text-gray-700">{stats.safety_breakdown.safe} ({safePercent}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${safePercent}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Caution</span>
              <span className="text-sm font-medium text-gray-700">{stats.safety_breakdown.caution} ({cautionPercent}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${cautionPercent}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Danger</span>
              <span className="text-sm font-medium text-gray-700">{stats.safety_breakdown.danger} ({dangerPercent}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${dangerPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Type Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Scan Type Distribution</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <p className="text-blue-600 font-semibold">Manual Entries</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{stats.scan_type_breakdown.manual}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
            <p className="text-emerald-600 font-semibold">Auto Scans</p>
            <p className="text-2xl font-bold text-emerald-900 mt-2">{stats.scan_type_breakdown.auto}</p>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      {stats.recent_scans.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Food Scans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Safety</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_scans.map((scan) => (
                  <tr key={scan.id}>
                    <td className="py-3 px-4 text-gray-900">{scan.user__username}</td>
                    <td className="py-3 px-4 text-gray-600">{Array.isArray(scan.recognized_items) ? scan.recognized_items.length : 0} items</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        scan.safety_level === 'safe' ? 'bg-green-100 text-green-800' :
                        scan.safety_level === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {scan.safety_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{new Date(scan.uploaded_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      {stats.recent_reports.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Medical Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_reports.map((report) => (
                  <tr key={report.id}>
                    <td className="py-3 px-4 text-gray-900">{report.user__username}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === 'completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{new Date(report.uploaded_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
