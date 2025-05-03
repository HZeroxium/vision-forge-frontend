// /src/store/youtubeSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as youtubeService from '@services/youtubeService'
import type { RootState } from './store'
import {
  YouTubeState,
  YouTubeCallbackResponse,
  YouTubeUploadResponse,
  YouTubeVideoStatistics,
  BaseAnalyticsResponse,
  TopVideosAnalyticsResponse,
  DemographicsAnalyticsResponse,
} from '@services/types/youtubeTypes'

// Initial state
const initialState: YouTubeState = {
  auth: {
    isAuthenticated: false,
    channelId: undefined,
    channelName: undefined,
    loading: false,
    error: null,
  },
  upload: {
    uploading: false,
    uploadProgress: 0,
    uploadSuccess: false,
    uploadError: null,
    youtubeVideoId: undefined,
    youtubeUrl: undefined,
    publishingHistoryId: undefined,
  },
  analytics: {
    videoAnalytics: {},
    channelAnalytics: null,
    topVideos: null,
    demographics: null,
    loading: false,
    error: null,
  },
  statistics: {},
  loading: false,
  error: null,
}

// Async thunks for YouTube authentication
export const getAuthUrlAsync = createAsyncThunk(
  'youtube/getAuthUrl',
  async (_, { rejectWithValue }) => {
    try {
      return await youtubeService.getAuthUrl()
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to get auth URL'
      )
    }
  }
)

export const handleCallbackAsync = createAsyncThunk(
  'youtube/handleCallback',
  async (
    { code, error }: { code: string; error?: string },
    { rejectWithValue }
  ) => {
    try {
      return await youtubeService.handleCallback(code, error)
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to authenticate with YouTube'
      )
    }
  }
)

export const handlePublicCallbackAsync = createAsyncThunk(
  'youtube/handlePublicCallback',
  async (
    { code, state, error }: { code: string; state: string; error?: string },
    { rejectWithValue }
  ) => {
    try {
      return await youtubeService.handlePublicCallback(code, state, error)
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to authenticate with YouTube'
      )
    }
  }
)

// Async thunk for uploading a video to YouTube
export const uploadVideoAsync = createAsyncThunk(
  'youtube/uploadVideo',
  async (
    options: youtubeService.YouTubeUploadOptions,
    { rejectWithValue, dispatch }
  ) => {
    try {
      // Start progress updates - simulated for now
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += 5
        if (progress <= 90) {
          dispatch(updateUploadProgress(progress))
        }
      }, 500)

      // Actual upload call
      const data = await youtubeService.uploadVideo(options)

      // Clean up and complete
      clearInterval(progressInterval)
      dispatch(updateUploadProgress(100))

      return data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to upload video to YouTube'
      )
    }
  }
)

// Async thunk for getting video statistics
export const getVideoStatisticsAsync = createAsyncThunk(
  'youtube/getVideoStatistics',
  async (publishingHistoryId: string, { rejectWithValue }) => {
    try {
      const data = await youtubeService.getVideoStatistics(publishingHistoryId)
      return { publishingHistoryId, data }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to get video statistics'
      )
    }
  }
)

// Async thunk for getting video analytics
export const getVideoAnalyticsAsync = createAsyncThunk(
  'youtube/getVideoAnalytics',
  async (
    {
      videoId,
      metrics,
      startDate,
      endDate,
      dimensions,
    }: {
      videoId: string
      metrics?: string
      startDate?: string
      endDate?: string
      dimensions?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await youtubeService.getVideoAnalytics(
        videoId,
        metrics,
        startDate,
        endDate,
        dimensions
      )
      return { videoId, data }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to get video analytics'
      )
    }
  }
)

