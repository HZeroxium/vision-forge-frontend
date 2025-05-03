// src/services/imagesService.ts
import api from './api'

export interface Image {
  id: string
  prompt: string
  style: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface ImagesPaginationDto {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  images: Image[]
}

/**
 * Create a new image with provided prompt and style
 */
export const createImage = async (data: {
  prompt: string
  style: string
}): Promise<Image> => {
  const response = await api.post('/images', data)
  return response.data
}

/**
 * Fetch a paginated list of all images
 * Optional userId filter can be provided
 */
export const fetchImages = async (
  page: number = 1,
  limit: number = 10,
  userId?: string
): Promise<ImagesPaginationDto> => {
  const params = { page, limit, ...(userId && { userId }) }
  const response = await api.get('/images', { params })
  return response.data
}

/**
 * Fetch a paginated list of the current user's images
 */
export const fetchUserImages = async (
  page: number = 1,
  limit: number = 10
): Promise<ImagesPaginationDto> => {
  const response = await api.get('/images/user/me', { params: { page, limit } })
  return response.data
}

/**
 * Fetch a single image by ID
 */
export const fetchImage = async (id: string): Promise<Image> => {
  const response = await api.get(`/images/${id}`)
  return response.data
}

/**
 * Update an existing image
 */
export const updateImage = async (
  id: string,
  data: Partial<{ prompt: string; style: string }>
): Promise<Image> => {
  const response = await api.patch(`/images/${id}`, data)
  return response.data
}

/**
 * Delete an image by ID
 */
export const deleteImage = async (id: string): Promise<Image> => {
  const response = await api.delete(`/images/${id}`)
  return response.data
}
