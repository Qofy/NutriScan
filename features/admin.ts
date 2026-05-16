import { API_BASE_URL } from '@/lib/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` }),
  };
};

export interface AdminStats {
  total_users: number;
  total_scans: number;
  total_reports: number;
  safety_breakdown: {
    safe: number;
    caution: number;
    danger: number;
  };
  scan_type_breakdown: {
    manual: number;
    auto: number;
  };
  recent_scans: any[];
  recent_reports: any[];
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  date_joined: string;
  scan_count: number;
  report_count: number;
}

export interface AdminScan {
  id: number;
  user__username: string;
  recognized_items: string[];
  safety_level: string;
  is_manual: boolean;
  confidence_score: number;
  uploaded_at: string;
}

export interface AdminReport {
  id: number;
  user__username: string;
  status: string;
  uploaded_at: string;
  conditions_count: number;
}

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/stats/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch admin stats');
  return response.json();
};

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const updateUserRole = async (
  userId: number,
  role: 'user' | 'admin'
): Promise<{ success: boolean; role: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  if (!response.ok) throw new Error('Failed to update user role');
  return response.json();
};

export const fetchAdminScans = async (
  safety?: string,
  manual?: boolean
): Promise<AdminScan[]> => {
  const params = new URLSearchParams();
  if (safety) params.append('safety', safety);
  if (manual !== undefined) params.append('manual', String(manual));

  const response = await fetch(`${API_BASE_URL}/api/admin/scans/?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch scans');
  return response.json();
};

export const fetchAdminReports = async (status?: string): Promise<AdminReport[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const response = await fetch(`${API_BASE_URL}/api/admin/reports/?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch reports');
  return response.json();
};
