// src/components/flow/AudioPreviewConfig.tsx
'use client'
import React from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material'

interface AudioPreviewConfigProps {
  audioSpeed: number
  setAudioSpeed: (value: number) => void
  audioVoice: string
  setAudioVoice: (value: string) => void
  audioInstructions: string
  setAudioInstructions: (value: string) => void
  previewAudioUrl: string | null
  onPreviewAudio: () => Promise<void>
  audioSpeedOptions: number[]
  audioVoiceOptions: string[]
  audioInstructionsOptions: string[]
}

const AudioPreviewConfig: React.FC<AudioPreviewConfigProps> = ({
  audioSpeed,
  setAudioSpeed,
  audioVoice,
  setAudioVoice,
  audioInstructions,
  setAudioInstructions,
  previewAudioUrl,
  onPreviewAudio,
  audioSpeedOptions,
  audioVoiceOptions,
  audioInstructionsOptions,
}) => {
  return (
    <Box mt={4}>
      <Typography variant="subtitle1">Audio Preview Configuration</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
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
            onChange={(e) => setAudioVoice(e.target.value)}
          >
            {audioVoiceOptions.map((voice) => (
              <MenuItem key={voice} value={voice}>
                {voice}
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
        <Button variant="outlined" onClick={onPreviewAudio}>
          Preview Audio
        </Button>
        {previewAudioUrl && (
          <Box>
            <Typography variant="body2">Audio Preview:</Typography>
            <audio controls src={previewAudioUrl} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AudioPreviewConfig
