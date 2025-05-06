// src/store/scriptsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as scriptService from '@services/scriptsService'
import type { Script, ScriptsPaginationDto } from '@services/scriptsService'
import type { RootState } from './store'

export interface ScriptState {
  // Current script being worked with (for editing, viewing details)
  script: Script | null
  loading: boolean
  error: string | null

  // All scripts list
  scripts: Script[]
  scriptsPage: number
  scriptsLimit: number
  scriptsTotalPages: number
  scriptsLoading: boolean
  scriptsError: string | null
  scriptsTotal: number

  // User-specific scripts list
  userScripts: Script[]
  userScriptsPage: number
  userScriptsLimit: number
  userScriptsTotalPages: number
  userScriptsLoading: boolean
  userScriptsError: string | null
  userScriptsTotal: number
}

const initialState: ScriptState = {
  script: null,
  loading: false,
  error: null,

  scripts: [],
  scriptsPage: 1,
  scriptsLimit: 10,
  scriptsTotalPages: 1,
  scriptsLoading: false,
  scriptsError: null,
  scriptsTotal: 0,

  userScripts: [],
  userScriptsPage: 1,
  userScriptsLimit: 10,
  userScriptsTotalPages: 1,
  userScriptsLoading: false,
  userScriptsError: null,
  userScriptsTotal: 0,
}

/**
 * Async thunk to create a new script.
 */
export const createScriptAsync = createAsyncThunk(
  'scripts/createScript',
  async (
    data: {
      title: string
      style?: string
      language?: string
      includePersonalDescription?: boolean
    },
    { rejectWithValue }
  ) => {
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

/**
 * Async thunk to fetch all scripts with pagination.
 */
export const fetchScriptsAsync = createAsyncThunk(
  'scripts/fetchScripts',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const scriptsData = await scriptService.fetchScripts(page, limit)
      return scriptsData
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch scripts'
      )
    }
  }
)

/**
 * Async thunk to fetch user's scripts with pagination.
 */
export const fetchUserScriptsAsync = createAsyncThunk(
  'scripts/fetchUserScripts',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const scriptsData = await scriptService.fetchUserScripts(page, limit)
      return scriptsData
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user scripts'
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
    clearScriptsError(state) {
      state.scriptsError = null
    },
    clearUserScriptsError(state) {
      state.userScriptsError = null
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
      // Fetch all scripts
      .addCase(fetchScriptsAsync.pending, (state) => {
        state.scriptsLoading = true
        state.scriptsError = null
      })
      .addCase(
        fetchScriptsAsync.fulfilled,
        (state, action: PayloadAction<ScriptsPaginationDto>) => {
          state.scriptsLoading = false
          state.scripts = action.payload.scripts
          state.scriptsPage = action.payload.page
          state.scriptsLimit = action.payload.limit
          state.scriptsTotalPages = action.payload.totalPages
          state.scriptsTotal = action.payload.totalCount
        }
      )
      .addCase(fetchScriptsAsync.rejected, (state, action) => {
        state.scriptsLoading = false
        state.scriptsError =
          (action.payload as string) || 'Failed to fetch scripts'
      })
      // Fetch user scripts
      .addCase(fetchUserScriptsAsync.pending, (state) => {
        state.userScriptsLoading = true
        state.userScriptsError = null
      })
      .addCase(
        fetchUserScriptsAsync.fulfilled,
        (state, action: PayloadAction<ScriptsPaginationDto>) => {
          state.userScriptsLoading = false
          state.userScripts = action.payload.scripts
          state.userScriptsPage = action.payload.page
          state.userScriptsLimit = action.payload.limit
          state.userScriptsTotalPages = action.payload.totalPages
          state.userScriptsTotal = action.payload.totalCount
        }
      )
      .addCase(fetchUserScriptsAsync.rejected, (state, action) => {
        state.userScriptsLoading = false
        state.userScriptsError =
          (action.payload as string) || 'Failed to fetch user scripts'
      })
      // Delete script handling
      .addCase(deleteScriptAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        deleteScriptAsync.fulfilled,
        (state, action: PayloadAction<Script>) => {
          state.loading = false
          state.script = null // Reset script after deletion

          // Also remove it from lists if present
          state.scripts = state.scripts.filter(
            (s) => s.id !== action.payload.id
          )
          state.userScripts = state.userScripts.filter(
            (s) => s.id !== action.payload.id
          )
        }
      )
      .addCase(deleteScriptAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to delete script'
      })
  },
})

export const {
  clearScriptError,
  resetScript,
  clearScriptsError,
  clearUserScriptsError,
} = scriptsSlice.actions
export default scriptsSlice.reducer
