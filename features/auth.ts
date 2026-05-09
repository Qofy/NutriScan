import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
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
    },

    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
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
};

export const selectAuth = (state: any) => state.auth;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;

export default authSlice.reducer;
