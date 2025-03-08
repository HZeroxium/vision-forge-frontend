// src/modules/publishing/publishingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PublishingState {
  videos: any[]
}

const initialState: PublishingState = {
  videos: [],
}

const publishingSlice = createSlice({
  name: 'publishing',
  initialState,
  reducers: {
    setPublishingVideos(state, action: PayloadAction<any[]>) {
      state.videos = action.payload
    },
  },
})

export const { setPublishingVideos } = publishingSlice.actions
export default publishingSlice.reducer
