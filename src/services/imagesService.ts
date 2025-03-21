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

export const createImage = async (data: {
  prompt: string
  style: string
}): Promise<Image> => {
  const response = await api.post('/images', data)
  return response.data
}

export const fetchImages = async (
  page = 1,
  limit = 10
): Promise<ImagesPaginationDto> => {
  const response = await api.get('/images', { params: { page, limit } })
  return response.data
}

export const fetchImage = async (id: string): Promise<Image> => {
  const response = await api.get(`/images/${id}`)
  return response.data
}

export const updateImage = async (
  id: string,
  data: Partial<{ prompt: string; style: string }>
): Promise<Image> => {
  const response = await api.patch(`/images/${id}`, data)
  return response.data
}

export const deleteImage = async (id: string): Promise<Image> => {
  const response = await api.delete(`/images/${id}`)
  return response.data
}
