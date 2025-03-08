// src/modules/analytics/analyticsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AnalyticsState {
  data: any
}

const initialState: AnalyticsState = {
  data: {},
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData(state, action: PayloadAction<any>) {
      state.data = action.payload
    },
  },
})

export const { setAnalyticsData } = analyticsSlice.actions
export default analyticsSlice.reducer
