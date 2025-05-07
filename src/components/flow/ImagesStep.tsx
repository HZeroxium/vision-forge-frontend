// src/components/flow/ImagesStep.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { Box, Typography, Chip, Divider } from '@mui/material'
import LoadingIndicator from '../common/LoadingIndicator'
import { useStorage } from '@hooks/useStorage'
import { useImages } from '@hooks/useImages'

// Import types
import { Block } from './types/BlockTypes'

// Import extracted components
import ImageCarousel from './images/ImageCarousel'
import ScriptEditor from './images/ScriptEditor'
import ThumbnailGallery from './images/ThumbnailGallery'
import ActionButtons from './images/ActionButtons'
import Notifications from './images/Notifications'
import PromptDisplay from './images/PromptDisplay'
import ImageUploadDialog from './images/ImageUploadDialog'
import AddBlockDialog from './images/AddBlockDialog'
import CollapsibleBlockManager from './images/CollapsibleBlockManager'
import { FileType } from '@/services/storageService'

interface ImagesStepProps {
  imagesData: {
    image_urls: string[]
    scripts: string[]
    prompts?: string[]
  } | null
  onEditImageScript: (index: number, newScript: string) => void
  onRegenerateImages: () => Promise<void>
  onProceedToAudio: () => void
  isRegeneratingImages?: boolean
  isGeneratingInitialImages?: boolean
  onSaveAllScripts?: (
    scripts: string[],
    imageUrls: string[]
  ) => Promise<boolean>
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
  // Storage hook for uploading images
  const storage = useStorage()

  // Images hook for database operations
  const { createImage } = useImages()

  // State for blocks management
  const [blocks, setBlocks] = useState<Block[]>([])
  const [originalBlocks, setOriginalBlocks] = useState<Block[]>([])
  const [blocksReordered, setBlocksReordered] = useState<boolean>(false)
  const [originalScripts, setOriginalScripts] = useState<string[]>([])
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([])

