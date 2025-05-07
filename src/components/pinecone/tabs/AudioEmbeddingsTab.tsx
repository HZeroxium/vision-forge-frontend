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

const AudioEmbeddingsTab: React.FC<TabProps> = ({
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
  const [audioScript, setAudioScript] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [audioVoice, setAudioVoice] = useState('nova')
  const [audioDuration, setAudioDuration] = useState(30)

  // Handle search
  const handleQueryAudios = async () => {
    if (!queryText) {
      showNotification('Please enter a query text', 'error')
      return
    }

    try {
      await pinecone.queryAudioEmbeddings({
        query_text: queryText,
        voice: audioVoice || undefined,
        top_k: topK,
        threshold,
      })
      showNotification('Query successful', 'success')
    } catch (error) {
      console.error('Error querying audios:', error)
      showNotification('Failed to query audio embeddings', 'error')
    }
  }

  // Handle upload
  const handleUpsertAudio = async () => {
    if (!audioScript || !audioUrl || !audioVoice) {
      showNotification('Script, URL, and voice are required', 'error')
      return
    }

    try {
      await pinecone.upsertAudioEmbedding({
        script: audioScript,
        audio_url: audioUrl,
        voice: audioVoice,
        duration: audioDuration,
      })
      showNotification('Audio embedding added successfully', 'success')

      // Reset form
      setAudioScript('')
      setAudioUrl('')
      setAudioVoice('nova')
      setAudioDuration(30)
    } catch (error) {
      console.error('Error upserting audio:', error)
      showNotification('Failed to add audio embedding', 'error')
    }
  }

  // Handle delete
  const handleDeleteAudio = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteAudioEmbedding(vectorIdToDelete)
      showNotification('Audio embedding deleted successfully', 'success')
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting audio:', error)
      showNotification('Failed to delete audio embedding', 'error')
    }
  }

  // Handle delete by filter
  const handleDeleteAudiosByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteAudiosByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification('Audios deleted by filter successfully', 'success')
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting audios by filter:', error)
      showNotification('Failed to delete audios by filter', 'error')
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
        Audio Embeddings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage audio embeddings in the Pinecone vector database. You can search
        for similar audio files, add new audio embeddings, and delete existing
        ones.
      </Typography>

      {pinecone.audio.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {pinecone.audio.error}
        </Alert>
      )}

      {/* Search Audio */}
      <SearchSection
        queryText={queryText}
        setQueryText={setQueryText}
        topK={topK}
        setTopK={setTopK}
        threshold={threshold}
        setThreshold={setThreshold}
        handleQuery={handleQueryAudios}
        isLoading={pinecone.audio.isLoading}
        type="Audio"
      />

      {/* Results */}
      {pinecone.audio.matches.length > 0 && (
        <ResultsTable
          matches={pinecone.audio.matches}
          showNotification={showNotification}
        />
      )}

      {/* Add Audio Embedding */}
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
          Add Audio Embedding
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
                label="Audio Script"
                value={audioScript}
                onChange={(e) => setAudioScript(e.target.value)}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter the script/transcript for this audio"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Audio URL"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="https://example.com/audio.mp3"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <InputLabel id="audio-voice-label">Voice</InputLabel>
                <Select
                  labelId="audio-voice-label"
                  value={audioVoice}
                  onChange={(e) => setAudioVoice(e.target.value)}
                  label="Voice"
                >
                  <MenuItem value="nova">Nova</MenuItem>
                  <MenuItem value="alloy">Alloy</MenuItem>
                  <MenuItem value="echo">Echo</MenuItem>
                  <MenuItem value="fable">Fable</MenuItem>
                  <MenuItem value="onyx">Onyx</MenuItem>
                  <MenuItem value="shimmer">Shimmer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Duration (seconds)"
                type="number"
                value={audioDuration}
                onChange={(e) => setAudioDuration(Number(e.target.value))}
                fullWidth
                variant="outlined"
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MotionButton
                variant="contained"
                color="secondary"
                onClick={handleUpsertAudio}
                disabled={pinecone.audio.upsertLoading}
                startIcon={
                  pinecone.audio.upsertLoading ? (
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
                {pinecone.audio.upsertLoading
                  ? 'Adding...'
                  : 'Add Audio Embedding'}
              </MotionButton>
            </Grid>
          </Grid>
        </Paper>
      </MotionBox>

      {/* Delete Audio Embeddings */}
      <DeleteSection
        vectorIdToDelete={vectorIdToDelete}
        setVectorIdToDelete={setVectorIdToDelete}
        filterKeyToDelete={filterKeyToDelete}
        setFilterKeyToDelete={setFilterKeyToDelete}
        filterValueToDelete={filterValueToDelete}
        setFilterValueToDelete={setFilterValueToDelete}
        handleDelete={handleDeleteAudio}
        handleDeleteByFilter={handleDeleteAudiosByFilter}
        isDeleting={pinecone.audio.deleteLoading}
        type="Audio"
      />
    </MotionPaper>
  )
}

export default AudioEmbeddingsTab
