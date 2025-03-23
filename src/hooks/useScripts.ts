// src/hooks/useScripts.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import {
  createScriptAsync,
  updateScriptAsync,
  fetchScriptAsync,
  clearScriptError,
  resetScript,
} from '@store/scriptsSlice'

export const useScripts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const scriptState = useSelector((state: RootState) => state.scripts)

  // Memoized function to create script
  const createScript = useCallback(
    (data: { title: string; style?: string }) => {
      dispatch(createScriptAsync(data))
    },
    [dispatch]
  )

  // Memoized function to update script
  const updateScript = useCallback(
    (
      id: string,
      data: Partial<{ title: string; content: string; style: string }>
    ) => {
      dispatch(updateScriptAsync({ id, data }))
    },
    [dispatch]
  )

  // Memoized function to fetch script details
  const fetchScript = useCallback(
    (id: string) => {
      dispatch(fetchScriptAsync(id))
    },
    [dispatch]
  )

  const clearError = useCallback(() => {
    dispatch(clearScriptError())
  }, [dispatch])

  const resetScriptState = useCallback(() => {
    dispatch(resetScript())
  }, [dispatch])

  return {
    ...scriptState,
    createScript,
    updateScript,
    fetchScript,
    clearError,
    resetScriptState,
  }
}
