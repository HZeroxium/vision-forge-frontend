// src/services/scriptService.ts
import api from './api'

export interface Script {
  id: string
  title: string
  content: string
  style: string
  language: string
  createdAt: string
  updatedAt: string
}

export interface ScriptsPaginationDto {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  scripts: Script[]
}

/**
 * Create a new script by providing title (and optional style).
 */
export const createScript = async (data: {
  title: string
  style?: string
  language?: string
}): Promise<Script> => {
  const response = await api.post('/scripts', data)
  return response.data
}

/**
 * Fetch a script by its ID.
 */
export const fetchScript = async (id: string): Promise<Script> => {
  const response = await api.get(`/scripts/${id}`)
  return response.data
}

/**
 * Update an existing script (e.g., content).
 */
export const updateScript = async (
  id: string,
  data: Partial<{ title: string; content: string; style: string }>
): Promise<Script> => {
  const response = await api.patch(`/scripts/${id}`, data)
  return response.data
}

/**
 * Fetch a paginated list of scripts.
 */
export const fetchScripts = async (
  page: number = 1,
  limit: number = 10
): Promise<ScriptsPaginationDto> => {
  const response = await api.get('/scripts', { params: { page, limit } })
  return response.data
}

/**
 * Delete a script by its ID.
 */
export const deleteScript = async (id: string): Promise<Script> => {
  const response = await api.delete(`/scripts/${id}`)
  return response.data
}
