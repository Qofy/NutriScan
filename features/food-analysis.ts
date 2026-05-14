import { API_BASE_URL } from '@/lib/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface FoodItem {
  name: string;
  confidence: number;
}

export interface NutritionInfo {
  [key: string]: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    vitamins?: Record<string, string>;
    minerals?: Record<string, string>;
  };
}

export interface AnalysisResult {
  id: number;
  image: string;
  uploaded_at: string;
  recognized_items: FoodItem[];
  nutritional_info: NutritionInfo;
  safety_level: 'safe' | 'caution' | 'danger';
  confidence_score: number;
  analysis_result: Record<string, any>;
  is_manual?: boolean;
}

export interface HealthProfile {
  conditions: string[];
  allergens: string[];
}

export interface FoodAnalysisState {
  currentAnalysis: {
    image: string | null;
    loading: boolean;
    error: string | null;
    data: AnalysisResult | null;
  };
  recentAnalyses: {
    data: AnalysisResult[];
    loading: boolean;
    error: string | null;
  };
  foodSearch: {
    results: any[];
    loading: boolean;
    error: string | null;
    query: string;
  };
  healthProfile: HealthProfile | null;
  imagePreview: string | null;
  selectedAnalysis: AnalysisResult | null;
}

const loadRecentAnalysesFromStorage = (): AnalysisResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('recentAnalyses');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load recent analyses from localStorage:', error);
    return [];
  }
};

const saveRecentAnalysesToStorage = (analyses: AnalysisResult[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('recentAnalyses', JSON.stringify(analyses));
  } catch (error) {
    console.error('Failed to save recent analyses to localStorage:', error);
  }
};

export const initialState: FoodAnalysisState = {
  currentAnalysis: {
    image: null,
    loading: false,
    error: null,
    data: null,
  },
  recentAnalyses: {
    data: loadRecentAnalysesFromStorage(),
    loading: false,
    error: null,
  },
  foodSearch: {
    results: [],
    loading: false,
    error: null,
    query: '',
  },
  healthProfile: null,
  imagePreview: null,
  selectedAnalysis: null,
};

const foodAnalysisSlice = createSlice({
  name: 'foodAnalysis',
  initialState,
  reducers: {
    setCurrentAnalysisLoading: (state, action: PayloadAction<boolean>) => {
      state.currentAnalysis.loading = action.payload;
    },

    setCurrentAnalysisError: (state, action: PayloadAction<string | null>) => {
      state.currentAnalysis.error = action.payload;
    },

    setCurrentAnalysisData: (state, action: PayloadAction<AnalysisResult | null>) => {
      state.currentAnalysis.data = action.payload;
      state.currentAnalysis.loading = false;
      state.currentAnalysis.error = null;
    },

    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = {
        image: null,
        loading: false,
        error: null,
        data: null,
      };
      state.imagePreview = null;
    },

    // Recent Analyses Actions
    setRecentAnalysesLoading: (state, action: PayloadAction<boolean>) => {
      state.recentAnalyses.loading = action.payload;
    },

    setRecentAnalysesError: (state, action: PayloadAction<string | null>) => {
      state.recentAnalyses.error = action.payload;
    },

    setRecentAnalysesData: (state, action: PayloadAction<AnalysisResult[]>) => {
      state.recentAnalyses.data = action.payload;
      state.recentAnalyses.loading = false;
      state.recentAnalyses.error = null;
      saveRecentAnalysesToStorage(action.payload);
    },

    addRecentAnalysis: (state, action: PayloadAction<AnalysisResult>) => {
      state.recentAnalyses.data.unshift(action.payload);
      saveRecentAnalysesToStorage(state.recentAnalyses.data);
    },

    removeRecentAnalysis: (state, action: PayloadAction<number>) => {
      state.recentAnalyses.data = state.recentAnalyses.data.filter(
        (analysis) => analysis.id !== action.payload
      );
      saveRecentAnalysesToStorage(state.recentAnalyses.data);
    },

    // Food Search Actions
    setFoodSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.foodSearch.loading = action.payload;
    },

    setFoodSearchError: (state, action: PayloadAction<string | null>) => {
      state.foodSearch.error = action.payload;
    },

    setFoodSearchResults: (state, action: PayloadAction<any[]>) => {
      state.foodSearch.results = action.payload;
      state.foodSearch.loading = false;
      state.foodSearch.error = null;
    },

    setFoodSearchQuery: (state, action: PayloadAction<string>) => {
      state.foodSearch.query = action.payload;
    },

    resetFoodSearch: (state) => {
      state.foodSearch = {
        results: [],
        loading: false,
        error: null,
        query: '',
      };
    },

    setHealthProfile: (state, action: PayloadAction<HealthProfile>) => {
      state.healthProfile = action.payload;
    },

    clearHealthProfile: (state) => {
      state.healthProfile = null;
    },

    setImagePreview: (state, action: PayloadAction<string | null>) => {
      state.imagePreview = action.payload;
    },

    clearImagePreview: (state) => {
      state.imagePreview = null;
    },

    setSelectedAnalysis: (state, action: PayloadAction<AnalysisResult | null>) => {
      state.selectedAnalysis = action.payload;
    },

    clearRecentAnalyses: (state) => {
      state.recentAnalyses.data = [];
      state.recentAnalyses.loading = false;
      state.recentAnalyses.error = null;
      saveRecentAnalysesToStorage([]);
    },

    clearAllErrors: (state) => {
      state.currentAnalysis.error = null;
      state.recentAnalyses.error = null;
      state.foodSearch.error = null;
    },
  },
});

