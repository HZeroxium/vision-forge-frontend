// src/store/audiosSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as audiosService from '@services/audiosService'
import type { Audio, AudiosPaginationDto } from '@services/audiosService'
import type { RootState } from './store'

export interface AudiosState {
  audios: Audio[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: AudiosState = {
  audios: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
}

/**
 * Async thunk to fetch audios with pagination.
 * Added condition to prevent duplicate calls while loading.
 */
export const fetchAudiosAsync = createAsyncThunk(
  'audios/fetchAudios',
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const data: AudiosPaginationDto = await audiosService.fetchAudios(
        params.page,
        params.limit
      )
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch audios'
      )
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      // Prevent fetching if audios are already being loaded
      if (state.audios.loading) return false
      return true
    },
  }
)

const audiosSlice = createSlice({
  name: 'audios',
  initialState,
  reducers: {
    clearAudiosError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudiosAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchAudiosAsync.fulfilled,
        (state, action: PayloadAction<AudiosPaginationDto>) => {
          state.loading = false
          state.audios = action.payload.audios
          state.totalCount = action.payload.totalCount
          state.page = action.payload.page
          state.limit = action.payload.limit
          state.totalPages = action.payload.totalPages
        }
      )
      .addCase(fetchAudiosAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch audios'
      })
  },
})

export const { clearAudiosError } = audiosSlice.actions
export default audiosSlice.reducer
