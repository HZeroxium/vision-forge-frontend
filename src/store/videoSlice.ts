// src/store/videoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface VideoState {
  videos: any[]
  loading: boolean
  error: string | null
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
}

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    fetchVideosStart(state) {
      state.loading = true
      state.error = null
    },
    fetchVideosSuccess(state, action: PayloadAction<any[]>) {
      state.videos = action.payload
      state.loading = false
    },
    fetchVideosFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    // Additional reducers for create, update, delete video actions
  },
})

export const { fetchVideosStart, fetchVideosSuccess, fetchVideosFailure } =
  videoSlice.actions
export default videoSlice.reducer
