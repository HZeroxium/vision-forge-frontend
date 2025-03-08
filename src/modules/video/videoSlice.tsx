// src/modules/video/videoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface VideoState {
  list: any[]
}

const initialState: VideoState = {
  list: [],
}

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos(state, action: PayloadAction<any[]>) {
      state.list = action.payload
    },
    addVideo(state, action: PayloadAction<any>) {
      state.list.push(action.payload)
    },
    updateVideoInList(state, action: PayloadAction<any>) {
      const index = state.list.findIndex((v) => v.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
    },
  },
})

export const { setVideos, addVideo, updateVideoInList } = videoSlice.actions
export default videoSlice.reducer
