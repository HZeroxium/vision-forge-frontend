// src/hooks/useVideos.ts
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import { fetchVideosAsync, clearVideoError } from '@store/videoSlice'

export const useVideos = () => {
  const dispatch = useDispatch<AppDispatch>()
  const videoState = useSelector((state: RootState) => state.video)

  /**
   * Loads videos with optional pagination parameters.
   */
  const loadVideos = (page?: number, limit?: number) => {
    dispatch(fetchVideosAsync({ page, limit }))
  }

  /**
   * Clears any video-related error.
   */
  const clearError = () => {
    dispatch(clearVideoError())
  }

  return { ...videoState, loadVideos, clearError }
}
