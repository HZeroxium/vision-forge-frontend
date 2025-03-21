// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as authService from '../services/authService'
import type { User } from '../services/authService'

// Define the shape of our auth state
export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

// Initial state for authentication
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

// Async thunk for logging in
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Call login API
      const loginResponse = await authService.login({ email, password })
      // Save token in localStorage for persistence
      localStorage.setItem('token', loginResponse.access_token)
      // Load user profile after login
      const user = await authService.getProfile()
      return { token: loginResponse.access_token, user }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      )
    }
  }
)

// Async thunk for registering
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name?: string },
    { rejectWithValue }
  ) => {
    try {
      const user = await authService.register({ email, password, name })
      // Optionally, you may choose tự động đăng nhập sau khi register
      return { user }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      )
    }
  }
)

// Async thunk for loading user profile
export const loadProfileAsync = createAsyncThunk(
  'auth/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getProfile()
      return { user }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load profile.'
      )
    }
  }
)

// Async thunk for changing password
export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.changePassword(
        oldPassword,
        newPassword
      )
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Change password failed.'
      )
    }
  }
)

// Async thunk for resetting password
export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.resetPassword(token, newPassword)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Reset password failed.'
      )
    }
  }
)

// Async thunk for forgot password (to request a reset token)
export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Forgot password failed.'
      )
    }
  }
)

// Create authSlice using createSlice API from Redux Toolkit
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous action to log out the user
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    // Action to clear error messages
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle loginAsync actions
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        loginAsync.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false
          state.token = action.payload.token
          state.user = action.payload.user
        }
      )
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Login failed'
      })
      // Handle registerAsync actions
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        registerAsync.fulfilled,
        (state, action: PayloadAction<{ user: User }>) => {
          state.loading = false
          state.user = action.payload.user
        }
      )
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Registration failed'
      })
      // Handle loadProfileAsync actions
      .addCase(loadProfileAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        loadProfileAsync.fulfilled,
        (state, action: PayloadAction<{ user: User }>) => {
          state.loading = false
          state.user = action.payload.user
        }
      )
      .addCase(loadProfileAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to load profile'
      })
      // Handle changePasswordAsync actions
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Change password failed'
      })
      // Handle resetPasswordAsync actions
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Reset password failed'
      })
      // Handle forgotPasswordAsync actions
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Forgot password failed'
      })
  },
})

// Export actions for use in components
export const { logout, clearError } = authSlice.actions

// Export reducer to be included in the store
export default authSlice.reducer
