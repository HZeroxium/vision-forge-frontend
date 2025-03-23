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
} from '@mui/material'
import { useScripts } from '@hooks/useScripts'
import { generateVideoFlow } from '@services/flowService'
import { Video } from '@/services/videoService'

export default function GenerateVideoFlowPage() {
  // Local state for form and process management
  const [title, setTitle] = useState('')
  const [localContent, setLocalContent] = useState('')
  const [step, setStep] = useState<
    'initial' | 'editing' | 'generating' | 'generated'
  >('initial')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Use our custom script hook to manage script state
  const { script, createScript, updateScript, resetScriptState } = useScripts()

  // Handler: Create a new script from title input.
  const handleCreateScript = async () => {
    if (!title) {
      setError('Title is required')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await createScript({ title, style: 'default' })
      // Khi script được tạo, useScripts sẽ lưu script trong state.
    } catch (err: any) {
      setError('Failed to create script')
    } finally {
      setLoading(false)
    }
  }

  // Khi script được tạo, cập nhật localContent và chuyển bước sang editing.
  useEffect(() => {
    if (script) {
      setLocalContent(script.content)
      setStep('editing')
    }
  }, [script])

  // Handler: Update script nếu nội dung đã được chỉnh sửa.
  const handleUpdateScript = async () => {
    if (!script) return
    // Nếu không có thay đổi thì bỏ qua.
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

  // Handler: Gọi API flow để generate video.
  const handleGenerateVideo = async () => {
    if (!script) return
    // Nếu nội dung đã thay đổi, cập nhật trước khi generate.
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

  // Handler: Reset lại flow để thực hiện lần mới.
  const handleReset = () => {
    setTitle('')
    setLocalContent('')
    setVideoUrl(null)
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
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={handleUpdateScript}>
              Update Script
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
