import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/store'
import {
  fetchUsersAsync,
  fetchUserByIdAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
  updateProfileAsync,
  clearUsersError,
  clearCurrentUserError,
  resetCurrentUser,
} from '@store/userSlice'
import type { UpdateProfileDto } from '@services/userService'

export const useUsers = () => {
  const dispatch = useAppDispatch()
  const {
    users,
    totalCount,
    page,
    limit,
    totalPages,
    loading,
    error,
    currentUser,
    currentLoading,
    currentError,
  } = useAppSelector((state) => state.users)

  const fetchUsers = useCallback(
    (page = 1, limit = 10, order: 'asc' | 'desc' = 'asc') => {
      return dispatch(fetchUsersAsync({ page, limit, order }))
    },
    [dispatch]
  )

  const fetchUserById = useCallback(
    (id: string) => {
      return dispatch(fetchUserByIdAsync(id))
    },
    [dispatch]
  )

  const createUser = useCallback(
    (userData: {
      email: string
      password: string
      name?: string
      description?: string
      role?: string
    }) => {
      return dispatch(createUserAsync(userData))
    },
    [dispatch]
  )

  const updateUser = useCallback(
    (
      id: string,
      userData: Partial<{
        email: string
        password: string
        name: string
        description: string
        role: string
      }>
    ) => {
      return dispatch(updateUserAsync({ id, userData }))
    },
    [dispatch]
  )

  const deleteUser = useCallback(
    (id: string) => {
      return dispatch(deleteUserAsync(id))
    },
    [dispatch]
  )

  const updateProfile = useCallback(
    (profileData: UpdateProfileDto) => {
      return dispatch(updateProfileAsync(profileData))
    },
    [dispatch]
  )

  const clearErrors = useCallback(() => {
    dispatch(clearUsersError())
    dispatch(clearCurrentUserError())
  }, [dispatch])

  const clearCurrentUserData = useCallback(() => {
    dispatch(resetCurrentUser())
  }, [dispatch])

  return {
    // State
    users,
    totalCount,
    page,
    limit,
    totalPages,
    loading,
    error,
    currentUser,
    currentLoading,
    currentError,

    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    updateProfile,
    clearErrors,
    clearCurrentUserData,
  }
}