export const {
  setCurrentAnalysisLoading,
  setCurrentAnalysisError,
  setCurrentAnalysisData,
  clearCurrentAnalysis,
  setRecentAnalysesLoading,
  setRecentAnalysesError,
  setRecentAnalysesData,
  addRecentAnalysis,
  removeRecentAnalysis,
  clearRecentAnalyses,
  setFoodSearchLoading,
  setFoodSearchError,
  setFoodSearchResults,
  setFoodSearchQuery,
  resetFoodSearch,
  setHealthProfile,
  clearHealthProfile,
  setImagePreview,
  clearImagePreview,
  setSelectedAnalysis,
  clearAllErrors,
} = foodAnalysisSlice.actions;

import { AppDispatch } from '../store';

export const analyzeFood =
  (imageFile: File, healthProfile?: HealthProfile) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setCurrentAnalysisLoading(true));
      dispatch(setCurrentAnalysisError(null));

      const formData = new FormData();
      formData.append('image', imageFile);

      if (healthProfile) {
        formData.append('health_profile', JSON.stringify(healthProfile));
      }

      const response = await fetch(`${API_BASE_URL}/api/food/analysis/analyze/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      dispatch(setCurrentAnalysisData(data));
      dispatch(addRecentAnalysis(data));

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze food';
      dispatch(setCurrentAnalysisError(errorMessage));
      throw error;
    }
  };

export const deleteAnalysis =
  (analysisId: number) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/food/analysis/${analysisId}/`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      dispatch(removeRecentAnalysis(analysisId));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete analysis';
      throw new Error(errorMessage);
    }
  };

export const fetchRecentAnalyses =
  (limit: number = 10) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setRecentAnalysesLoading(true));
      dispatch(setRecentAnalysesError(null));

      const response = await fetch(
        `${API_BASE_URL}/api/food/analysis/recent/?limit=${limit}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: AnalysisResult[] = await response.json();

      // If backend returns data, use it
      if (data && data.length > 0) {
        dispatch(setRecentAnalysesData(data));
      } else {
        // If backend returns empty, keep localStorage data intact
        // (user might be offline or not authenticated)
        dispatch(setRecentAnalysesLoading(false));
      }

      return data;
    } catch {
      // On error, keep localStorage data (don't clear it)
      dispatch(setRecentAnalysesLoading(false));
      dispatch(setRecentAnalysesError(`Using saved data`));
      return [];
    }
  };

export const searchFoodItems =
  (query: string) =>
  async (dispatch: AppDispatch) => {
    try {
      if (!query.trim()) {
        dispatch(resetFoodSearch());
        return [];
      }

      dispatch(setFoodSearchQuery(query));
      dispatch(setFoodSearchLoading(true));
      dispatch(setFoodSearchError(null));

      const response = await fetch(
        `${API_BASE_URL}/api/food/items/search/?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setFoodSearchResults(data));

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search foods';
      dispatch(setFoodSearchError(errorMessage));
      throw error;
    }
  };

export const manualAnalyzeFood =
  (foodItems: string[], imageFile?: File, healthProfile?: HealthProfile) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setCurrentAnalysisLoading(true));
      dispatch(setCurrentAnalysisError(null));

      const formData = new FormData();
      const items = foodItems.filter(n => n.trim()).map(n => ({ name: n.trim(), confidence: 1.0 }));
      formData.append('food_items', JSON.stringify(items));

      if (imageFile) {
        formData.append('image', imageFile);
        const reader = new FileReader();
        reader.onload = () => dispatch(setImagePreview(reader.result as string));
        reader.readAsDataURL(imageFile);
      }

      if (healthProfile) {
        formData.append('health_profile', JSON.stringify(healthProfile));
      }

      const response = await fetch(`${API_BASE_URL}/api/food/analysis/manual-analyze/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to submit manual entry');
      }

      const data: AnalysisResult = await response.json();
      dispatch(setCurrentAnalysisData(data));
      dispatch(addRecentAnalysis(data));

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze foods';
      dispatch(setCurrentAnalysisError(errorMessage));
      throw error;
    }
  };

// Utility: Extract health profile from medical reports
export const extractHealthProfileFromReports = (reports: any[]): HealthProfile | null => {
  if (!reports || reports.length === 0) return null;

  const conditions = new Set<string>();
  const allergens = new Set<string>();

  reports.forEach((report) => {
    // From extracted_data (new format)
    if (report.extracted_data) {
      report.extracted_data.conditions?.forEach((c: any) => {
        if (c.condition) conditions.add(c.condition);
      });
      report.extracted_data.allergens?.forEach((a: any) => {
        if (a.allergen) allergens.add(a.allergen);
      });
    }

    // From health_info (legacy format)
    if (report.health_info) {
      report.health_info.forEach((h: any) => {
        if (h.condition_name) conditions.add(h.condition_name);
      });
    }

    // From allergies (legacy format)
    if (report.allergies) {
      report.allergies.forEach((a: any) => {
        if (a.allergen) allergens.add(a.allergen);
      });
    }
  });

  return {
    conditions: Array.from(conditions),
    allergens: Array.from(allergens),
  };
};

// Selectors
export const selectCurrentAnalysis = (state: any) => state.foodAnalysis.currentAnalysis;
export const selectRecentAnalyses = (state: any) => state.foodAnalysis.recentAnalyses;
export const selectFoodSearch = (state: any) => state.foodAnalysis.foodSearch;
export const selectHealthProfile = (state: any) => state.foodAnalysis.healthProfile;
export const selectImagePreview = (state: any) => state.foodAnalysis.imagePreview;
export const selectSelectedAnalysis = (state: any) => state.foodAnalysis.selectedAnalysis;

// Export reducer
export default foodAnalysisSlice.reducer;
