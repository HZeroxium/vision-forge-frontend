// src/hooks/useScripts.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import {
  createScriptAsync,
  updateScriptAsync,
  fetchScriptAsync,
  fetchScriptsAsync,
  fetchUserScriptsAsync,
  deleteScriptAsync,
  clearScriptError,
  clearScriptsError,
  clearUserScriptsError as clearUserScriptsErrorImport,
  resetScript,
} from '@store/scriptsSlice'

export const useScripts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const scriptState = useSelector((state: RootState) => state.scripts)

  // Memoized function to create script
  const createScript = useCallback(
    (data: { title: string; style?: string; language?: string }) => {
      const action = dispatch(createScriptAsync(data))
      // Return the promise from the async thunk
      return action.unwrap()
    },
    [dispatch]
  )

  // Memoized function to update script
  const updateScript = useCallback(
    (
      id: string,
      data: Partial<{ title: string; content: string; style: string }>
    ) => {
      console.log('updateScript in hook called with:', { id, data })

      try {
        const action = dispatch(updateScriptAsync({ id, data }))
        console.log('updateScriptAsync dispatched')

        // Return the promise
        return action
          .unwrap()
          .then((result) => {
            console.log('updateScriptAsync success:', result)
            return result
          })
          .catch((error) => {
            console.error('updateScriptAsync error:', error)
            throw error
          })
      } catch (error) {
        console.error('Error in updateScript:', error)
        throw error
      }
    },
    [dispatch]
  )

  // Memoized function to fetch script details
  const fetchScript = useCallback(
    (id: string) => {
      return dispatch(fetchScriptAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Memoized function to fetch all scripts
  const fetchScripts = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(fetchScriptsAsync({ page, limit })).unwrap()
    },
    [dispatch]
  )

  // Memoized function to fetch user scripts
  const fetchUserScripts = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(fetchUserScriptsAsync({ page, limit })).unwrap()
    },
    [dispatch]
  )

  // Memoized function to delete script
  const deleteScript = useCallback(
    (id: string) => {
      return dispatch(deleteScriptAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Memoized functions to clear errors
  const clearError = useCallback(() => {
    dispatch(clearScriptError())
  }, [dispatch])

  const clearAllScriptsError = useCallback(() => {
    dispatch(clearScriptsError())
  }, [dispatch])

  const clearUserScriptsError = useCallback(() => {
    dispatch({ type: 'scripts/clearUserScriptsError' })
  }, [dispatch])

  const resetScriptState = useCallback(() => {
    dispatch(resetScript())
  }, [dispatch])

  return {
    ...scriptState,
    createScript,
    updateScript,
    fetchScript,
    fetchScripts,
    fetchUserScripts,
    deleteScript,
    clearError,
    clearAllScriptsError,
    clearUserScriptsError,
    resetScriptState,
  }
}
