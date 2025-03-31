// src/hooks/useScripts.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import {
  createScriptAsync,
  updateScriptAsync,
  fetchScriptAsync,
  deleteScriptAsync,
  clearScriptError,
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
      dispatch(fetchScriptAsync(id))
    },
    [dispatch]
  )

  const deleteScript = useCallback(
    (id: string) => {
      dispatch(deleteScriptAsync(id))
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
    deleteScript,
    clearError,
    resetScriptState,
  }
}
