// /src/hooks/usePinecone.ts

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store/store'
import * as pineconeService from '@/services/pineconeService'
import {
  // Image actions
  upsertImageEmbeddingAsync,
  queryImageEmbeddingsAsync,
  deleteImageEmbeddingAsync,
  deleteImagesByFilterAsync,
  // Audio actions
  upsertAudioEmbeddingAsync,
  queryAudioEmbeddingsAsync,
  deleteAudioEmbeddingAsync,
  deleteAudiosByFilterAsync,
  // Script actions
  upsertScriptEmbeddingAsync,
  queryScriptEmbeddingsAsync,
  deleteScriptEmbeddingAsync,
  deleteScriptsByFilterAsync,
  // Image prompts actions
  upsertImagePromptsEmbeddingAsync,
  queryImagePromptsEmbeddingsAsync,
  deleteImagePromptsEmbeddingAsync,
  deleteImagePromptsByFilterAsync,
  // Error clearing actions
  clearImageErrors,
  clearAudioErrors,
  clearScriptErrors,
  clearImagePromptsErrors,
  // Reset match actions
  resetImageMatches,
  resetAudioMatches,
  resetScriptMatches,
  resetImagePromptsMatches,
} from '@/store/pineconeSlice'

export const usePinecone = () => {
  const dispatch = useDispatch<AppDispatch>()
  const pineconeState = useSelector((state: RootState) => state.pinecone)

  // Image operations
  const upsertImageEmbedding = useCallback(
    (data: pineconeService.UpsertImageEmbeddingRequest) => {
      return dispatch(upsertImageEmbeddingAsync(data)).unwrap()
    },
    [dispatch]
  )

  const queryImageEmbeddings = useCallback(
    (data: pineconeService.QueryImageEmbeddingRequest) => {
      return dispatch(queryImageEmbeddingsAsync(data)).unwrap()
    },
    [dispatch]
  )

  const deleteImageEmbedding = useCallback(
    (vectorId: string) => {
      return dispatch(deleteImageEmbeddingAsync(vectorId)).unwrap()
    },
    [dispatch]
  )

  const deleteImagesByFilter = useCallback(
    (filter: Record<string, any>) => {
      return dispatch(deleteImagesByFilterAsync(filter)).unwrap()
    },
    [dispatch]
  )

  const clearImageErrorsAction = useCallback(() => {
    dispatch(clearImageErrors())
  }, [dispatch])

  const resetImageMatchesAction = useCallback(() => {
    dispatch(resetImageMatches())
  }, [dispatch])

  // Audio operations
  const upsertAudioEmbedding = useCallback(
    (data: pineconeService.UpsertAudioEmbeddingRequest) => {
      return dispatch(upsertAudioEmbeddingAsync(data)).unwrap()
    },
    [dispatch]
  )

  const queryAudioEmbeddings = useCallback(
    (data: pineconeService.QueryAudioEmbeddingRequest) => {
      return dispatch(queryAudioEmbeddingsAsync(data)).unwrap()
    },
    [dispatch]
  )

  const deleteAudioEmbedding = useCallback(
    (vectorId: string) => {
      return dispatch(deleteAudioEmbeddingAsync(vectorId)).unwrap()
    },
    [dispatch]
  )

  const deleteAudiosByFilter = useCallback(
    (filter: Record<string, any>) => {
      return dispatch(deleteAudiosByFilterAsync(filter)).unwrap()
    },
    [dispatch]
  )

  const clearAudioErrorsAction = useCallback(() => {
    dispatch(clearAudioErrors())
  }, [dispatch])

  const resetAudioMatchesAction = useCallback(() => {
    dispatch(resetAudioMatches())
  }, [dispatch])

  // Script operations
  const upsertScriptEmbedding = useCallback(
    (data: pineconeService.UpsertScriptEmbeddingRequest) => {
      return dispatch(upsertScriptEmbeddingAsync(data)).unwrap()
    },
    [dispatch]
  )

  const queryScriptEmbeddings = useCallback(
    (data: pineconeService.QueryScriptEmbeddingRequest) => {
      return dispatch(queryScriptEmbeddingsAsync(data)).unwrap()
    },
    [dispatch]
  )

  const deleteScriptEmbedding = useCallback(
    (vectorId: string) => {
      return dispatch(deleteScriptEmbeddingAsync(vectorId)).unwrap()
    },
    [dispatch]
  )

  const deleteScriptsByFilter = useCallback(
    (filter: Record<string, any>) => {
      return dispatch(deleteScriptsByFilterAsync(filter)).unwrap()
    },
    [dispatch]
  )

  const clearScriptErrorsAction = useCallback(() => {
    dispatch(clearScriptErrors())
  }, [dispatch])

  const resetScriptMatchesAction = useCallback(() => {
    dispatch(resetScriptMatches())
  }, [dispatch])

  // Image prompts operations
  const upsertImagePromptsEmbedding = useCallback(
    (data: pineconeService.UpsertImagePromptsEmbeddingRequest) => {
      return dispatch(upsertImagePromptsEmbeddingAsync(data)).unwrap()
    },
    [dispatch]
  )

  const queryImagePromptsEmbeddings = useCallback(
    (data: pineconeService.QueryImagePromptsEmbeddingRequest) => {
      return dispatch(queryImagePromptsEmbeddingsAsync(data)).unwrap()
    },
    [dispatch]
  )

  const deleteImagePromptsEmbedding = useCallback(
    (vectorId: string) => {
      return dispatch(deleteImagePromptsEmbeddingAsync(vectorId)).unwrap()
    },
    [dispatch]
  )

  const deleteImagePromptsByFilter = useCallback(
    (filter: Record<string, any>) => {
      return dispatch(deleteImagePromptsByFilterAsync(filter)).unwrap()
    },
    [dispatch]
  )

  const clearImagePromptsErrorsAction = useCallback(() => {
    dispatch(clearImagePromptsErrors())
  }, [dispatch])

  const resetImagePromptsMatchesAction = useCallback(() => {
    dispatch(resetImagePromptsMatches())
  }, [dispatch])

  return {
    // State
    ...pineconeState,

    // Image operations
    upsertImageEmbedding,
    queryImageEmbeddings,
    deleteImageEmbedding,
    deleteImagesByFilter,
    clearImageErrors: clearImageErrorsAction,
    resetImageMatches: resetImageMatchesAction,

    // Audio operations
    upsertAudioEmbedding,
    queryAudioEmbeddings,
    deleteAudioEmbedding,
    deleteAudiosByFilter,
    clearAudioErrors: clearAudioErrorsAction,
    resetAudioMatches: resetAudioMatchesAction,

    // Script operations
    upsertScriptEmbedding,
    queryScriptEmbeddings,
    deleteScriptEmbedding,
    deleteScriptsByFilter,
    clearScriptErrors: clearScriptErrorsAction,
    resetScriptMatches: resetScriptMatchesAction,

    // Image prompts operations
    upsertImagePromptsEmbedding,
    queryImagePromptsEmbeddings,
    deleteImagePromptsEmbedding,
    deleteImagePromptsByFilter,
    clearImagePromptsErrors: clearImagePromptsErrorsAction,
    resetImagePromptsMatches: resetImagePromptsMatchesAction,
  }
}
