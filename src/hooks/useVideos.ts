// src/hooks/useVideos.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import {
  fetchVideosAsync,
  fetchUserVideosAsync,
  fetchVideoAsync,
  deleteVideoAsync,
  clearVideoError,
  clearUserVideoError,
  clearCurrentVideoError,
  resetCurrentVideo,
} from '@store/videoSlice'
import type { Video } from '@services/videoService'

export const useVideos = () => {
  const dispatch = useDispatch<AppDispatch>()
  const videoState = useSelector((state: RootState) => state.video)

  // Load all videos with optional filtering
  const loadVideos = useCallback(
    (page?: number, limit?: number, userId?: string) => {
      return dispatch(fetchVideosAsync({ page, limit, userId })).unwrap()
    },
    [dispatch]
  )

  // Load only the current user's videos
  const loadUserVideos = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(fetchUserVideosAsync({ page, limit })).unwrap()
    },
    [dispatch]
  )

  // Load a specific video by ID
  const loadVideo = useCallback(
    (id: string) => {
      return dispatch(fetchVideoAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Delete a video
  const deleteVideo = useCallback(
    (id: string) => {
      return dispatch(deleteVideoAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Clear errors
  const clearError = useCallback(() => {
    dispatch(clearVideoError())
  }, [dispatch])

  const clearUserError = useCallback(() => {
    dispatch(clearUserVideoError())
  }, [dispatch])

  const clearCurrentError = useCallback(() => {
    dispatch(clearCurrentVideoError())
  }, [dispatch])

  // Reset current video
  const resetVideo = useCallback(() => {
    dispatch(resetCurrentVideo())
  }, [dispatch])

  return {
    ...videoState,
    loadVideos,
    loadUserVideos,
    loadVideo,
    deleteVideo,
    clearError,
    clearUserError,
    clearCurrentError,
    resetVideo,
  }
}
