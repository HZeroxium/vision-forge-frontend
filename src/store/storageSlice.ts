// /src/store/storageSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as storageService from '@/services/storageService'
import type { RootState } from './store'

export interface StorageState {
  // Current directory browsing state
  currentPrefix: string
  files: storageService.FileInfo[]
  directories: string[]
  isLoading: boolean
  error: string | null

  // Pagination
  isTruncated: boolean
  nextMarker: string | null

  // Upload state
  isUploading: boolean
  uploadProgress: number
  uploadError: string | null
  lastUploadedFile: storageService.FileUploadResponse | null

  // Operation states
  isDeleting: boolean
  deleteError: string | null

  // Selected files
  selectedFiles: string[]
}

const initialState: StorageState = {
  currentPrefix: '',
  files: [],
  directories: [],
  isLoading: false,
  error: null,

  isTruncated: false,
  nextMarker: null,

  isUploading: false,
  uploadProgress: 0,
  uploadError: null,
  lastUploadedFile: null,

  isDeleting: false,
  deleteError: null,

  selectedFiles: [],
}

// Async thunks for storage operations
export const listFilesAsync = createAsyncThunk(
  'storage/listFiles',
  async (
    request: storageService.ListFilesRequest = {},
    { rejectWithValue }
  ) => {
    try {
      return await storageService.listFiles(request)
    } catch (error: any) {
      // Enhanced error handling with more details
      const errorMessage =
        error.response?.data?.detail ||
        (error.message === 'Network Error'
          ? 'CORS issue or network error - ensure backend has CORS enabled'
          : 'Failed to list files')
      return rejectWithValue(errorMessage)
    }
  }
)

export const uploadFileAsync = createAsyncThunk(
  'storage/uploadFile',
  async (
    params: {
      file: File
      fileType?: storageService.FileType
      customFilename?: string
      folder?: string
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // You can add progress tracking here if needed
      const { file, fileType, customFilename, folder } = params
      const result = await storageService.uploadFile(
        file,
        fileType,
        customFilename,
        folder
      )

      // Refresh the file list after upload if we're in the same directory
      const folderPrefix = folder ? `${folder}/` : ''
      if (folderPrefix === initialState.currentPrefix) {
        dispatch(listFilesAsync({ prefix: folderPrefix }))
      }

      return result
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to upload file'
      )
    }
  }
)

export const deleteFileAsync = createAsyncThunk(
  'storage/deleteFile',
  async (key: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await storageService.deleteFile(key)

      // Refresh the file list after deletion
      const state = getState() as RootState
      dispatch(listFilesAsync({ prefix: state.storage.currentPrefix }))

      return result
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete file'
      )
    }
  }
)

export const deleteMultipleFilesAsync = createAsyncThunk(
  'storage/deleteMultipleFiles',
  async (keys: string[], { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await storageService.deleteMultipleFiles(keys)

      // Refresh the file list after deletion
      const state = getState() as RootState
      dispatch(listFilesAsync({ prefix: state.storage.currentPrefix }))

      return result
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete files'
      )
    }
  }
)

export const createDirectoryAsync = createAsyncThunk(
  'storage/createDirectory',
  async (path: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await storageService.createDirectory(path)

      // Refresh the file list after creating a directory
      const state = getState() as RootState
      dispatch(listFilesAsync({ prefix: state.storage.currentPrefix }))

      return result
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to create directory'
      )
    }
  }
)

export const copyFileAsync = createAsyncThunk(
  'storage/copyFile',
  async (
    params: { sourceKey: string; destinationKey: string },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const result = await storageService.copyFile(
        params.sourceKey,
        params.destinationKey
      )

      // Refresh the file list after copying
      const state = getState() as RootState
      dispatch(listFilesAsync({ prefix: state.storage.currentPrefix }))

      return result
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to copy file'
      )
    }
  }
)

