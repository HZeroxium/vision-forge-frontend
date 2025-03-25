// src/store/scriptsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as scriptService from '@services/scriptsService'
import type { Script } from '@services/scriptsService'
import type { RootState } from './store'

export interface ScriptState {
  script: Script | null
  loading: boolean
  error: string | null
}

const initialState: ScriptState = {
  script: null,
  loading: false,
  error: null,
}

/**
 * Async thunk to create a new script.
 */
export const createScriptAsync = createAsyncThunk(
  'scripts/createScript',
  async (data: { title: string; style?: string }, { rejectWithValue }) => {
    try {
      const script = await scriptService.createScript(data)
      return script
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create script'
      )
    }
  }
)

/**
 * Async thunk to update an existing script.
 */
export const updateScriptAsync = createAsyncThunk(
  'scripts/updateScript',
  async (
    params: {
      id: string
      data: Partial<{ title: string; content: string; style: string }>
    },
    { rejectWithValue }
  ) => {
    try {
      const script = await scriptService.updateScript(params.id, params.data)
      return script
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update script'
      )
    }
  }
)

/**
 * Async thunk to fetch a script by ID.
 */
export const fetchScriptAsync = createAsyncThunk(
  'scripts/fetchScript',
  async (id: string, { rejectWithValue }) => {
    try {
      const script = await scriptService.fetchScript(id)
      return script
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch script'
      )
    }
  }
)

export const deleteScriptAsync = createAsyncThunk(
  'scripts/deleteScript',
  async (id: string, { rejectWithValue }) => {
    try {
      const script = await scriptService.deleteScript(id)
      return script
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete script'
      )
    }
  }
)

const scriptsSlice = createSlice({
  name: 'scripts',
  initialState,
  reducers: {
    clearScriptError(state) {
      state.error = null
    },
    resetScript(state) {
      state.script = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create script
      .addCase(createScriptAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        createScriptAsync.fulfilled,
        (state, action: PayloadAction<Script>) => {
          state.loading = false
          state.script = action.payload
        }
      )
      .addCase(createScriptAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to create script'
      })
      // Update script
      .addCase(updateScriptAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        updateScriptAsync.fulfilled,
        (state, action: PayloadAction<Script>) => {
          state.loading = false
          state.script = action.payload
        }
      )
      .addCase(updateScriptAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to update script'
      })
      // Fetch script
      .addCase(fetchScriptAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchScriptAsync.fulfilled,
        (state, action: PayloadAction<Script>) => {
          state.loading = false
          state.script = action.payload
        }
      )
      .addCase(fetchScriptAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch script'
      })
      // [ADDED] Delete script handling
      .addCase(deleteScriptAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        deleteScriptAsync.fulfilled,
        (state, action: PayloadAction<Script>) => {
          state.loading = false
          state.script = null // Reset script after deletion
        }
      )
      .addCase(deleteScriptAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to delete script'
      })
  },
})

export const { clearScriptError, resetScript } = scriptsSlice.actions
export default scriptsSlice.reducer
