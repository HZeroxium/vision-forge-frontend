// /src/components/dev/StorageTools.tsx

'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
} from '@mui/material'
import {
  ExpandMore,
  Upload,
  Delete,
  Folder,
  Search,
  Refresh,
  Visibility,
  CloudDownload,
  Link as LinkIcon,
  ContentCopy,
  Check,
  OpenInNew,
  CreateNewFolder,
} from '@mui/icons-material'
import { useStorage } from '@/hooks/useStorage'
import { FileType } from '@/services/storageService'

// Define interfaces for storage items
interface StorageFile {
  name: string
  path: string
  size: number
  url: string
  contentType: string
  updatedAt: string
}

export default function StorageTools() {
  // Use the storage hook
  const storage = useStorage()

  // State for file operations
  const [file, setFile] = useState<File | null>(null)
  const [uploadPath, setUploadPath] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // State for listing files
  const [listPath, setListPath] = useState('')

  // State for delete operations
  const [deleteTarget, setDeleteTarget] = useState('')

  // State for signed URL operations
  const [signedUrlPath, setSignedUrlPath] = useState('')
  const [signedUrlExpiry, setSignedUrlExpiry] = useState(60)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [signUrlError, setSignUrlError] = useState<string | null>(null)
  const [signingUrl, setSigningUrl] = useState(false)

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

  // Map files from storage state to our component's expected format
  const mapFilesToStorageFiles = (): StorageFile[] => {
    return storage.files.map((file) => ({
      name: file.key.split('/').pop() || file.key,
      path: file.key,
      size: file.size,
      url: file.url,
      contentType: file.content_type || 'unknown',
      updatedAt: file.last_modified || new Date().toISOString(),
    }))
  }

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
      storage.clearErrors() // Clear previous errors
      setUploadSuccess(false)
      setUploadedUrl(null)
    }
  }

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      showNotification('Please select a file first', 'error')
      return
    }

    try {
      const folder = uploadPath.trim() || undefined

      const response = await storage.uploadFile(
        file,
        FileType.OTHER,
        undefined,
        folder
      )

      setUploadedUrl(response.url)
      setUploadSuccess(true)
      setFile(null)

      const fileInput = document.getElementById(
        'file-upload'
      ) as HTMLInputElement
      if (fileInput) fileInput.value = ''

      showNotification('File uploaded successfully', 'success')

      if (storage.currentPrefix === uploadPath || !uploadPath) {
        refreshFileList()
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      showNotification('Upload failed', 'error')
    }
  }

  // Handle listing files
  const handleListFiles = async () => {
    try {
      await storage.navigateToDirectory(listPath.trim())
    } catch (error: any) {
      console.error('List error:', error)
      // Display more helpful error message for common issues
      let errorMessage =
        typeof error === 'string' ? error : 'Failed to list files'

      if (
        errorMessage.includes('CORS') ||
        error?.message?.includes('Network Error')
      ) {
        errorMessage =
          'CORS issue detected. The API server may not have CORS enabled properly. Check server logs.'
        showNotification(errorMessage, 'error')
      } else {
        showNotification('Failed to list files', 'error')
      }
    }
  }

  // Helper function to refresh current file list
  const refreshFileList = () => {
    storage.refreshDirectory().catch((err) => {
      console.error('Error refreshing directory:', err)
      showNotification('Failed to refresh directory', 'error')
    })
  }

  // Load files when component mounts
  useEffect(() => {
    if (!storage.isLoading && storage.files.length === 0) {
      refreshFileList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle file deletion
  const handleDeleteFile = async (filePath: string) => {
    if (!confirm(`Are you sure you want to delete "${filePath}"?`)) return

    setDeleteTarget(filePath)

    try {
      await storage.deleteFile(filePath)
      showNotification(`Deleted: ${filePath}`, 'success')
    } catch (error: any) {
      console.error('Delete error:', error)
      showNotification('Delete operation failed', 'error')
    } finally {
      setDeleteTarget('')
    }
  }

  // Get signed URL for a file
  const handleGetSignedUrl = async () => {
    if (!signedUrlPath.trim()) {
      setSignUrlError('Please enter a file path')
      return
    }

    setSigningUrl(true)
    setSignUrlError(null)
    setSignedUrl(null)

    try {
      const response = await storage.getFileURL(
        signedUrlPath.trim(),
        signedUrlExpiry * 60
      )
      setSignedUrl(response.url)
      showNotification('Signed URL generated successfully', 'success')
    } catch (error: any) {
      console.error('Signed URL error:', error)
      setSignUrlError('Failed to get signed URL')
      showNotification('Failed to generate signed URL', 'error')
    } finally {
      setSigningUrl(false)
    }
  }

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format file size to human readable
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
    else return (bytes / 1073741824).toFixed(1) + ' GB'
  }

  // Determine if we should show the "up" button
  const canNavigateUp = storage.currentPrefix !== ''

  // Get the file list from storage state
  const fileList = mapFilesToStorageFiles()

  // Render navigation breadcrumbs
  const renderBreadcrumbs = () => {
    if (!storage.currentPrefix)
      return <Chip label="Root" size="small" color="primary" />

    const pathParts = storage.currentPrefix.split('/')
    return (
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
        <Chip
          label="Root"
          size="small"
          clickable
          onClick={() => {
            setListPath('')
            storage.navigateToDirectory('')
          }}
        />

        {pathParts.map((part, index) => {
          if (!part) return null

          const pathToHere = pathParts.slice(0, index + 1).join('/')
          return (
            <React.Fragment key={index}>
              <Typography variant="body2" color="text.secondary">
                /
              </Typography>
              <Chip
                label={part}
                size="small"
                clickable
                onClick={() => {
                  const dirPath = `${pathToHere}/`
                  setListPath(dirPath)
                  storage.navigateToDirectory(dirPath)
                }}
              />
            </React.Fragment>
          )
        })}
      </Box>
    )
  }

  // Show notification
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

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Storage API Tools
      </Typography>

      <Grid container spacing={4}>
        {/* File Operations Section */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Upload sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Upload File</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  id="file-upload"
                  type="file"
                  variant="outlined"
                  fullWidth
                  onChange={handleFileChange}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Storage Path (optional)"
                  variant="outlined"
                  fullWidth
                  value={uploadPath}
                  onChange={(e) => setUploadPath(e.target.value)}
                  placeholder="e.g. images/profile/"
                  helperText="Leave empty to use default location"
                />

                {file && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Selected: {file.name} ({formatFileSize(file.size)})
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={!file || storage.isUploading}
                  startIcon={
                    storage.isUploading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Upload />
                    )
                  }
                >
                  {storage.isUploading ? 'Uploading...' : 'Upload File'}
                </Button>

                {storage.uploadError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {storage.uploadError}
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    File uploaded successfully!
                    {uploadedUrl && (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          value={uploadedUrl}
                          fullWidth
                          size="small"
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <IconButton
                                size="small"
                                onClick={() => copyToClipboard(uploadedUrl)}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            ),
                          }}
                        />
                      </Box>
                    )}
                  </Alert>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <LinkIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Generate Signed URL</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="File Path"
                  variant="outlined"
                  fullWidth
                  value={signedUrlPath}
                  onChange={(e) => setSignedUrlPath(e.target.value)}
                  placeholder="e.g. images/profile/avatar.jpg"
                  error={!!signUrlError}
                  helperText={signUrlError || 'Complete path to the file'}
                />

                <TextField
                  label="Expiry Time (minutes)"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={signedUrlExpiry}
                  onChange={(e) => setSignedUrlExpiry(parseInt(e.target.value))}
                  inputProps={{ min: 1, max: 1440 }} // Max 24 hours
                  helperText="How long the signed URL should be valid (1-1440 minutes)"
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGetSignedUrl}
                  disabled={signingUrl}
                  startIcon={
                    signingUrl ? <CircularProgress size={20} /> : <LinkIcon />
                  }
                >
                  {signingUrl ? 'Generating...' : 'Generate Signed URL'}
                </Button>

                {signedUrl && (
                  <Box
                    sx={{
                      mt: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      Signed URL (Valid for {signedUrlExpiry} minutes):
                    </Typography>
                    <TextField
                      value={signedUrl}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(signedUrl)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => window.open(signedUrl, '_blank')}
                            >
                              <OpenInNew fontSize="small" />
                            </IconButton>
                          </Box>
                        ),
                      }}
                    />
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* File Listing Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={1}
            sx={{ p: 3, mb: 3, height: '100%', borderRadius: 2 }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Browse Files
              </Typography>

              <Box>
                <Tooltip title="Refresh">
                  <IconButton
                    onClick={refreshFileList}
                    color="primary"
                    size="small"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box display="flex" flexWrap="nowrap" gap={1} mb={2}>
              <TextField
                label="Path"
                variant="outlined"
                fullWidth
                size="small"
                value={listPath}
                onChange={(e) => setListPath(e.target.value)}
                placeholder="e.g. images/"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Folder fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleListFiles()}
                disabled={storage.isLoading}
                startIcon={
                  storage.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Search />
                  )
                }
              >
                List
              </Button>

              {canNavigateUp && (
                <Tooltip title="Navigate up">
                  <Button
                    onClick={() => storage.navigateUp()}
                    variant="outlined"
                  >
                    Up
                  </Button>
                </Tooltip>
              )}
            </Box>

            {/* Navigation breadcrumbs */}
            <Box mb={2}>{renderBreadcrumbs()}</Box>

            {/* Error message if listing fails */}
            {storage.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {storage.error}
              </Alert>
            )}

            {/* File listing table */}
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 500, overflow: 'auto' }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storage.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <CircularProgress size={24} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  ) : fileList.length > 0 ? (
                    fileList.map((file) => (
                      <TableRow key={file.path} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{ mr: 1 }}
                            >
                              📁
                            </Typography>
                            <Tooltip title={file.path}>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: '200px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {file.name}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatFileSize(file.size)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {new Date(file.updatedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            gap={0.5}
                          >
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                onClick={() => window.open(file.url, '_blank')}
                                color="primary"
                              >
                                <CloudDownload fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Copy Path">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  copyToClipboard(file.path)
                                  showNotification(
                                    'Path copied to clipboard',
                                    'success'
                                  )
                                }}
                                color="primary"
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteFile(file.path)}
                                color="error"
                                disabled={
                                  storage.isDeleting &&
                                  deleteTarget === file.path
                                }
                              >
                                {storage.isDeleting &&
                                deleteTarget === file.path ? (
                                  <CircularProgress size={18} />
                                ) : (
                                  <Delete fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          {storage.currentPrefix
                            ? `No files found in "${storage.currentPrefix}"`
                            : 'No files found in root directory'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

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
function setCopied(arg0: boolean): void {
  throw new Error('Function not implemented.')
}
