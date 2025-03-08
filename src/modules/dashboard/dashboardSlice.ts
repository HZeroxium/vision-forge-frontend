// src/modules/dashboard/dashboardSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Video {
  id: string
  thumbnail: string
  title: string
  status: string
}

interface Stats {
  [key: string]: number
}

interface DashboardState {
  videos: Video[]
  stats: Stats
}

const initialState: DashboardState = {
  videos: [],
  stats: {},
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData(state, action: PayloadAction<DashboardState>) {
      state.videos = action.payload.videos
      state.stats = action.payload.stats
    },
  },
})

export const { setDashboardData } = dashboardSlice.actions
export default dashboardSlice.reducer
