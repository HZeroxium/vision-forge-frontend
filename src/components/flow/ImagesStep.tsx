// src/components/flow/ImagesStep.tsx
'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Fade,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import RefreshIcon from '@mui/icons-material/Refresh'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EditIcon from '@mui/icons-material/Edit'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface ImagesStepProps {
  imagesData: { image_urls: string[]; scripts: string[] }
  onEditImageScript: (index: number, newScript: string) => void
  onRegenerateImages: () => Promise<void>
  onProceedToAudio: () => void
}

const ImagesStep: React.FC<ImagesStepProps> = ({
  imagesData,
  onEditImageScript,
  onRegenerateImages,
  onProceedToAudio,
}) => {
  const theme = useTheme()
  const [editedScripts, setEditedScripts] = useState<boolean[]>(
    Array(imagesData.scripts.length).fill(false)
  )
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleScriptChange = (index: number, newScript: string) => {
    onEditImageScript(index, newScript)
    const newEditedScripts = [...editedScripts]
    newEditedScripts[index] = true
    setEditedScripts(newEditedScripts)
  }

  const handleSaveAllChanges = () => {
    setShowSaveNotification(true)
    setEditedScripts(Array(imagesData.scripts.length).fill(false))
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagesData.image_urls.length - 1 : prevIndex - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagesData.image_urls.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Generated Images & Scripts
        </Typography>
        <Chip
          label={`${currentImageIndex + 1}/${imagesData.image_urls.length}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Edit the scripts below to customize each image's narration. Your changes
        will be used when generating the final video.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Main Carousel */}
      <Box sx={{ position: 'relative' }}>
        <Paper
          elevation={isFullscreen ? 24 : 3}
          sx={{
            p: 2,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: isFullscreen ? 'scale(1.05)' : 'scale(1)',
            zIndex: isFullscreen ? 10 : 1,
          }}
        >
          <Fade in={true} timeout={500}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: isFullscreen
                  ? 'column'
                  : { xs: 'column', md: 'row' },
                overflow: 'hidden',
                minHeight: 500,
                position: 'relative',
              }}
            >
              <CardMedia
                component="img"
                image={imagesData.image_urls[currentImageIndex]}
                alt={`Generated ${currentImageIndex + 1}`}
                sx={{
                  height: isFullscreen ? 500 : 350,
                  objectFit: 'cover',
                  width: isFullscreen ? '100%' : { xs: '100%', md: '60%' },
                  transition: 'all 0.3s ease',
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>

              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  width: isFullscreen ? '100%' : { xs: '100%', md: '40%' },
                  p: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EditIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Script for Image {currentImageIndex + 1}
                  </Typography>
                </Box>

                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  value={imagesData.scripts[currentImageIndex]}
                  onChange={(e) =>
                    handleScriptChange(currentImageIndex, e.target.value)
                  }
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderColor: editedScripts[currentImageIndex]
                        ? theme.palette.primary.main
                        : 'inherit',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.light,
                      },
                      '&.Mui-focused': {
                        boxShadow: `0 0 8px ${theme.palette.primary.light}`,
                      },
                    },
                  }}
                />

                {editedScripts[currentImageIndex] && (
                  <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <CheckCircleIcon
                      color="primary"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="primary.main"
                      fontWeight="medium"
                    >
                      Changes will be saved automatically
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>
        </Paper>

        {/* Navigation Controls */}
        <IconButton
          sx={{
            position: 'absolute',
            left: { xs: 15, md: 10 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.7)',
            '&:hover': { backgroundColor: 'white', boxShadow: 2 },
          }}
          onClick={handlePrevImage}
        >
          <ChevronLeftIcon fontSize="large" />
        </IconButton>

        <IconButton
          sx={{
            position: 'absolute',
            right: { xs: 15, md: 10 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.7)',
            '&:hover': { backgroundColor: 'white', boxShadow: 2 },
          }}
          onClick={handleNextImage}
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Thumbnails */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          mt: 2,
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[300],
            borderRadius: 3,
          },
        }}
      >
        {imagesData.image_urls.map((url, index) => (
          <Box
            key={index}
            onClick={() => handleThumbnailClick(index)}
            sx={{
              width: 80,
              height: 60,
              flexShrink: 0,
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 1,
              cursor: 'pointer',
              border:
                currentImageIndex === index
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
              opacity: currentImageIndex === index ? 1 : 0.7,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                opacity: 1,
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2} mt={2} flexWrap="wrap">
        <Tooltip title="Generate a new set of images from your script">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRegenerateImages}
            sx={{
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 1,
              },
            }}
          >
            Regenerate Images
          </Button>
        </Tooltip>

        <Tooltip title="Save all your script edits">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveAllChanges}
            disabled={!editedScripts.some((edited) => edited)}
            sx={{
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 1,
              },
            }}
          >
            Save All Changes
          </Button>
        </Tooltip>

        <Button
          variant="contained"
          color="primary"
          endIcon={<NavigateNextIcon />}
          onClick={onProceedToAudio}
          sx={{
            ml: { xs: 0, sm: 'auto' },
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
          }}
        >
          Continue to Audio
        </Button>
      </Box>

      <Snackbar
        open={showSaveNotification}
        autoHideDuration={3000}
        onClose={() => setShowSaveNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
          onClose={() => setShowSaveNotification(false)}
          sx={{ width: '100%' }}
        >
          Your script changes have been saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ImagesStep
