import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Divider,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Add, Delete, Save } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { usePinecone } from '@/hooks/usePinecone'
import { SearchSection, DeleteSection, ResultsTable } from '../index'
import { TabProps, PromptItem } from '../types'

const MotionPaper = motion(Paper)
const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionTableRow = motion(TableRow)

const ImagePromptsTab: React.FC<TabProps> = ({
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
  const [promptsContent, setPromptsContent] = useState('')
  const [promptsStyle, setPromptsStyle] = useState('')
  const [promptsTextInput, setPromptsTextInput] = useState('')
  const [promptsImagePromptInput, setPromptsImagePromptInput] = useState('')
  const [promptsList, setPromptsList] = useState<PromptItem[]>([])

  // Handle adding a prompt to the list
  const handleAddPrompt = () => {
    if (!promptsTextInput || !promptsImagePromptInput) {
      showNotification('Both text and image prompt are required', 'error')
      return
    }

    setPromptsList([
      ...promptsList,
      { text: promptsTextInput, image_prompt: promptsImagePromptInput },
    ])

    setPromptsTextInput('')
    setPromptsImagePromptInput('')
  }

  // Handle removing a prompt from the list
  const handleRemovePrompt = (index: number) => {
    const newList = [...promptsList]
    newList.splice(index, 1)
    setPromptsList(newList)
  }

  // Handle search
  const handleQueryImagePrompts = async () => {
    if (!queryText) {
      showNotification('Please enter a query text', 'error')
      return
    }

    try {
      await pinecone.queryImagePromptsEmbeddings({
        query_text: queryText,
        style: promptsStyle || undefined,
        top_k: topK,
        threshold,
      })
      showNotification('Query successful', 'success')
    } catch (error) {
      console.error('Error querying image prompts:', error)
      showNotification('Failed to query image prompts', 'error')
    }
  }

  // Handle upload
  const handleUpsertImagePrompts = async () => {
    if (!promptsContent || promptsList.length === 0) {
      showNotification('Content and at least one prompt are required', 'error')
      return
    }

    try {
      await pinecone.upsertImagePromptsEmbedding({
        content: promptsContent,
        prompts: promptsList,
        style: promptsStyle,
      })
      showNotification('Image prompts embedding added successfully', 'success')

      // Reset form
      setPromptsContent('')
      setPromptsStyle('')
      setPromptsList([])
    } catch (error) {
      console.error('Error upserting image prompts:', error)
      showNotification('Failed to add image prompts embedding', 'error')
    }
  }

  // Handle delete
  const handleDeleteImagePrompts = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteImagePromptsEmbedding(vectorIdToDelete)
      showNotification(
        'Image prompts embedding deleted successfully',
        'success'
      )
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting image prompts:', error)
      showNotification('Failed to delete image prompts embedding', 'error')
    }
  }

  // Handle delete by filter
  const handleDeleteImagePromptsByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteImagePromptsByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification(
        'Image prompts deleted by filter successfully',
        'success'
      )
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting image prompts by filter:', error)
      showNotification('Failed to delete image prompts by filter', 'error')
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
        Image Prompts Embeddings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage image prompts embeddings in the Pinecone vector database. This
        allows you to store and search for content with associated image
        generation prompts.
      </Typography>

      {pinecone.imagePrompts.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {pinecone.imagePrompts.error}
        </Alert>
      )}

      {/* Search Image Prompts */}
      <SearchSection
        queryText={queryText}
        setQueryText={setQueryText}
        topK={topK}
        setTopK={setTopK}
        threshold={threshold}
        setThreshold={setThreshold}
        handleQuery={handleQueryImagePrompts}
        isLoading={pinecone.imagePrompts.isLoading}
        type="Image Prompts"
      />

      {/* Results */}
      {pinecone.imagePrompts.matches.length > 0 && (
        <ResultsTable
          matches={pinecone.imagePrompts.matches}
          showNotification={showNotification}
        />
      )}

      {/* Add Image Prompts Embedding */}
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
          Add Image Prompts Embedding
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
                label="Content"
                value={promptsContent}
                onChange={(e) => setPromptsContent(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter the main content or description"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Style (Optional)"
                value={promptsStyle}
                onChange={(e) => setPromptsStyle(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="e.g. oil painting, pencil sketch, digital art"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Add Image Prompts" />
              </Divider>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Text"
                    value={promptsTextInput}
                    onChange={(e) => setPromptsTextInput(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter text description"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Image Prompt"
                    value={promptsImagePromptInput}
                    onChange={(e) => setPromptsImagePromptInput(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter the image generation prompt"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <MotionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleAddPrompt}
                    startIcon={<Add />}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{ mt: 1, borderRadius: 2 }}
                  >
                    Add Prompt
                  </MotionButton>
                </Grid>
              </Grid>

              {promptsList.length > 0 && (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Text</TableCell>
                        <TableCell>Image Prompt</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {promptsList.map((prompt, index) => (
                        <MotionTableRow
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TableCell>{prompt.text}</TableCell>
                          <TableCell>{prompt.image_prompt}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleRemovePrompt(index)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </MotionTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <MotionButton
                variant="contained"
                color="secondary"
                onClick={handleUpsertImagePrompts}
                disabled={
                  pinecone.imagePrompts.upsertLoading ||
                  promptsList.length === 0
                }
                startIcon={
                  pinecone.imagePrompts.upsertLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Save />
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
                {pinecone.imagePrompts.upsertLoading
                  ? 'Adding...'
                  : 'Add Image Prompts Embedding'}
              </MotionButton>
            </Grid>
          </Grid>
        </Paper>
      </MotionBox>

      {/* Delete Image Prompts Embeddings */}
      <DeleteSection
        vectorIdToDelete={vectorIdToDelete}
        setVectorIdToDelete={setVectorIdToDelete}
        filterKeyToDelete={filterKeyToDelete}
        setFilterKeyToDelete={setFilterKeyToDelete}
        filterValueToDelete={filterValueToDelete}
        setFilterValueToDelete={setFilterValueToDelete}
        handleDelete={handleDeleteImagePrompts}
        handleDeleteByFilter={handleDeleteImagePromptsByFilter}
        isDeleting={pinecone.imagePrompts.deleteLoading}
        type="Image Prompts"
      />
    </MotionPaper>
  )
}

export default ImagePromptsTab
