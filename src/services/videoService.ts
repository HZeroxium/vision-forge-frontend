// src/services/videoService.ts
import api from './api'

/**
 * Video interface represents the video asset.
 */
export interface Video {
  id: string
  userId: string
  scriptId?: string
  status: string
  url?: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
}

/**
 * VideosPaginationDto interface for paginated video response.
 */
export interface VideosPaginationDto {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  videos: Video[]
}

/**
 * Creates a new video asset.
 * @param data - Object containing imageUrls, audioUrl, scriptId, and optionally transitionDuration.
 */
export const createVideo = async (data: {
  imageUrls: string[]
  audioUrl: string
  scriptId: string
  transitionDuration?: number
}): Promise<Video> => {
  const response = await api.post('/videos', data)
  return response.data
}

/**
 * Fetches a paginated list of videos.
 * @param page - Current page number.
 * @param limit - Number of videos per page.
 */
export const fetchVideos = async (
  page = 1,
  limit = 10
): Promise<VideosPaginationDto> => {
  const response = await api.get('/videos', { params: { page, limit } })
  return response.data
}

/**
 * Retrieves a single video asset by its ID.
 * @param id - Video ID.
 */
export const fetchVideo = async (id: string): Promise<Video> => {
  const response = await api.get(`/videos/${id}`)
  return response.data
}

/**
 * Updates an existing video asset.
 * @param id - Video ID.
 * @param data - Partial update data.
 */
export const updateVideo = async (
  id: string,
  data: Partial<{
    scriptId: string
    status: string
    thumbnailUrl?: string
    url?: string
  }>
): Promise<Video> => {
  const response = await api.patch(`/videos/${id}`, data)
  return response.data
}

/**
 * Soft-deletes a video asset.
 * @param id - Video ID.
 */
export const deleteVideo = async (id: string): Promise<Video> => {
  const response = await api.delete(`/videos/${id}`)
  return response.data
}