  // UI state
  const [showPrompt, setShowPrompt] = useState<boolean>(false)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loadingImages, setLoadingImages] = useState<boolean[]>([])
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false)
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)

  // Image upload state
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  // Add block dialog state
  const [addBlockDialogOpen, setAddBlockDialogOpen] = useState<boolean>(false)

  // Changes tracking
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Initialize state when imagesData changes
  useEffect(() => {
    if (imagesData) {
      const isInitialLoad = blocks.length === 0
      const hasLengthChanged = blocks.length !== imagesData.image_urls.length

      if (isInitialLoad || hasLengthChanged || isRegeneratingImages) {
        // Create new blocks from imagesData
        const newBlocks: Block[] = imagesData.image_urls.map((url, index) => ({
          id: `block-${index}`,
          imageUrl: url,
          script: imagesData.scripts[index] || '',
          prompt: imagesData.prompts?.[index] || 'Generated image',
        }))

        setBlocks(newBlocks)
        setOriginalBlocks(JSON.parse(JSON.stringify(newBlocks)))

        // Store original data for comparison and restoration
        setOriginalScripts([...imagesData.scripts])
        setOriginalImageUrls([...imagesData.image_urls])

        // Initialize loading state for images
        setLoadingImages(Array(imagesData.image_urls.length).fill(false))

        // Reset reordering flag when loading new images
        setBlocksReordered(false)
      }
    }
  }, [imagesData, isRegeneratingImages])

  // Reset current image index if it's out of bounds
  useEffect(() => {
    if (blocks.length > 0 && currentImageIndex >= blocks.length) {
      setCurrentImageIndex(0)
    }
  }, [blocks, currentImageIndex])

  // Check which scripts have been edited compared to original
  const getEditedScripts = (): boolean[] => {
    return blocks.map((block, index) => {
      // Find matching block by array index for more reliable comparison
      const originalBlock = originalBlocks[index]
      if (!originalBlock) return true // New block is considered edited
      return originalBlock.script !== block.script
    })
  }

  // Determine if any scripts have been edited or blocks reordered
  const editedScripts = getEditedScripts()
  const hasEditedScripts =
    editedScripts.some((edited) => edited) ||
    blocksReordered ||
    blocks.length !== originalBlocks.length

  // Show loading state when generating initial images
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

  // Handle script changes
  const handleScriptChange = (index: number, newScript: string) => {
    // Update local state
    const newBlocks = [...blocks]
    newBlocks[index].script = newScript
    setBlocks(newBlocks)

    // Call parent handler to update script in parent component
    // We only notify parent of changes but we don't update our originalBlocks
    // This allows us to maintain knowledge of what's changed
    onEditImageScript(index, newScript)

    // Clear any previous save errors
    if (saveError) {
      setSaveError(null)
    }
  }

  // Handle saving all changes
  const handleSaveAllChanges = async () => {
    // Don't try to save if no changes or already saving
    if (!hasEditedScripts || isSaving) {
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // Extract current data in the proper order from blocks
      const currentScripts = blocks.map((block) => block.script)
      const currentImageUrls = blocks.map((block) => block.imageUrl)

      // If the parent component provided a save function, use it
      if (onSaveAllScripts) {
        const success = await onSaveAllScripts(currentScripts, currentImageUrls)

        if (success) {
          // After successful save, update original state to match current
          setOriginalBlocks(JSON.parse(JSON.stringify(blocks)))
          setOriginalScripts([...currentScripts])
          setOriginalImageUrls([...currentImageUrls])
          setBlocksReordered(false)
          setShowSaveNotification(true)
        } else {
          setSaveError('Failed to save script changes')
        }
      } else {
        // No save function provided, just update original state
        setOriginalBlocks(JSON.parse(JSON.stringify(blocks)))
        setOriginalScripts([...currentScripts])
        setOriginalImageUrls([...currentImageUrls])
        setBlocksReordered(false)
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

  // Navigation handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? blocks.length - 1 : prevIndex - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === blocks.length - 1 ? 0 : prevIndex + 1
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
    setLoadingImages(Array(blocks.length).fill(true))
    await onRegenerateImages()
  }

  // Block Management
  const handleReorderBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks)
    setBlocksReordered(true)
  }

  const handleDeleteBlock = (index: number) => {
    // Don't delete if it's the only block
    if (blocks.length <= 1) {
      return
    }

    const newBlocks = [...blocks]
    newBlocks.splice(index, 1)

    // Update current index if needed
    if (currentImageIndex >= newBlocks.length) {
      setCurrentImageIndex(Math.max(0, newBlocks.length - 1))
    }

    setBlocks(newBlocks)
    setBlocksReordered(true)
  }

  // Handle selecting an existing image
  const handleSelectExistingImage = (imageUrl: string) => {
    // Replace the image URL in the current block
    const newBlocks = [...blocks]
    newBlocks[currentImageIndex] = {
      ...newBlocks[currentImageIndex],
      imageUrl: imageUrl,
      isCustomImage: true,
    }

    setBlocks(newBlocks)
    setUploadDialogOpen(false)

    // Mark as edited
    setBlocksReordered(true)
  }

  // Enhanced upload handler that also adds the image to the database
  const handleUploadImage = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      // 1. Upload the file to storage
      const result = await storage.uploadFile(
        file,
        FileType.IMAGE,
        undefined,
        'images/user-uploads/',
        (progress) => setUploadProgress(progress)
      )

      // 2. Add the image to the database
      await createImage({
        prompt: blocks[currentImageIndex]?.prompt || 'Custom image',
        style: 'custom',
        url: result.url,
      })

      // 3. Replace the image URL in the current block
      const newBlocks = [...blocks]
      newBlocks[currentImageIndex] = {
        ...newBlocks[currentImageIndex],
        imageUrl: result.url,
        isCustomImage: true,
      }

      setBlocks(newBlocks)
      setUploadDialogOpen(false)
      setBlocksReordered(true)
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Enhanced add block handler that works with both new and existing images
  const handleAddBlock = async (
    script: string,
    prompt: string,
    file: File | null,
    existingImageUrl?: string
  ) => {
    let imageUrl = existingImageUrl || ''

    // If file is selected, upload it and add to database
    if (file) {
      setIsUploading(true)
      try {
        const result = await storage.uploadFile(
          file,
          FileType.IMAGE,
          undefined,
          'images/user-uploads/'
        )
        imageUrl = result.url

        // Add the image to the database
        await createImage({
          prompt: prompt || 'Custom image',
          style: 'custom',
          url: imageUrl,
        })
      } catch (error) {
        console.error('Error uploading image for new block:', error)
        setUploadError('Failed to upload image for new block.')
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    // Create new block
    const newBlock: Block = {
      id: `block-${Date.now()}`, // Unique ID
      imageUrl: imageUrl || '/placeholder-image.jpg', // Use uploaded image or placeholder
      script: script,
      prompt: prompt || 'Custom block',
      isCustomImage: !!file || !!existingImageUrl,
    }

    // Add to blocks
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)

    // Set the current index to the new block
    setCurrentImageIndex(newBlocks.length - 1)

    // Close dialog
    setAddBlockDialogOpen(false)

    // Mark as changed
    setBlocksReordered(true)
  }

  // Image Upload handlers
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true)
    setUploadProgress(0)
    setUploadError(null)
  }

  // Add Block Dialog handlers
  const handleOpenAddBlockDialog = () => {
    setAddBlockDialogOpen(true)
    setUploadError(null)
  }

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Generated Images & Scripts
        </Typography>
        <Chip
          label={`${currentImageIndex + 1}/${blocks.length}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Edit the scripts below to customize each image's narration. You can
        reorder blocks, upload your own images, or add new blocks.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Main Content Area - Now takes full width */}
      <Box>
        {/* Prompt Display */}
        <PromptDisplay
          prompt={blocks[currentImageIndex]?.prompt}
          showPrompt={showPrompt}
          onTogglePrompt={() => setShowPrompt(!showPrompt)}
        />

        {/* Image and Script Editor */}
        <ImageCarousel
          currentImageIndex={currentImageIndex}
          imageUrls={blocks.map((block) => block.imageUrl)}
          isFullscreen={isFullscreen}
          isRegeneratingImages={isRegeneratingImages}
          loadingImages={loadingImages}
          onPrevImage={handlePrevImage}
          onNextImage={handleNextImage}
          onToggleFullscreen={toggleFullscreen}
          onImageLoad={handleImageLoad}
          onReplaceImage={handleOpenUploadDialog}
        >
          <ScriptEditor
            currentImageIndex={currentImageIndex}
            script={blocks[currentImageIndex]?.script || ''}
            isEdited={editedScripts[currentImageIndex]}
            isFullscreen={isFullscreen}
            isRegeneratingImages={isRegeneratingImages}
            onScriptChange={handleScriptChange}
          />
        </ImageCarousel>

        {/* Thumbnails */}
        <ThumbnailGallery
          imageUrls={blocks.map((block) => block.imageUrl)}
          currentImageIndex={currentImageIndex}
          isRegeneratingImages={isRegeneratingImages}
          loadingImages={loadingImages}
          onThumbnailClick={handleThumbnailClick}
        />
      </Box>

      {/* Action Buttons */}
      <ActionButtons
        hasEditedScripts={hasEditedScripts}
        isRegeneratingImages={isRegeneratingImages}
        isGeneratingInitialImages={isGeneratingInitialImages}
        isSaving={isSaving}
        onRegenerateImages={handleRegenerateImagesClick}
        onSaveAllChanges={handleSaveAllChanges}
        onProceedToAudio={handleProceedClick}
      />

      {/* Collapsible Block Manager - Now appears below Action Buttons */}
      <CollapsibleBlockManager
        blocks={blocks}
        currentIndex={currentImageIndex}
        isRegeneratingImages={isRegeneratingImages}
        onSelectBlock={setCurrentImageIndex}
        onReplaceImage={handleOpenUploadDialog}
        onDeleteBlock={handleDeleteBlock}
        onOpenAddBlockDialog={handleOpenAddBlockDialog}
        onReorderBlocks={handleReorderBlocks}
        onDragStart={(id) => setDragActiveId(id)}
        onDragEnd={() => setDragActiveId(null)}
      />

      {/* Notifications */}
      <Notifications
        showSaveNotification={showSaveNotification}
        showIncompleteAlert={showIncompleteAlert}
        saveError={saveError}
        onCloseSaveNotification={() => setShowSaveNotification(false)}
        onCloseIncompleteAlert={() => setShowIncompleteAlert(false)}
        onCloseSaveError={() => setSaveError(null)}
      />

      {/* Image Upload Dialog with enhanced functionality */}
      <ImageUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUploadImage}
        onSelectExisting={handleSelectExistingImage}
        isUploading={isUploading}
        error={uploadError}
        uploadProgress={uploadProgress}
      />

      {/* Add Block Dialog with enhanced functionality */}
      <AddBlockDialog
        open={addBlockDialogOpen}
        onClose={() => setAddBlockDialogOpen(false)}
        onAddBlock={handleAddBlock}
        isUploading={isUploading}
        error={uploadError}
      />
    </Box>
  )
}

export default ImagesStep
