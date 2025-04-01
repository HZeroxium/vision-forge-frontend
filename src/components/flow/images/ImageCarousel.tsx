// src/components/flow/images/ImageCarousel.tsx
'use client'
import React from 'react'
import {
  Box,
  Paper,
  IconButton,
  Card,
  CardMedia,
  useTheme,
  Fade,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import ImageSkeleton from '../../common/ImageSkeleton'

interface ImageCarouselProps {
  currentImageIndex: number
  imageUrls: string[]
  isFullscreen: boolean
  isRegeneratingImages: boolean
  loadingImages: boolean[]
  onPrevImage: () => void
  onNextImage: () => void
  onToggleFullscreen: () => void
  onImageLoad: (index: number) => void
  children: React.ReactNode
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  currentImageIndex,
  imageUrls,
  isFullscreen,
  isRegeneratingImages,
  loadingImages,
  onPrevImage,
  onNextImage,
  onToggleFullscreen,
  onImageLoad,
  children,
}) => {
  const theme = useTheme()

  return (
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
                image={imageUrls[currentImageIndex]}
                alt={`Generated ${currentImageIndex + 1}`}
                sx={{
                  height: isFullscreen ? 500 : 350,
                  objectFit: 'cover',
                  width: isFullscreen ? '100%' : { xs: '100%', md: '60%' },
                  transition: 'all 0.3s ease',
                }}
                onLoad={() => onImageLoad(currentImageIndex)}
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
              onClick={onToggleFullscreen}
              disabled={isRegeneratingImages}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>

            {children}
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
        onClick={onPrevImage}
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
        onClick={onNextImage}
        disabled={isRegeneratingImages}
      >
        <ChevronRightIcon fontSize="large" />
      </IconButton>
    </Box>
  )
}

export default ImageCarousel
