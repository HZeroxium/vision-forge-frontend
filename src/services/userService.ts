// src/services/userService.ts

import api from './api'
import { User } from './authService'

export interface UpdateProfileDto {
  name?: string
  description?: string
}

export interface UsersPaginationDto {
  data: User[]
  meta: {
    totalItems: number
    itemsPerPage: number
    currentPage: number
    totalPages: number
    sortOrder: 'asc' | 'desc'
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Get a paginated list of users
 */
export const getUsers = async (
  page = 1,
  limit = 10,
  order: 'asc' | 'desc' = 'asc'
): Promise<UsersPaginationDto> => {
  const response = await api.get('/users', {
    params: { page, limit, order },
  })
  return response.data
}

/**
 * Get a specific user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

/**
 * Create a new user (admin operation)
 */
export const createUser = async (userData: {
  email: string
  password: string
  name?: string
  description?: string
  role?: string
}): Promise<User> => {
  const response = await api.post('/users', userData)
  return response.data
}

/**
 * Update a user (admin operation)
 */
export const updateUser = async (
  id: string,
  userData: Partial<{
    email: string
    password: string
    name: string
    description: string
    role: string
  }>
): Promise<User> => {
  const response = await api.put(`/users/${id}`, userData)
  return response.data
}

/**
 * Delete a user (admin operation)
 */
export const deleteUser = async (id: string): Promise<User> => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}

/**
 * Update current user's profile
 */
export const updateProfile = async (
  profileData: UpdateProfileDto
): Promise<User> => {
  const response = await api.patch('/users/profile', profileData)
  return response.data
}
