// src/services/youtubeService.ts

import api from './api'
import {
  YouTubeAuthResponse,
  YouTubeCallbackResponse,
  YouTubeUploadOptions,
  YouTubeUploadResponse,
  YouTubeVideoStatistics,
  BaseAnalyticsResponse,
  TopVideosAnalyticsResponse,
  DemographicsAnalyticsResponse,
} from './types/youtubeTypes'

/**
 * Get the YouTube OAuth authentication URL
 */
export const getAuthUrl = async (): Promise<YouTubeAuthResponse> => {
  const response = await api.get('/youtube/auth-url')
  return response.data
}

/**
 * Handle the callback from YouTube OAuth (for authenticated users)
 */
export const handleCallback = async (
  code: string,
  error?: string
): Promise<YouTubeCallbackResponse> => {
  const response = await api.get('/youtube/callback', {
    params: { code, error },
  })
  return response.data
}

/**
 * Handle the callback from YouTube OAuth (for public users)
 */
export const handlePublicCallback = async (
  code: string,
  state: string,
  error?: string
): Promise<YouTubeCallbackResponse> => {
  const response = await api.get('/youtube/public-callback', {
    params: { code, state, error },
  })
  return response.data
}

/**
 * Upload a video to YouTube
 */
export const uploadVideo = async (
  data: YouTubeUploadOptions
): Promise<YouTubeUploadResponse> => {
  const response = await api.post('/youtube/upload', data)
  return response.data
}

/**
 * Get video statistics from YouTube
 */
export const getVideoStatistics = async (
  publishingHistoryId: string
): Promise<YouTubeVideoStatistics> => {
  const response = await api.get(`/youtube/statistics/${publishingHistoryId}`)
  return response.data
}

/**
 * Get video analytics from YouTube
 */
export const getVideoAnalytics = async (
  videoId: string,
  metrics?: string,
  startDate?: string,
  endDate?: string,
  dimensions?: string
): Promise<BaseAnalyticsResponse> => {
  const response = await api.get(`/youtube/analytics/video/${videoId}`, {
    params: { metrics, startDate, endDate, dimensions },
  })
  return response.data
}

/**
 * Get channel analytics from YouTube
 */
export const getChannelAnalytics = async (
  metrics?: string,
  startDate?: string,
  endDate?: string,
  dimensions?: string
): Promise<BaseAnalyticsResponse> => {
  const response = await api.get('/youtube/analytics/channel', {
    params: { metrics, startDate, endDate, dimensions },
  })
  return response.data
}

/**
 * Get top videos analytics from YouTube
 */
export const getTopVideosAnalytics = async (
  limit?: number,
  metrics?: string,
  startDate?: string,
  endDate?: string
): Promise<TopVideosAnalyticsResponse> => {
  const response = await api.get('/youtube/analytics/top-videos', {
    params: { limit, metrics, startDate, endDate },
  })
  return response.data
}

/**
 * Get demographics analytics from YouTube
 */
export const getDemographicsAnalytics = async (
  startDate?: string,
  endDate?: string
): Promise<DemographicsAnalyticsResponse> => {
  const response = await api.get('/youtube/analytics/demographics', {
    params: { startDate, endDate },
  })
  return response.data
}
