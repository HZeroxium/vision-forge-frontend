// src/store/imagesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as imagesService from '../services/imagesService'
import type { Image, ImagesPaginationDto } from '../services/imagesService'

export interface ImagesState {
  images: Image[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: ImagesState = {
  images: [],
  totalCount: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
}

export const fetchImagesAsync = createAsyncThunk(
  'images/fetchImages',
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await imagesService.fetchImages(params.page, params.limit)
      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch images'
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
  },
  extraReducers: (builder) => {
    builder
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
  },
})

export const { clearImagesError } = imagesSlice.actions
export default imagesSlice.reducer
