// /src/components/dev/PineconeTools.tsx

'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  InputAdornment,
} from '@mui/material'
import {
  Search,
  Add,
  Delete,
  ExpandMore,
  ContentCopy,
  Check,
  FilterAlt,
  CloudUpload,
  Save,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { usePinecone } from '@/hooks/usePinecone'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pinecone-tabpanel-${index}`}
      aria-labelledby={`pinecone-tab-${index}`}
      {...other}
      style={{ paddingTop: '16px' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default function PineconeTools() {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  // Common state for query
  const [queryText, setQueryText] = useState('')
  const [topK, setTopK] = useState(5)
  const [threshold, setThreshold] = useState(0.7)

  // State for image operations
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageStyle, setImageStyle] = useState('')

  // State for audio operations
  const [audioScript, setAudioScript] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [audioVoice, setAudioVoice] = useState('nova')
  const [audioDuration, setAudioDuration] = useState(30)

  // State for script operations
  const [scriptTitle, setScriptTitle] = useState('')
  const [scriptContent, setScriptContent] = useState('')
  const [scriptStyle, setScriptStyle] = useState('default')
  const [scriptLanguage, setScriptLanguage] = useState('en')
  const [scriptSources, setScriptSources] = useState<string>('')

  // State for image prompts operations
  const [promptsContent, setPromptsContent] = useState('')
  const [promptsStyle, setPromptsStyle] = useState('')
  const [promptsTextInput, setPromptsTextInput] = useState('')
  const [promptsImagePromptInput, setPromptsImagePromptInput] = useState('')
  const [promptsList, setPromptsList] = useState<
    { text: string; image_prompt: string }[]
  >([])

  // State for notifications
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
  }>({
    open: false,
    message: '',
    severity: 'info',
  })

  // Delete state
  const [vectorIdToDelete, setVectorIdToDelete] = useState('')
  const [filterKeyToDelete, setFilterKeyToDelete] = useState('')
  const [filterValueToDelete, setFilterValueToDelete] = useState('')

  // Access Pinecone state and methods
  const pinecone = usePinecone()

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  // Common functions
  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  // Image operations
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
      showNotification('Image embedding added', 'success')

      // Reset form
      setImagePrompt('')
      setImageUrl('')
      setImageStyle('')
    } catch (error) {
      console.error('Error upserting image:', error)
      showNotification('Failed to add image embedding', 'error')
    }
  }

  const handleDeleteImage = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteImageEmbedding(vectorIdToDelete)
      showNotification('Image embedding deleted', 'success')
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting image:', error)
      showNotification('Failed to delete image embedding', 'error')
    }
  }

  const handleDeleteImagesByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteImagesByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification('Images deleted by filter', 'success')
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting images by filter:', error)
      showNotification('Failed to delete images by filter', 'error')
    }
  }

  // Audio operations
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
      showNotification('Audio embedding added', 'success')

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

  const handleDeleteAudio = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteAudioEmbedding(vectorIdToDelete)
      showNotification('Audio embedding deleted', 'success')
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting audio:', error)
      showNotification('Failed to delete audio embedding', 'error')
    }
  }

  const handleDeleteAudiosByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteAudiosByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification('Audios deleted by filter', 'success')
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting audios by filter:', error)
      showNotification('Failed to delete audios by filter', 'error')
    }
  }

  // Script operations
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
      showNotification('Script embedding added', 'success')

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

  const handleDeleteScript = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteScriptEmbedding(vectorIdToDelete)
      showNotification('Script embedding deleted', 'success')
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting script:', error)
      showNotification('Failed to delete script embedding', 'error')
    }
  }

  const handleDeleteScriptsByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteScriptsByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification('Scripts deleted by filter', 'success')
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting scripts by filter:', error)
      showNotification('Failed to delete scripts by filter', 'error')
    }
  }

  // Image prompts operations
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

  const handleRemovePrompt = (index: number) => {
    const newList = [...promptsList]
    newList.splice(index, 1)
    setPromptsList(newList)
  }

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
      showNotification('Image prompts embedding added', 'success')

      // Reset form
      setPromptsContent('')
      setPromptsStyle('')
      setPromptsList([])
    } catch (error) {
      console.error('Error upserting image prompts:', error)
      showNotification('Failed to add image prompts embedding', 'error')
    }
  }

  const handleDeleteImagePrompts = async () => {
    if (!vectorIdToDelete) {
      showNotification('Vector ID is required', 'error')
      return
    }

    try {
      await pinecone.deleteImagePromptsEmbedding(vectorIdToDelete)
      showNotification('Image prompts embedding deleted', 'success')
      setVectorIdToDelete('')
    } catch (error) {
      console.error('Error deleting image prompts:', error)
      showNotification('Failed to delete image prompts embedding', 'error')
    }
  }

  const handleDeleteImagePromptsByFilter = async () => {
    if (!filterKeyToDelete || !filterValueToDelete) {
      showNotification('Filter key and value are required', 'error')
      return
    }

    try {
      await pinecone.deleteImagePromptsByFilter({
        [filterKeyToDelete]: filterValueToDelete,
      })
      showNotification('Image prompts deleted by filter', 'success')
      setFilterKeyToDelete('')
      setFilterValueToDelete('')
    } catch (error) {
      console.error('Error deleting image prompts by filter:', error)
      showNotification('Failed to delete image prompts by filter', 'error')
    }
  }

  // Common search component
  const renderSearchSection = (
    handleQuery: () => Promise<void>,
    isLoading: boolean,
    matches: any[],
    type: string
  ) => (
    <Box mb={4}>
      <Typography variant="subtitle1" gutterBottom>
        Search {type}
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Query Text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Top K Results"
              type="number"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{ inputProps: { min: 1, max: 100 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Similarity Threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleQuery}
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <Search />
              }
              fullWidth
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {matches.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Search Results ({matches.length})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Metadata</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.8rem',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {match.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{match.score.toFixed(4)}</TableCell>
                    <TableCell>
                      <Tooltip title={JSON.stringify(match.metadata, null, 2)}>
                        <Button size="small" variant="text">
                          View
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Copy ID">
                        <IconButton
                          size="small"
                          onClick={() => {
                            copyToClipboard(match.id)
                            showNotification(
                              'ID copied to clipboard',
                              'success'
                            )
                          }}
                        >
                          {copied ? (
                            <Check fontSize="small" />
                          ) : (
                            <ContentCopy fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  )

  // Common delete section
  const renderDeleteSection = (
    handleDelete: () => Promise<void>,
    handleDeleteByFilter: () => Promise<void>,
    isDeleting: boolean,
    type: string
  ) => (
    <Box mb={4}>
      <Typography variant="subtitle1" gutterBottom>
        Delete {type}
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Delete by Vector ID</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Vector ID"
                value={vectorIdToDelete}
                onChange={(e) => setVectorIdToDelete(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={isDeleting}
                startIcon={
                  isDeleting ? <CircularProgress size={20} /> : <Delete />
                }
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Delete by Filter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Filter Key"
                value={filterKeyToDelete}
                onChange={(e) => setFilterKeyToDelete(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="e.g. userId"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Filter Value"
                value={filterValueToDelete}
                onChange={(e) => setFilterValueToDelete(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteByFilter}
                disabled={isDeleting}
                startIcon={
                  isDeleting ? <CircularProgress size={20} /> : <FilterAlt />
                }
              >
                Delete by Filter
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pinecone Vector Database Tools
      </Typography>

      <Paper sx={{ mt: 2, mb: 4 }}>
        <Tabs
          value={activeTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Image Embeddings" />
          <Tab label="Audio Embeddings" />
          <Tab label="Script Embeddings" />
          <Tab label="Image Prompts" />
        </Tabs>
      </Paper>

      {/* IMAGE EMBEDDINGS TAB */}
      <TabPanel value={activeTabIndex} index={0}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ p: 3, mb: 4 }}
        >
          <Typography variant="h6" gutterBottom>
            Image Embeddings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage image embeddings in the Pinecone vector database. You can
            search for similar images or add new image embeddings.
          </Typography>

          {pinecone.image.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {pinecone.image.error}
            </Alert>
          )}

          {/* Search Images */}
          {renderSearchSection(
            handleQueryImages,
            pinecone.image.isLoading,
            pinecone.image.matches,
            'Images'
          )}

          {/* Add Image Embedding */}
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom>
              Add Image Embedding
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Image Prompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Style (Optional)"
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    placeholder="e.g. oil painting, pencil sketch"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
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
                  >
                    Add Image Embedding
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Delete Image Embeddings */}
          {renderDeleteSection(
            handleDeleteImage,
            handleDeleteImagesByFilter,
            pinecone.image.deleteLoading,
            'Images'
          )}
        </MotionPaper>
      </TabPanel>

      {/* AUDIO EMBEDDINGS TAB */}
      <TabPanel value={activeTabIndex} index={1}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ p: 3, mb: 4 }}
        >
          <Typography variant="h6" gutterBottom>
            Audio Embeddings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage audio embeddings in the Pinecone vector database. You can
            search for similar audio files or add new audio embeddings.
          </Typography>

          {pinecone.audio.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {pinecone.audio.error}
            </Alert>
          )}

          {/* Search Audio */}
          {renderSearchSection(
            handleQueryAudios,
            pinecone.audio.isLoading,
            pinecone.audio.matches,
            'Audio'
          )}

          {/* Add Audio Embedding */}
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom>
              Add Audio Embedding
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Audio Script"
                    value={audioScript}
                    onChange={(e) => setAudioScript(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Audio URL"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Voice</InputLabel>
                    <Select
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration (seconds)"
                    type="number"
                    value={audioDuration}
                    onChange={(e) => setAudioDuration(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
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
                  >
                    Add Audio Embedding
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Delete Audio Embeddings */}
          {renderDeleteSection(
            handleDeleteAudio,
            handleDeleteAudiosByFilter,
            pinecone.audio.deleteLoading,
            'Audio'
          )}
        </MotionPaper>
      </TabPanel>

      {/* SCRIPT EMBEDDINGS TAB */}
      <TabPanel value={activeTabIndex} index={2}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ p: 3, mb: 4 }}
        >
          <Typography variant="h6" gutterBottom>
            Script Embeddings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage script embeddings in the Pinecone vector database. You can
            search for similar scripts or add new script embeddings.
          </Typography>

          {pinecone.script.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {pinecone.script.error}
            </Alert>
          )}

          {/* Search Scripts */}
          {renderSearchSection(
            handleQueryScripts,
            pinecone.script.isLoading,
            pinecone.script.matches,
            'Scripts'
          )}

          {/* Add Script Embedding */}
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom>
              Add Script Embedding
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Script Title"
                    value={scriptTitle}
                    onChange={(e) => setScriptTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Script Content"
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Style</InputLabel>
                    <Select
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
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Language</InputLabel>
                    <Select
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
                <Grid item xs={12}>
                  <TextField
                    label="Sources (JSON array, optional)"
                    value={scriptSources}
                    onChange={(e) => setScriptSources(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="normal"
                    variant="outlined"
                    placeholder='[{"title": "Source Title", "url": "https://example.com", "content": "Optional content"}]'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
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
                  >
                    Add Script Embedding
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Delete Script Embeddings */}
          {renderDeleteSection(
            handleDeleteScript,
            handleDeleteScriptsByFilter,
            pinecone.script.deleteLoading,
            'Scripts'
          )}
        </MotionPaper>
      </TabPanel>

      {/* IMAGE PROMPTS TAB */}
      <TabPanel value={activeTabIndex} index={3}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ p: 3, mb: 4 }}
        >
          <Typography variant="h6" gutterBottom>
            Image Prompts Embeddings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage image prompts embeddings in the Pinecone vector database.
            This allows you to store and search for content with associated
            image generation prompts.
          </Typography>

          {pinecone.imagePrompts.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {pinecone.imagePrompts.error}
            </Alert>
          )}

          {/* Search Image Prompts */}
          {renderSearchSection(
            handleQueryImagePrompts,
            pinecone.imagePrompts.isLoading,
            pinecone.imagePrompts.matches,
            'Image Prompts'
          )}

          {/* Add Image Prompts Embedding */}
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom>
              Add Image Prompts Embedding
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Content"
                    value={promptsContent}
                    onChange={(e) => setPromptsContent(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Style (Optional)"
                    value={promptsStyle}
                    onChange={(e) => setPromptsStyle(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ mt: 1, mb: 2 }}>
                    <Chip label="Add Image Prompts" />
                  </Divider>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Text"
                        value={promptsTextInput}
                        onChange={(e) => setPromptsTextInput(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Image Prompt"
                        value={promptsImagePromptInput}
                        onChange={(e) =>
                          setPromptsImagePromptInput(e.target.value)
                        }
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={handleAddPrompt}
                        startIcon={<Add />}
                      >
                        Add Prompt
                      </Button>
                    </Grid>
                  </Grid>

                  {promptsList.length > 0 && (
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ mt: 2 }}
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
                            <TableRow key={index}>
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
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
                  >
                    Add Image Prompts Embedding
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Delete Image Prompts Embeddings */}
          {renderDeleteSection(
            handleDeleteImagePrompts,
            handleDeleteImagePromptsByFilter,
            pinecone.imagePrompts.deleteLoading,
            'Image Prompts'
          )}
        </MotionPaper>
      </TabPanel>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
