// src/app/flow/generate-video/page.tsx

'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import ScriptStep from '@components/flow/ScriptStep'
import ImagesStep from '@components/flow/ImagesStep'
import AudioPreviewConfig from '@components/flow/AudioPreviewConfig'
import VideoPreviewStep from '@components/flow/VideoPreviewStep'
import SocialUploadStep from '@components/flow/SocialUploadStep'
import ProgressTracker from '@components/flow/ProgressTracker'
import StepNavigation from '@components/flow/StepNavigation'
import PageTransition from '@components/flow/PageTransition'
import { useScripts } from '@hooks/useScripts'
import {
  generateImages,
  startVideoGenerationJob,
  getPreviewVoiceUrl,
  AudioPreview,
  getJobStatus,
  getVideoByScriptId,
} from '@services/flowService'
import { subscribeToJobProgress, JobProgress } from '@utils/sse'
import { Source } from '@/services/scriptsService'
import { useRouter } from 'next/navigation'

/**
 * Define the steps of the flow.
 * 'script'   - User creates & edits script.
 * 'images'   - Generated images & per-image script editing.
 * 'audio'    - Audio configuration & preview.
 * 'videoGenerating' - Video is being generated (spinner shown).
 * 'videoGenerated'  - Video is generated and preview is shown.
 * 'socialUpload'    - Optional step for uploading to social media.
 */
type Step =
  | 'script'
  | 'images'
  | 'audio'
  | 'videoGenerating'
  | 'videoGenerated'
  | 'socialUpload'

export interface ContentStyleOption {
  displayValue: string
  backendValue: string
  label?: string // Optional friendly label for display
}

const contentStyleMapping: ContentStyleOption[] = [
  { displayValue: 'default', backendValue: 'phổ thông', label: 'Default' },
  { displayValue: 'child', backendValue: 'trẻ em', label: 'Child-Friendly' },
  { displayValue: 'in-depth', backendValue: 'chuyên gia', label: 'In-Depth' },
]

