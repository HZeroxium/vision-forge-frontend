// /src/store/pineconeSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as pineconeService from '@/services/pineconeService'

// Define state types for each entity
interface ImageEmbeddingState {
  matches: pineconeService.PineconeMatch[]
  isLoading: boolean
  error: string | null
  upsertLoading: boolean
  upsertError: string | null
  deleteLoading: boolean
  deleteError: string | null
}

interface AudioEmbeddingState {
  matches: pineconeService.PineconeMatch[]
  isLoading: boolean
  error: string | null
  upsertLoading: boolean
  upsertError: string | null
  deleteLoading: boolean
  deleteError: string | null
}

interface ScriptEmbeddingState {
  matches: pineconeService.PineconeMatch[]
  isLoading: boolean
  error: string | null
  upsertLoading: boolean
  upsertError: string | null
  deleteLoading: boolean
  deleteError: string | null
}

interface ImagePromptsEmbeddingState {
  matches: pineconeService.PineconeMatch[]
  isLoading: boolean
  error: string | null
  upsertLoading: boolean
  upsertError: string | null
  deleteLoading: boolean
  deleteError: string | null
}

// Define the overall state
export interface PineconeState {
  image: ImageEmbeddingState
  audio: AudioEmbeddingState
  script: ScriptEmbeddingState
  imagePrompts: ImagePromptsEmbeddingState
}

// Initial state
const initialState: PineconeState = {
  image: {
    matches: [],
    isLoading: false,
    error: null,
    upsertLoading: false,
    upsertError: null,
    deleteLoading: false,
    deleteError: null,
  },
  audio: {
    matches: [],
    isLoading: false,
    error: null,
    upsertLoading: false,
    upsertError: null,
    deleteLoading: false,
    deleteError: null,
  },
  script: {
    matches: [],
    isLoading: false,
    error: null,
    upsertLoading: false,
    upsertError: null,
    deleteLoading: false,
    deleteError: null,
  },
  imagePrompts: {
    matches: [],
    isLoading: false,
    error: null,
    upsertLoading: false,
    upsertError: null,
    deleteLoading: false,
    deleteError: null,
  },
}

// Image embedding async thunks
export const upsertImageEmbeddingAsync = createAsyncThunk(
  'pinecone/upsertImageEmbedding',
  async (
    data: pineconeService.UpsertImageEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.upsertImageEmbedding(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to upsert image embedding'
      )
    }
  }
)

export const queryImageEmbeddingsAsync = createAsyncThunk(
  'pinecone/queryImageEmbeddings',
  async (
    data: pineconeService.QueryImageEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.queryImageEmbeddings(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to query image embeddings'
      )
    }
  }
)

export const deleteImageEmbeddingAsync = createAsyncThunk(
  'pinecone/deleteImageEmbedding',
  async (vectorId: string, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteImageEmbedding(vectorId)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete image embedding'
      )
    }
  }
)

export const deleteImagesByFilterAsync = createAsyncThunk(
  'pinecone/deleteImagesByFilter',
  async (filter: Record<string, any>, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteImagesByFilter(filter)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete images by filter'
      )
    }
  }
)

// Audio embedding async thunks
export const upsertAudioEmbeddingAsync = createAsyncThunk(
  'pinecone/upsertAudioEmbedding',
  async (
    data: pineconeService.UpsertAudioEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.upsertAudioEmbedding(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to upsert audio embedding'
      )
    }
  }
)

export const queryAudioEmbeddingsAsync = createAsyncThunk(
  'pinecone/queryAudioEmbeddings',
  async (
    data: pineconeService.QueryAudioEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.queryAudioEmbeddings(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to query audio embeddings'
      )
    }
  }
)

export const deleteAudioEmbeddingAsync = createAsyncThunk(
  'pinecone/deleteAudioEmbedding',
  async (vectorId: string, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteAudioEmbedding(vectorId)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete audio embedding'
      )
    }
  }
)

