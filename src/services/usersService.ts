// src/services/usersService.ts
import api from './api'
import { User } from './authService'

export interface UsersPaginationDto {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  order: 'asc' | 'desc'
  users: User[]
}

export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  order: 'asc' | 'desc' = 'asc'
): Promise<UsersPaginationDto> => {
  const response = await api.get('/users', {
    params: { page, limit, order },
  })
  return response.data
}
