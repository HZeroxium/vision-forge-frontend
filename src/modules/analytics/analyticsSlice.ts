// src/modules/analytics/analyticsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AnalyticsState {
  data: unknown
}

const initialState: AnalyticsState = {
  data: {},
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData(state, action: PayloadAction<unknown>) {
      state.data = action.payload
    },
  },
})

export const { setAnalyticsData } = analyticsSlice.actions
export default analyticsSlice.reducer
