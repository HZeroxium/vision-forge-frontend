import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const ScriptEmbeddingsTab: React.FC<TabProps> = ({
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
  const [scriptTitle, setScriptTitle] = useState('')
  const [scriptContent, setScriptContent] = useState('')
  const [scriptStyle, setScriptStyle] = useState('default')
  const [scriptLanguage, setScriptLanguage] = useState('en')
  const [scriptSources, setScriptSources] = useState<string>('')

  // Handle search
  const handleQueryScripts = async () => {
    if (!queryText) {
      showNotification('Please enter a query text', 'error')
      return
    }

    try {
      await pinecone.queryScriptEmbeddings({
        query_text: queryText,
        language: scriptLanguage || undefined,
        top_k: topK,
        threshold,
      })
      showNotification('Query successful', 'success')
    } catch (error) {
      console.error('Error querying scripts:', error)
      showNotification('Failed to query script embeddings', 'error')
    }
  }

  // Handle upload
  const handleUpsertScript = async () => {
    if (!scriptTitle || !scriptContent) {
      showNotification('Title and content are required', 'error')
      return
    }

    // Parse sources if provided
    let sources: { title: string; url: string; content?: string }[] = []
    if (scriptSources) {
      try {
        sources = JSON.parse(scriptSources)
      } catch (e) {
        showNotification('Invalid JSON format for sources', 'error')
        return
      }
    }

    try {
      await pinecone.upsertScriptEmbedding({
        title: scriptTitle,
        content: scriptContent,
        style: scriptStyle,
        language: scriptLanguage,
        sources: sources.length > 0 ? sources : undefined,
      })
      showNotification('Script embedding added successfully', 'success')

      // Reset form
      setScriptTitle('')
      setScriptContent('')
      setScriptStyle('default')
      setScriptLanguage('en')
      setScriptSources('')
    } catch (error) {
      console.error('Error upserting script:', error)
      showNotification('Failed to add script embedding', 'error')
    }
  }

  // Handle delete
  const handleDeleteScript = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteScriptEmbedding(vectorIdToDelete)
      showNotification('Script embedding deleted successfully', 'success')
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting script:', error)
      showNotification('Failed to delete script embedding', 'error')
    }
  }

  // Handle delete by filter
  const handleDeleteScriptsByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteScriptsByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification('Scripts deleted by filter successfully', 'success')
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting scripts by filter:', error)
      showNotification('Failed to delete scripts by filter', 'error')
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
        Script Embeddings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage script embeddings in the Pinecone vector database. You can search
        for similar scripts, add new script embeddings, and delete existing
        ones.
      </Typography>

      {pinecone.script.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {pinecone.script.error}
        </Alert>
      )}

      {/* Search Scripts */}
      <SearchSection
        queryText={queryText}
        setQueryText={setQueryText}
        topK={topK}
        setTopK={setTopK}
        threshold={threshold}
        setThreshold={setThreshold}
        handleQuery={handleQueryScripts}
        isLoading={pinecone.script.isLoading}
        type="Scripts"
      />

      {/* Results */}
      {pinecone.script.matches.length > 0 && (
        <ResultsTable
          matches={pinecone.script.matches}
          showNotification={showNotification}
        />
      )}

      {/* Add Script Embedding */}
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
          Add Script Embedding
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
                label="Script Title"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter a title for this script"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Script Content"
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Enter the full content of the script"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <InputLabel id="script-style-label">Style</InputLabel>
                <Select
                  labelId="script-style-label"
                  value={scriptStyle}
                  onChange={(e) => setScriptStyle(e.target.value)}
                  label="Style"
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="creative">Creative</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <InputLabel id="script-language-label">Language</InputLabel>
                <Select
                  labelId="script-language-label"
                  value={scriptLanguage}
                  onChange={(e) => setScriptLanguage(e.target.value)}
                  label="Language"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="vi">Vietnamese</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Sources (JSON array, optional)"
                value={scriptSources}
                onChange={(e) => setScriptSources(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder={`[
  {
    "title": "Source Title",
    "url": "https://example.com",
    "content": "Optional content excerpt"
  }
]`}
                helperText="JSON format array of sources"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MotionButton
                variant="contained"
                color="secondary"
                onClick={handleUpsertScript}
                disabled={pinecone.script.upsertLoading}
                startIcon={
                  pinecone.script.upsertLoading ? (
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
                {pinecone.script.upsertLoading
                  ? 'Adding...'
                  : 'Add Script Embedding'}
              </MotionButton>
            </Grid>
          </Grid>
        </Paper>
      </MotionBox>

      {/* Delete Script Embeddings */}
      <DeleteSection
        vectorIdToDelete={vectorIdToDelete}
        setVectorIdToDelete={setVectorIdToDelete}
        filterKeyToDelete={filterKeyToDelete}
        setFilterKeyToDelete={setFilterKeyToDelete}
        filterValueToDelete={filterValueToDelete}
        setFilterValueToDelete={setFilterValueToDelete}
        handleDelete={handleDeleteScript}
        handleDeleteByFilter={handleDeleteScriptsByFilter}
        isDeleting={pinecone.script.deleteLoading}
        type="Scripts"
      />
    </MotionPaper>
  )
}

export default ScriptEmbeddingsTab
