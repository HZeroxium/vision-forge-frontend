// /src/app/media/videos/uploadYoutube/[id]/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  FormHelperText,
} from '@mui/material'
import { YouTube, ArrowBack, CloudUpload } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { fetchVideo } from '@services/videoService'
import { useYouTube } from '@hooks/useYouTube'
import type { Video } from '@services/videoService'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionButton = motion(Button)

export default function UploadYoutubePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  // Video state
  const [video, setVideo] = useState<Video | null>(null)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState<string | null>(null)

  // Form state
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
    resetUploadState,
  } = useYouTube()

  // Load video data when component mounts
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setVideoLoading(true)
        const videoData = await fetchVideo(id)
        setVideo(videoData)

        // Pre-fill form with video data
        setTitle(videoData.title || `Video ${videoData.id}`)
        setDescription(
          videoData.description || 'Generated with Vision Forge AI'
        )
        setVideoError(null)
      } catch (error: any) {
        setVideoError(error?.message || 'Failed to load video')
        console.error('Error loading video:', error)
      } finally {
        setVideoLoading(false)
      }
    }

    if (id) {
      loadVideo()
    }
  }, [id])

  // Reset YouTube upload state when component unmounts
  useEffect(() => {
    return () => {
      // This cleanup function runs when component unmounts
      resetUploadState()
    }
  }, [resetUploadState])

  const handleUpload = async () => {
    if (!video) return

    try {
      // Clear any previous errors
      clearErrors()

      await uploadVideo({
        videoId: id,
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

  const handleBack = () => {
    router.push(`/media/videos/${id}`)
  }

  const viewOnYoutube = () => {
    if (youtubeUrl) {
      window.open(youtubeUrl, '_blank')
    }
  }

  if (videoLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress color="secondary" />
          <Typography>Loading video...</Typography>
        </Box>
      </Container>
    )
  }

  if (videoError) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {videoError}
        </Alert>
        <Button variant="contained" onClick={handleBack}>
          Back to Video Details
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <MotionButton
            variant="contained"
            color="secondary"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ borderRadius: 2, textTransform: 'none', mr: 2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </MotionButton>

          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Upload to YouTube
          </Typography>

          <YouTube fontSize="large" color="error" />
        </Box>

        <MotionPaper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'black',
              }}
            >
              {video && (
                <video
                  src={video.url}
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
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            YouTube Details
          </Typography>

          {/* Display alerts */}
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}

          {uploadSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Video successfully uploaded to YouTube!
            </Alert>
          )}

          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            onSubmit={(e) => {
              e.preventDefault()
              handleUpload()
            }}
          >
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
              rows={4}
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

            <FormControl fullWidth disabled={uploading || uploadSuccess}>
              <InputLabel id="privacy-label">Privacy Setting</InputLabel>
              <Select
                labelId="privacy-label"
                value={privacyStatus}
                onChange={(e) =>
                  setPrivacyStatus(
                    e.target.value as 'private' | 'public' | 'unlisted'
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

            {/* Upload progress */}
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

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              {uploadSuccess ? (
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <MotionButton
                    variant="contained"
                    color="primary"
                    onClick={viewOnYoutube}
                    fullWidth
                    startIcon={<YouTube />}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View on YouTube
                  </MotionButton>
                  <MotionButton
                    variant="outlined"
                    onClick={handleBack}
                    fullWidth
                    startIcon={<ArrowBack />}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Back to Video
                  </MotionButton>
                </Box>
              ) : (
                <>
                  <MotionButton
                    variant="contained"
                    color="error"
                    type="submit"
                    disabled={uploading || !title}
                    fullWidth
                    startIcon={uploading ? undefined : <CloudUpload />}
                    whileHover={{ scale: !uploading ? 1.03 : 1 }}
                    whileTap={{ scale: !uploading ? 0.97 : 1 }}
                  >
                    {uploading ? (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <CircularProgress size={20} color="inherit" />
                        <span>Uploading...</span>
                      </Box>
                    ) : (
                      'Upload to YouTube'
                    )}
                  </MotionButton>
                  <MotionButton
                    variant="outlined"
                    onClick={handleBack}
                    disabled={uploading}
                    whileHover={{ scale: !uploading ? 1.03 : 1 }}
                    whileTap={{ scale: !uploading ? 0.97 : 1 }}
                  >
                    Cancel
                  </MotionButton>
                </>
              )}
            </Box>
          </Box>
        </MotionPaper>
      </MotionBox>
    </Container>
  )
}
