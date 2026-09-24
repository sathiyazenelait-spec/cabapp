import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppRole = 'parent' | 'driver' | 'cab_owner' | 'student' | 'admin' | 'professional';

export interface UserSession {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: AppRole;
  token?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  roleDetails?: Record<string, any>;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserSession | null;
  token: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  token: null,
  isLoading: false,
  errorMessage: null,
  rememberMe: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.errorMessage = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: UserSession; token: string }>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.errorMessage = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.token = null;
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.token = null;
      state.isLoading = false;
      state.errorMessage = null;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    clearAuthError: (state) => {
      state.errorMessage = null;
    }
  },
});

export const { setLoading, loginSuccess, loginFailure, logout, setRememberMe, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
