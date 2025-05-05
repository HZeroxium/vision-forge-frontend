// /src/hooks/useStorage.ts

import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '@/store/store'
import {
  selectStorageState,
  listFilesAsync,
  uploadFileAsync,
  deleteFileAsync,
  deleteMultipleFilesAsync,
  createDirectoryAsync,
  copyFileAsync,
  getFileURLAsync,
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
} from '@/store/storageSlice'
import { FileType } from '@/services/storageService'

export const useStorage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const storageState = useSelector(selectStorageState)
  const [fileURLs, setFileURLs] = useState<
    Record<string, { url: string; expiresAt: Date }>
  >({})

  // Navigate to a directory
  const navigateToDirectory = useCallback(
    async (prefix: string) => {
      dispatch(setCurrentPrefix(prefix))
      try {
        return await dispatch(listFilesAsync({ prefix })).unwrap()
      } catch (error) {
        console.error('Navigation error:', error)
        // If there's a CORS error, provide more helpful info
        if (typeof error === 'string' && error.includes('CORS')) {
          console.info(
            'CORS Troubleshooting: Ensure your FastAPI server has CORS enabled with appropriate origins'
          )
        }
        throw error
      }
    },
    [dispatch]
  )

  // Navigate up one level
  const navigateUp = useCallback(() => {
    const parts = storageState.currentPrefix.split('/')
    parts.pop() // Remove last segment
    parts.pop() // Remove empty segment from trailing slash
    const newPrefix = parts.length ? `${parts.join('/')}/` : ''

    return navigateToDirectory(newPrefix)
  }, [dispatch, storageState.currentPrefix, navigateToDirectory])

  // List files in current directory
  const refreshDirectory = useCallback(async () => {
    try {
      return await dispatch(
        listFilesAsync({ prefix: storageState.currentPrefix })
      ).unwrap()
    } catch (error) {
      console.error('Refresh directory error:', error)
      // Provide helpful info if it's a CORS or network issue
      if (error instanceof Error && error.message.includes('Network Error')) {
        console.info(
          'Network error: Check if the FastAPI server is running and accessible'
        )
      }
      throw error
    }
  }, [dispatch, storageState.currentPrefix])

  // Upload a file with progress tracking
  const uploadFile = useCallback(
    async (
      file: File,
      fileType?: FileType,
      customFilename?: string,
      folder?: string,
      onProgress?: (progress: number) => void
    ) => {
      // Set up progress tracking if available
      if (onProgress) {
        const interval = setInterval(() => {
          // Simulate progress updates since we can't track real progress with the current API
          const currentProgress = storageState.uploadProgress
          if (currentProgress < 90) {
            const newProgress = currentProgress + 10
            dispatch(updateUploadProgress(newProgress))
            onProgress(newProgress)
          }
        }, 300)

        try {
          const result = await dispatch(
            uploadFileAsync({
              file,
              fileType,
              customFilename,
              folder,
            })
          ).unwrap()

          // Complete the progress
          dispatch(updateUploadProgress(100))
          onProgress(100)

          return result
        } finally {
          clearInterval(interval)
        }
      } else {
        return dispatch(
          uploadFileAsync({
            file,
            fileType,
            customFilename,
            folder,
          })
        ).unwrap()
      }
    },
    [dispatch, storageState.uploadProgress]
  )

  // Delete a file
  const deleteFile = useCallback(
    (key: string) => {
      return dispatch(deleteFileAsync(key)).unwrap()
    },
    [dispatch]
  )

  // Delete multiple files
  const deleteMultipleFiles = useCallback(
    (keys: string[]) => {
      return dispatch(deleteMultipleFilesAsync(keys)).unwrap()
    },
    [dispatch]
  )

  // Delete selected files
  const deleteSelectedFiles = useCallback(() => {
    if (storageState.selectedFiles.length === 0) return Promise.resolve(null)

    return dispatch(
      deleteMultipleFilesAsync(storageState.selectedFiles)
    ).unwrap()
  }, [dispatch, storageState.selectedFiles])

  // Create a directory
  const createDirectory = useCallback(
    (path: string) => {
      return dispatch(createDirectoryAsync(path)).unwrap()
    },
    [dispatch]
  )

  // Copy a file
  const copyFile = useCallback(
    (sourceKey: string, destinationKey: string) => {
      return dispatch(copyFileAsync({ sourceKey, destinationKey })).unwrap()
    },
    [dispatch]
  )

  // Get a pre-signed URL with caching
  const getFileURL = useCallback(
    async (key: string, expiry: number = 3600) => {
      // Check if we have a cached URL that hasn't expired
      const cached = fileURLs[key]
      const now = new Date()

      if (cached && cached.expiresAt > now) {
        return { url: cached.url, expires_at: cached.expiresAt.toISOString() }
      }

      // Get a new URL
      const result = await dispatch(getFileURLAsync({ key, expiry })).unwrap()

      // Cache the URL
      setFileURLs((prev) => ({
        ...prev,
        [key]: {
          url: result.url,
          expiresAt: new Date(result.expires_at),
        },
      }))

      return result
    },
    [dispatch, fileURLs]
  )

  // File selection methods
  const toggleSelection = useCallback(
    (key: string) => {
      dispatch(toggleFileSelection(key))
    },
    [dispatch]
  )

  const selectFileItem = useCallback(
    (key: string) => {
      dispatch(selectFile(key))
    },
    [dispatch]
  )

  const unselectFileItem = useCallback(
    (key: string) => {
      dispatch(unselectFile(key))
    },
    [dispatch]
  )

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedFiles())
  }, [dispatch])

  // Clear error states
  const clearErrors = useCallback(() => {
    dispatch(clearStorageError())
    dispatch(clearUploadError())
    dispatch(clearDeleteError())
  }, [dispatch])

  // Reset upload state
  const resetUpload = useCallback(() => {
    dispatch(resetUploadState())
  }, [dispatch])

  // Return the hook API
  return {
    // State
    ...storageState,

    // Navigation
    navigateToDirectory,
    navigateUp,
    refreshDirectory,

    // File operations
    uploadFile,
    deleteFile,
    deleteMultipleFiles,
    deleteSelectedFiles,
    createDirectory,
    copyFile,
    getFileURL,

    // Selection
    toggleSelection,
    selectFile: selectFileItem,
    unselectFile: unselectFileItem,
    clearSelection,

    // Error handling
    clearErrors,
    resetUpload,
  }
}
