// src/app/flow/generate-video/page.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import ScriptStep from '@components/flow/ScriptStep'
import ImagesStep from '@components/flow/ImagesStep'
import AudioPreviewConfig from '@components/flow/AudioPreviewConfig'
import VideoPreviewStep from '@components/flow/VideoPreviewStep'
import ProgressTracker from '@components/flow/ProgressTracker'
import StepNavigation from '@components/flow/StepNavigation'
import PageTransition from '@components/flow/PageTransition'
import LoadingIndicator from '@components/common/LoadingIndicator'
import { useScripts } from '@hooks/useScripts'
import {
  generateImages,
  generateVideoFlow,
  startVideoGenerationJob,
  getPreviewVoiceUrl,
  getVideoById,
  AudioPreview,
} from '@services/flowService'
import {
  subscribeToJobProgress,
  pollJobProgress,
  JobProgress,
} from '@utils/sse'

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
  const [previousStep, setPreviousStep] = useState<Step | null>(null)
  const [transitionDirection, setTransitionDirection] = useState<
    'right' | 'left'
  >('right')

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

  // Add isGeneratingScript state
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [isRegeneratingImages, setIsRegeneratingImages] = useState(false)

  // Add new state for job tracking
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [jobProgress, setJobProgress] = useState<JobProgress | null>(null)
  const sseCleanupRef = useRef<(() => void) | null>(null)

  // Cleanup SSE connection when component unmounts
  useEffect(() => {
    return () => {
      if (sseCleanupRef.current) {
        sseCleanupRef.current()
      }
    }
  }, [])

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
      await createScript({ title, style: selectedContentStyle })
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
      await updateScript(script.id, { content: localContent })
      console.log('Script update successful')
      // Loại bỏ dòng return result
    } catch (err: any) {
      console.error('Failed to update script:', err)
      setError(err.message || 'Failed to update script')
      throw err // Vẫn giữ throw err để có thể bắt lỗi
    } finally {
      setLoading(false)
    }
  }

  // Tách logic cập nhật script và tạo ảnh thành hàm riêng
  const handleUpdateScriptAndGenerateImages = async () => {
    if (localContent !== script?.content) {
      try {
        await handleUpdateScript()
      } catch (err) {
        console.error('Failed to update script before generating images:', err)
        // Tiếp tục tạo ảnh ngay cả khi cập nhật script thất bại
      }
    }

    // Chỉ tạo hình ảnh nếu chưa có
    if (!imagesData) {
      setIsRegeneratingImages(true) // Hiển thị trạng thái loading trong ImagesStep
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
      }
    }
  }

  // Giữ lại handleProceedToImages nhưng sửa lại để gọi hàm mới
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

  // --- STEP NAVIGATION HANDLERS ---
  const handleNextStep = () => {
    if (step === 'script' && script) {
      // Ngay lập tức chuyển sang bước Images
      navigateToStep('images')

      // Sau đó bắt đầu quá trình cập nhật script và tạo hình ảnh
      handleUpdateScriptAndGenerateImages()
    } else if (step === 'images') {
      navigateToStep('audio')
    } else if (step === 'audio') {
      handleProceedToVideo()
    }
  }

  const handlePreviousStep = () => {
    if (step === 'images') {
      navigateToStep('script')
    } else if (step === 'audio') {
      navigateToStep('images')
    }
  }

  // --- STEP 3: Audio Configuration Handlers ---
  const handleProceedToVideo = async () => {
    navigateToStep('videoGenerating')
    // Start video generation and show spinner immediately.
    if (!script || !imagesData) return

    setLoading(true)
    setError(null)
    setJobProgress(null)

    try {
      // Use the job-based approach instead of the synchronous one
      const jobResponse = await startVideoGenerationJob({
        scriptId: script.id,
        imageUrls: imagesData.image_urls,
        scripts: imagesData.scripts,
      })

      // Set the current job ID to track
      setCurrentJobId(jobResponse.jobId)

      // Start listening for SSE updates on this job
      const cleanup = subscribeToJobProgress(
        jobResponse.jobId,
        (progress) => {
          setJobProgress(progress)

          // When the job is complete, update the videoUrl
          if (progress.state === 'completed') {
            fetchVideoUrl(jobResponse.scriptId)
          } else if (progress.state === 'failed') {
            setError(
              'Video generation failed: ' + (progress.error || 'Unknown error')
            )
            navigateToStep('videoGenerated')
          }
        },
        (error) => {
          console.error('SSE error:', error)
          setError(
            'Failed to track video generation progress. Using fallback...'
          )

          // Fall back to polling if SSE fails
          sseCleanupRef.current = pollJobProgress(
            jobResponse.jobId,
            setJobProgress,
            (pollError) => {
              setError('Video generation tracking failed: ' + pollError)
              navigateToStep('audio')
            }
          )
        }
      )

      sseCleanupRef.current = cleanup

      // Move to the video generated step - progress will be shown there
      navigateToStep('videoGenerated')
    } catch (err: any) {
      console.error('Failed to start video generation:', err)
      setError('Failed to start video generation')
      navigateToStep('audio') // go back to audio step if video generation fails
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch the final video URL when job is complete
  const fetchVideoUrl = async (scriptId: string) => {
    try {
      // In a real implementation, the backend should return the videoId from the job
      // For now, we'll use the script ID to find the video
      const videoResponse = await generateVideoFlow({
        scriptId,
        imageUrls: imagesData!.image_urls,
        scripts: imagesData!.scripts,
      })

      setVideoUrl(videoResponse.url)
    } catch (err) {
      console.error('Failed to get final video URL:', err)
      setError('Failed to retrieve the generated video')
    }
  }

  // --- Reset Flow Handler ---
  const handleReset = () => {
    // Clean up any existing SSE connection
    if (sseCleanupRef.current) {
      sseCleanupRef.current()
      sseCleanupRef.current = null
    }

    setTitle('')
    setSelectedContentStyle('default')
    setSelectedLanguage('en')
    setLocalContent('')
    setImagesData(null)
    setVideoUrl(null)
    setPreviewAudioUrl(null)
    setAudioVoice('alloy') // Reset to default voice
    navigateToStep('script')
    resetScriptState()
    setCurrentJobId(null)
    setJobProgress(null)
  }

  // Determine if Next button should be disabled
  const isNextDisabled = () => {
    if (step === 'script') {
      return !script // Disable if no script exists
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

      {/* {loading && (
        <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
          <LoadingIndicator isLoading={false} size={24} />
        </Box>
      )} */}

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
      </Paper>

      <StepNavigation
        currentStep={step}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
        disableNext={isNextDisabled()}
        nextLabel={step === 'audio' ? 'Generate Video' : 'Next Step'}
      />
    </Container>
  )
}