export const deleteAudiosByFilterAsync = createAsyncThunk(
  'pinecone/deleteAudiosByFilter',
  async (filter: Record<string, any>, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteAudiosByFilter(filter)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete audios by filter'
      )
    }
  }
)

// Script embedding async thunks
export const upsertScriptEmbeddingAsync = createAsyncThunk(
  'pinecone/upsertScriptEmbedding',
  async (
    data: pineconeService.UpsertScriptEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.upsertScriptEmbedding(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to upsert script embedding'
      )
    }
  }
)

export const queryScriptEmbeddingsAsync = createAsyncThunk(
  'pinecone/queryScriptEmbeddings',
  async (
    data: pineconeService.QueryScriptEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.queryScriptEmbeddings(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to query script embeddings'
      )
    }
  }
)

export const deleteScriptEmbeddingAsync = createAsyncThunk(
  'pinecone/deleteScriptEmbedding',
  async (vectorId: string, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteScriptEmbedding(vectorId)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete script embedding'
      )
    }
  }
)

export const deleteScriptsByFilterAsync = createAsyncThunk(
  'pinecone/deleteScriptsByFilter',
  async (filter: Record<string, any>, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteScriptsByFilter(filter)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete scripts by filter'
      )
    }
  }
)

// Image prompts embedding async thunks
export const upsertImagePromptsEmbeddingAsync = createAsyncThunk(
  'pinecone/upsertImagePromptsEmbedding',
  async (
    data: pineconeService.UpsertImagePromptsEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.upsertImagePromptsEmbedding(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          'Failed to upsert image prompts embedding'
      )
    }
  }
)

export const queryImagePromptsEmbeddingsAsync = createAsyncThunk(
  'pinecone/queryImagePromptsEmbeddings',
  async (
    data: pineconeService.QueryImagePromptsEmbeddingRequest,
    { rejectWithValue }
  ) => {
    try {
      return await pineconeService.queryImagePromptsEmbeddings(data)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          'Failed to query image prompts embeddings'
      )
    }
  }
)

export const deleteImagePromptsEmbeddingAsync = createAsyncThunk(
  'pinecone/deleteImagePromptsEmbedding',
  async (vectorId: string, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteImagePromptsEmbedding(vectorId)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          'Failed to delete image prompts embedding'
      )
    }
  }
)

export const deleteImagePromptsByFilterAsync = createAsyncThunk(
  'pinecone/deleteImagePromptsByFilter',
  async (filter: Record<string, any>, { rejectWithValue }) => {
    try {
      return await pineconeService.deleteImagePromptsByFilter(filter)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          'Failed to delete image prompts by filter'
      )
    }
  }
)

