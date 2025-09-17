import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState } from '../types';

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  }
);

export const validateToken = createAsyncThunk(
  'auth/validate',
  async (token: string) => {
    const response = await axios.get('/api/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = { username: action.payload.username, isAdmin: true };
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = { username: action.payload.username, isAdmin: true };
        state.isAuthenticated = true;
      })
      .addCase(validateToken.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;