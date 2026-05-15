export const getAuthHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  return headers;
};

export const API_BASE_URL = 'https://web-production-cc1b9.up.railway.app';
