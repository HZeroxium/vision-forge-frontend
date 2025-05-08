import React from 'react'
import Grid from '@mui/material/Grid2'
import {
  Visibility,
  ThumbUp,
  Comment,
  Share,
  Timeline,
  PlayCircle,
} from '@mui/icons-material'
import { useTheme } from '@mui/material'
import SummaryCard from './cards/SummaryCard'

interface SummaryMetrics {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  totalWatchTime: number
  avgViewDuration: number
}

interface SummaryCardsProps {
  metrics: SummaryMetrics
  isLoading: boolean
  formatNumber: (num: number) => string
  formatTime: (seconds: number) => string
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  isLoading,
  formatNumber,
  formatTime,
}) => {
  const theme = useTheme()

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <SummaryCard
          title="Views"
          value={formatNumber(metrics.totalViews)}
          subtitle="Total Views"
          icon={<Visibility />}
          color={theme.palette.primary.main}
          isLoading={isLoading}
          delay={0.2}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <SummaryCard
          title="Likes"
          value={formatNumber(metrics.totalLikes)}
          subtitle="Total Likes"
          icon={<ThumbUp />}
          color={theme.palette.secondary.main}
          isLoading={isLoading}
          delay={0.25}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <SummaryCard
          title="Comments"
          value={formatNumber(metrics.totalComments)}
          subtitle="Total Comments"
          icon={<Comment />}
          color={theme.palette.success.main}
          isLoading={isLoading}
          delay={0.3}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <SummaryCard
          title="Shares"
          value={formatNumber(metrics.totalShares)}
          subtitle="Total Shares"
          icon={<Share />}
          color={theme.palette.info.main}
          isLoading={isLoading}
          delay={0.35}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <SummaryCard
          title="Watch Time"
          value={`${Math.floor(metrics.totalWatchTime)}m`}
          subtitle="Total Minutes Watched"
          icon={<Timeline />}
          color={theme.palette.warning.main}
          isLoading={isLoading}
          delay={0.4}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
        <SummaryCard
          title="Avg Duration"
          value={formatTime(metrics.avgViewDuration)}
          subtitle="Average View Duration"
          icon={<PlayCircle />}
          color={theme.palette.error.main}
          isLoading={isLoading}
          delay={0.45}
        />
      </Grid>
    </Grid>
  )
}

export default SummaryCards
