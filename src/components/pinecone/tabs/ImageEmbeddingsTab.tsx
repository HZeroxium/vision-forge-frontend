import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { CloudUpload } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { usePinecone } from '@/hooks/usePinecone'
import { SearchSection, DeleteSection, ResultsTable } from '../index'
import { TabProps } from '../types'

const MotionPaper = motion(Paper)
const MotionBox = motion(Box)
const MotionButton = motion(Button)

const ImageEmbeddingsTab: React.FC<TabProps> = ({
  showNotification,
  queryText,
  setQueryText,
  topK,
  setTopK,
  threshold,
  setThreshold,
  vectorIdToDelete,
  setVectorIdToDelete,
  filterKeyToDelete,
  setFilterKeyToDelete,
  filterValueToDelete,
  setFilterValueToDelete,
}) => {
  const pinecone = usePinecone()

  // Local state
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageStyle, setImageStyle] = useState('')

  // Handle search
  const handleQueryImages = async () => {
    if (!queryText) {
      showNotification('Please enter a query text', 'error')
      return
    }

    try {
      await pinecone.queryImageEmbeddings({
        query_text: queryText,
        top_k: topK,
        threshold,
      })
      showNotification('Query successful', 'success')
    } catch (error) {
      console.error('Error querying images:', error)
      showNotification('Failed to query images', 'error')
    }
  }

  // Handle upload
  const handleUpsertImage = async () => {
    if (!imagePrompt || !imageUrl) {
      showNotification('Prompt and image URL are required', 'error')
      return
    }

    try {
      await pinecone.upsertImageEmbedding({
        prompt: imagePrompt,
        image_url: imageUrl,
        style: imageStyle || undefined,
      })
      showNotification('Image embedding added successfully', 'success')

      // Reset form
      setImagePrompt('')
      setImageUrl('')
      setImageStyle('')
    } catch (error) {
      console.error('Error upserting image:', error)
      showNotification('Failed to add image embedding', 'error')
    }
  }

  // Handle delete
  const handleDeleteImage = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteImageEmbedding(vectorIdToDelete)
      showNotification('Image embedding deleted successfully', 'success')
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting image:', error)
      showNotification('Failed to delete image embedding', 'error')
    }
  }

  // Handle delete by filter
  const handleDeleteImagesByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteImagesByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification('Images deleted by filter successfully', 'success')
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting images by filter:', error)
      showNotification('Failed to delete images by filter', 'error')
    }
  }

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ p: 3, mb: 4, borderRadius: 2 }}
      elevation={0}
      variant="outlined"
    >
      <Typography variant="h5" gutterBottom fontWeight="medium">
        Image Embeddings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage image embeddings in the Pinecone vector database. You can search
        for similar images, add new image embeddings, and delete existing ones.
      </Typography>

      {pinecone.image.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {pinecone.image.error}
        </Alert>
      )}

      {/* Search Images */}
      <SearchSection
        queryText={queryText}
        setQueryText={setQueryText}
        topK={topK}
        setTopK={setTopK}
        threshold={threshold}
        setThreshold={setThreshold}
        handleQuery={handleQueryImages}
        isLoading={pinecone.image.isLoading}
        type="Images"
      />

      {/* Results */}
      {pinecone.image.matches.length > 0 && (
        <ResultsTable
          matches={pinecone.image.matches}
          showNotification={showNotification}
        />
      )}

      {/* Add Image Embedding */}
      <MotionBox
        mb={4}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Typography
          variant="h6"
          fontWeight="500"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              display: 'block',
              width: '4px',
              height: '24px',
              backgroundColor: 'secondary.main',
              marginRight: '8px',
              borderRadius: '2px',
            },
          }}
        >
          Add Image Embedding
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Image Prompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter a detailed description of the image"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="https://example.com/image.jpg"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Style (Optional)"
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="e.g. oil painting, pencil sketch, digital art"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MotionButton
                variant="contained"
                color="secondary"
                onClick={handleUpsertImage}
                disabled={pinecone.image.upsertLoading}
                startIcon={
                  pinecone.image.upsertLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloudUpload />
                  )
                }
                fullWidth
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {pinecone.image.upsertLoading
                  ? 'Adding...'
                  : 'Add Image Embedding'}
              </MotionButton>
            </Grid>
          </Grid>
        </Paper>
      </MotionBox>

      {/* Delete Image Embeddings */}
      <DeleteSection
        vectorIdToDelete={vectorIdToDelete}
        setVectorIdToDelete={setVectorIdToDelete}
        filterKeyToDelete={filterKeyToDelete}
        setFilterKeyToDelete={setFilterKeyToDelete}
        filterValueToDelete={filterValueToDelete}
        setFilterValueToDelete={setFilterValueToDelete}
        handleDelete={handleDeleteImage}
        handleDeleteByFilter={handleDeleteImagesByFilter}
        isDeleting={pinecone.image.deleteLoading}
        type="Images"
      />
    </MotionPaper>
  )
}

export default ImageEmbeddingsTab
