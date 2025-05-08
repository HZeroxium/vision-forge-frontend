// /src/services/types/youtubeTypes.ts

/**
 * Interface for YouTube video upload options
 */
export interface YouTubeUploadOptions {
  videoId: string
  title: string
  description: string
  tags: string[]
  privacyStatus?: 'private' | 'public' | 'unlisted'
}

/**
 * Interface for YouTube video statistics
 */
export interface VideoStatistics {
  viewCount: number
  likeCount: number
  dislikeCount: number
  commentCount: number
  favoriteCount: number
  lastUpdated: string
}

export interface YouTubeVideoStatistics {
  statistics: VideoStatistics
  youtubeVideoId: string
  youtubeUrl: string
}

/**
 * Interface for YouTube authentication response
 */
export interface YouTubeAuthResponse {
  url: string
}

export interface YouTubeCallbackResponse {
  success: boolean
  channelName: string
  channelId: string
}

/**
 * Interface for YouTube upload response
 */
export interface YouTubeUploadResponse {
  success: boolean
  youtubeVideoId: string
  youtubeUrl: string
  publishingHistoryId: string
  message?: string
}

/**
 * Interfaces for YouTube analytics
 */
export interface ChartDataset {
  label: string
  data: number[]
  fill: boolean
  borderColor: string
  tension: number
}

export interface ColumnHeader {
  name: string
  type: string
  dataType: string
}

export interface BaseAnalyticsResponse {
  labels: string[]
  datasets: ChartDataset[]
  columnHeaders: ColumnHeader[]
  timeUnit: string
}

export interface TopVideoDetails {
  videoId: string
  title: string
  thumbnail: string
  publishedAt: string
  duration: string
  metrics: number[]
}

export interface TopVideosAnalyticsResponse {
  columnHeaders: ColumnHeader[]
  rows: TopVideoDetails[]
}

export interface GenderDistribution {
  male: number
  female: number
  other: number
}

export interface AgeGroupData {
  male: number
  female: number
  other?: number
}

export interface DemographicsAnalyticsResponse {
  ageGroups: Record<string, AgeGroupData>
  genderDistribution: GenderDistribution
}

/**
 * Interfaces for YouTube state management
 */
export interface YouTubeAuthState {
  isAuthenticated: boolean
  channelId?: string
  channelName?: string
  loading: boolean
  error: string | null
}

export interface YouTubeUploadState {
  uploading: boolean
  uploadProgress: number
  uploadSuccess: boolean
  uploadError: string | null
  youtubeVideoId?: string
  youtubeUrl?: string
  publishingHistoryId?: string
}

export interface YouTubeAnalyticsState {
  videoAnalytics: Record<string, BaseAnalyticsResponse>
  channelAnalytics: BaseAnalyticsResponse | null
  topVideos: TopVideosAnalyticsResponse | null
  demographics: DemographicsAnalyticsResponse | null
  loading: boolean
  error: string | null
}

export interface YouTubeState {
  auth: YouTubeAuthState
  upload: YouTubeUploadState
  analytics: YouTubeAnalyticsState
  statistics: {
    [publishingHistoryId: string]: YouTubeVideoStatistics
  }
  loading: boolean
  error: string | null
}
