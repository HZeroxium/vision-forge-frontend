import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Visibility,
  ThumbUp,
  Comment,
  YouTube,
  Movie,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

interface VideoData {
  id: string
  title?: string
  thumbnailUrl?: string
  youtubeData?: {
    youtubeUrl?: string
    statistics?: {
      viewCount?: number // Changed from string to number to match API
      likeCount?: number // Changed from string to number to match API
      commentCount?: number // Changed from string to number to match API
    }
  }
}

interface VideoCardProps {
  video: VideoData
  formatNumber: (num: number) => string
}

const MotionCard = motion(Card)

const VideoCard: React.FC<VideoCardProps> = ({ video, formatNumber }) => {
  const theme = useTheme()

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}
    >
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%',
          bgcolor: 'black',
        }}
      >
        {video.thumbnailUrl ? (
          <Box
            component="img"
            src={video.thumbnailUrl}
            alt={video.title || 'Video thumbnail'}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.900',
            }}
          >
            <Movie sx={{ fontSize: 60, color: 'grey.500' }} />
          </Box>
        )}

        {/* YouTube badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'error.main',
            color: 'white',
            p: 0.5,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <YouTube fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption" fontWeight="bold">
            PUBLISHED
          </Typography>
        </Box>
      </Box>

      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          noWrap
          sx={{
            height: 32,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {video.title || `Video ${video.id}`}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Visibility color="action" />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Views
              </Typography>
              <Typography variant="h6">
                {video.youtubeData?.statistics?.viewCount !== undefined
                  ? formatNumber(Number(video.youtubeData.statistics.viewCount))
                  : '0'}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <ThumbUp color="action" />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Likes
              </Typography>
              <Typography variant="h6">
                {video.youtubeData?.statistics?.likeCount !== undefined
                  ? formatNumber(Number(video.youtubeData.statistics.likeCount))
                  : '0'}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Comment color="action" />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Comments
              </Typography>
              <Typography variant="h6">
                {video.youtubeData?.statistics?.commentCount !== undefined
                  ? formatNumber(
                      Number(video.youtubeData.statistics.commentCount)
                    )
                  : '0'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          color="error"
          startIcon={<YouTube />}
          sx={{ mt: 2, width: '100%' }}
          href={video.youtubeData?.youtubeUrl || '#'}
          target="_blank"
          disabled={!video.youtubeData?.youtubeUrl}
        >
          View on YouTube
        </Button>
      </CardContent>
    </MotionCard>
  )
}

export default VideoCard
