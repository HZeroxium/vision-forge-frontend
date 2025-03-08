// src/modules/publishing/publishingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Video } from '../dashboard/dashboardSlice'

interface PublishingState {
  videos: Video[]
}

const initialState: PublishingState = {
  videos: [],
}

const publishingSlice = createSlice({
  name: 'publishing',
  initialState,
  reducers: {
    setPublishingVideos(state, action: PayloadAction<Video[]>) {
      state.videos = action.payload
    },
  },
})

export const { setPublishingVideos } = publishingSlice.actions
export default publishingSlice.reducer
