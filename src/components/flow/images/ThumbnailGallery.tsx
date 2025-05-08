// src/components/flow/images/ThumbnailGallery.tsx
'use client'
import React from 'react'
import { Box, useTheme } from '@mui/material'
import LoadingIndicator from '../../common/LoadingIndicator'

interface ThumbnailGalleryProps {
  imageUrls: string[]
  currentImageIndex: number
  isRegeneratingImages: boolean
  loadingImages: boolean[]
  onThumbnailClick: (index: number) => void
}

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({
  imageUrls,
  currentImageIndex,
  isRegeneratingImages,
  loadingImages,
  onThumbnailClick,
}) => {
  const theme = useTheme()

  return (
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
      {imageUrls.map((url, index) => (
        <Box
          key={index}
          onClick={() => onThumbnailClick(index)}
          sx={{
            width: 80,
            height: 80,
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
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
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
  )
}

export default ThumbnailGallery
