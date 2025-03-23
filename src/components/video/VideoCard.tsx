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
import type { Video } from '@services/videoService'
import Link from 'next/link'

interface VideoCardProps {
  video: Video
  onDelete?: (id: string) => void
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete }) => {
  return (
    <Link href={`/media/videos/${video.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none' }}>
        <Card
          sx={{
            maxWidth: 345,
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
          }}
          className="bg-base-100"
        >
          {/* CHANGED: Use CardMedia with component="video" to embed video player directly */}
          {video.url ? (
            <CardMedia
              component="video"
              controls
              height="200"
              src={video.url}
              poster={
                video.thumbnailUrl ? video.thumbnailUrl : '/images/logo.webp'
              } // Fallback thumbnail
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            // Fallback: display thumbnail image if no video URL provided
            <CardMedia
              component="img"
              height="200"
              image={
                video.thumbnailUrl ? video.thumbnailUrl : '/images/logo.webp'
              }
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
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              Created: {new Date(video.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
          {onDelete && (
            <CardActions>
              <Button
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(video.id)
                }}
              >
                Delete
              </Button>
            </CardActions>
          )}
        </Card>
      </a>
    </Link>
  )
}

export default VideoCard
