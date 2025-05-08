// src/store/audiosSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as audiosService from '@services/audiosService'
import type { Audio, AudiosPaginationDto } from '@services/audiosService'
import type { RootState } from './store'

export interface AudiosState {
  // All audios state
  audios: Audio[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null

  // User-specific audios state
  userAudios: Audio[]
  userTotalCount: number
  userPage: number
  userLimit: number
  userTotalPages: number
  userLoading: boolean
  userError: string | null

  // Current audio being viewed/edited
  currentAudio: Audio | null
  currentAudioLoading: boolean
  currentAudioError: string | null
}

const initialState: AudiosState = {
  // All audios
  audios: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,

  // User audios
  userAudios: [],
  userTotalCount: 0,
  userPage: 1,
  userLimit: 10,
  userTotalPages: 0,
  userLoading: false,
  userError: null,

  // Current audio
  currentAudio: null,
  currentAudioLoading: false,
  currentAudioError: null,
}

/**
 * Async thunk to fetch audios with pagination.
 * Added condition to prevent duplicate calls while loading.
 */
export const fetchAudiosAsync = createAsyncThunk(
  'audios/fetchAudios',
  async (
    params: { page?: number; limit?: number; userId?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const data: AudiosPaginationDto = await audiosService.fetchAudios(
        params.page,
        params.limit,
        params.userId
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

/**
 * Async thunk to fetch the current user's audios with pagination.
 */
export const fetchUserAudiosAsync = createAsyncThunk(
  'audios/fetchUserAudios',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const data: AudiosPaginationDto = await audiosService.fetchUserAudios(
        page,
        limit
      )
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user audios'
      )
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      // Prevent fetching if user audios are already being loaded
      if (state.audios.userLoading) return false
      return true
    },
  }
)

/**
 * Async thunk to fetch a single audio by ID.
 */
export const fetchAudioAsync = createAsyncThunk(
  'audios/fetchAudio',
  async (id: string, { rejectWithValue }) => {
    try {
      const audio = await audiosService.fetchAudio(id)
      return audio
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch audio'
      )
    }
  }
)

/**
 * Async thunk to create a new audio.
 */
export const createAudioAsync = createAsyncThunk(
  'audios/createAudio',
  async (
    data: { scriptId: string; provider?: string },
    { rejectWithValue }
  ) => {
    try {
      const audio = await audiosService.createAudio(data)
      return audio
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create audio'
      )
    }
  }
)

/**
 * Async thunk to update an existing audio.
 */
export const updateAudioAsync = createAsyncThunk(
  'audios/updateAudio',
  async (
    params: {
      id: string
      data: Partial<{
        scriptId: string
        provider: string
        url: string
        durationSeconds: number
      }>
    },
    { rejectWithValue }
  ) => {
    try {
      const audio = await audiosService.updateAudio(params.id, params.data)
      return audio
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update audio'
      )
    }
  }
)

/**
 * Async thunk to delete an audio.
 */
export const deleteAudioAsync = createAsyncThunk(
  'audios/deleteAudio',
  async (id: string, { rejectWithValue }) => {
    try {
      const audio = await audiosService.deleteAudio(id)
      return audio
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete audio'
      )
    }
  }
)

const audiosSlice = createSlice({
  name: 'audios',
  initialState,
  reducers: {
    clearAudiosError(state) {
      state.error = null
    },
    clearUserAudiosError(state) {
      state.userError = null
    },
    clearCurrentAudioError(state) {
      state.currentAudioError = null
    },
    resetCurrentAudio(state) {
      state.currentAudio = null
      state.currentAudioError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all audios
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

      // Fetch user audios
      .addCase(fetchUserAudiosAsync.pending, (state) => {
        state.userLoading = true
        state.userError = null
      })
      .addCase(
        fetchUserAudiosAsync.fulfilled,
        (state, action: PayloadAction<AudiosPaginationDto>) => {
          state.userLoading = false
          state.userAudios = action.payload.audios
          state.userTotalCount = action.payload.totalCount
          state.userPage = action.payload.page
          state.userLimit = action.payload.limit
          state.userTotalPages = action.payload.totalPages
        }
      )
      .addCase(fetchUserAudiosAsync.rejected, (state, action) => {
        state.userLoading = false
        state.userError =
          (action.payload as string) || 'Failed to fetch user audios'
      })

      // Fetch single audio
      .addCase(fetchAudioAsync.pending, (state) => {
        state.currentAudioLoading = true
        state.currentAudioError = null
      })
      .addCase(
        fetchAudioAsync.fulfilled,
        (state, action: PayloadAction<Audio>) => {
          state.currentAudioLoading = false
          state.currentAudio = action.payload
        }
      )
      .addCase(fetchAudioAsync.rejected, (state, action) => {
        state.currentAudioLoading = false
        state.currentAudioError =
          (action.payload as string) || 'Failed to fetch audio'
      })

      // Create audio
      .addCase(
        createAudioAsync.fulfilled,
        (state, action: PayloadAction<Audio>) => {
          // Add to user audios if present and update counts
          if (state.userAudios.length > 0) {
            state.userAudios = [action.payload, ...state.userAudios]
            state.userTotalCount += 1
          }
        }
      )

      // Update audio
      .addCase(
        updateAudioAsync.fulfilled,
        (state, action: PayloadAction<Audio>) => {
          const updatedAudio = action.payload

          // Update in all audios list if present
          const allIndex = state.audios.findIndex(
            (audio) => audio.id === updatedAudio.id
          )
          if (allIndex !== -1) {
            state.audios[allIndex] = updatedAudio
          }

          // Update in user audios list if present
          const userIndex = state.userAudios.findIndex(
            (audio) => audio.id === updatedAudio.id
          )
          if (userIndex !== -1) {
            state.userAudios[userIndex] = updatedAudio
          }

          // Update current audio if it's the same one
          if (state.currentAudio?.id === updatedAudio.id) {
            state.currentAudio = updatedAudio
          }
        }
      )

      // Delete audio
      .addCase(
        deleteAudioAsync.fulfilled,
        (state, action: PayloadAction<Audio>) => {
          const deletedAudioId = action.payload.id

          // Remove from all audios list if present
          state.audios = state.audios.filter(
            (audio) => audio.id !== deletedAudioId
          )
          if (state.totalCount > 0) state.totalCount -= 1

          // Remove from user audios list if present
          state.userAudios = state.userAudios.filter(
            (audio) => audio.id !== deletedAudioId
          )
          if (state.userTotalCount > 0) state.userTotalCount -= 1

          // Clear current audio if it was deleted
          if (state.currentAudio?.id === deletedAudioId) {
            state.currentAudio = null
          }
        }
      )
  },
})

export const {
  clearAudiosError,
  clearUserAudiosError,
  clearCurrentAudioError,
  resetCurrentAudio,
} = audiosSlice.actions

export default audiosSlice.reducer
