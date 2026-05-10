import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearRecentAnalyses, fetchRecentAnalyses } from './food-analysis';
import { clearMedicalReports, fetchMedicalReports } from './medical-reports';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const loadAuthFromStorage = (): { user: User | null; token: string | null } => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const user = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch (error) {
    console.error('Failed to load auth from localStorage:', error);
    return { user: null, token: null };
  }
};

const saveAuthToStorage = (user: User | null, token: string | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  } catch (error) {
    console.error('Failed to save auth to localStorage:', error);
  }
};

const { user: storedUser, token: storedToken } = loadAuthFromStorage();

export const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      saveAuthToStorage(action.payload, state.token);
    },

    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      saveAuthToStorage(state.user, action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      saveAuthToStorage(null, null);
    },
  },
});

export const {
  setUser,
  setToken,
  setLoading,
  setError,
  clearAuth,
} = authSlice.actions;

import { AppDispatch } from '../store';

export const login =
  (username: string, password: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await fetch('http://localhost:8000/api/profile/user/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log("data:",data)
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
      localStorage.setItem('auth_token', data.token);
      document.cookie = `auth_token=${data.token}; path=/; max-age=86400`;

      dispatch(fetchRecentAnalyses(100) as any);
      dispatch(fetchMedicalReports() as any);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const register =
  (username: string, email: string, password: string, firstName?: string, lastName?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await fetch('http://localhost:8000/api/profile/user/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
      localStorage.setItem('auth_token', data.token);
      document.cookie = `auth_token=${data.token}; path=/; max-age=86400`;

      dispatch(fetchRecentAnalyses(100) as any);
      dispatch(fetchMedicalReports() as any);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const restoreAuth = () => async (dispatch: AppDispatch) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      dispatch(clearAuth());
      return;
    }

    dispatch(setLoading(true));
    const response = await fetch('http://localhost:8000/api/profile/user/me/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      localStorage.removeItem('auth_token');
      dispatch(clearAuth());
      return;
    }

    const user = await response.json();
    dispatch(setToken(token));
    dispatch(setUser(user));
    dispatch(fetchRecentAnalyses(100) as any);
    dispatch(fetchMedicalReports() as any);
  } catch (error) {
    localStorage.removeItem('auth_token');
    dispatch(clearAuth());
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; max-age=0';
  dispatch(clearAuth());
  dispatch(clearRecentAnalyses());
  dispatch(clearMedicalReports());
};

export const updateProfile = (profileData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Update user info (first_name, last_name, email)
    const userResponse = await fetch('http://localhost:8000/api/profile/user/update_profile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
      }),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(errorData.error || 'Failed to update user profile');
    }

    const updatedUser = await userResponse.json();
    dispatch(setUser(updatedUser));

    // Update health profile (conditions, allergies, dietary preferences, etc.)
    try {
      await fetch('http://localhost:8000/api/profile/health/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          age: parseInt(profileData.age) || null,
          height: parseFloat(profileData.height) || null,
          weight: parseFloat(profileData.weight) || null,
          health_conditions: Object.keys(profileData.conditions).filter(
            key => profileData.conditions[key]
          ),
          allergies: profileData.allergies ? profileData.allergies.split(',').map((a: string) => a.trim()).filter((a: string) => a) : [],
          dietary_preferences: profileData.dietaryPreferences ? [profileData.dietaryPreferences] : [],
        }),
      });
    } catch (healthError) {
      console.warn('Health profile update warning:', healthError);
      // Don't fail the entire save if health profile update fails
    }

    return updatedUser;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    dispatch(setError(errorMessage));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchHealthProfile = () => async (dispatch: AppDispatch) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch('http://localhost:8000/api/profile/health/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch health profile:', error);
    return null;
  }
};

export const selectAuth = (state: any) => state.auth;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;

export default authSlice.reducer;
