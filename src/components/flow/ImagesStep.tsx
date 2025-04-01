// src/components/flow/ImagesStep.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react'
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
  onSaveAllScripts?: (scripts: string[]) => Promise<boolean>
}

const ImagesStep: React.FC<ImagesStepProps> = ({
  imagesData,
  onEditImageScript,
  onRegenerateImages,
  onProceedToAudio,
  isRegeneratingImages = false,
  isGeneratingInitialImages = false,
  onSaveAllScripts,
}) => {
  // Store the original scripts to detect changes
  const [originalScripts, setOriginalScripts] = useState<string[]>([])
  const [currentScripts, setCurrentScripts] = useState<string[]>([])

  // Removed editedScripts state and use a computed value instead
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loadingImages, setLoadingImages] = useState<boolean[]>([])
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Initialize state when imagesData changes (like when first loading or regenerating)
  useEffect(() => {
    if (imagesData) {
      // Only reset scripts when imagesData is first loaded or regenerated
      if (
        originalScripts.length === 0 ||
        imagesData.scripts.length !== originalScripts.length
      ) {
        setOriginalScripts([...imagesData.scripts])
        setCurrentScripts([...imagesData.scripts])
      }
      setLoadingImages(Array(imagesData.image_urls.length).fill(false))
    }
  }, [imagesData, originalScripts.length])

  useEffect(() => {
    if (imagesData && currentImageIndex >= imagesData.image_urls.length) {
      setCurrentImageIndex(0)
    }
  }, [imagesData, currentImageIndex])

  // Compute which scripts have been edited by comparing original to current
  const editedScripts = currentScripts.map(
    (script, index) => originalScripts[index] !== script
  )

  // Determine if any scripts have been edited
  const hasEditedScripts = editedScripts.some((edited) => edited)

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
    // Call parent handler to update script in parent component
    onEditImageScript(index, newScript)

    // Update our local state to track current scripts
    const updatedScripts = [...currentScripts]
    updatedScripts[index] = newScript
    setCurrentScripts(updatedScripts)

    // Clear any previous save errors
    if (saveError) {
      setSaveError(null)
    }
  }

  const handleSaveAllChanges = async () => {
    // Don't try to save if no changes or already saving
    if (!hasEditedScripts || isSaving) {
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // If the parent component provided a save function, use it
      if (onSaveAllScripts) {
        const success = await onSaveAllScripts(currentScripts)

        if (success) {
          // After successful save, update original scripts to match current
          setOriginalScripts([...currentScripts])
          setShowSaveNotification(true)
        } else {
          setSaveError('Failed to save script changes')
        }
      } else {
        // No save function provided, just update original scripts
        setOriginalScripts([...currentScripts])
        setShowSaveNotification(true)
      }
    } catch (error) {
      console.error('Error saving scripts:', error)
      setSaveError(
        typeof error === 'string' ? error : 'Failed to save script changes'
      )
    } finally {
      setIsSaving(false)
    }
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
    // If there are unsaved changes, save them before proceeding
    if (hasEditedScripts) {
      handleSaveAllChanges()
    }

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
          script={currentScripts[currentImageIndex] || ''}
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
        hasEditedScripts={hasEditedScripts}
        isRegeneratingImages={isRegeneratingImages}
        isGeneratingInitialImages={isGeneratingInitialImages}
        isSaving={isSaving}
        onRegenerateImages={handleRegenerateImagesClick}
        onSaveAllChanges={handleSaveAllChanges}
        onProceedToAudio={handleProceedClick}
      />

      <Notifications
        showSaveNotification={showSaveNotification}
        showIncompleteAlert={showIncompleteAlert}
        saveError={saveError}
        onCloseSaveNotification={() => setShowSaveNotification(false)}
        onCloseIncompleteAlert={() => setShowIncompleteAlert(false)}
        onCloseSaveError={() => setSaveError(null)}
      />
    </Box>
  )
}

export default ImagesStep
