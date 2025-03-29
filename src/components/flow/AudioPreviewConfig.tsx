// src/components/flow/AudioPreviewConfig.tsx
'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  SelectChangeEvent,
  Stack,
} from '@mui/material'
import { AudioPreview } from '@services/flowService'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CloseIcon from '@mui/icons-material/Close'

interface AudioPreviewConfigProps {
  audioSpeed: number
  setAudioSpeed: (value: number) => void
  audioVoice: string
  setAudioVoice: (value: string) => void
  audioInstructions: string
  setAudioInstructions: (value: string) => void
  availableVoices: AudioPreview[]
  onProceedToVideo: () => void
  audioSpeedOptions: number[]
  audioInstructionsOptions: string[]
  previewAudioUrl: string | null
  isLoadingPreview: boolean
  onVoiceChange: (voiceId: string) => void
}

const AudioPreviewConfig: React.FC<AudioPreviewConfigProps> = ({
  audioSpeed,
  setAudioSpeed,
  audioVoice,
  setAudioVoice,
  audioInstructions,
  setAudioInstructions,
  availableVoices,
  onProceedToVideo,
  audioSpeedOptions,
  audioInstructionsOptions,
  previewAudioUrl,
  isLoadingPreview,
  onVoiceChange,
}) => {
  // State to control whether to show the audio preview player
  const [showPreview, setShowPreview] = useState(false)

  const handleVoiceChange = (e: SelectChangeEvent<string>) => {
    const voiceId = e.target.value
    setAudioVoice(voiceId)
    onVoiceChange(voiceId)
    // Hide audio preview when voice changes
    setShowPreview(false)
  }

  // Toggle audio preview display
  const togglePreview = () => {
    setShowPreview((prev) => !prev)
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={4}>
      <Typography variant="h6">Audio Configuration</Typography>
      <FormControl fullWidth>
        <InputLabel id="audio-speed-label">Audio Speed</InputLabel>
        <Select
          labelId="audio-speed-label"
          label="Audio Speed"
          value={audioSpeed}
          onChange={(e) => setAudioSpeed(Number(e.target.value))}
        >
          {audioSpeedOptions.map((speed) => (
            <MenuItem key={speed} value={speed}>
              {speed}x
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="audio-voice-label">Audio Voice</InputLabel>
        <Select
          labelId="audio-voice-label"
          label="Audio Voice"
          value={audioVoice}
          onChange={handleVoiceChange}
        >
          {availableVoices.map((voice) => (
            <MenuItem key={voice.id} value={voice.id}>
              {voice.id} - {voice.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="audio-instructions-label">
          Audio Instructions
        </InputLabel>
        <Select
          labelId="audio-instructions-label"
          label="Audio Instructions"
          value={audioInstructions}
          onChange={(e) => setAudioInstructions(e.target.value)}
        >
          {audioInstructionsOptions.map((instr) => (
            <MenuItem key={instr} value={instr}>
              {instr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <Typography variant="body2" gutterBottom>
          Audio Preview:
        </Typography>

        {isLoadingPreview ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        ) : previewAudioUrl ? (
          <Box>
            {!showPreview ? (
              <Button
                variant="outlined"
                startIcon={<PlayArrowIcon />}
                onClick={togglePreview}
                sx={{ mt: 1 }}
              >
                Play Voice Preview
              </Button>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <audio controls src={previewAudioUrl} autoPlay />
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={togglePreview}
                    startIcon={<CloseIcon />}
                  >
                    Close
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Select a voice to enable preview
          </Typography>
        )}
      </Box>

      {/* <Button variant="contained" onClick={onProceedToVideo} sx={{ mt: 2 }}>
        Proceed to Video Generation
      </Button> */}
    </Box>
  )
}

export default AudioPreviewConfig