// Async thunk for getting channel analytics
export const getChannelAnalyticsAsync = createAsyncThunk(
  'youtube/getChannelAnalytics',
  async (
    {
      metrics,
      startDate,
      endDate,
      dimensions,
    }: {
      metrics?: string
      startDate?: string
      endDate?: string
      dimensions?: string
    },
    { rejectWithValue }
  ) => {
    try {
      return await youtubeService.getChannelAnalytics(
        metrics,
        startDate,
        endDate,
        dimensions
      )
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to get channel analytics'
      )
    }
  }
)

// Async thunk for getting top videos analytics
export const getTopVideosAnalyticsAsync = createAsyncThunk(
  'youtube/getTopVideosAnalytics',
  async (
    {
      limit,
      metrics,
      startDate,
      endDate,
    }: {
      limit?: number
      metrics?: string
      startDate?: string
      endDate?: string
    },
    { rejectWithValue }
  ) => {
    try {
      return await youtubeService.getTopVideosAnalytics(
        limit,
        metrics,
        startDate,
        endDate
      )
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to get top videos analytics'
      )
    }
  }
)

// Async thunk for getting demographics analytics
export const getDemographicsAnalyticsAsync = createAsyncThunk(
  'youtube/getDemographicsAnalytics',
  async (
    {
      startDate,
      endDate,
    }: {
      startDate?: string
      endDate?: string
    },
    { rejectWithValue }
  ) => {
    try {
      return await youtubeService.getDemographicsAnalytics(startDate, endDate)
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to get demographics analytics'
      )
    }
  }
)

