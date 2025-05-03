// src/store/imagesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as imagesService from '../services/imagesService'
import type { Image, ImagesPaginationDto } from '../services/imagesService'
import type { RootState } from './store'

export interface ImagesState {
  // All images state
  images: Image[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null

  // User-specific images state
  userImages: Image[]
  userTotalCount: number
  userPage: number
  userLimit: number
  userTotalPages: number
  userLoading: boolean
  userError: string | null

  // Current image being viewed/edited
  currentImage: Image | null
  currentImageLoading: boolean
  currentImageError: string | null
}

const initialState: ImagesState = {
  // All images
  images: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,

  // User images
  userImages: [],
  userTotalCount: 0,
  userPage: 1,
  userLimit: 10,
  userTotalPages: 0,
  userLoading: false,
  userError: null,

  // Current image
  currentImage: null,
  currentImageLoading: false,
  currentImageError: null,
}

export const fetchImagesAsync = createAsyncThunk(
  'images/fetchImages',
  async (
    params: { page?: number; limit?: number; userId?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await imagesService.fetchImages(
        params.page,
        params.limit,
        params.userId
      )
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch images'
      )
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      if (state.images.loading) {
        return false
      }
      return true
    },
  }
)

export const fetchUserImagesAsync = createAsyncThunk(
  'images/fetchUserImages',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await imagesService.fetchUserImages(page, limit)
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user images'
      )
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      if (state.images.userLoading) {
        return false
      }
      return true
    },
  }
)

export const fetchImageAsync = createAsyncThunk(
  'images/fetchImage',
  async (id: string, { rejectWithValue }) => {
    try {
      const image = await imagesService.fetchImage(id)
      return image
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch image'
      )
    }
  }
)

export const createImageAsync = createAsyncThunk(
  'images/createImage',
  async (data: { prompt: string; style: string }, { rejectWithValue }) => {
    try {
      const image = await imagesService.createImage(data)
      return image
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create image'
      )
    }
  }
)

export const updateImageAsync = createAsyncThunk(
  'images/updateImage',
  async (
    params: { id: string; data: Partial<{ prompt: string; style: string }> },
    { rejectWithValue }
  ) => {
    try {
      const image = await imagesService.updateImage(params.id, params.data)
      return image
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update image'
      )
    }
  }
)

export const deleteImageAsync = createAsyncThunk(
  'images/deleteImage',
  async (id: string, { rejectWithValue }) => {
    try {
      const image = await imagesService.deleteImage(id)
      return image
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete image'
      )
    }
  }
)

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearImagesError(state) {
      state.error = null
    },
    clearUserImagesError(state) {
      state.userError = null
    },
    clearCurrentImageError(state) {
      state.currentImageError = null
    },
    resetCurrentImage(state) {
      state.currentImage = null
      state.currentImageError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all images
      .addCase(fetchImagesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchImagesAsync.fulfilled,
        (state, action: PayloadAction<ImagesPaginationDto>) => {
          state.loading = false
          state.images = action.payload.images
          state.totalCount = action.payload.totalCount
          state.page = action.payload.page
          state.limit = action.payload.limit
          state.totalPages = action.payload.totalPages
        }
      )
      .addCase(fetchImagesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch images'
      })

      // Fetch user images
      .addCase(fetchUserImagesAsync.pending, (state) => {
        state.userLoading = true
        state.userError = null
      })
      .addCase(
        fetchUserImagesAsync.fulfilled,
        (state, action: PayloadAction<ImagesPaginationDto>) => {
          state.userLoading = false
          state.userImages = action.payload.images
          state.userTotalCount = action.payload.totalCount
          state.userPage = action.payload.page
          state.userLimit = action.payload.limit
          state.userTotalPages = action.payload.totalPages
        }
      )
      .addCase(fetchUserImagesAsync.rejected, (state, action) => {
        state.userLoading = false
        state.userError =
          (action.payload as string) || 'Failed to fetch user images'
      })

      // Fetch single image
      .addCase(fetchImageAsync.pending, (state) => {
        state.currentImageLoading = true
        state.currentImageError = null
      })
      .addCase(
        fetchImageAsync.fulfilled,
        (state, action: PayloadAction<Image>) => {
          state.currentImageLoading = false
          state.currentImage = action.payload
        }
      )
      .addCase(fetchImageAsync.rejected, (state, action) => {
        state.currentImageLoading = false
        state.currentImageError =
          (action.payload as string) || 'Failed to fetch image'
      })

      // Create image
      .addCase(
        createImageAsync.fulfilled,
        (state, action: PayloadAction<Image>) => {
          // Add to user images if present and update counts
          if (state.userImages.length > 0) {
            state.userImages = [action.payload, ...state.userImages]
            state.userTotalCount += 1
          }
        }
      )

      // Update image
      .addCase(
        updateImageAsync.fulfilled,
        (state, action: PayloadAction<Image>) => {
          const updatedImage = action.payload

          // Update in all images list if present
          const allIndex = state.images.findIndex(
            (img) => img.id === updatedImage.id
          )
          if (allIndex !== -1) {
            state.images[allIndex] = updatedImage
          }

          // Update in user images list if present
          const userIndex = state.userImages.findIndex(
            (img) => img.id === updatedImage.id
          )
          if (userIndex !== -1) {
            state.userImages[userIndex] = updatedImage
          }

          // Update current image if it's the same one
          if (state.currentImage?.id === updatedImage.id) {
            state.currentImage = updatedImage
          }
        }
      )

      // Delete image
      .addCase(
        deleteImageAsync.fulfilled,
        (state, action: PayloadAction<Image>) => {
          const deletedImageId = action.payload.id

          // Remove from all images list if present
          state.images = state.images.filter((img) => img.id !== deletedImageId)
          if (state.totalCount > 0) state.totalCount -= 1

          // Remove from user images list if present
          state.userImages = state.userImages.filter(
            (img) => img.id !== deletedImageId
          )
          if (state.userTotalCount > 0) state.userTotalCount -= 1

          // Clear current image if it was deleted
          if (state.currentImage?.id === deletedImageId) {
            state.currentImage = null
          }
        }
      )
  },
})

export const {
  clearImagesError,
  clearUserImagesError,
  clearCurrentImageError,
  resetCurrentImage,
} = imagesSlice.actions

export default imagesSlice.reducer
