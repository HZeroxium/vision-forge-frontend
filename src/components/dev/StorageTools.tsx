// /src/components/dev/StorageTools.tsx

'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
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
  useTheme,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  ExpandMore,
  Upload,
  Delete,
  Folder,
  Search,
  Refresh,
  CloudDownload,
  Link as LinkIcon,
  ContentCopy,
  OpenInNew,
  ArrowUpward,
  FolderOpen,
  AttachFile,
  Info,
  Home,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useStorage } from '@/hooks/useStorage'
import { FileType } from '@/services/storageService'

// Styled components using motion
const MotionPaper = motion(Paper)
const MotionBox = motion(Box)
const MotionButton = motion(Button)
const MotionIconButton = motion(IconButton)

// Define interfaces for storage items
interface StorageFile {
  name: string
  path: string
  size: number
  url: string
  contentType: string
  updatedAt: string
}

// Component for file upload section
const FileUploadSection = ({
  showNotification,
}: {
  showNotification: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void
}) => {
  const storage = useStorage()
  const theme = useTheme()
  const [file, setFile] = useState<File | null>(null)
  const [uploadPath, setUploadPath] = useState('')
  const [customFilename, setCustomFilename] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [filenameError, setFilenameError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Format file size to human readable
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
    else return (bytes / 1073741824).toFixed(1) + ' GB'
  }

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)

      // Auto-populate the custom filename field
      setCustomFilename(selectedFile.name)

      storage.clearErrors()
      setFilenameError(null)
      setUploadSuccess(false)
      setUploadedUrl(null)
      setUploadProgress(0)
    }
  }

  // Validate the custom filename
  const validateFilename = (filename: string): boolean => {
    if (!filename.trim()) {
      setFilenameError('Filename cannot be empty')
      return false
    }

    // Check for invalid characters in filename
    const invalidChars = /[\\/:*?"<>|]/
    if (invalidChars.test(filename)) {
      setFilenameError(
        'Filename contains invalid characters: \\ / : * ? " < > |'
      )
      return false
    }

    setFilenameError(null)
    return true
  }

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      showNotification('Please select a file first', 'error')
      return
    }

    if (customFilename && !validateFilename(customFilename)) {
      showNotification('Invalid filename', 'error')
      return
    }

    try {
      const folder = uploadPath.trim() || undefined
      const filenameToUse = customFilename.trim() || undefined

      // Track upload progress
      const onProgress = (progress: number) => {
        setUploadProgress(progress)
      }

      const response = await storage.uploadFile(
        file,
        FileType.OTHER,
        filenameToUse,
        folder,
        onProgress // Pass the progress callback
      )

      setUploadedUrl(response.url)
      setUploadSuccess(true)
      setFile(null)
      setCustomFilename('')

      const fileInput = document.getElementById(
        'file-upload'
      ) as HTMLInputElement
      if (fileInput) fileInput.value = ''

      showNotification('File uploaded successfully', 'success')
    } catch (error: any) {
      console.error('Upload error:', error)
      showNotification(
        'Upload failed: ' + (error.message || 'Unknown error'),
        'error'
      )
    }
  }

  // Copy to clipboard functionality
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showNotification('Copied to clipboard', 'success')
  }

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Upload color="primary" />
        File Upload
      </Typography>

      <Box
        component="form"
        sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          id="file-upload"
          type="file"
          variant="outlined"
          fullWidth
          onChange={handleFileChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
        />

        <TextField
          label="Custom Filename"
          variant="outlined"
          fullWidth
          value={customFilename}
          onChange={(e) => setCustomFilename(e.target.value)}
          placeholder="e.g. my-custom-filename.jpg"
          helperText={
            filenameError || "Leave empty to use the file's original name"
          }
          error={!!filenameError}
          disabled={!file}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
        />

        <TextField
          label="Storage Path"
          variant="outlined"
          fullWidth
          value={uploadPath}
          onChange={(e) => setUploadPath(e.target.value)}
          placeholder="e.g. images/profile/"
          helperText="Leave empty to use default location"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FolderOpen fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
        />

        {file && (
          <Alert
            severity="info"
            icon={<AttachFile fontSize="inherit" />}
            sx={{
              borderRadius: 1.5,
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Selected: {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {formatFileSize(file.size)}
            </Typography>
          </Alert>
        )}

        {storage.isUploading && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgressWithLabel value={uploadProgress} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >{`${Math.round(uploadProgress)}%`}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        <MotionButton
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || storage.isUploading || !!filenameError}
          startIcon={
            storage.isUploading ? <CircularProgress size={20} /> : <Upload />
          }
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            mt: 1,
            borderRadius: 1.5,
            py: 1.2,
            boxShadow: theme.shadows[2],
          }}
        >
          {storage.isUploading ? 'Uploading...' : 'Upload File'}
        </MotionButton>

        {storage.uploadError && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
            {storage.uploadError}
          </Alert>
        )}

        {uploadSuccess && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 1.5 }}>
            <Typography>File uploaded successfully!</Typography>
            {uploadedUrl && (
              <Box sx={{ mt: 1 }}>
                <TextField
                  value={uploadedUrl}
                  fullWidth
                  size="small"
                  sx={{ borderRadius: 1.5 }}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <MotionIconButton
                        size="small"
                        onClick={() => copyToClipboard(uploadedUrl)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ContentCopy fontSize="small" />
                      </MotionIconButton>
                    ),
                  }}
                />
              </Box>
            )}
          </Alert>
        )}
      </Box>
    </MotionPaper>
  )
}

