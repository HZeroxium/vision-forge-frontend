import React from 'react'
import Grid from '@mui/material/Grid2'
import ViewsTrendChart from '../charts/ViewsTrendChart'
import EngagementChart from '../charts/EngagementChart'

interface OverviewTabProps {
  viewTrendsData: Array<{ date: string; views: number }>
  engagementTrendsData: Array<{
    date: string
    likes: number
    comments: number
    shares: number
  }>
  isLoading: boolean
  startDate: Date | null
  endDate: Date | null
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  viewTrendsData,
  engagementTrendsData,
  isLoading,
  startDate,
  endDate,
}) => {
  return (
    <Grid container spacing={3}>
      {/* View trends chart */}
      <Grid size={{ xs: 12 }}>
        <ViewsTrendChart
          data={viewTrendsData}
          isLoading={isLoading}
          startDate={startDate}
          endDate={endDate}
        />
      </Grid>

      {/* Engagement metrics */}
      <Grid size={{ xs: 12 }}>
        <EngagementChart data={engagementTrendsData} isLoading={isLoading} />
      </Grid>
    </Grid>
  )
}

export default OverviewTab
