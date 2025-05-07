import React from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Alert, Button, Typography } from '@mui/material'
import VideoCard from '../cards/VideoCard'

interface Video {
  id: string
  title?: string
  thumbnailUrl?: string
  youtubeData?: {
    youtubeUrl?: string
    youtubeVideoId?: string
    statistics?: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
  }
  publishingHistoryId?: string
}

interface PublishedVideosTabProps {
  videos: Video[]
  formatNumber: (num: number) => string
  isLoading: boolean
}

const PublishedVideosTab: React.FC<PublishedVideosTabProps> = ({
  videos,
  formatNumber,
  isLoading,
}) => {
  const publishedVideos = videos.filter(
    (video) => video.youtubeData?.youtubeUrl
  )

  if (publishedVideos.length === 0 && !isLoading) {
    return (
      <Alert
        severity="info"
        sx={{ mb: 4 }}
        action={
          <Button color="inherit" size="small" href="/media/videos">
            Go to Videos
          </Button>
        }
      >
        <Typography variant="body1">
          You don't have any videos published to YouTube yet.
        </Typography>
        <Typography variant="body2">
          Publish videos to see analytics data in this section.
        </Typography>
      </Alert>
    )
  }

  return (
    <Grid container spacing={3}>
      {publishedVideos.map((video) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={video.id}>
          <VideoCard video={video} formatNumber={formatNumber} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PublishedVideosTab