// Component for linear progress with label
const LinearProgressWithLabel = (props: { value: number }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        position: 'relative',
        height: 8,
        borderRadius: 4,
        bgcolor: 'rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${props.value}%`,
          bgcolor: theme.palette.primary.main,
          borderRadius: 4,
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </Box>
  )
}

// Component for signed URL generation
const SignedUrlSection = ({
  showNotification,
}: {
  showNotification: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void
}) => {
  const storage = useStorage()
  const theme = useTheme()
  const [signedUrlPath, setSignedUrlPath] = useState('')
  const [signedUrlExpiry, setSignedUrlExpiry] = useState(60)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [signUrlError, setSignUrlError] = useState<string | null>(null)
  const [signingUrl, setSigningUrl] = useState(false)

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

  // Copy to clipboard functionality
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showNotification('Copied to clipboard', 'success')
  }

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <LinkIcon color="primary" />
        Generate Signed URL
      </Typography>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="File Path"
          variant="outlined"
          fullWidth
          value={signedUrlPath}
          onChange={(e) => setSignedUrlPath(e.target.value)}
          placeholder="e.g. images/profile/avatar.jpg"
          error={!!signUrlError}
          helperText={signUrlError || 'Complete path to the file'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachFile fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
        />

        <TextField
          label="Expiry Time (minutes)"
          variant="outlined"
          type="number"
          fullWidth
          value={signedUrlExpiry}
          onChange={(e) => setSignedUrlExpiry(parseInt(e.target.value) || 60)}
          inputProps={{ min: 1, max: 1440 }} // Max 24 hours
          helperText="How long the signed URL should be valid (1-1440 minutes)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Info fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
        />

        <MotionButton
          variant="contained"
          color="primary"
          onClick={handleGetSignedUrl}
          disabled={signingUrl}
          startIcon={signingUrl ? <CircularProgress size={20} /> : <LinkIcon />}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            mt: 1,
            borderRadius: 1.5,
            py: 1.2,
            boxShadow: theme.shadows[2],
          }}
        >
          {signingUrl ? 'Generating...' : 'Generate Signed URL'}
        </MotionButton>

        {signedUrl && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 2,
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" fontWeight="medium" color="primary">
              Signed URL (Valid for {signedUrlExpiry} minutes):
            </Typography>
            <TextField
              value={signedUrl}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <MotionIconButton
                      size="small"
                      onClick={() => copyToClipboard(signedUrl)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ContentCopy fontSize="small" />
                    </MotionIconButton>
                    <MotionIconButton
                      size="small"
                      onClick={() => window.open(signedUrl, '_blank')}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <OpenInNew fontSize="small" />
                    </MotionIconButton>
                  </Box>
                ),
              }}
            />
          </MotionBox>
        )}
      </Box>
    </MotionPaper>
  )
}