const pineconeSlice = createSlice({
  name: 'pinecone',
  initialState,
  reducers: {
    clearImageErrors(state) {
      state.image.error = null
      state.image.upsertError = null
      state.image.deleteError = null
    },
    clearAudioErrors(state) {
      state.audio.error = null
      state.audio.upsertError = null
      state.audio.deleteError = null
    },
    clearScriptErrors(state) {
      state.script.error = null
      state.script.upsertError = null
      state.script.deleteError = null
    },
    clearImagePromptsErrors(state) {
      state.imagePrompts.error = null
      state.imagePrompts.upsertError = null
      state.imagePrompts.deleteError = null
    },
    resetImageMatches(state) {
      state.image.matches = []
    },
    resetAudioMatches(state) {
      state.audio.matches = []
    },
    resetScriptMatches(state) {
      state.script.matches = []
    },
    resetImagePromptsMatches(state) {
      state.imagePrompts.matches = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Image embedding handlers
      .addCase(upsertImageEmbeddingAsync.pending, (state) => {
        state.image.upsertLoading = true
        state.image.upsertError = null
      })
      .addCase(upsertImageEmbeddingAsync.fulfilled, (state) => {
        state.image.upsertLoading = false
      })
      .addCase(upsertImageEmbeddingAsync.rejected, (state, action) => {
        state.image.upsertLoading = false
        state.image.upsertError = action.payload as string
      })
      .addCase(queryImageEmbeddingsAsync.pending, (state) => {
        state.image.isLoading = true
        state.image.error = null
      })
      .addCase(queryImageEmbeddingsAsync.fulfilled, (state, action) => {
        state.image.isLoading = false
        state.image.matches = action.payload.matches
      })
      .addCase(queryImageEmbeddingsAsync.rejected, (state, action) => {
        state.image.isLoading = false
        state.image.error = action.payload as string
      })
      .addCase(deleteImageEmbeddingAsync.pending, (state) => {
        state.image.deleteLoading = true
        state.image.deleteError = null
      })
      .addCase(deleteImageEmbeddingAsync.fulfilled, (state) => {
        state.image.deleteLoading = false
      })
      .addCase(deleteImageEmbeddingAsync.rejected, (state, action) => {
        state.image.deleteLoading = false
        state.image.deleteError = action.payload as string
      })
      .addCase(deleteImagesByFilterAsync.pending, (state) => {
        state.image.deleteLoading = true
        state.image.deleteError = null
      })
      .addCase(deleteImagesByFilterAsync.fulfilled, (state) => {
        state.image.deleteLoading = false
      })
      .addCase(deleteImagesByFilterAsync.rejected, (state, action) => {
        state.image.deleteLoading = false
        state.image.deleteError = action.payload as string
      })

      // Audio embedding handlers
      .addCase(upsertAudioEmbeddingAsync.pending, (state) => {
        state.audio.upsertLoading = true
        state.audio.upsertError = null
      })
      .addCase(upsertAudioEmbeddingAsync.fulfilled, (state) => {
        state.audio.upsertLoading = false
      })
      .addCase(upsertAudioEmbeddingAsync.rejected, (state, action) => {
        state.audio.upsertLoading = false
        state.audio.upsertError = action.payload as string
      })
      .addCase(queryAudioEmbeddingsAsync.pending, (state) => {
        state.audio.isLoading = true
        state.audio.error = null
      })
      .addCase(queryAudioEmbeddingsAsync.fulfilled, (state, action) => {
        state.audio.isLoading = false
        state.audio.matches = action.payload.matches
      })
      .addCase(queryAudioEmbeddingsAsync.rejected, (state, action) => {
        state.audio.isLoading = false
        state.audio.error = action.payload as string
      })
      .addCase(deleteAudioEmbeddingAsync.pending, (state) => {
        state.audio.deleteLoading = true
        state.audio.deleteError = null
      })
      .addCase(deleteAudioEmbeddingAsync.fulfilled, (state) => {
        state.audio.deleteLoading = false
      })
      .addCase(deleteAudioEmbeddingAsync.rejected, (state, action) => {
        state.audio.deleteLoading = false
        state.audio.deleteError = action.payload as string
      })
      .addCase(deleteAudiosByFilterAsync.pending, (state) => {
        state.audio.deleteLoading = true
        state.audio.deleteError = null
      })
      .addCase(deleteAudiosByFilterAsync.fulfilled, (state) => {
        state.audio.deleteLoading = false
      })
      .addCase(deleteAudiosByFilterAsync.rejected, (state, action) => {
        state.audio.deleteLoading = false
        state.audio.deleteError = action.payload as string
      })

      // Script embedding handlers
      .addCase(upsertScriptEmbeddingAsync.pending, (state) => {
        state.script.upsertLoading = true
        state.script.upsertError = null
      })
      .addCase(upsertScriptEmbeddingAsync.fulfilled, (state) => {
        state.script.upsertLoading = false
      })
      .addCase(upsertScriptEmbeddingAsync.rejected, (state, action) => {
        state.script.upsertLoading = false
        state.script.upsertError = action.payload as string
      })
      .addCase(queryScriptEmbeddingsAsync.pending, (state) => {
        state.script.isLoading = true
        state.script.error = null
      })
      .addCase(queryScriptEmbeddingsAsync.fulfilled, (state, action) => {
        state.script.isLoading = false
        state.script.matches = action.payload.matches
      })
      .addCase(queryScriptEmbeddingsAsync.rejected, (state, action) => {
        state.script.isLoading = false
        state.script.error = action.payload as string
      })
      .addCase(deleteScriptEmbeddingAsync.pending, (state) => {
        state.script.deleteLoading = true
        state.script.deleteError = null
      })
      .addCase(deleteScriptEmbeddingAsync.fulfilled, (state) => {
        state.script.deleteLoading = false
      })
      .addCase(deleteScriptEmbeddingAsync.rejected, (state, action) => {
        state.script.deleteLoading = false
        state.script.deleteError = action.payload as string
      })
      .addCase(deleteScriptsByFilterAsync.pending, (state) => {
        state.script.deleteLoading = true
        state.script.deleteError = null
      })
      .addCase(deleteScriptsByFilterAsync.fulfilled, (state) => {
        state.script.deleteLoading = false
      })
      .addCase(deleteScriptsByFilterAsync.rejected, (state, action) => {
        state.script.deleteLoading = false
        state.script.deleteError = action.payload as string
      })

      // Image prompts embedding handlers
      .addCase(upsertImagePromptsEmbeddingAsync.pending, (state) => {
        state.imagePrompts.upsertLoading = true
        state.imagePrompts.upsertError = null
      })
      .addCase(upsertImagePromptsEmbeddingAsync.fulfilled, (state) => {
        state.imagePrompts.upsertLoading = false
      })
      .addCase(upsertImagePromptsEmbeddingAsync.rejected, (state, action) => {
        state.imagePrompts.upsertLoading = false
        state.imagePrompts.upsertError = action.payload as string
      })
      .addCase(queryImagePromptsEmbeddingsAsync.pending, (state) => {
        state.imagePrompts.isLoading = true
        state.imagePrompts.error = null
      })
      .addCase(queryImagePromptsEmbeddingsAsync.fulfilled, (state, action) => {
        state.imagePrompts.isLoading = false
        state.imagePrompts.matches = action.payload.matches
      })
      .addCase(queryImagePromptsEmbeddingsAsync.rejected, (state, action) => {
        state.imagePrompts.isLoading = false
        state.imagePrompts.error = action.payload as string
      })
      .addCase(deleteImagePromptsEmbeddingAsync.pending, (state) => {
        state.imagePrompts.deleteLoading = true
        state.imagePrompts.deleteError = null
      })
      .addCase(deleteImagePromptsEmbeddingAsync.fulfilled, (state) => {
        state.imagePrompts.deleteLoading = false
      })
      .addCase(deleteImagePromptsEmbeddingAsync.rejected, (state, action) => {
        state.imagePrompts.deleteLoading = false
        state.imagePrompts.deleteError = action.payload as string
      })
      .addCase(deleteImagePromptsByFilterAsync.pending, (state) => {
        state.imagePrompts.deleteLoading = true
        state.imagePrompts.deleteError = null
      })
      .addCase(deleteImagePromptsByFilterAsync.fulfilled, (state) => {
        state.imagePrompts.deleteLoading = false
      })
      .addCase(deleteImagePromptsByFilterAsync.rejected, (state, action) => {
        state.imagePrompts.deleteLoading = false
        state.imagePrompts.deleteError = action.payload as string
      })
  },
})

export const {
  clearImageErrors,
  clearAudioErrors,
  clearScriptErrors,
  clearImagePromptsErrors,
  resetImageMatches,
  resetAudioMatches,
  resetScriptMatches,
  resetImagePromptsMatches,
} = pineconeSlice.actions

export default pineconeSlice.reducer
