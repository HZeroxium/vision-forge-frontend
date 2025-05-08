// src/services/scriptService.ts

import api from './api'

export interface Source {
  title: string
  url?: string
  content?: string
  source_type?: string
}

export interface Script {
  id: string
  userId: string
  title: string
  content: string
  sources: Source[]
  style?: string
  language?: string
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
 * Create a new script
 */
export const createScript = async (data: {
  title: string
  style?: string
  language?: string
  includePersonalDescription?: boolean
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
 * Fetch a paginated list of all scripts.
 */
export const fetchScripts = async (
  page: number = 1,
  limit: number = 10
): Promise<ScriptsPaginationDto> => {
  const response = await api.get('/scripts', { params: { page, limit } })
  return response.data
}

/**
 * Fetch a paginated list of scripts belonging to the current user.
 */
export const fetchUserScripts = async (
  page: number = 1,
  limit: number = 10
): Promise<ScriptsPaginationDto> => {
  const response = await api.get('/scripts/user/me', {
    params: { page, limit },
  })
  return response.data
}

/**
 * Delete a script by its ID.
 */
export const deleteScript = async (id: string): Promise<Script> => {
  const response = await api.delete(`/scripts/${id}`)
  return response.data
}