// Component for file browser
const FileBrowserSection = ({
  showNotification,
}: {
  showNotification: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void
}) => {
  const storage = useStorage()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [listPath, setListPath] = useState('')
  const [deleteTarget, setDeleteTarget] = useState('')

  // Map files from storage state
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

  // Handle listing files
  const handleListFiles = async () => {
    try {
      await storage.navigateToDirectory(listPath.trim())
    } catch (error: any) {
      console.error('List error:', error)
      showNotification('Failed to list files', 'error')
    }
  }

  // Refresh current file list
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

  // Format file size to human readable
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
    else return (bytes / 1073741824).toFixed(1) + ' GB'
  }

  // Determine if we can navigate up
  const canNavigateUp = storage.currentPrefix !== ''

  // Get the file list
  const fileList = mapFilesToStorageFiles()

  // Copy to clipboard functionality
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showNotification('Copied to clipboard', 'success')
  }

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography
          variant="h6"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <FolderOpen color="primary" />
          File Browser
        </Typography>

        <MotionIconButton
          onClick={refreshFileList}
          color="primary"
          size="small"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
        >
          <Refresh />
        </MotionIconButton>
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
        />

        <MotionButton
          variant="contained"
          color="primary"
          onClick={() => handleListFiles()}
          disabled={storage.isLoading}
          startIcon={
            storage.isLoading ? <CircularProgress size={20} /> : <Search />
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            borderRadius: 1.5,
            minWidth: isMobile ? '80px' : '120px',
          }}
        >
          {isMobile ? '' : 'List'}
          {!isMobile && <Search sx={{ ml: 1 }} />}
          {isMobile && <Search />}
        </MotionButton>

        {canNavigateUp && (
          <MotionButton
            onClick={() => storage.navigateUp()}
            variant="outlined"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              borderRadius: 1.5,
              minWidth: isMobile ? '80px' : '120px',
            }}
          >
            {isMobile ? <ArrowUpward /> : 'Up'}
            {!isMobile && <ArrowUpward sx={{ ml: 1 }} />}
          </MotionButton>
        )}
      </Box>

      {/* Breadcrumbs navigation */}
      <BreadcrumbsNavigation
        currentPrefix={storage.currentPrefix}
        setListPath={setListPath}
        navigateToDirectory={(path: string) =>
          storage.navigateToDirectory(path)
        }
      />

      {/* Error message if listing fails */}
      {storage.error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
          {storage.error}
        </Alert>
      )}

      {/* File listing table */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          maxHeight: 500,
          overflow: 'auto',
          mt: 2,
          borderRadius: 1.5,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell
                align="right"
                sx={{ display: { xs: 'none', sm: 'table-cell' } }}
              >
                Size
              </TableCell>
              <TableCell
                align="right"
                sx={{ display: { xs: 'none', md: 'table-cell' } }}
              >
                Updated
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storage.isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : fileList.length > 0 ? (
              fileList.map((file) => (
                <MotionBox
                  key={file.path}
                  whileHover={{ backgroundColor: theme.palette.action.hover }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <FileIcon contentType={file.contentType} />
                      <Tooltip title={file.path}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: { xs: '120px', sm: '200px', md: '300px' },
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
                  <TableCell
                    align="right"
                    sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                  >
                    <Typography variant="body2">
                      {formatFileSize(file.size)}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  >
                    <Typography variant="body2">
                      {new Date(file.updatedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <FileActions
                      file={file}
                      deleteTarget={deleteTarget}
                      isDeleting={
                        storage.isDeleting && deleteTarget === file.path
                      }
                      onCopyPath={() => copyToClipboard(file.path)}
                      onDeleteFile={() => handleDeleteFile(file.path)}
                    />
                  </TableCell>
                </MotionBox>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <FolderOpen sx={{ fontSize: 40, opacity: 0.5 }} />
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
    </MotionPaper>
  )
}

// Component for breadcrumbs navigation
const BreadcrumbsNavigation = ({
  currentPrefix,
  setListPath,
  navigateToDirectory,
}: {
  currentPrefix: string
  setListPath: (path: string) => void
  navigateToDirectory: (path: string) => void
}) => {
  const theme = useTheme()

  if (!currentPrefix) {
    return (
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} my={2}>
        <Chip
          label="Root"
          size="small"
          color="primary"
          icon={<Home fontSize="small" />}
          sx={{
            fontWeight: 'medium',
            borderRadius: 1,
          }}
        />
      </Box>
    )
  }

  const pathParts = currentPrefix.split('/')

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} my={2}>
      <MotionChip
        label="Root"
        size="small"
        clickable
        icon={<Home fontSize="small" />}
        onClick={() => {
          setListPath('')
          navigateToDirectory('')
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          borderRadius: 1,
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
            <MotionChip
              label={part}
              size="small"
              clickable
              onClick={() => {
                const dirPath = `${pathToHere}/`
                setListPath(dirPath)
                navigateToDirectory(dirPath)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: 1,
              }}
            />
          </React.Fragment>
        )
      })}
    </Box>
  )
}

