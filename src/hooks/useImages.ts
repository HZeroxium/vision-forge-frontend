// src/hooks/useImages.ts

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import {
  fetchImagesAsync,
  fetchUserImagesAsync,
  fetchImageAsync,
  createImageAsync,
  updateImageAsync,
  deleteImageAsync,
  clearImagesError,
  clearUserImagesError,
  clearCurrentImageError,
  resetCurrentImage,
} from '../store/imagesSlice'
import type { Image } from '../services/imagesService'

export const useImages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const imagesState = useSelector((state: RootState) => state.images)

  // Fetch all images (with optional filtering)
  const loadImages = useCallback(
    (page?: number, limit?: number, userId?: string) => {
      return dispatch(fetchImagesAsync({ page, limit, userId })).unwrap()
    },
    [dispatch]
  )

  // Fetch only the current user's images
  const loadUserImages = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(fetchUserImagesAsync({ page, limit })).unwrap()
    },
    [dispatch]
  )

  // Fetch a single image by ID
  const loadImage = useCallback(
    (id: string) => {
      return dispatch(fetchImageAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Create a new image
  const createImage = useCallback(
    (data: { prompt: string; style: string }) => {
      return dispatch(createImageAsync(data)).unwrap()
    },
    [dispatch]
  )

  // Update an existing image
  const updateImage = useCallback(
    (id: string, data: Partial<{ prompt: string; style: string }>) => {
      return dispatch(updateImageAsync({ id, data })).unwrap()
    },
    [dispatch]
  )

  // Delete an image
  const deleteImage = useCallback(
    (id: string) => {
      return dispatch(deleteImageAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Clear errors
  const clearError = useCallback(() => {
    dispatch(clearImagesError())
  }, [dispatch])

  const clearUserError = useCallback(() => {
    dispatch(clearUserImagesError())
  }, [dispatch])

  const clearCurrentError = useCallback(() => {
    dispatch(clearCurrentImageError())
  }, [dispatch])

  // Reset current image
  const resetImage = useCallback(() => {
    dispatch(resetCurrentImage())
  }, [dispatch])

  return {
    // State
    ...imagesState,

    // Actions for all images
    loadImages,
    clearError,

    // Actions for user images
    loadUserImages,
    clearUserError,

    // Actions for current image
    loadImage,
    createImage,
    updateImage,
    deleteImage,
    clearCurrentError,
    resetImage,
  }
}
