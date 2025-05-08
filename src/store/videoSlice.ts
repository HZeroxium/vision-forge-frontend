// src/store/videoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as videoService from '@services/videoService'
import type { Video, VideosPaginationDto } from '@services/videoService'
import type { RootState } from './store'

export interface VideoState {
  // All videos state
  videos: Video[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null

  // User videos state
  userVideos: Video[]
  userTotalCount: number
  userPage: number
  userLimit: number
  userTotalPages: number
  userLoading: boolean
  userError: string | null

  // Current video state
  currentVideo: Video | null
  currentVideoLoading: boolean
  currentVideoError: string | null
}

const initialState: VideoState = {
  // All videos
  videos: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,

  // User videos
  userVideos: [],
  userTotalCount: 0,
  userPage: 1,
  userLimit: 10,
  userTotalPages: 0,
  userLoading: false,
  userError: null,

  // Current video
  currentVideo: null,
  currentVideoLoading: false,
  currentVideoError: null,
}

/**
 * Async thunk to fetch paginated videos.
 * Added condition to prevent duplicate calls while loading.
 */
export const fetchVideosAsync = createAsyncThunk(
  'videos/fetchVideos',
  async (
    params: { page?: number; limit?: number; userId?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const data: VideosPaginationDto = await videoService.fetchVideos(
        params.page,
        params.limit,
        params.userId
      )
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch videos'
      )
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      // Prevent fetching if videos are already being loaded
      if (state.video.loading) return false
      return true
    },
  }
)

/**
 * Async thunk to fetch user videos.
 */
export const fetchUserVideosAsync = createAsyncThunk(
  'videos/fetchUserVideos',
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const data: VideosPaginationDto = await videoService.fetchUserVideos(
        params.page,
        params.limit
      )
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user videos'
      )
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      // Prevent fetching if user videos are already being loaded
      if (state.video.userLoading) return false
      return true
    },
  }
)

/**
 * Async thunk to fetch a single video by id.
 */
export const fetchVideoAsync = createAsyncThunk(
  'videos/fetchVideo',
  async (id: string, { rejectWithValue }) => {
    try {
      const video = await videoService.fetchVideo(id)
      return video
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch video'
      )
    }
  }
)

/**
 * Async thunk to delete a video.
 */
export const deleteVideoAsync = createAsyncThunk(
  'videos/deleteVideo',
  async (id: string, { rejectWithValue }) => {
    try {
      const video = await videoService.deleteVideo(id)
      return video
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete video'
      )
    }
  }
)

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    clearVideoError(state) {
      state.error = null
    },
    clearUserVideoError(state) {
      state.userError = null
    },
    clearCurrentVideoError(state) {
      state.currentVideoError = null
    },
    resetCurrentVideo(state) {
      state.currentVideo = null
      state.currentVideoError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all videos
      .addCase(fetchVideosAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchVideosAsync.fulfilled,
        (state, action: PayloadAction<VideosPaginationDto>) => {
          state.loading = false
          state.videos = action.payload.videos
          state.totalCount = action.payload.totalCount
          state.page = action.payload.page
          state.limit = action.payload.limit
          state.totalPages = action.payload.totalPages
        }
      )
      .addCase(fetchVideosAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch videos'
      })

      // Fetch user videos
      .addCase(fetchUserVideosAsync.pending, (state) => {
        state.userLoading = true
        state.userError = null
      })
      .addCase(
        fetchUserVideosAsync.fulfilled,
        (state, action: PayloadAction<VideosPaginationDto>) => {
          state.userLoading = false
          state.userVideos = action.payload.videos
          state.userTotalCount = action.payload.totalCount
          state.userPage = action.payload.page
          state.userLimit = action.payload.limit
          state.userTotalPages = action.payload.totalPages
        }
      )
      .addCase(fetchUserVideosAsync.rejected, (state, action) => {
        state.userLoading = false
        state.userError =
          (action.payload as string) || 'Failed to fetch user videos'
      })

      // Fetch a single video
      .addCase(fetchVideoAsync.pending, (state) => {
        state.currentVideoLoading = true
        state.currentVideoError = null
      })
      .addCase(
        fetchVideoAsync.fulfilled,
        (state, action: PayloadAction<Video>) => {
          state.currentVideoLoading = false
          state.currentVideo = action.payload
        }
      )
      .addCase(fetchVideoAsync.rejected, (state, action) => {
        state.currentVideoLoading = false
        state.currentVideoError =
          (action.payload as string) || 'Failed to fetch video'
      })

      // Delete a video
      .addCase(
        deleteVideoAsync.fulfilled,
        (state, action: PayloadAction<Video>) => {
          const id = action.payload.id
          state.videos = state.videos.filter((video) => video.id !== id)
          state.userVideos = state.userVideos.filter((video) => video.id !== id)

          // Adjust counts
          if (state.totalCount > 0) state.totalCount -= 1
          if (state.userTotalCount > 0) state.userTotalCount -= 1

          // Clear current video if it was deleted
          if (state.currentVideo?.id === id) {
            state.currentVideo = null
          }
        }
      )
  },
})

export const {
  clearVideoError,
  clearUserVideoError,
  clearCurrentVideoError,
  resetCurrentVideo,
} = videoSlice.actions

export default videoSlice.reducer
