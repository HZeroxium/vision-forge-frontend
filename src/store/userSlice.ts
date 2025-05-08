import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as userService from '../services/userService'
import { User } from '../services/authService'

// Define the shape of our users state
export interface UsersState {
  users: User[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null
  currentUser: User | null
  currentLoading: boolean
  currentError: string | null
}

// Initial state for users
const initialState: UsersState = {
  users: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
  currentUser: null,
  currentLoading: false,
  currentError: null,
}

// Async thunk for fetching users
export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async (
    {
      page = 1,
      limit = 10,
      order = 'asc',
    }: { page?: number; limit?: number; order?: 'asc' | 'desc' },
    { rejectWithValue }
  ) => {
    try {
      return await userService.getUsers(page, limit, order)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      )
    }
  }
)

// Async thunk for fetching a user by ID
export const fetchUserByIdAsync = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await userService.getUserById(id)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user'
      )
    }
  }
)

// Async thunk for creating a user
export const createUserAsync = createAsyncThunk(
  'users/createUser',
  async (
    userData: Parameters<typeof userService.createUser>[0],
    { rejectWithValue }
  ) => {
    try {
      return await userService.createUser(userData)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create user'
      )
    }
  }
)

// Async thunk for updating a user
export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async (
    {
      id,
      userData,
    }: { id: string; userData: Parameters<typeof userService.updateUser>[1] },
    { rejectWithValue }
  ) => {
    try {
      return await userService.updateUser(id, userData)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user'
      )
    }
  }
)

// Async thunk for deleting a user
export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      return await userService.deleteUser(id)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      )
    }
  }
)

// Async thunk for updating profile
export const updateProfileAsync = createAsyncThunk(
  'users/updateProfile',
  async (profileData: userService.UpdateProfileDto, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(profileData)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      )
    }
  }
)

// Create userSlice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError(state) {
      state.error = null
    },
    clearCurrentUserError(state) {
      state.currentError = null
    },
    resetCurrentUser(state) {
      state.currentUser = null
      state.currentError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUsersAsync
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.data
        state.totalCount = action.payload.meta.totalItems
        state.page = action.payload.meta.currentPage
        state.limit = action.payload.meta.itemsPerPage
        state.totalPages = action.payload.meta.totalPages
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Handle fetchUserByIdAsync
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.currentLoading = true
        state.currentError = null
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.currentLoading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.currentLoading = false
        state.currentError = action.payload as string
      })

      // Handle createUserAsync
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.users = [action.payload, ...state.users]
        state.totalCount += 1
      })

      // Handle updateUserAsync
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const updatedUser = action.payload
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        )
        if (index !== -1) {
          state.users[index] = updatedUser
        }
        // Update current user if it's the same one
        if (state.currentUser?.id === updatedUser.id) {
          state.currentUser = updatedUser
        }
      })

      // Handle deleteUserAsync
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        const deletedUser = action.payload
        state.users = state.users.filter((user) => user.id !== deletedUser.id)
        state.totalCount -= 1
        // Clear current user if it was deleted
        if (state.currentUser?.id === deletedUser.id) {
          state.currentUser = null
        }
      })

      // Handle updateProfileAsync - This updates the current user's profile
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        const updatedUser = action.payload
        // Update in the users list if exists
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        )
        if (index !== -1) {
          state.users[index] = updatedUser
        }
      })
  },
})

// Export actions
export const { clearUsersError, clearCurrentUserError, resetCurrentUser } =
  userSlice.actions

// Export reducer
export default userSlice.reducer
