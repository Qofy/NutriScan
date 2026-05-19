'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Search } from 'lucide-react';
import { fetchAdminUsers, updateUserRole, AdminUser } from '@/features/admin';

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      setUpdatingId(userId);
      await updateUserRole(userId, newRole as 'user' | 'admin');
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole as 'user' | 'admin' } : u))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-gray-600">Loading users...</div>
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users and their roles</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-50 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Scans</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Reports</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center font-semibold text-emerald-800">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role === 'admin' ? '👤 Admin' : 'User'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{user.scan_count}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{user.report_count}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      disabled={updatingId === user.id}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        user.role === 'admin'
                          ? 'bg-red-100 hover:bg-red-200 text-red-700 disabled:opacity-50'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50'
                      }`}
                    >
                      {updatingId === user.id
                        ? 'Updating...'
                        : user.role === 'admin'
                          ? 'Demote'
                          : 'Promote'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No users found matching your search.</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}
