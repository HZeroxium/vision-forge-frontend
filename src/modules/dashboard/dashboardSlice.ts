// src/modules/dashboard/dashboardSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DashboardState {
  videos: any[]
  stats: any
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
