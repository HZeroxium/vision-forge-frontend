// src/hooks/useImages.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { fetchImagesAsync, clearImagesError } from '../store/imagesSlice'

export const useImages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const imagesState = useSelector((state: RootState) => state.images)

  // Memoize loadImages to prevent re-creation on each render
  const loadImages = useCallback(
    (page?: number, limit?: number) => {
      dispatch(fetchImagesAsync({ page, limit }))
    },
    [dispatch]
  )

  const clearError = useCallback(() => {
    dispatch(clearImagesError())
  }, [dispatch])

  return { ...imagesState, loadImages, clearError }
}