// YouTube slice
const youtubeSlice = createSlice({
  name: 'youtube',
  initialState,
  reducers: {
    resetAuth(state) {
      state.auth = initialState.auth
    },
    resetUpload(state) {
      state.upload = initialState.upload
    },
    updateUploadProgress(state, action: PayloadAction<number>) {
      state.upload.uploadProgress = action.payload
    },
    clearError(state) {
      state.error = null
    },
    clearAuthError(state) {
      state.auth.error = null
    },
    clearUploadError(state) {
      state.upload.uploadError = null
    },
    clearAnalyticsError(state) {
      state.analytics.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getAuthUrl
      .addCase(getAuthUrlAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAuthUrlAsync.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getAuthUrlAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Handle callback
      .addCase(handleCallbackAsync.pending, (state) => {
        state.auth.loading = true
        state.auth.error = null
      })
      .addCase(
        handleCallbackAsync.fulfilled,
        (state, action: PayloadAction<YouTubeCallbackResponse>) => {
          state.auth.loading = false
          state.auth.isAuthenticated = action.payload.success
          state.auth.channelId = action.payload.channelId
          state.auth.channelName = action.payload.channelName
        }
      )
      .addCase(handleCallbackAsync.rejected, (state, action) => {
        state.auth.loading = false
        state.auth.isAuthenticated = false
        state.auth.error = action.payload as string
      })

      // Handle public callback (similar to regular callback)
      .addCase(handlePublicCallbackAsync.pending, (state) => {
        state.auth.loading = true
        state.auth.error = null
      })
      .addCase(
        handlePublicCallbackAsync.fulfilled,
        (state, action: PayloadAction<YouTubeCallbackResponse>) => {
          state.auth.loading = false
          state.auth.isAuthenticated = action.payload.success
          state.auth.channelId = action.payload.channelId
          state.auth.channelName = action.payload.channelName
        }
      )
      .addCase(handlePublicCallbackAsync.rejected, (state, action) => {
        state.auth.loading = false
        state.auth.isAuthenticated = false
        state.auth.error = action.payload as string
      })

      // Handle video upload
      .addCase(uploadVideoAsync.pending, (state) => {
        state.upload.uploading = true
        state.upload.uploadSuccess = false
        state.upload.uploadError = null
        state.upload.uploadProgress = 0
      })
      .addCase(
        uploadVideoAsync.fulfilled,
        (state, action: PayloadAction<YouTubeUploadResponse>) => {
          state.upload.uploading = false
          state.upload.uploadSuccess = action.payload.success
          state.upload.youtubeVideoId = action.payload.youtubeVideoId
          state.upload.youtubeUrl = action.payload.youtubeUrl
          state.upload.publishingHistoryId = action.payload.publishingHistoryId
          state.upload.uploadProgress = 100
        }
      )
      .addCase(uploadVideoAsync.rejected, (state, action) => {
        state.upload.uploading = false
        state.upload.uploadSuccess = false
        state.upload.uploadError = action.payload as string
        state.upload.uploadProgress = 0
      })

      // Handle video statistics
      .addCase(getVideoStatisticsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        getVideoStatisticsAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            publishingHistoryId: string
            data: YouTubeVideoStatistics
          }>
        ) => {
          state.loading = false
          const { publishingHistoryId, data } = action.payload
          state.statistics[publishingHistoryId] = data
        }
      )
      .addCase(getVideoStatisticsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Handle video analytics
      .addCase(getVideoAnalyticsAsync.pending, (state) => {
        state.analytics.loading = true
        state.analytics.error = null
      })
      .addCase(
        getVideoAnalyticsAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            videoId: string
            data: BaseAnalyticsResponse
          }>
        ) => {
          state.analytics.loading = false
          const { videoId, data } = action.payload
          state.analytics.videoAnalytics[videoId] = data
        }
      )
      .addCase(getVideoAnalyticsAsync.rejected, (state, action) => {
        state.analytics.loading = false
        state.analytics.error = action.payload as string
      })

      // Handle channel analytics
      .addCase(getChannelAnalyticsAsync.pending, (state) => {
        state.analytics.loading = true
        state.analytics.error = null
      })
      .addCase(
        getChannelAnalyticsAsync.fulfilled,
        (state, action: PayloadAction<BaseAnalyticsResponse>) => {
          state.analytics.loading = false
          state.analytics.channelAnalytics = action.payload
        }
      )
      .addCase(getChannelAnalyticsAsync.rejected, (state, action) => {
        state.analytics.loading = false
        state.analytics.error = action.payload as string
      })

      // Handle top videos analytics
      .addCase(getTopVideosAnalyticsAsync.pending, (state) => {
        state.analytics.loading = true
        state.analytics.error = null
      })
      .addCase(
        getTopVideosAnalyticsAsync.fulfilled,
        (state, action: PayloadAction<TopVideosAnalyticsResponse>) => {
          state.analytics.loading = false
          state.analytics.topVideos = action.payload
        }
      )
      .addCase(getTopVideosAnalyticsAsync.rejected, (state, action) => {
        state.analytics.loading = false
        state.analytics.error = action.payload as string
      })

      // Handle demographics analytics
      .addCase(getDemographicsAnalyticsAsync.pending, (state) => {
        state.analytics.loading = true
        state.analytics.error = null
      })
      .addCase(
        getDemographicsAnalyticsAsync.fulfilled,
        (state, action: PayloadAction<DemographicsAnalyticsResponse>) => {
          state.analytics.loading = false
          state.analytics.demographics = action.payload
        }
      )
      .addCase(getDemographicsAnalyticsAsync.rejected, (state, action) => {
        state.analytics.loading = false
        state.analytics.error = action.payload as string
      })
  },
})

// Export actions
export const {
  resetAuth,
  resetUpload,
  updateUploadProgress,
  clearError,
  clearAuthError,
  clearUploadError,
  clearAnalyticsError,
} = youtubeSlice.actions

// Export selectors
export const selectYouTubeAuth = (state: RootState) => state.youtube.auth
export const selectYouTubeUpload = (state: RootState) => state.youtube.upload
export const selectYouTubeAnalytics = (state: RootState) =>
  state.youtube.analytics
export const selectYouTubeStatistics = (state: RootState) =>
  state.youtube.statistics
export const selectYouTubeState = (state: RootState) => state.youtube

export default youtubeSlice.reducer
