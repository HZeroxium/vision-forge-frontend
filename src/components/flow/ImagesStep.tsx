// src/components/flow/ImagesStep.tsx
'use client'
import React, { useState, useEffect } from 'react'
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
  CircularProgress,
  Skeleton,
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
import LoadingIndicator from '../common/LoadingIndicator'
import ImageSkeleton from '../common/ImageSkeleton'

interface ImagesStepProps {
  imagesData: { image_urls: string[]; scripts: string[] } | null
  onEditImageScript: (index: number, newScript: string) => void
  onRegenerateImages: () => Promise<void>
  onProceedToAudio: () => void
  isRegeneratingImages?: boolean
}

const ImagesStep: React.FC<ImagesStepProps> = ({
  imagesData,
  onEditImageScript,
  onRegenerateImages,
  onProceedToAudio,
  isRegeneratingImages = false,
}) => {
  const theme = useTheme()

  // State quản lý
  const [editedScripts, setEditedScripts] = useState<boolean[]>([])
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loadingImages, setLoadingImages] = useState<boolean[]>([])

  // QUAN TRỌNG: useEffect PHẢI được khai báo trước bất kỳ câu lệnh return nào
  useEffect(() => {
    if (imagesData) {
      // Trạng thái scripts
      setEditedScripts(Array(imagesData.scripts.length).fill(false))

      // Reset currentImageIndex nếu vượt quá số lượng ảnh mới
      if (currentImageIndex >= imagesData.image_urls.length) {
        setCurrentImageIndex(0)
      }

      // Reset trạng thái loading của tất cả ảnh
      setLoadingImages(Array(imagesData.image_urls.length).fill(false))
    }
  }, [imagesData, currentImageIndex]) // Thêm currentImageIndex vào dependencies

  // BÂY GIỜ đặt câu lệnh return
  if (!imagesData) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        gap={3}
      >
        <LoadingIndicator
          isLoading={true}
          message="Generating images from your script. This may take a moment."
          size={60}
        />
      </Box>
    )
  }

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

  const handleImageLoad = (index: number) => {
    const newLoadingImages = [...loadingImages]
    newLoadingImages[index] = false
    setLoadingImages(newLoadingImages)
  }

  const handleRegenerateImagesClick = async () => {
    // Set all images to loading state
    setLoadingImages(Array(imagesData.image_urls.length).fill(true))
    await onRegenerateImages()
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
              {isRegeneratingImages || loadingImages[currentImageIndex] ? (
                <ImageSkeleton
                  height={isFullscreen ? 500 : 350}
                  width={isFullscreen ? '100%' : { xs: '100%', md: '60%' }}
                />
              ) : (
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
                  onLoad={() => handleImageLoad(currentImageIndex)}
                />
              )}
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
                disabled={isRegeneratingImages}
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
                  disabled={isRegeneratingImages}
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
          disabled={isRegeneratingImages}
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
          disabled={isRegeneratingImages}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage:
                isRegeneratingImages || loadingImages[index]
                  ? 'none'
                  : `url(${url})`,
              backgroundColor:
                isRegeneratingImages || loadingImages[index]
                  ? theme.palette.grey[200]
                  : 'transparent',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 1,
              cursor: isRegeneratingImages ? 'default' : 'pointer',
              border:
                currentImageIndex === index
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
              opacity: currentImageIndex === index ? 1 : 0.7,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                opacity: isRegeneratingImages ? 0.7 : 1,
                transform: isRegeneratingImages ? 'none' : 'scale(1.05)',
              },
            }}
          >
            {(isRegeneratingImages || loadingImages[index]) && (
              <LoadingIndicator isLoading={true} size={20} showAfterDelay={0} />
            )}
          </Box>
        ))}
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2} mt={2} flexWrap="wrap">
        <Tooltip title="Generate a new set of images from your script">
          <Button
            variant="outlined"
            startIcon={
              isRegeneratingImages ? (
                <LoadingIndicator
                  isLoading={true}
                  size={20}
                  showAfterDelay={0}
                />
              ) : (
                <RefreshIcon />
              )
            }
            onClick={handleRegenerateImagesClick}
            disabled={isRegeneratingImages}
            sx={{
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 1,
              },
            }}
          >
            {isRegeneratingImages ? 'Regenerating...' : 'Regenerate Images'}
          </Button>
        </Tooltip>

        <Tooltip title="Save all your script edits">
          {!editedScripts.some((edited) => edited) || isRegeneratingImages ? (
            <span>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveAllChanges}
                disabled={true}
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
            </span>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveAllChanges}
              disabled={false}
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
          )}
        </Tooltip>

        <Button
          variant="contained"
          color="primary"
          endIcon={<NavigateNextIcon />}
          onClick={onProceedToAudio}
          disabled={isRegeneratingImages}
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
