/**
 * Authentication utilities
 */

export function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  return headers;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}
