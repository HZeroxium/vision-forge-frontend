// src/app/flow/generate-video/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { useScripts } from '@hooks/useScripts'
import { generateVideoFlow, previewAudio } from '@services/flowService'
import { Video } from '@services/videoService'

export default function GenerateVideoFlowPage() {
  // Local state for form and process management
  const [title, setTitle] = useState('')
  const [selectedContentStyle, setSelectedContentStyle] = useState('default')
  const [selectedLanguage, setSelectedLanguage] = useState('vi')
  const [localContent, setLocalContent] = useState('')
  const [step, setStep] = useState<
    'initial' | 'editing' | 'generating' | 'generated'
  >('initial')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Audio configuration state
  const [audioSpeed, setAudioSpeed] = useState(1) // default 1x
  const [audioVoice, setAudioVoice] = useState('Default Voice')
  const [audioInstructions, setAudioInstructions] = useState('Clear')
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)

  // Dropdown options
  const contentStyleOptions = ['default', 'child', 'professional', 'in-depth']
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ]
  const audioSpeedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4]
  const audioVoiceOptions = [
    'Default Voice',
    'Male',
    'Female',
    'Narrator',
    'Young',
  ]
  const audioInstructionsOptions = ['Clear', 'Dramatic', 'Calm', 'Energetic']

  // Use our custom script hook to manage script state
  const { script, createScript, updateScript, deleteScript, resetScriptState } =
    useScripts()

  // Handler: Create a new script from title input and selected style.
  const handleCreateScript = async () => {
    if (!title) {
      setError('Title is required')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await createScript({ title, style: selectedContentStyle })
      // When script is created, useScripts will store it in state.
    } catch (err: any) {
      setError('Failed to create script')
    } finally {
      setLoading(false)
    }
  }

  // When script is created, update localContent and switch to editing step.
  useEffect(() => {
    if (script) {
      setLocalContent(script.content)
      setStep('editing')
    }
  }, [script])

  // Handler: Update script if content has been edited.
  const handleUpdateScript = async () => {
    if (!script) return
    // If no change, skip update.
    if (localContent === script.content) return
    setLoading(true)
    try {
      await updateScript(script.id, { content: localContent })
    } catch (err: any) {
      setError('Failed to update script')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScript = async () => {
    if (!script) return
    setLoading(true)
    try {
      await deleteScript(script.id)
      // Reset state to allow user to create a new script from scratch.
      setTitle('')
      setSelectedContentStyle('default')
      setSelectedLanguage('en')
      setLocalContent('')
      setStep('initial')
    } catch (err: any) {
      setError('Failed to delete script')
    } finally {
      setLoading(false)
    }
  }

  // Handler: Preview audio based on selected audio configuration.
  const handlePreviewAudio = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await previewAudio({
        speed: audioSpeed,
        voice: audioVoice,
        instructions: audioInstructions,
      })
      setPreviewAudioUrl(response.url)
    } catch (err: any) {
      setError('Failed to preview audio')
    } finally {
      setLoading(false)
    }
  }

  // Handler: Call API flow to generate video.
  const handleGenerateVideo = async () => {
    if (!script) return
    // Update script if content has been edited.
    if (localContent !== script.content) {
      await handleUpdateScript()
    }
    setLoading(true)
    setStep('generating')
    try {
      const videoResponse = await generateVideoFlow({ scriptId: script.id })
      setVideoUrl(videoResponse.url)
      setStep('generated')
    } catch (err: any) {
      setError('Failed to generate video')
      setStep('editing')
    } finally {
      setLoading(false)
    }
  }

  // Handler: Reset flow for a new generation.
  const handleReset = () => {
    setTitle('')
    setSelectedContentStyle('default')
    setLocalContent('')
    setVideoUrl(null)
    setPreviewAudioUrl(null)
    setStep('initial')
    resetScriptState()
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Video Flow
      </Typography>

      {error && (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {step === 'initial' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="content-style-label">Content Style</InputLabel>
            <Select
              labelId="content-style-label"
              label="Content Style"
              value={selectedContentStyle}
              onChange={(e) => setSelectedContentStyle(e.target.value)}
            >
              {contentStyleOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              labelId="language-label"
              label="Language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languageOptions.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleCreateScript}>
            Generate Script
          </Button>
        </Box>
      )}

      {step === 'editing' && script && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6">Edit Script Content</Typography>
          <TextField
            label="Script Content"
            variant="outlined"
            fullWidth
            multiline
            minRows={6}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
          />

          {/* Audio Configuration Section */}
          <Typography variant="h6">Audio Configuration</Typography>
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

            <Button variant="outlined" onClick={handlePreviewAudio}>
              Preview Audio
            </Button>

            {previewAudioUrl && (
              <Box>
                <Typography variant="body2">Audio Preview:</Typography>
                <audio controls src={previewAudioUrl} />
              </Box>
            )}
          </Box>

          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={handleUpdateScript}>
              Update Script
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteScript}
            >
              Delete Script
            </Button>
            <Button variant="contained" onClick={handleGenerateVideo}>
              Generate Video
            </Button>
          </Box>
        </Box>
      )}

      {step === 'generated' && videoUrl && (
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <Typography variant="h6">Video Generated</Typography>
          <video controls width="600" src={videoUrl} />
          <Button variant="outlined" onClick={handleReset}>
            Generate Another Video
          </Button>
        </Box>
      )}
    </Container>
  )
}
