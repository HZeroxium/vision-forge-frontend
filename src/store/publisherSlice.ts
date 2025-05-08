// /src/store/publisherSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as publisherService from '@services/publisherService'
import type {
  PublishVideoDto,
  UpdatePublisherDto,
  PublisherResponse,
  PublisherPaginationDto,
} from '@services/publisherService'
import type { RootState } from './store'

export interface PublisherState {
  // Publisher histories list state
  histories: PublisherResponse[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null

  // Current publishing history state
  currentHistory: PublisherResponse | null
  currentHistoryLoading: boolean
  currentHistoryError: string | null

  // Publish operation state
  publishing: boolean
  publishSuccess: boolean
  publishError: string | null
}

const initialState: PublisherState = {
  // Publisher histories list
  histories: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,

  // Current publishing history
  currentHistory: null,
  currentHistoryLoading: false,
  currentHistoryError: null,

  // Publish operation
  publishing: false,
  publishSuccess: false,
  publishError: null,
}

/**
 * Async thunk to publish a video
 */
export const publishVideoAsync = createAsyncThunk(
  'publisher/publishVideo',
  async (data: PublishVideoDto, { rejectWithValue }) => {
    try {
      const response = await publisherService.publishVideo(data)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to publish video'
      )
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState
      // Prevent duplicate publish requests
      if (state.publisher.publishing) return false
      return true
    },
  }
)

/**
 * Async thunk to fetch paginated list of publishing histories
 */
export const fetchHistoriesAsync = createAsyncThunk(
  'publisher/fetchHistories',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await publisherService.fetchPublishingHistories(page, limit)
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch publishing histories'
      )
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState
      // Prevent fetching if already in progress
      if (state.publisher.loading) return false
      return true
    },
  }
)

/**
 * Async thunk to fetch a single publishing history by ID
 */
export const fetchHistoryAsync = createAsyncThunk(
  'publisher/fetchHistory',
  async (id: string, { rejectWithValue }) => {
    try {
      const history = await publisherService.fetchPublishingHistory(id)
      return history
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch publishing history'
      )
    }
  }
)

/**
 * Async thunk to update a publishing history
 */
export const updateHistoryAsync = createAsyncThunk(
  'publisher/updateHistory',
  async (
    params: { id: string; data: UpdatePublisherDto },
    { rejectWithValue }
  ) => {
    try {
      const history = await publisherService.updatePublishingHistory(
        params.id,
        params.data
      )
      return history
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update publishing history'
      )
    }
  }
)

/**
 * Async thunk to delete a publishing history
 */
export const deleteHistoryAsync = createAsyncThunk(
  'publisher/deleteHistory',
  async (id: string, { rejectWithValue }) => {
    try {
      const history = await publisherService.deletePublishingHistory(id)
      return history
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete publishing history'
      )
    }
  }
)

const publisherSlice = createSlice({
  name: 'publisher',
  initialState,
  reducers: {
    clearHistoriesError(state) {
      state.error = null
    },
    clearCurrentHistoryError(state) {
      state.currentHistoryError = null
    },
    clearPublishError(state) {
      state.publishError = null
    },
    resetPublishState(state) {
      state.publishing = false
      state.publishSuccess = false
      state.publishError = null
    },
    resetCurrentHistory(state) {
      state.currentHistory = null
      state.currentHistoryError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Publish video handling
      .addCase(publishVideoAsync.pending, (state) => {
        state.publishing = true
        state.publishSuccess = false
        state.publishError = null
      })
      .addCase(
        publishVideoAsync.fulfilled,
        (state, action: PayloadAction<PublisherResponse>) => {
          state.publishing = false
          state.publishSuccess = true
          state.currentHistory = action.payload

          // Add to histories list if it's not already there
          if (!state.histories.some((h) => h.id === action.payload.id)) {
            state.histories = [action.payload, ...state.histories]
            state.totalCount += 1
          }
        }
      )
      .addCase(publishVideoAsync.rejected, (state, action) => {
        state.publishing = false
        state.publishSuccess = false
        state.publishError =
          (action.payload as string) || 'Failed to publish video'
      })

      // Fetch publishing histories
      .addCase(fetchHistoriesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchHistoriesAsync.fulfilled,
        (state, action: PayloadAction<PublisherPaginationDto>) => {
          state.loading = false
          state.histories = action.payload.publishingHistories
          state.totalCount = action.payload.totalCount
          state.page = action.payload.page
          state.limit = action.payload.limit
          state.totalPages = action.payload.totalPages
        }
      )
      .addCase(fetchHistoriesAsync.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || 'Failed to fetch publishing histories'
      })

      // Fetch single publishing history
      .addCase(fetchHistoryAsync.pending, (state) => {
        state.currentHistoryLoading = true
        state.currentHistoryError = null
      })
      .addCase(
        fetchHistoryAsync.fulfilled,
        (state, action: PayloadAction<PublisherResponse>) => {
          state.currentHistoryLoading = false
          state.currentHistory = action.payload
        }
      )
      .addCase(fetchHistoryAsync.rejected, (state, action) => {
        state.currentHistoryLoading = false
        state.currentHistoryError =
          (action.payload as string) || 'Failed to fetch publishing history'
      })

      // Update publishing history
      .addCase(
        updateHistoryAsync.fulfilled,
        (state, action: PayloadAction<PublisherResponse>) => {
          const updatedHistory = action.payload

          // Update in histories list if present
          state.histories = state.histories.map((history) =>
            history.id === updatedHistory.id ? updatedHistory : history
          )

          // Update current history if it's the same one
          if (state.currentHistory?.id === updatedHistory.id) {
            state.currentHistory = updatedHistory
          }
        }
      )

      // Delete publishing history
      .addCase(
        deleteHistoryAsync.fulfilled,
        (state, action: PayloadAction<PublisherResponse>) => {
          const deletedHistoryId = action.payload.id

          // Remove from histories list
          state.histories = state.histories.filter(
            (history) => history.id !== deletedHistoryId
          )
          if (state.totalCount > 0) state.totalCount -= 1

          // Clear current history if it's the same one
          if (state.currentHistory?.id === deletedHistoryId) {
            state.currentHistory = null
          }
        }
      )
  },
})

export const {
  clearHistoriesError,
  clearCurrentHistoryError,
  clearPublishError,
  resetPublishState,
  resetCurrentHistory,
} = publisherSlice.actions

export default publisherSlice.reducer
