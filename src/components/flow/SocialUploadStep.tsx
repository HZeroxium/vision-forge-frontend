// /src/components/flow/SocialUploadStep.tsx

'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  FormHelperText,
  Stack,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  YouTube,
  CloudUpload,
  Check,
  Close,
  Home,
  VideoLibrary,
  Add,
  Visibility,
} from '@mui/icons-material'
import { useYouTube } from '@hooks/useYouTube'
import { useRouter } from 'next/navigation'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

interface SocialUploadStepProps {
  videoId: string | null
  videoUrl: string | null
  onSkip: () => void
  onComplete: () => void
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`upload-tabpanel-${index}`}
      aria-labelledby={`upload-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const SocialUploadStep: React.FC<SocialUploadStepProps> = ({
  videoId,
  videoUrl,
  onSkip,
  onComplete,
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)

  // YouTube form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string>('')
  const [privacyStatus, setPrivacyStatus] = useState<
    'private' | 'public' | 'unlisted'
  >('private')

  // YouTube hook
  const {
    uploadVideo,
    uploadProgress,
    uploading,
    uploadSuccess,
    uploadError,
    youtubeUrl,
    publishingHistoryId,
    clearErrors,
    resetUploadState, // Add this function from the hook
  } = useYouTube()

  // Pre-fill form with default values
  useEffect(() => {
    setTitle(`Vision Forge AI Video`)
    setDescription('Generated with Vision Forge AI - https://visionforge.ai')
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleYoutubeUpload = async () => {
    if (!videoId) {
      console.error('No video ID available for upload')
      return
    }

    try {
      clearErrors()

      await uploadVideo({
        videoId,
        title,
        description,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        privacyStatus,
      })

      // Success is handled by the uploadSuccess state in the YouTube hook
    } catch (error) {
      console.error('Error uploading to YouTube:', error)
      // Error is handled by the uploadError state in the YouTube hook
    }
  }

  const viewOnYoutube = () => {
    if (youtubeUrl) {
      window.open(youtubeUrl, '_blank')
    }
  }

  // Navigation handlers
  const goToHomePage = () => {
    router.push('/')
  }

  const goToVideoDetails = () => {
    if (videoId) {
      router.push(`/media/videos/${videoId}`)
    }
  }

  const goToVideoLibrary = () => {
    router.push('/media/videos')
  }

  const startNewVideo = () => {
    // Reset YouTube upload state before starting a new video
    resetUploadState() // Reset the YouTube upload state
    onComplete()
    router.push('/flow/generate-video')
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center">
        Share Your Video
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        align="center"
        sx={{ mb: 4 }}
      >
        Your video has been successfully created! Would you like to share it on
        social media?
      </Typography>

      {!videoUrl ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'black',
                mb: 2,
              }}
            >
              <video
                src={videoUrl}
                controls
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Paper>
          </Box>

          <Paper sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                variant="fullWidth"
              >
                <Tab
                  icon={<YouTube />}
                  iconPosition="start"
                  label="YouTube"
                  sx={{ borderRadius: '8px 0 0 0' }}
                />
                {/* Add more tabs for other social platforms here */}
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 2 }}>
                {uploadError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {uploadError}
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Video successfully uploaded to YouTube!
                  </Alert>
                )}

                {!uploadSuccess ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleYoutubeUpload()
                    }}
                  >
                    <Stack spacing={3}>
                      <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        disabled={uploading || uploadSuccess}
                      />

                      <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={uploading || uploadSuccess}
                      />

                      <TextField
                        label="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        fullWidth
                        helperText="E.g. ai, video, vision-forge"
                        disabled={uploading || uploadSuccess}
                      />

                      <FormControl
                        fullWidth
                        disabled={uploading || uploadSuccess}
                      >
                        <InputLabel id="privacy-label">
                          Privacy Setting
                        </InputLabel>
                        <Select
                          labelId="privacy-label"
                          value={privacyStatus}
                          onChange={(e) =>
                            setPrivacyStatus(
                              e.target.value as
                                | 'private'
                                | 'public'
                                | 'unlisted'
                            )
                          }
                          label="Privacy Setting"
                        >
                          <MenuItem value="private">Private</MenuItem>
                          <MenuItem value="unlisted">Unlisted</MenuItem>
                          <MenuItem value="public">Public</MenuItem>
                        </Select>
                        <FormHelperText>
                          Who can view your video on YouTube
                        </FormHelperText>
                      </FormControl>

                      {uploading && (
                        <Box sx={{ width: '100%', mb: 1 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Uploading: {uploadProgress}%
                          </Typography>
                          <Box
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: 'grey.200',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                height: '100%',
                                width: `${uploadProgress}%`,
                                bgcolor: 'secondary.main',
                                borderRadius: 5,
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </Box>
                        </Box>
                      )}
                    </Stack>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 4,
                      }}
                    >
                      <MotionButton
                        variant="outlined"
                        color="primary"
                        onClick={onSkip}
                        startIcon={<Close />}
                        disabled={uploading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Skip
                      </MotionButton>

                      <MotionButton
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={uploading || !title || !videoId}
                        startIcon={
                          uploading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <CloudUpload />
                          )
                        }
                        whileHover={{ scale: !uploading ? 1.03 : 1 }}
                        whileTap={{ scale: !uploading ? 0.97 : 1 }}
                      >
                        {uploading ? 'Uploading...' : 'Upload to YouTube'}
                      </MotionButton>
                    </Box>
                  </form>
                ) : (
                  <Box>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        WHAT'S NEXT?
                      </Typography>
                    </Divider>

                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <MotionButton
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={viewOnYoutube}
                                startIcon={<YouTube />}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                sx={{ mb: 2 }}
                              >
                                View on YouTube
                              </MotionButton>

                              <MotionButton
                                fullWidth
                                variant="outlined"
                                onClick={goToVideoDetails}
                                startIcon={<Visibility />}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                View Video Details
                              </MotionButton>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <MotionButton
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={startNewVideo}
                                startIcon={<Add />}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                sx={{ mb: 2 }}
                              >
                                Create New Video
                              </MotionButton>

                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <MotionButton
                                  variant="outlined"
                                  color="inherit"
                                  onClick={goToHomePage}
                                  startIcon={<Home />}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  sx={{ flexGrow: 1 }}
                                >
                                  Home
                                </MotionButton>
                                <MotionButton
                                  variant="outlined"
                                  color="inherit"
                                  onClick={goToVideoLibrary}
                                  startIcon={<VideoLibrary />}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  sx={{ flexGrow: 1 }}
                                >
                                  Library
                                </MotionButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Don't want to share now? You can always upload your videos later
              from your video library.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  )
}

export default SocialUploadStep
