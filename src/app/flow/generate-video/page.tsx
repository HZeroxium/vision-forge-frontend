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
import Grid from '@mui/material/Grid2'
import { useScripts } from '@hooks/useScripts'
import {
  generateImages,
  generateVideoFlow,
  previewAudio,
} from '@services/flowService'
import { Video } from '@services/videoService'

type Step = 'script' | 'images' | 'videoGenerated'

export default function GenerateVideoFlowPage() {
  // Step management: "script" (step 1), "images" (step 2), "videoGenerated" (step 3)
  const [step, setStep] = useState<Step>('script')

  // Local state for Step 1 – Script Creation & Editing
  const [title, setTitle] = useState('')
  const [selectedContentStyle, setSelectedContentStyle] = useState('default')
  const [selectedLanguage, setSelectedLanguage] = useState('vi')
  const [localContent, setLocalContent] = useState('')

  // Local state for Step 2 – Image Generation & Per-Image Script Editing
  const [imagesData, setImagesData] = useState<{
    image_urls: string[]
    scripts: string[]
  } | null>(null)

  // Local state for Step 3 – Video Generation
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // Global state from script hook
  const { script, createScript, updateScript, deleteScript, resetScriptState } =
    useScripts()

  // Local error & loading state
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Audio configuration state (không được sử dụng trong bước 3 nhưng vẫn giữ cho tính năng preview audio)
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

  // --- STEP 1: Script Creation & Editing ---
  const handleCreateScript = async () => {
    if (!title) {
      setError('Title is required')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await createScript({ title, style: selectedContentStyle })
      // Khi script được tạo, hook sẽ lưu script vào state.
    } catch (err: any) {
      setError('Failed to create script')
    } finally {
      setLoading(false)
    }
  }

  // Khi script được tạo, cập nhật localContent và chuyển bước sang editing (step 1 hoàn tất).
  useEffect(() => {
    if (script) {
      setLocalContent(script.content)
    }
  }, [script])

  const handleUpdateScript = async () => {
    if (!script) return
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

  // Khi người dùng xác nhận script, chuyển sang bước 2.
  const handleProceedToImages = async () => {
    // Nếu có thay đổi, cập nhật script trước.
    if (localContent !== script?.content) {
      await handleUpdateScript()
    }
    setLoading(true)
    setError(null)
    try {
      // Gọi API generateImages với content và style từ script.
      const imagesResponse = await generateImages({
        content: localContent,
        style: selectedContentStyle,
      })
      setImagesData(imagesResponse)
      setStep('images')
    } catch (err: any) {
      setError('Failed to generate images')
    } finally {
      setLoading(false)
    }
  }

  // Handler: Cho phép người dùng chỉnh sửa script cho từng image.
  const handleEditImageScript = (index: number, newScript: string) => {
    if (imagesData) {
      const newScripts = [...imagesData.scripts]
      newScripts[index] = newScript
      setImagesData({ ...imagesData, scripts: newScripts })
    }
  }

  // Handler: Regenerate images (gọi lại API generateImages) cho bước 2.
  const handleRegenerateImages = async () => {
    if (!localContent) return
    setLoading(true)
    setError(null)
    try {
      const imagesResponse = await generateImages({
        content: localContent,
        style: selectedContentStyle,
      })
      setImagesData(imagesResponse)
    } catch (err: any) {
      setError('Failed to regenerate images')
    } finally {
      setLoading(false)
    }
  }

  // --- STEP 3: Confirm & Generate Video ---
  const handleGenerateVideo = async () => {
    if (!script || !imagesData) return
    // Nếu có thay đổi trong script, cập nhật trước.
    if (localContent !== script.content) {
      await handleUpdateScript()
    }
    setLoading(true)
    setError(null)
    try {
      // Gọi API generateVideoFlow với scriptId, imageUrls, và scripts (có thể đã chỉnh sửa)
      const videoResponse = await generateVideoFlow({
        scriptId: script.id,
        imageUrls: imagesData.image_urls,
        scripts: imagesData.scripts,
      })
      setVideoUrl(videoResponse.url)
      setStep('videoGenerated')
    } catch (err: any) {
      setError('Failed to generate video')
      setStep('images')
    } finally {
      setLoading(false)
    }
  }

  // Handler: Reset lại flow để tạo video mới.
  const handleReset = () => {
    setTitle('')
    setSelectedContentStyle('default')
    setSelectedLanguage('en')
    setLocalContent('')
    setImagesData(null)
    setVideoUrl(null)
    setStep('script')
    resetScriptState()
  }

  // Handler: Preview audio (cũng giữ lại như cũ)
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

      {step === 'script' && (
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
          {script && (
            <>
              <Typography variant="subtitle1">
                Script Content (Editable):
              </Typography>
              <TextField
                label="Script Content"
                variant="outlined"
                fullWidth
                multiline
                minRows={6}
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
              />
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={handleUpdateScript}>
                  Update Script
                </Button>
                <Button variant="contained" onClick={handleProceedToImages}>
                  Proceed to Image Generation
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}

      {step === 'images' && imagesData && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6">
            Generated Images & Corresponding Scripts
          </Typography>
          <Grid container spacing={2}>
            {imagesData.image_urls.map((imgUrl, index) => (
              <Grid key={index} size={{ xs: 12, sm: 4 }}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <img
                    src={imgUrl}
                    alt={`Generated ${index + 1}`}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <TextField
                    label={`Script for Image ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    multiline
                    minRows={3}
                    value={imagesData.scripts[index]}
                    onChange={(e) =>
                      handleEditImageScript(index, e.target.value)
                    }
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={handleRegenerateImages}>
              Regenerate Images
            </Button>
            <Button variant="contained" onClick={handleGenerateVideo}>
              Generate Video
            </Button>
          </Box>
        </Box>
      )}

      {step === 'videoGenerated' && videoUrl && (
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <Typography variant="h6">Video Generated</Typography>
          <video controls width="600" src={videoUrl} />
          <Button variant="outlined" onClick={handleReset}>
            Generate Another Video
          </Button>
        </Box>
      )}

      {/* Phần Audio Configuration để Preview Audio (giữ lại chức năng cũ, có thể dùng trong bước script nếu cần) */}
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
      </Box>
    </Container>
  )
}
