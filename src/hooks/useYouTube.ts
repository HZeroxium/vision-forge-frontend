// /src/hooks/useYouTube.ts

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '@store/store'
import {
  getAuthUrlAsync,
  handleCallbackAsync,
  handlePublicCallbackAsync,
  uploadVideoAsync,
  getVideoStatisticsAsync,
  getVideoAnalyticsAsync,
  getChannelAnalyticsAsync,
  getTopVideosAnalyticsAsync,
  getDemographicsAnalyticsAsync,
  resetAuth,
  resetUpload,
  clearError,
  clearAuthError,
  clearUploadError,
  clearAnalyticsError,
  selectYouTubeAuth,
  selectYouTubeUpload,
  selectYouTubeAnalytics,
  selectYouTubeStatistics,
  selectYouTubeState,
} from '@store/youtubeSlice'
import { YouTubeUploadOptions } from '@services/types/youtubeTypes'

export const useYouTube = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Select all parts of the YouTube state
  const auth = useSelector(selectYouTubeAuth)
  const upload = useSelector(selectYouTubeUpload)
  const analytics = useSelector(selectYouTubeAnalytics)
  const statistics = useSelector(selectYouTubeStatistics)
  const youtubeState = useSelector(selectYouTubeState)

  // Authentication methods
  const initiateAuth = useCallback(async () => {
    try {
      const result = await dispatch(getAuthUrlAsync()).unwrap()
      if (result.url) {
        window.location.href = result.url
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to initiate YouTube authentication:', error)
      return false
    }
  }, [dispatch])

  const completeAuth = useCallback(
    async (code: string, error?: string) => {
      try {
        return await dispatch(handleCallbackAsync({ code, error })).unwrap()
      } catch (error) {
        console.error('YouTube authentication failed:', error)
        return null
      }
    },
    [dispatch]
  )

  const completePublicAuth = useCallback(
    async (code: string, state: string, error?: string) => {
      try {
        return await dispatch(
          handlePublicCallbackAsync({ code, state, error })
        ).unwrap()
      } catch (error) {
        console.error('YouTube public authentication failed:', error)
        return null
      }
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(resetAuth())
  }, [dispatch])

  // Upload methods
  const uploadVideo = useCallback(
    async (options: YouTubeUploadOptions) => {
      try {
        return await dispatch(uploadVideoAsync(options)).unwrap()
      } catch (error) {
        console.error('YouTube video upload failed:', error)
        return null
      }
    },
    [dispatch]
  )

  const resetUploadState = useCallback(() => {
    dispatch(resetUpload())
  }, [dispatch])

  // Statistics methods
  const getVideoStatistics = useCallback(
    async (publishingHistoryId: string) => {
      try {
        const result = await dispatch(
          getVideoStatisticsAsync(publishingHistoryId)
        ).unwrap()
        return result.data
      } catch (error) {
        console.error('Failed to fetch YouTube statistics:', error)
        return null
      }
    },
    [dispatch]
  )

  // Analytics methods
  const getVideoAnalytics = useCallback(
    async (
      videoId: string,
      metrics?: string,
      startDate?: string,
      endDate?: string,
      dimensions?: string
    ) => {
      try {
        return await dispatch(
          getVideoAnalyticsAsync({
            videoId,
            metrics,
            startDate,
            endDate,
            dimensions,
          })
        ).unwrap()
      } catch (error) {
        console.error('Failed to fetch YouTube video analytics:', error)
        return null
      }
    },
    [dispatch]
  )

  const getChannelAnalytics = useCallback(
    async (
      metrics?: string,
      startDate?: string,
      endDate?: string,
      dimensions?: string
    ) => {
      try {
        return await dispatch(
          getChannelAnalyticsAsync({
            metrics,
            startDate,
            endDate,
            dimensions,
          })
        ).unwrap()
      } catch (error) {
        console.error('Failed to fetch YouTube channel analytics:', error)
        return null
      }
    },
    [dispatch]
  )

  const getTopVideosAnalytics = useCallback(
    async (
      limit?: number,
      metrics?: string,
      startDate?: string,
      endDate?: string
    ) => {
      try {
        return await dispatch(
          getTopVideosAnalyticsAsync({
            limit,
            metrics,
            startDate,
            endDate,
          })
        ).unwrap()
      } catch (error) {
        console.error('Failed to fetch YouTube top videos analytics:', error)
        return null
      }
    },
    [dispatch]
  )

  const getDemographicsAnalytics = useCallback(
    async (startDate?: string, endDate?: string) => {
      try {
        return await dispatch(
          getDemographicsAnalyticsAsync({
            startDate,
            endDate,
          })
        ).unwrap()
      } catch (error) {
        console.error('Failed to fetch YouTube demographics analytics:', error)
        return null
      }
    },
    [dispatch]
  )

  // Error handling methods
  const clearErrors = useCallback(() => {
    dispatch(clearError())
    dispatch(clearAuthError())
    dispatch(clearUploadError())
    dispatch(clearAnalyticsError())
  }, [dispatch])

  return {
    // Auth state
    isAuthenticated: auth.isAuthenticated,
    channelName: auth.channelName,
    channelId: auth.channelId,
    authLoading: auth.loading,
    authError: auth.error,

    // Upload state
    uploading: upload.uploading,
    uploadProgress: upload.uploadProgress,
    uploadSuccess: upload.uploadSuccess,
    uploadError: upload.uploadError,
    youtubeVideoId: upload.youtubeVideoId,
    youtubeUrl: upload.youtubeUrl,
    publishingHistoryId: upload.publishingHistoryId,

    // Analytics state
    videoAnalytics: analytics.videoAnalytics,
    channelAnalytics: analytics.channelAnalytics,
    topVideos: analytics.topVideos,
    demographics: analytics.demographics,
    analyticsLoading: analytics.loading,
    analyticsError: analytics.error,

    // Statistics state
    statistics,

    // General state
    loading: youtubeState.loading,
    error: youtubeState.error,

    // Auth methods
    initiateAuth,
    completeAuth,
    completePublicAuth,
    logout,

    // Upload methods
    uploadVideo,
    resetUploadState,

    // Statistics methods
    getVideoStatistics,

    // Analytics methods
    getVideoAnalytics,
    getChannelAnalytics,
    getTopVideosAnalytics,
    getDemographicsAnalytics,

    // Error handling
    clearErrors,
  }
}
