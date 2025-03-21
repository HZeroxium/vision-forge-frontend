// src/components/video/VideoCard.tsx
import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material'
import type { Video } from '../../services/videoService'

interface VideoCardProps {
  video: Video
  onPreview?: (url?: string) => void
  onDelete?: (id: string) => void
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPreview,
  onDelete,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {video.thumbnailUrl ? (
        <CardMedia
          component="img"
          height="200"
          image={video.thumbnailUrl}
          alt="Video thumbnail"
        />
      ) : (
        <CardMedia
          component="img"
          height="200"
          image="/images/placeholder-video.jpg" // Fallback image
          alt="Placeholder thumbnail"
        />
      )}
      <CardContent>
        <Typography variant="h6" component="div">
          Video ID: {video.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Status: {video.status}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Created: {new Date(video.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        {onPreview && (
          <Button size="small" onClick={() => onPreview(video.url)}>
            Preview
          </Button>
        )}
        {onDelete && (
          <Button size="small" color="error" onClick={() => onDelete(video.id)}>
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default VideoCard
