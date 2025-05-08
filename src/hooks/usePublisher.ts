import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@store/store'
import {
  publishVideoAsync,
  fetchHistoriesAsync,
  fetchHistoryAsync,
  updateHistoryAsync,
  deleteHistoryAsync,
  clearHistoriesError,
  clearCurrentHistoryError,
  clearPublishError,
  resetPublishState,
  resetCurrentHistory,
} from '@store/publisherSlice'
import type {
  PublishVideoDto,
  UpdatePublisherDto,
  PublisherResponse,
} from '@services/publisherService'

export const usePublisher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const publisherState = useSelector((state: RootState) => state.publisher)

  // Publish a video to a platform
  const publishVideo = useCallback(
    (data: PublishVideoDto) => {
      return dispatch(publishVideoAsync(data)).unwrap()
    },
    [dispatch]
  )

  // Fetch paginated list of publishing histories
  const fetchHistories = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(fetchHistoriesAsync({ page, limit })).unwrap()
    },
    [dispatch]
  )

  // Fetch a specific publishing history
  const fetchHistory = useCallback(
    (id: string) => {
      return dispatch(fetchHistoryAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Update a publishing history
  const updateHistory = useCallback(
    (id: string, data: UpdatePublisherDto) => {
      return dispatch(updateHistoryAsync({ id, data })).unwrap()
    },
    [dispatch]
  )

  // Delete a publishing history
  const deleteHistory = useCallback(
    (id: string) => {
      return dispatch(deleteHistoryAsync(id)).unwrap()
    },
    [dispatch]
  )

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(clearHistoriesError())
  }, [dispatch])

  const clearCurrentError = useCallback(() => {
    dispatch(clearCurrentHistoryError())
  }, [dispatch])

  const clearPubError = useCallback(() => {
    dispatch(clearPublishError())
  }, [dispatch])

  // Reset states
  const resetPublish = useCallback(() => {
    dispatch(resetPublishState())
  }, [dispatch])

  const resetCurrent = useCallback(() => {
    dispatch(resetCurrentHistory())
  }, [dispatch])

  // Utility functions
  const getStatusColor = useCallback((status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'published':
      case 'success':
        return 'success'
      case 'pending':
      case 'processing':
      case 'in_progress':
        return 'warning'
      case 'failed':
      case 'error':
        return 'error'
      default:
        return 'info'
    }
  }, [])

  const getFormattedDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString()
  }, [])

  return {
    // State
    ...publisherState,

    // Actions
    publishVideo,
    fetchHistories,
    fetchHistory,
    updateHistory,
    deleteHistory,

    // Clear errors
    clearErrors,
    clearCurrentError,
    clearPubError,

    // Reset states
    resetPublish,
    resetCurrent,

    // Utility functions
    getStatusColor,
    getFormattedDate,
  }
}
