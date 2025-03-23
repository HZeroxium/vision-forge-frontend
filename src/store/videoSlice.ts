// src/store/videoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as videoService from '@services/videoService'
import type { Video, VideosPaginationDto } from '@services/videoService'
import type { RootState } from './store'

export interface VideoState {
  videos: Video[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: VideoState = {
  videos: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
}

/**
 * Async thunk to fetch paginated videos.
 * Added condition to prevent duplicate calls while loading.
 */
export const fetchVideosAsync = createAsyncThunk(
  'videos/fetchVideos',
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const data: VideosPaginationDto = await videoService.fetchVideos(
        params.page,
        params.limit
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

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    clearVideoError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
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
  },
})

export const { clearVideoError } = videoSlice.actions
export default videoSlice.reducer
