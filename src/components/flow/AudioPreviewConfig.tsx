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
import { AudioPreview } from '@services/flowService'

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
}) => {
  // Find the selected voice to get its URL
  const selectedVoice = availableVoices.find((voice) => voice.id === audioVoice)
  const previewAudioUrl = selectedVoice?.url || null

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
          onChange={(e) => setAudioVoice(e.target.value)}
        >
          {availableVoices.map((voice) => (
            <MenuItem key={voice.id} value={voice.id}>
              {voice.id}
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

      {previewAudioUrl && (
        <Box>
          <Typography variant="body2">Audio Preview:</Typography>
          <audio controls src={previewAudioUrl} />
        </Box>
      )}

      <Button variant="contained" onClick={onProceedToVideo}>
        Proceed to Video Generation
      </Button>
    </Box>
  )
}

export default AudioPreviewConfig
