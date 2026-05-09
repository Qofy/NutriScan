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

export const initialState: FoodAnalysisState = {
  currentAnalysis: {
    image: null,
    loading: false,
    error: null,
    data: null,
  },
  recentAnalyses: {
    data: [],
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
    },

    addRecentAnalysis: (state, action: PayloadAction<AnalysisResult>) => {
      state.recentAnalyses.data.unshift(action.payload);
    },

    removeRecentAnalysis: (state, action: PayloadAction<number>) => {
      state.recentAnalyses.data = state.recentAnalyses.data.filter(
        (analysis) => analysis.id !== action.payload
      );
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

      const response = await fetch('http://localhost:8000/api/food/analysis/analyze/', {
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
        `http://localhost:8000/api/food/analysis/${analysisId}/`,
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
        `http://localhost:8000/api/food/analysis/recent/?limit=${limit}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: AnalysisResult[] = await response.json();
      dispatch(setRecentAnalysesData(data));

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analyses';
      dispatch(setRecentAnalysesError(errorMessage));
      throw error;
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
        `http://localhost:8000/api/food/items/search/?q=${encodeURIComponent(query)}`,
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

// Selectors
export const selectCurrentAnalysis = (state: any) => state.foodAnalysis.currentAnalysis;
export const selectRecentAnalyses = (state: any) => state.foodAnalysis.recentAnalyses;
export const selectFoodSearch = (state: any) => state.foodAnalysis.foodSearch;
export const selectHealthProfile = (state: any) => state.foodAnalysis.healthProfile;
export const selectImagePreview = (state: any) => state.foodAnalysis.imagePreview;
export const selectSelectedAnalysis = (state: any) => state.foodAnalysis.selectedAnalysis;

// Export reducer
export default foodAnalysisSlice.reducer;