export default function GenerateVideoFlowPage() {
  const router = useRouter()

  // Step management state
  const [step, setStep] = useState<Step>('script')
  const [previousStep, setPreviousStep] = useState<Step | null>(null)
  const [transitionDirection, setTransitionDirection] = useState<
    'right' | 'left'
  >('right')

  // State for Step 1 – Script Creation & Editing
  const [title, setTitle] = useState('')
  const [selectedContentStyle, setSelectedContentStyle] = useState('default')
  const [selectedLanguage, setSelectedLanguage] = useState('vi')
  const [localContent, setLocalContent] = useState('')
  const [sources, setSources] = useState<Source[]>([])
  // Add state for profile description inclusion
  const [includePersonalDescription, setIncludePersonalDescription] =
    useState(false)

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

  // State for Step 5 - Social Upload
  const [videoId, setVideoId] = useState<string | null>(null)

  // Global script state from hook
  const { script, createScript, updateScript, deleteScript, resetScriptState } =
    useScripts()

  // Local error & loading state
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Add isGeneratingScript state
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [isRegeneratingImages, setIsRegeneratingImages] = useState(false)

  // Add new state for job tracking
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [jobProgress, setJobProgress] = useState<JobProgress | null>(null)
  const sseCleanupRef = useRef<(() => void) | null>(null)

  // Add a new state to track initial image generation
  const [isGeneratingInitialImages, setIsGeneratingInitialImages] =
    useState(false)

  // Cleanup SSE connection when component unmounts
  useEffect(() => {
    return () => {
      if (sseCleanupRef.current) {
        sseCleanupRef.current()
        sseCleanupRef.current = null
      }
    }
  }, [])

  // Dropdown options
  const contentStyleOptions = contentStyleMapping

  // Function to get backend value from display value
  const getBackendValue = (displayValue: string): string => {
    const option = contentStyleMapping.find(
      (opt) => opt.displayValue === displayValue
    )
    return option?.backendValue || displayValue
  }

  // Function to get display value from backend value
  const getDisplayValue = (backendValue: string): string => {
    const option = contentStyleMapping.find(
      (opt) => opt.backendValue === backendValue
    )
    return option?.displayValue || backendValue
  }

  const languageOptions = [
    { value: 'vi', label: 'Vietnamese' },
    { value: 'en', label: 'English (In development)' },
    // { value: 'es', label: 'Spanish' },
    // { value: 'fr', label: 'French' },
    // { value: 'de', label: 'German' },
  ]
  const audioSpeedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4]
  const audioInstructionsOptions = ['Clear', 'Dramatic', 'Calm', 'Energetic']

  // Helper function to change steps with proper transition direction
  const navigateToStep = (newStep: Step) => {
    setPreviousStep(step)

    // Set transition direction based on step progression
    const stepOrder: Step[] = [
      'script',
      'images',
      'audio',
      'videoGenerating',
      'videoGenerated',
      'socialUpload',
    ]
    const currentIndex = stepOrder.indexOf(step)
    const newIndex = stepOrder.indexOf(newStep)

    setTransitionDirection(newIndex > currentIndex ? 'right' : 'left')
    setStep(newStep)
  }

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
    setIsGeneratingScript(true)
    try {
      await createScript({
        title,
        style: getBackendValue(selectedContentStyle),
        includePersonalDescription, // Include this preference in script creation
      })
    } catch (err: any) {
      setError('Failed to create script')
    } finally {
      setLoading(false)
      setIsGeneratingScript(false)
    }
  }

  useEffect(() => {
    if (script) {
      setLocalContent(script.content)
      setSources(script.sources || [])
    }
  }, [script])

  const handleUpdateScript = async () => {
    console.log('handleUpdateScript called', { script, localContent })

    if (!script) {
      console.error('Cannot update: script is null')
      setError('Script not found')
      return
    }

    if (localContent === script.content) {
      console.log('No changes detected in script content')
      return
    }

    console.log('Updating script with new content...')
    setLoading(true)

    try {
      // Update the script content
      await updateScript(script.id, { content: localContent })
      console.log('Script update successful')

      // Important: Make sure to retain sources by explicitly updating local state
      // This ensures the UI shows the sources even after an update
      if (script.sources) {
        setSources(script.sources)
      }
    } catch (err: any) {
      console.error('Failed to update script:', err)
      setError(err.message || 'Failed to update script')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateScriptAndGenerateImages = async () => {
    if (localContent !== script?.content) {
      try {
        await handleUpdateScript()
      } catch (err) {
        console.error('Failed to update script before generating images:', err)
      }
    }

    if (!imagesData) {
      setIsRegeneratingImages(true)
      setIsGeneratingInitialImages(true)
      setError(null)

      try {
        const imagesResponse = await generateImages({
          content: localContent,
          style: selectedContentStyle,
        })
        setImagesData(imagesResponse)
      } catch (err: any) {
        setError('Failed to generate images')
        console.error('Error generating images:', err)
      } finally {
        setIsRegeneratingImages(false)
        setIsGeneratingInitialImages(false)
      }
    }
  }

  const handleProceedToImages = async () => {
    navigateToStep('images')
    handleUpdateScriptAndGenerateImages()
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
    setIsRegeneratingImages(true)
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
      setIsRegeneratingImages(false)
    }
  }

  // Handle saving all scripts and image reordering
  const handleSaveAllScripts = async (
    scripts: string[],
    imageUrls: string[]
  ) => {
    if (imagesData) {
      // Update imagesData with the new scripts and potentially reordered image URLs
      setImagesData({
        ...imagesData,
        scripts: scripts,
        image_urls: imageUrls,
      })
      return true
    }
    return false
  }

  // --- STEP NAVIGATION HANDLERS ---
  const handleNextStep = () => {
    if (step === 'script' && script) {
      navigateToStep('images')
      handleUpdateScriptAndGenerateImages()
    } else if (
      step === 'images' &&
      !isGeneratingInitialImages &&
      !isRegeneratingImages
    ) {
      navigateToStep('audio')
    } else if (step === 'audio') {
      handleProceedToVideo()
    } else if (step === 'videoGenerated') {
      handleProceedToSocialUpload()
    }
  }

  const handlePreviousStep = () => {
    if (step === 'images') {
      navigateToStep('script')
    } else if (step === 'audio') {
      navigateToStep('images')
    } else if (step === 'socialUpload') {
      navigateToStep('videoGenerated')
    }
  }

  // --- STEP 3: Audio Configuration Handlers ---
  const handleProceedToVideo = async () => {
    navigateToStep('videoGenerating')
    if (!script || !imagesData) return

    setLoading(true)
    setError(null)
    setJobProgress(null)
    setVideoUrl(null)

    try {
      const jobResponse = await startVideoGenerationJob({
        scriptId: script.id,
        imageUrls: imagesData.image_urls,
        scripts: imagesData.scripts,
        voice: audioVoice,
      })

      setCurrentJobId(jobResponse.jobId)

      const jobCompletionRef = { completed: false }

      const cleanup = subscribeToJobProgress(
        jobResponse.jobId,
        (progress) => {
          console.log(
            `Job progress update: ${progress.state} - ${progress.progress}%`
          )
          setJobProgress(progress)

          if (progress.state === 'completed' && !jobCompletionRef.completed) {
            console.log('Job completed, fetching video details')
            jobCompletionRef.completed = true

            fetchCompletedVideo(jobResponse.jobId)
              .then(() => {
                navigateToStep('videoGenerated')
              })
              .catch((err) => {
                console.error('Error fetching completed video:', err)
                setError('Failed to retrieve the generated video')
              })
          } else if (progress.state === 'failed') {
            setError(progress.error || 'Video generation failed')
            navigateToStep('audio')
          }
        },
        (error) => {
          console.error('SSE error:', error)
          setError('Connection error during video generation')
        }
      )

      sseCleanupRef.current = cleanup
    } catch (err) {
      console.error('Failed to start video generation:', err)
      setError('Failed to start video generation')
      navigateToStep('audio')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompletedVideo = async (jobId: string) => {
    if (!script || !imagesData) return

    try {
      const jobStatus = await getJobStatus(jobId)
      console.log('Job status:', jobStatus)

      if (jobStatus.state !== 'completed') {
        throw new Error('Job is not completed')
      }

      if (jobStatus.result && jobStatus.result.url) {
        console.log('Setting video URL from job result:', jobStatus.result.url)
        setVideoUrl(jobStatus.result.url)
        if (jobStatus.result.id) {
          setVideoId(jobStatus.result.id)
        }
        return jobStatus.result
      }

      console.log('Fetching video using script ID')
      const videoResponse = await getVideoByScriptId(script.id)

      if (!videoResponse || !videoResponse.url) {
        throw new Error('No video URL returned from server')
      }

      console.log('Setting video URL:', videoResponse.url)
      setVideoUrl(videoResponse.url)
      setVideoId(videoResponse.id)
      return videoResponse
    } catch (err) {
      console.error('Failed to fetch video for completed job:', err)
      setError('Failed to retrieve the completed video')
      throw err
    }
  }

  // --- Reset Flow Handler ---
  const handleReset = () => {
    if (sseCleanupRef.current) {
      sseCleanupRef.current()
      sseCleanupRef.current = null
    }

    setTitle('')
    setSelectedContentStyle('default')
    setSelectedLanguage('vi')
    setLocalContent('')
    setImagesData(null)
    setVideoUrl(null)
    setVideoId(null)
    setPreviewAudioUrl(null)
    setAudioVoice('alloy')
    navigateToStep('script')
    resetScriptState()
    setCurrentJobId(null)
    setJobProgress(null)
  }

  const handleProceedToSocialUpload = () => {
    navigateToStep('socialUpload')
  }

  const handleSkipSocialUpload = () => {
    handleReset()
    router.push('/media/videos')
  }

  const isNextDisabled = () => {
    if (step === 'script') {
      return !script
    }
    if (step === 'videoGenerated') {
      return !videoUrl
    }
    return false
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Video Flow
      </Typography>

      <ProgressTracker currentStep={step} />

      {error && (
        <Typography color="error" variant="body1" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper
        elevation={3}
        sx={{
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px',
        }}
      >
        <PageTransition
          isVisible={step === 'script'}
          direction={transitionDirection}
        >
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
            onReset={handleReset}
            isGeneratingScript={isGeneratingScript}
            sources={sources}
            includePersonalDescription={includePersonalDescription}
            setIncludePersonalDescription={setIncludePersonalDescription}
          />
        </PageTransition>

        <PageTransition
          isVisible={step === 'images'}
          direction={transitionDirection}
        >
          <ImagesStep
            imagesData={imagesData}
            onEditImageScript={handleEditImageScript}
            onRegenerateImages={handleRegenerateImages}
            onProceedToAudio={() => navigateToStep('audio')}
            isRegeneratingImages={isRegeneratingImages}
            isGeneratingInitialImages={isGeneratingInitialImages}
            onSaveAllScripts={handleSaveAllScripts}
          />
        </PageTransition>

        <PageTransition
          isVisible={step === 'audio'}
          direction={transitionDirection}
        >
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
        </PageTransition>

        <PageTransition
          isVisible={step === 'videoGenerating' || step === 'videoGenerated'}
          direction={transitionDirection}
        >
          <VideoPreviewStep
            videoUrl={videoUrl}
            onReset={handleReset}
            jobProgress={jobProgress}
            isGenerating={step === 'videoGenerating'}
          />
        </PageTransition>

        <PageTransition
          isVisible={step === 'socialUpload'}
          direction={transitionDirection}
        >
          <SocialUploadStep
            videoId={videoId}
            videoUrl={videoUrl}
            onSkip={handleSkipSocialUpload}
            onComplete={handleReset}
          />
        </PageTransition>
      </Paper>

      <StepNavigation
        currentStep={step}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
        disableNext={isNextDisabled()}
        nextLabel={
          step === 'videoGenerated'
            ? 'Upload to Social Media'
            : step === 'audio'
              ? 'Generate Video'
              : 'Next Step'
        }
        showNext={step !== 'socialUpload' && step !== 'videoGenerating'}
        showPrevious={
          step !== 'script' &&
          step !== 'videoGenerating' &&
          step !== 'socialUpload'
        }
        isGeneratingImages={isRegeneratingImages || isGeneratingInitialImages}
      />
    </Container>
  )
}
