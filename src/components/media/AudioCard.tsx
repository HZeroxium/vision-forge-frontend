// src/components/media/AudioCard.tsx
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material'
import type { Audio } from '@services/audiosService'

interface AudioCardProps {
  audio: Audio
  onDelete?: (id: string) => void
  onPlay?: (url: string) => void
}

const AudioCard: React.FC<AudioCardProps> = ({ audio, onDelete, onPlay }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Provider: {audio.provider}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Duration: {audio.durationSeconds} sec
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Created: {new Date(audio.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        {onPlay && (
          <Button size="small" onClick={() => onPlay(audio.url)}>
            Play
          </Button>
        )}
        {onDelete && (
          <Button size="small" color="error" onClick={() => onDelete(audio.id)}>
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default AudioCard
