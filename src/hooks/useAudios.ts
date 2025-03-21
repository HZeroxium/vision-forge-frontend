// src/hooks/useAudios.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import { fetchAudiosAsync, clearAudiosError } from '@store/audiosSlice'

export const useAudios = () => {
  const dispatch = useDispatch<AppDispatch>()
  const audiosState = useSelector((state: RootState) => state.audios)

  // Memoize loadAudios to avoid re-creation on each render
  const loadAudios = useCallback(
    (page?: number, limit?: number) => {
      dispatch(fetchAudiosAsync({ page, limit }))
    },
    [dispatch]
  )

  // Memoize clearError to avoid unnecessary re-creation
  const clearError = useCallback(() => {
    dispatch(clearAudiosError())
  }, [dispatch])

  return { ...audiosState, loadAudios, clearError }
}
