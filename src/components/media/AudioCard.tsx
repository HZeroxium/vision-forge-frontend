// src/components/media/AudioCard.tsx
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from '@mui/material'
import type { Audio } from '@services/audiosService'
import Link from 'next/link'

interface AudioCardProps {
  audio: Audio
  onDelete?: (id: string) => void
  onPlay?: (url: string) => void
}

const AudioCard: React.FC<AudioCardProps> = ({ audio, onDelete, onPlay }) => {
  return (
    <Link href={`/media/audios/${audio.id}`} className="no-underline">
      <Card
        sx={{
          maxWidth: 345,
          transition: 'transform 0.2s ease',
          '&:hover': { transform: 'scale(1.02)' },
        }}
        className="bg-base-100"
      >
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
          {/* CHANGED: Embed inline audio player directly */}
          <Box sx={{ mt: 1 }}>
            <audio controls style={{ width: '100%' }}>
              <source src={audio.url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        </CardContent>
        {onDelete && (
          <CardActions>
            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onDelete(audio.id)
              }}
            >
              Delete
            </Button>
          </CardActions>
        )}
      </Card>
    </Link>
  )
}

export default AudioCard
