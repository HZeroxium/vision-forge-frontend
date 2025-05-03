// src/hooks/useAudios.ts

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import {
  fetchAudiosAsync,
  fetchUserAudiosAsync,
  fetchAudioAsync,
  createAudioAsync,
  updateAudioAsync,
  deleteAudioAsync,
  clearAudiosError,
  clearUserAudiosError,
  clearCurrentAudioError,
  resetCurrentAudio,
} from '@store/audiosSlice'
import type { Audio } from '@services/audiosService'

export const useAudios = () => {
  const dispatch = useDispatch<AppDispatch>()
  const audiosState = useSelector((state: RootState) => state.audios)

  // Fetch all audios (with optional filtering)
  const loadAudios = useCallback(
    (page?: number, limit?: number, userId?: string) => {
      return dispatch(fetchAudiosAsync({ page, limit, userId })).unwrap()
    },
    [dispatch]
  )

  // Fetch only the current user's audios
  const loadUserAudios = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(fetchUserAudiosAsync({ page, limit })).unwrap()
    },
    [dispatch]
  )

  // Fetch a single audio by ID
  const loadAudio = useCallback(
    (id: string) => {
      return dispatch(fetchAudioAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Create a new audio
  const createAudio = useCallback(
    (data: { scriptId: string; provider?: string }) => {
      return dispatch(createAudioAsync(data)).unwrap()
    },
    [dispatch]
  )

  // Update an existing audio
  const updateAudio = useCallback(
    (
      id: string,
      data: Partial<{
        scriptId: string
        provider: string
        url: string
        durationSeconds: number
      }>
    ) => {
      return dispatch(updateAudioAsync({ id, data })).unwrap()
    },
    [dispatch]
  )

  // Delete an audio
  const deleteAudio = useCallback(
    (id: string) => {
      return dispatch(deleteAudioAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Clear errors
  const clearError = useCallback(() => {
    dispatch(clearAudiosError())
  }, [dispatch])

  const clearUserError = useCallback(() => {
    dispatch(clearUserAudiosError())
  }, [dispatch])

  const clearCurrentError = useCallback(() => {
    dispatch(clearCurrentAudioError())
  }, [dispatch])

  // Reset current audio
  const resetAudio = useCallback(() => {
    dispatch(resetCurrentAudio())
  }, [dispatch])

  return {
    // State
    ...audiosState,

    // Actions for all audios
    loadAudios,
    clearError,

    // Actions for user audios
    loadUserAudios,
    clearUserError,

    // Actions for current audio
    loadAudio,
    createAudio,
    updateAudio,
    deleteAudio,
    clearCurrentError,
    resetAudio,
  }
}
