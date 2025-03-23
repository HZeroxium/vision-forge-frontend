// src/hooks/useVideos.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import { fetchVideosAsync, clearVideoError } from '@store/videoSlice'

export const useVideos = () => {
  const dispatch = useDispatch<AppDispatch>()
  const videoState = useSelector((state: RootState) => state.video)

  // Memoize loadVideos to avoid re-creation on each render
  const loadVideos = useCallback(
    (page?: number, limit?: number) => {
      dispatch(fetchVideosAsync({ page, limit }))
    },
    [dispatch]
  )

  // Memoize clearError to avoid unnecessary re-creation
  const clearError = useCallback(() => {
    dispatch(clearVideoError())
  }, [dispatch])

  return { ...videoState, loadVideos, clearError }
}
