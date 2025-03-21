// src/modules/video/videoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Video } from '../dashboard/dashboardSlice'

interface VideoState {
  list: Video[]
  id: number
}

const initialState: VideoState = {
  list: [],
  id: 0,
}

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos(state, action: PayloadAction<Video[]>) {
      state.list = action.payload
    },
    addVideo(state, action: PayloadAction<Video>) {
      state.list.push(action.payload)
    },
    updateVideoInList(state, action: PayloadAction<Video>) {
      const index = state.list.findIndex((v) => v.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
    },
  },
})

export const { setVideos, addVideo, updateVideoInList } = videoSlice.actions
export default videoSlice.reducer
