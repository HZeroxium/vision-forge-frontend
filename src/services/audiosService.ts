// src/services/audiosService.ts
import api from './api'

/**
 * Audio interface represents the audio asset.
 */
export interface Audio {
  id: string
  script: string // Script content or ID (depending on backend response)
  provider: string
  voiceParams: any // JSON object for voice configuration
  url: string
  durationSeconds: number
  createdAt: string
  updatedAt: string
  userId?: string // Added to track ownership
}

/**
 * AudiosPaginationDto interface for paginated response.
 */
export interface AudiosPaginationDto {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  audios: Audio[]
}

/**
 * Creates a new audio asset.
 */
export const createAudio = async (data: {
  scriptId: string
  provider?: string
}): Promise<Audio> => {
  const response = await api.post('/audios', data)
  return response.data
}

/**
 * Fetches a paginated list of audio assets.
 * Optional userId filter can be provided
 */
export const fetchAudios = async (
  page = 1,
  limit = 10,
  userId?: string
): Promise<AudiosPaginationDto> => {
  const params = { page, limit, ...(userId && { userId }) }
  const response = await api.get('/audios', { params })
  return response.data
}

/**
 * Fetches a paginated list of the current user's audio assets.
 */
export const fetchUserAudios = async (
  page = 1,
  limit = 10
): Promise<AudiosPaginationDto> => {
  const response = await api.get('/audios/user/me', { params: { page, limit } })
  return response.data
}

/**
 * Retrieves a single audio asset by its ID.
 */
export const fetchAudio = async (id: string): Promise<Audio> => {
  const response = await api.get(`/audios/${id}`)
  return response.data
}

/**
 * Updates an existing audio asset.
 */
export const updateAudio = async (
  id: string,
  data: Partial<{
    scriptId: string
    provider: string
    url: string
    durationSeconds: number
  }>
): Promise<Audio> => {
  const response = await api.patch(`/audios/${id}`, data)
  return response.data
}

/**
 * Soft-deletes an audio asset.
 */
export const deleteAudio = async (id: string): Promise<Audio> => {
  const response = await api.delete(`/audios/${id}`)
  return response.data
}
