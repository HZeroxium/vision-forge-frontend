// src/hooks/useImages.ts
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { fetchImagesAsync, clearImagesError } from '../store/imagesSlice'

export const useImages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const imagesState = useSelector((state: RootState) => state.images)

  const loadImages = (page?: number, limit?: number) => {
    dispatch(fetchImagesAsync({ page, limit }))
  }

  const clearError = () => {
    dispatch(clearImagesError())
  }

  return { ...imagesState, loadImages, clearError }
}
