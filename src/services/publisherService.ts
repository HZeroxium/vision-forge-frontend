// /src/services/publisherService.ts

import api from './api'
import { PublishPlatform } from './types/commonTypes'

/**
 * PublishVideoDto interface for publishing video request
 */
export interface PublishVideoDto {
  videoId: string
  platform?: PublishPlatform
  title: string
  description: string
  tags: string[]
  privacyStatus?: 'private' | 'public' | 'unlisted'
}

/**
 * UpdatePublisherDto interface for updating publishing record
 */
export interface UpdatePublisherDto {
  title?: string
  description?: string
  tags?: string[]
  privacyStatus?: 'private' | 'public' | 'unlisted'
}

/**
 * PublisherResponse interface for publisher record response
 */
export interface PublisherResponse {
  id: string
  videoId: string
  platform: PublishPlatform
  platformVideoId: string
  publishStatus: string
  publishLogs: Record<string, any>
  createdAt: string
  updatedAt: string
  platformVideoUrl?: string
}

/**
 * PublisherPaginationDto interface for paginated publisher response
 */
export interface PublisherPaginationDto {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  publishingHistories: PublisherResponse[]
}

/**
 * Publish a video to a platform (currently only YouTube)
 * @param data - The video publishing data
 */
export const publishVideo = async (
  data: PublishVideoDto
): Promise<PublisherResponse> => {
  const response = await api.post('/publisher/publish', data)
  return response.data
}

/**
 * Fetch paginated publishing histories
 */
export const fetchPublishingHistories = async (
  page = 1,
  limit = 10
): Promise<PublisherPaginationDto> => {
  const response = await api.get('/publisher', { params: { page, limit } })
  return response.data
}

/**
 * Fetch a specific publishing history by ID
 */
export const fetchPublishingHistory = async (
  id: string
): Promise<PublisherResponse> => {
  const response = await api.get(`/publisher/${id}`)
  return response.data
}

/**
 * Update a publishing history record
 */
export const updatePublishingHistory = async (
  id: string,
  data: UpdatePublisherDto
): Promise<PublisherResponse> => {
  const response = await api.patch(`/publisher/${id}`, data)
  return response.data
}

/**
 * Delete a publishing history record
 */
export const deletePublishingHistory = async (
  id: string
): Promise<PublisherResponse> => {
  const response = await api.delete(`/publisher/${id}`)
  return response.data
}