export const getFileURLAsync = createAsyncThunk(
  'storage/getFileURL',
  async (params: { key: string; expiry?: number }, { rejectWithValue }) => {
    try {
      return await storageService.getFileURL(params.key, params.expiry)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to generate file URL'
      )
    }
  }
)

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    setCurrentPrefix(state, action: PayloadAction<string>) {
      state.currentPrefix = action.payload
    },
    clearStorageError(state) {
      state.error = null
    },
    clearUploadError(state) {
      state.uploadError = null
    },
    clearDeleteError(state) {
      state.deleteError = null
    },
    resetUploadState(state) {
      state.isUploading = false
      state.uploadProgress = 0
      state.uploadError = null
      state.lastUploadedFile = null
    },
    updateUploadProgress(state, action: PayloadAction<number>) {
      state.uploadProgress = action.payload
    },
    selectFile(state, action: PayloadAction<string>) {
      const key = action.payload
      if (!state.selectedFiles.includes(key)) {
        state.selectedFiles.push(key)
      }
    },
    unselectFile(state, action: PayloadAction<string>) {
      state.selectedFiles = state.selectedFiles.filter(
        (key) => key !== action.payload
      )
    },
    clearSelectedFiles(state) {
      state.selectedFiles = []
    },
    toggleFileSelection(state, action: PayloadAction<string>) {
      const key = action.payload
      if (state.selectedFiles.includes(key)) {
        state.selectedFiles = state.selectedFiles.filter((k) => k !== key)
      } else {
        state.selectedFiles.push(key)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // List files
      .addCase(listFilesAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(listFilesAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.files = action.payload.files
        state.directories = action.payload.directories
        state.currentPrefix = action.payload.prefix
        state.isTruncated = action.payload.is_truncated
        state.nextMarker = action.payload.next_marker || null
      })
      .addCase(listFilesAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Upload file
      .addCase(uploadFileAsync.pending, (state) => {
        state.isUploading = true
        state.uploadProgress = 0
        state.uploadError = null
      })
      .addCase(uploadFileAsync.fulfilled, (state, action) => {
        state.isUploading = false
        state.uploadProgress = 100
        state.lastUploadedFile = action.payload
      })
      .addCase(uploadFileAsync.rejected, (state, action) => {
        state.isUploading = false
        state.uploadError = action.payload as string
      })

      // Delete file
      .addCase(deleteFileAsync.pending, (state) => {
        state.isDeleting = true
        state.deleteError = null
      })
      .addCase(deleteFileAsync.fulfilled, (state, action) => {
        state.isDeleting = false
        // Remove the deleted file from selectedFiles if it exists
        state.selectedFiles = state.selectedFiles.filter(
          (key) => key !== action.payload.key
        )
      })
      .addCase(deleteFileAsync.rejected, (state, action) => {
        state.isDeleting = false
        state.deleteError = action.payload as string
      })

      // Delete multiple files
      .addCase(deleteMultipleFilesAsync.pending, (state) => {
        state.isDeleting = true
        state.deleteError = null
      })
      .addCase(deleteMultipleFilesAsync.fulfilled, (state, action) => {
        state.isDeleting = false
        // Remove deleted files from selectedFiles
        const deletedKeys = action.payload.deleted
        state.selectedFiles = state.selectedFiles.filter(
          (key) => !deletedKeys.includes(key)
        )
      })
      .addCase(deleteMultipleFilesAsync.rejected, (state, action) => {
        state.isDeleting = false
        state.deleteError = action.payload as string
      })

      // Other operations (create directory, copy file)
      // These don't need specific state handling beyond loading/error states
      .addCase(createDirectoryAsync.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(copyFileAsync.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(getFileURLAsync.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const {
  setCurrentPrefix,
  clearStorageError,
  clearUploadError,
  clearDeleteError,
  resetUploadState,
  updateUploadProgress,
  selectFile,
  unselectFile,
  clearSelectedFiles,
  toggleFileSelection,
} = storageSlice.actions

// Selectors
export const selectStorageState = (state: RootState) => state.storage
export const selectCurrentPrefix = (state: RootState) =>
  state.storage.currentPrefix
export const selectFiles = (state: RootState) => state.storage.files
export const selectDirectories = (state: RootState) => state.storage.directories
export const selectSelectedFiles = (state: RootState) =>
  state.storage.selectedFiles

export default storageSlice.reducer
