import { API_BASE_URL } from '@/lib/api';
import { createSlice } from '@reduxjs/toolkit';

export interface MedicalReport {
  id: number;
  document: string;
  uploaded_at: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  extracted_data: {
    extracted_summary?: string;
    conditions: Array<{ condition: string; confidence: number; severity: string }>;
    allergens: Array<{ allergen: string; severity: string; confidence: number }>;
    dietary_restrictions: Array<{ restriction: string; reason: string; recommendation: string }>;
  };
  health_info: Array<{ condition_name: string; confidence: number; description: string; severity: string }>;
  allergies: Array<{ allergen: string; reaction_type: string; severity: string; confidence: number }>;
  dietary_restrictions: Array<{ restriction: string; reason: string; recommendation: string }>;
}

interface MedicalReportsState {
  reports: MedicalReport[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
}

const loadReportsFromStorage = (): MedicalReport[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('medicalReports');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load reports from localStorage:', e);
    return [];
  }
};

const saveReportsToStorage = (reports: MedicalReport[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('medicalReports', JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to localStorage:', e);
  }
};

const initialState: MedicalReportsState = {
  reports: loadReportsFromStorage(),
  loading: false,
  error: null,
  uploading: false,
};

const medicalReportsSlice = createSlice({
  name: 'medicalReports',
  initialState,
  reducers: {
    setReports(state, action) {
      state.reports = action.payload;
      saveReportsToStorage(state.reports);
    },
    addReport(state, action) {
      state.reports.unshift(action.payload);
      saveReportsToStorage(state.reports);
    },
    removeReport(state, action) {
      state.reports = state.reports.filter(r => r.id !== action.payload);
      saveReportsToStorage(state.reports);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUploading(state, action) {
      state.uploading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setReports, addReport, removeReport, setLoading, setUploading, setError } = medicalReportsSlice.actions;

export function clearMedicalReports() {
  return (dispatch: any) => {
    dispatch(setReports([]));
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medicalReports');
    }
  };
}

export function uploadMedicalReport(file: File) {
  return async (dispatch: any) => {
    dispatch(setUploading(true));
    dispatch(setError(null));

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/medical/reports/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      dispatch(addReport(data));
      return data;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to upload report'));
      console.error('Upload error:', error);
      throw error;
    } finally {
      dispatch(setUploading(false));
    }
  };
}

export function fetchMedicalReports(limit = 100) {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(`${API_BASE_URL}/api/medical/reports/recent/?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch reports');

      const data = await response.json();
      if (data.length > 0) {
        dispatch(setReports(data));
      }
      return data;
    } catch (error: any) {
      dispatch(setError(error.message));
      console.error('Fetch error:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function deleteMedicalReport(reportId: number) {
  return async (dispatch: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/medical/reports/${reportId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete report');

      dispatch(removeReport(reportId));
      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      console.error('Delete error:', error);
      throw error;
    }
  };
}

export default medicalReportsSlice.reducer;
