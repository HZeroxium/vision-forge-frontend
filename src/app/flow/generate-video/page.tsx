// src/app/flow/generate-video/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { Container, Typography, CircularProgress, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ScriptStep from '@components/flow/ScriptStep'
import ImagesStep from '@components/flow/ImagesStep'
import AudioPreviewConfig from '@components/flow/AudioPreviewConfig'
import VideoPreviewStep from '@components/flow/VideoPreviewStep'
import { useScripts } from '@hooks/useScripts'
import {
  generateImages,
  generateVideoFlow,
  getPreviewVoiceUrl,
  AudioPreview,
} from '@services/flowService'

/**
 * Define the steps of the flow.
 * 'script'   - User creates & edits script.
 * 'images'   - Generated images & per-image script editing.
 * 'audio'    - Audio configuration & preview.
 * 'videoGenerating' - Video is being generated (spinner shown).
 * 'videoGenerated'  - Video is generated and preview is shown.
 */
type Step = 'script' | 'images' | 'audio' | 'videoGenerating' | 'videoGenerated'

export default function GenerateVideoFlowPage() {
  // Step management state
  const [step, setStep] = useState<Step>('script')

  // State for Step 1 – Script Creation & Editing
  const [title, setTitle] = useState('')
  const [selectedContentStyle, setSelectedContentStyle] = useState('default')
  const [selectedLanguage, setSelectedLanguage] = useState('vi')
  const [localContent, setLocalContent] = useState('')

  // State for Step 2 – Images & Scripts Editing
  const [imagesData, setImagesData] = useState<{
    image_urls: string[]
    scripts: string[]
  } | null>(null)

  // State for Step 3 – Audio Configuration
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [audioSpeed, setAudioSpeed] = useState(1)
  const [audioVoice, setAudioVoice] = useState('alloy') // Default to 'alloy'
  const [audioInstructions, setAudioInstructions] = useState('Clear')

  // Hardcoded voice data based on backend information
  const availableVoices: AudioPreview[] = [
    { id: 'alloy', description: 'Neutral, balanced voice' },
    { id: 'ash', description: 'Deep, resonant voice' },
    { id: 'echo', description: 'Soft, gentle voice' },
    { id: 'sage', description: 'Warm, friendly voice' },
    { id: 'verse', description: 'Strong, authoritative voice' },
  ]

  // State for Step 4 – Video Generation/Preview
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // Global script state from hook
  const { script, createScript, updateScript, deleteScript, resetScriptState } =
    useScripts()

  // Local error & loading state
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
  const audioInstructionsOptions = ['Clear', 'Dramatic', 'Calm', 'Energetic']

  // Load preview for default voice when component mounts
  useEffect(() => {
    if (audioVoice) {
      handleVoiceChange(audioVoice)
    }
  }, [])

  // Fetch audio preview when voice changes
  const handleVoiceChange = async (voiceId: string) => {
    if (!voiceId) return

    setIsLoadingPreview(true)
    setPreviewAudioUrl(null)

    try {
      const url = await getPreviewVoiceUrl(voiceId)
      setPreviewAudioUrl(url)
    } catch (err) {
      console.error('Error fetching voice preview:', err)
      setError('Failed to fetch voice preview')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  // --- STEP 1: Script Creation & Editing Handlers ---
  const handleCreateScript = async () => {
    if (!title) {
      setError('Title is required')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await createScript({ title, style: selectedContentStyle })
    } catch (err: any) {
      setError('Failed to create script')
    } finally {
      setLoading(false)
    }
  }

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

  const handleProceedToImages = async () => {
    if (localContent !== script?.content) {
      await handleUpdateScript()
    }
    setLoading(true)
    setError(null)
    try {
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

  // --- STEP 2: Images & Scripts Editing Handlers ---
  const handleEditImageScript = (index: number, newScript: string) => {
    if (imagesData) {
      const newScripts = [...imagesData.scripts]
      newScripts[index] = newScript
      setImagesData({ ...imagesData, scripts: newScripts })
    }
  }

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

  // Proceed from Images step to Audio step.
  const handleProceedToAudio = () => {
    setStep('audio')
  }

  // --- STEP 3: Audio Configuration Handlers ---
  const handleProceedToVideo = async () => {
    setStep('videoGenerating')
    // Start video generation and show spinner immediately.
    if (!script || !imagesData) return

    setLoading(true)
    setError(null)

    try {
      // The backend expects the scripts from ImagesStep - these already contain user edits
      // We don't need to call handleUpdateScript for the original content here
      // as the backend will automatically update the script if needed
      const videoResponse = await generateVideoFlow({
        scriptId: script.id,
        imageUrls: imagesData.image_urls,
        scripts: imagesData.scripts,
      })
      setVideoUrl(videoResponse.url)
      setStep('videoGenerated')
    } catch (err: any) {
      setError('Failed to generate video')
      setStep('audio') // go back to audio step if video generation fails
    } finally {
      setLoading(false)
    }
  }

  // --- Reset Flow Handler ---
  const handleReset = () => {
    setTitle('')
    setSelectedContentStyle('default')
    setSelectedLanguage('en')
    setLocalContent('')
    setImagesData(null)
    setVideoUrl(null)
    setPreviewAudioUrl(null)
    setAudioVoice('alloy') // Reset to default voice
    setStep('script')
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

      {step === 'script' && (
        <ScriptStep
          title={title}
          setTitle={setTitle}
          selectedContentStyle={selectedContentStyle}
          setSelectedContentStyle={setSelectedContentStyle}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          localContent={localContent}
          setLocalContent={setLocalContent}
          scriptExists={!!script}
          onCreateScript={handleCreateScript}
          onUpdateScript={handleUpdateScript}
          onProceedToImages={handleProceedToImages}
          contentStyleOptions={contentStyleOptions}
          languageOptions={languageOptions}
        />
      )}

      {step === 'images' && imagesData && (
        <ImagesStep
          imagesData={imagesData}
          onEditImageScript={handleEditImageScript}
          onRegenerateImages={handleRegenerateImages}
          onProceedToAudio={handleProceedToAudio}
        />
      )}

      {step === 'audio' && (
        <AudioPreviewConfig
          audioSpeed={audioSpeed}
          setAudioSpeed={setAudioSpeed}
          audioVoice={audioVoice}
          setAudioVoice={setAudioVoice}
          audioInstructions={audioInstructions}
          setAudioInstructions={setAudioInstructions}
          availableVoices={availableVoices}
          onProceedToVideo={handleProceedToVideo}
          audioSpeedOptions={audioSpeedOptions}
          audioInstructionsOptions={audioInstructionsOptions}
          previewAudioUrl={previewAudioUrl}
          isLoadingPreview={isLoadingPreview}
          onVoiceChange={handleVoiceChange}
        />
      )}

      {step === 'videoGenerating' && (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Typography variant="h6">Generating video, please wait...</Typography>
        </Box>
      )}

      {step === 'videoGenerated' && videoUrl && (
        <VideoPreviewStep videoUrl={videoUrl} onReset={handleReset} />
      )}
    </Container>
  )
}
