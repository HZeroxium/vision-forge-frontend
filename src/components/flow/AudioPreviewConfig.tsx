// src/components/flow/AudioPreviewConfig.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react'
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
  FormControlLabel,
  Checkbox,
  Alert,
  Paper,
  Divider,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { AudioPreview } from '@services/flowService'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CloseIcon from '@mui/icons-material/Close'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import ReplayIcon from '@mui/icons-material/Replay'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LoadingIndicator from '../common/LoadingIndicator'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

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

  // Voice recording states
  const [useOwnVoice, setUseOwnVoice] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [audioVisualizationData, setAudioVisualizationData] = useState<
    number[]
  >([])
  const [isPlaying, setIsPlaying] = useState(false)

  // Refs for recording functionality
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Responsive design
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Check if the minimum recording time is met
  const hasMinRecordingTime = recordingDuration >= 10

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

  // Handle checkbox change for using own voice
  const handleUseOwnVoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked
    setUseOwnVoice(checked)

    // Stop recording if it's ongoing when unchecked
    if (!checked && isRecording) {
      stopRecording()
    }

    // If unchecked, reset all recording states
    if (!checked) {
      setRecordedAudioUrl(null)
      setRecordingDuration(0)
    }
  }

  // Start recording function
  const startRecording = async () => {
    try {
      setRecordingError(null)

      // Reset previous recording data
      audioChunksRef.current = []
      setRecordingDuration(0)

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio context for visualization
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 256

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Event handlers for media recorder
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedAudioUrl(audioUrl)

        // Clean up stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      // Start recording
      mediaRecorder.start(100)
      setIsRecording(true)

      // Start timer to track recording duration
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)

      // Start audio visualization
      updateAudioVisualization()
    } catch (error) {
      console.error('Error starting recording:', error)
      setRecordingError(
        'Could not access microphone. Please check browser permissions.'
      )
    }
  }

  // Update audio visualization function
  const updateAudioVisualization = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateData = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)

      // Sample the data for visualization (taking ~30 points)
      const sampleSize = Math.floor(bufferLength / 30)
      const sampledData = []

      for (let i = 0; i < bufferLength; i += sampleSize) {
        let sum = 0
        for (let j = 0; j < sampleSize && i + j < bufferLength; j++) {
          sum += dataArray[i + j]
        }
        sampledData.push(sum / sampleSize)
      }

      setAudioVisualizationData(sampledData)
      animationFrameRef.current = requestAnimationFrame(updateData)
    }

    updateData()
  }

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }

      // Stop animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }

  // Delete recorded audio
  const deleteRecordedAudio = () => {
    setRecordedAudioUrl(null)
    setRecordingDuration(0)

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Toggle play/pause for recorded audio
  const togglePlayRecordedAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Audio playback ended handler
  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all resources
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl)
      }
    }
  }, [recordedAudioUrl])

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={4}>
      <Typography variant="h6">Audio Configuration</Typography>

      {/* Use Own Voice Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={useOwnVoice}
            onChange={handleUseOwnVoiceChange}
            color="primary"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>Use my own voice for narration</Typography>
            {hasMinRecordingTime && useOwnVoice && (
              <CheckCircleIcon color="success" fontSize="small" />
            )}
          </Box>
        }
      />

      {useOwnVoice ? (
        <Paper
          elevation={0}
          variant="outlined"
          sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}
        >
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Voice Recording
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Record your own voice for narrating the video. You need to record
              at least 10 seconds.
            </Typography>

            {/* Recording duration display */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="body2">
                Recording duration:{' '}
                <strong>{formatTime(recordingDuration)}</strong>
              </Typography>

              {!isRecording && recordingDuration > 0 && (
                <Typography
                  variant="body2"
                  color={hasMinRecordingTime ? 'success.main' : 'warning.main'}
                >
                  {hasMinRecordingTime
                    ? 'Minimum recording time met'
                    : `Need ${10 - recordingDuration}s more`}
                </Typography>
              )}
            </Box>

            {/* Progress bar showing how close to minimum time */}
            {!isRecording &&
              recordingDuration > 0 &&
              recordingDuration < 10 && (
                <LinearProgress
                  variant="determinate"
                  value={recordingDuration * 10}
                  sx={{ mb: 2, height: 6, borderRadius: 3 }}
                />
              )}

            {/* Audio visualization */}
            {isRecording && (
              <Box
                sx={{
                  height: 100,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  mb: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {audioVisualizationData.map((value, index) => (
                    <MotionBox
                      key={index}
                      initial={{ height: 10 }}
                      animate={{
                        height: Math.max(5, Math.min(80, value * 0.7)),
                      }}
                      transition={{ duration: 0.1 }}
                      sx={{
                        width: `${100 / audioVisualizationData.length}%`,
                        backgroundColor: theme.palette.primary.main,
                        alignSelf: 'center',
                        borderRadius: 1,
                      }}
                    />
                  ))}

                  {/* Show pulse animation when no data */}
                  {audioVisualizationData.length === 0 && (
                    <MotionBox
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        opacity: 0.6,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Recording controls */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                mb: 2,
              }}
            >
              {isRecording ? (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  fullWidth={isMobile}
                  onClick={stopRecording}
                >
                  Stop Recording
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MicIcon />}
                  fullWidth={isMobile}
                  onClick={startRecording}
                  disabled={!!recordedAudioUrl && isPlaying}
                >
                  Start Recording
                </Button>
              )}

              {recordedAudioUrl && !isRecording && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={isPlaying ? <StopIcon /> : <PlayArrowIcon />}
                    onClick={togglePlayRecordedAudio}
                    fullWidth={isMobile}
                  >
                    {isPlaying ? 'Stop' : 'Play'} Recording
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={deleteRecordedAudio}
                    fullWidth={isMobile}
                  >
                    Delete Recording
                  </Button>
                </>
              )}
            </Box>

            {/* Hidden audio element for playback */}
            {recordedAudioUrl && (
              <audio
                ref={audioRef}
                src={recordedAudioUrl}
                onEnded={handleAudioEnded}
                style={{ display: 'none' }}
              />
            )}

            {/* Error message */}
            {recordingError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {recordingError}
              </Alert>
            )}

            {/* Success message when recording meets requirements */}
            {!isRecording && recordedAudioUrl && hasMinRecordingTime && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Your voice recording is ready to use. You can proceed to video
                generation.
              </Alert>
            )}
          </Box>
        </Paper>
      ) : (
        <>
          {/* Regular audio configuration options */}
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
                <LoadingIndicator isLoading={true} size={24} />
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
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Proceed button */}
      <Button
        variant="contained"
        color="primary"
        onClick={onProceedToVideo}
        disabled={useOwnVoice && (!recordedAudioUrl || !hasMinRecordingTime)}
        sx={{ alignSelf: 'flex-end', mt: 2 }}
      >
        Proceed to Video Generation
      </Button>
    </Box>
  )
}

export default AudioPreviewConfig
