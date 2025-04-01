// src/components/flow/ImagesStep.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { Box, Typography, Chip, Divider } from '@mui/material'
import LoadingIndicator from '../common/LoadingIndicator'

// Import extracted components
import ImageCarousel from './images/ImageCarousel'
import ScriptEditor from './images/ScriptEditor'
import ThumbnailGallery from './images/ThumbnailGallery'
import ActionButtons from './images/ActionButtons'
import Notifications from './images/Notifications'

interface ImagesStepProps {
  imagesData: { image_urls: string[]; scripts: string[] } | null
  onEditImageScript: (index: number, newScript: string) => void
  onRegenerateImages: () => Promise<void>
  onProceedToAudio: () => void
  isRegeneratingImages?: boolean
  isGeneratingInitialImages?: boolean
}

const ImagesStep: React.FC<ImagesStepProps> = ({
  imagesData,
  onEditImageScript,
  onRegenerateImages,
  onProceedToAudio,
  isRegeneratingImages = false,
  isGeneratingInitialImages = false,
}) => {
  const [editedScripts, setEditedScripts] = useState<boolean[]>([])
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loadingImages, setLoadingImages] = useState<boolean[]>([])
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false)

  useEffect(() => {
    if (imagesData) {
      setEditedScripts(Array(imagesData.scripts.length).fill(false))
      setLoadingImages(Array(imagesData.image_urls.length).fill(false))
    }
  }, [imagesData])

  useEffect(() => {
    if (imagesData && currentImageIndex >= imagesData.image_urls.length) {
      setCurrentImageIndex(0)
    }
  }, [imagesData, currentImageIndex])

  if (!imagesData || isGeneratingInitialImages) {
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
          message={
            isGeneratingInitialImages
              ? 'Generating images from your script. This may take a moment.'
              : 'Loading images...'
          }
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
    setLoadingImages(Array(imagesData.image_urls.length).fill(true))
    await onRegenerateImages()
  }

  const handleProceedClick = () => {
    if (isRegeneratingImages || isGeneratingInitialImages) {
      setShowIncompleteAlert(true)
    } else {
      onProceedToAudio()
    }
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

      <ImageCarousel
        currentImageIndex={currentImageIndex}
        imageUrls={imagesData.image_urls}
        isFullscreen={isFullscreen}
        isRegeneratingImages={isRegeneratingImages}
        loadingImages={loadingImages}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        onToggleFullscreen={toggleFullscreen}
        onImageLoad={handleImageLoad}
      >
        <ScriptEditor
          currentImageIndex={currentImageIndex}
          script={imagesData.scripts[currentImageIndex]}
          isEdited={editedScripts[currentImageIndex]}
          isFullscreen={isFullscreen}
          isRegeneratingImages={isRegeneratingImages}
          onScriptChange={handleScriptChange}
        />
      </ImageCarousel>

      <ThumbnailGallery
        imageUrls={imagesData.image_urls}
        currentImageIndex={currentImageIndex}
        isRegeneratingImages={isRegeneratingImages}
        loadingImages={loadingImages}
        onThumbnailClick={handleThumbnailClick}
      />

      <ActionButtons
        hasEditedScripts={editedScripts.some((edited) => edited)}
        isRegeneratingImages={isRegeneratingImages}
        isGeneratingInitialImages={isGeneratingInitialImages}
        onRegenerateImages={handleRegenerateImagesClick}
        onSaveAllChanges={handleSaveAllChanges}
        onProceedToAudio={handleProceedClick}
      />

      <Notifications
        showSaveNotification={showSaveNotification}
        showIncompleteAlert={showIncompleteAlert}
        onCloseSaveNotification={() => setShowSaveNotification(false)}
        onCloseIncompleteAlert={() => setShowIncompleteAlert(false)}
      />
    </Box>
  )
}

export default ImagesStep
