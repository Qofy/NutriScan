import { API_BASE_URL } from '@/lib/api';
import { createSlice } from '@reduxjs/toolkit';

export interface Recommendation {
  id: number;
  food_item: string;
  description: string;
  condition: string;
  benefit: string;
  severity: 'safe' | 'caution' | 'danger';
  nutritional_info: Record<string, number>;
  created_at: string;
  based_on_food_analysis: boolean;
  based_on_medical_report: boolean;
}

interface RecommendationsState {
  items: Recommendation[];
  loading: boolean;
  error: string | null;
  generated: boolean;
}

const initialState: RecommendationsState = {
  items: [],
  loading: false,
  error: null,
  generated: false,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations(state, action) {
      state.items = action.payload;
      state.generated = true;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearRecommendations(state) {
      state.items = [];
      state.generated = false;
      state.error = null;
    },
  },
});

export const { setRecommendations, setLoading, setError, clearRecommendations } = recommendationsSlice.actions;

export function fetchRecommendations() {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/`);

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      console.log("Recommendation Data: ", data)
      dispatch(setRecommendations(Array.isArray(data) ? data : data.results || []));
    } catch (error: any) {
      dispatch(setError(error.message));
      console.error('Fetch recommendations error:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function generateRecommendations() {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/smart_generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate recommendations');
      }

      const data = await response.json();
      console.log("Generated Recommendation",data)
      dispatch(setRecommendations(Array.isArray(data) ? data : data.results || []));
      return data;
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to generate recommendations'));
      console.error('Generate recommendations error:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function trackRecommendationAction(recommendationId: number, action: string) {
  return async (dispatch: any) => {
    try {
      await fetch(`${API_BASE_URL}/api/recommendations/track_action/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendation_id: recommendationId, action }),
      });
    } catch (error) {
      console.error('Track action error:', error);
    }
  };
}

export default recommendationsSlice.reducer;
