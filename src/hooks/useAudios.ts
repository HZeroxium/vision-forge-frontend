// src/hooks/useAudios.ts
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import { fetchAudiosAsync, clearAudiosError } from '@store/audiosSlice'

export const useAudios = () => {
  const dispatch = useDispatch<AppDispatch>()
  const audiosState = useSelector((state: RootState) => state.audios)

  /**
   * Loads audios with optional page and limit.
   */
  const loadAudios = (page?: number, limit?: number) => {
    dispatch(fetchAudiosAsync({ page, limit }))
  }

  /**
   * Clears any audio-related error.
   */
  const clearError = () => {
    dispatch(clearAudiosError())
  }

  return { ...audiosState, loadAudios, clearError }
}
