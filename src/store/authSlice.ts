// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as authService from '../services/authService'
import type { User } from '../services/authService'
import { updateProfile } from '../services/userService'

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
      // Also save user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user))
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

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('No authentication token found')
      }

      // First try to get the user from localStorage
      const storedUser = authService.getCurrentUser()
      if (storedUser) {
        return storedUser
      }

      // If no stored user, fetch from API
      const user = await authService.getProfile()
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error: any) {
      // Clear invalid authentication data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile'
      )
    }
  }
)

// Async thunk for Google authentication
export const setGoogleAuth = createAsyncThunk(
  'auth/setGoogleAuth',
  async (token: string, { rejectWithValue }) => {
    try {
      // The token is already saved in localStorage in the callback page
      localStorage.setItem('token', token)

      // Fetch the user profile with the token
      const user = await authService.getProfile()

      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user))

      return { token, user }
    } catch (error: any) {
      // Clear invalid authentication data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return rejectWithValue(
        error.response?.data?.message || 'Failed to authenticate with Google'
      )
    }
  }
)

// Async thunk for updating profile
export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (
    profileData: { name?: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const updatedUser = await updateProfile(profileData)

      // Update user in localStorage
      const userJson = localStorage.getItem('user')
      if (userJson) {
        const user = JSON.parse(userJson)
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            name: updatedUser.name,
            description: updatedUser.description,
          })
        )
      }

      return updatedUser
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
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
      localStorage.removeItem('user')
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
      // Handle fetchUserProfile actions
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.user = null
        state.loading = false
        state.error = action.payload as string
      })
      // Handle Google auth
      .addCase(setGoogleAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        setGoogleAuth.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false
          state.token = action.payload.token
          state.user = action.payload.user
        }
      )
      .addCase(setGoogleAuth.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || 'Google authentication failed'
      })
      // Handle updateProfileAsync actions
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false
        if (state.user) {
          state.user = {
            ...state.user,
            name: action.payload.name,
            description: action.payload.description,
          }
        }
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// Export actions for use in components
export const { logout, clearError } = authSlice.actions

// Export reducer to be included in the store
export default authSlice.reducer