// Motion Chip component
const MotionChip = motion(Chip)

// Component for file actions
const FileActions = ({
  file,
  deleteTarget,
  isDeleting,
  onCopyPath,
  onDeleteFile,
}: {
  file: StorageFile
  deleteTarget: string
  isDeleting: boolean
  onCopyPath: () => void
  onDeleteFile: () => void
}) => {
  return (
    <Box display="flex" justifyContent="flex-end" gap={0.5}>
      <Tooltip title="Download">
        <MotionIconButton
          size="small"
          onClick={() => window.open(file.url, '_blank')}
          color="primary"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <CloudDownload fontSize="small" />
        </MotionIconButton>
      </Tooltip>

      <Tooltip title="Copy Path">
        <MotionIconButton
          size="small"
          onClick={onCopyPath}
          color="primary"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ContentCopy fontSize="small" />
        </MotionIconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <MotionIconButton
          size="small"
          onClick={onDeleteFile}
          color="error"
          disabled={isDeleting}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {isDeleting ? (
            <CircularProgress size={18} />
          ) : (
            <Delete fontSize="small" />
          )}
        </MotionIconButton>
      </Tooltip>
    </Box>
  )
}

// Component that returns appropriate file icon based on content type
const FileIcon = ({ contentType }: { contentType: string }) => {
  const getFileIcon = () => {
    if (contentType.includes('image')) {
      return '🖼️'
    } else if (contentType.includes('video')) {
      return '🎬'
    } else if (contentType.includes('audio')) {
      return '🎵'
    } else if (contentType.includes('text') || contentType.includes('json')) {
      return '📄'
    } else if (contentType.includes('pdf')) {
      return '📑'
    } else if (
      contentType.includes('zip') ||
      contentType.includes('compress')
    ) {
      return '📦'
    } else {
      return '📁'
    }
  }

  return (
    <Typography variant="body2" component="span" sx={{ mr: 1 }}>
      {getFileIcon()}
    </Typography>
  )
}

// Main component that combines all sections
export default function StorageTools() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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

  // Show notification function to be passed to child components
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

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Storage API Tools
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage files in cloud storage. Upload files, generate signed URLs, and
          browse your files.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* File operations section - On mobile, stack vertically */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FileUploadSection showNotification={showNotification} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <SignedUrlSection showNotification={showNotification} />
            </Grid>
          </Grid>
        </Grid>

        {/* File browser section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FileBrowserSection showNotification={showNotification} />
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
          sx={{ boxShadow: theme.shadows[3], borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </MotionBox>
  )
}
