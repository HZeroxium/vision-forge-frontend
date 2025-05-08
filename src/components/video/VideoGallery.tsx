'use client'
import React, { useEffect, useState } from 'react'
import {
  Typography,
  CircularProgress,
  Box,
  Pagination,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Skeleton,
  Paper,
  SelectChangeEvent,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Fade,
  Badge,
  Alert,
  alpha,
} from '@mui/material'
import {
  Search,
  FilterAlt,
  ViewModule,
  ViewList,
  SortRounded,
  Close,
  ClearAll,
  ArrowUpward,
  Movie,
  VideoLibrary,
  PersonOutline,
  Public,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import Grid from '@mui/material/Grid2'
import { useVideos } from '@hooks/useVideos'
import VideoCard from './VideoCard'
import { staggerContainer, fadeIn } from '@/utils/animations'
import { Video } from '@/services/videoService'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionButton = motion(Button)

// Define the gallery layout types
type LayoutType = 'grid' | 'list'

// Define props for VideoGallery component
interface VideoGalleryProps {
  mode?: 'all' | 'user'
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ mode = 'all' }) => {
  // Get the appropriate state and actions based on mode
  const {
    // Common states for both modes
    currentVideo,
    currentVideoLoading,
    currentVideoError,

    // For 'all' mode
    videos,
    loading,
    error,
    page,
    totalPages,

    // For 'user' mode
    userVideos,
    userLoading,
    userError,
    userPage,
    userTotalPages,

    // Actions
    loadVideos,
    loadUserVideos,
    deleteVideo,
    clearError,
    clearUserError,
  } = useVideos()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('grid')
  const [filterCount, setFilterCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const skeletonArray = Array.from({ length: 6 }, (_, i) => i)

  // Determine which data, loading state, and error to use based on mode
  const currentVideos = mode === 'all' ? videos : userVideos
  const currentLoading = mode === 'all' ? loading : userLoading
  const currentError = mode === 'all' ? error : userError
  const currentPage = mode === 'all' ? page : userPage
  const currentTotalPages = mode === 'all' ? totalPages : userTotalPages

  // Choose the appropriate load function based on mode
  const loadCurrentVideos = mode === 'all' ? loadVideos : loadUserVideos
  const clearCurrentError = mode === 'all' ? clearError : clearUserError

  // Load videos when the component mounts or when page changes
  useEffect(() => {
    // Only fetch if there is no error to prevent auto-retry spam
    if (!currentError) {
      loadCurrentVideos(currentPage, 12)
    }
  }, [loadCurrentVideos, currentPage, currentError])

  // Calculate filter count when filters change
  useEffect(() => {
    let count = 0
    if (searchTerm) count++
    if (sortBy !== 'newest') count++
    setFilterCount(count)
  }, [searchTerm, sortBy])

  // Track scroll for floating back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => loadCurrentVideos(value, 12), 300)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleFilterView = () => {
    setFilterOpen(!filterOpen)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSortBy('newest')
  }

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout)
  }

  // Handle delete button (only available in user mode)
  const handleDelete = async (id: string) => {
    if (mode !== 'user') return

    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id)
      } catch (error) {
        console.error('Failed to delete video:', error)
      }
    }
  }

  // Filter videos based on search term
  const filteredVideos = currentVideos.filter(
    (video) =>
      video.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort videos based on selected sort option
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status)
    }
    return 0
  })

  // Get grid columns based on layout and screen size
  const getGridItemSize = () => {
    if (layout === 'list') {
      return { xs: 12, sm: 12, md: 12 }
    }
    return { xs: 12, sm: 6, md: 4 }
  }

  const getGridGap = () => {
    return layout === 'list' ? 1.5 : 2
  }

  const renderFilterBar = () => (
    <MotionPaper
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        backgroundColor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        fullWidth
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 0 2px rgba(0,0,0,0.05)',
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${theme.palette.secondary.light}`,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchTerm('')}
                edge="end"
              >
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          alignItems: 'center',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="sort-by-label" sx={{ borderRadius: 2 }}>
            Sort by
          </InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            label="Sort by"
            onChange={handleSortChange}
            startAdornment={
              <SortRounded fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
            }
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
            <MenuItem value="status">By status</MenuItem>
          </Select>
        </FormControl>

        {filterCount > 0 && (
          <Tooltip title="Clear all filters">
            <IconButton
              onClick={handleClearFilters}
              color="secondary"
              component={motion.button}
              whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.9 }}
            >
              <ClearAll />
            </IconButton>
          </Tooltip>
        )}

        <Fade in={true}>
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              p: 0.5,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              ml: { xs: 0, sm: 1 },
            }}
          >
            {(['grid', 'list'] as LayoutType[]).map((layoutType) => (
              <Tooltip
                key={layoutType}
                title={`${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)} view`}
              >
                <IconButton
                  size="small"
                  onClick={() => handleLayoutChange(layoutType)}
                  color={layout === layoutType ? 'secondary' : 'default'}
                  sx={{
                    bgcolor:
                      layout === layoutType ? 'action.selected' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {layoutType === 'grid' ? <ViewModule /> : <ViewList />}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Fade>
      </Box>
    </MotionPaper>
  )

  if (currentError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Alert
          severity="error"
          sx={{
            mb: 2,
            width: '100%',
            maxWidth: 500,
            borderRadius: 2,
          }}
        >
          Oops! Failed to load videos. {currentError}
        </Alert>
        <MotionButton
          variant="contained"
          color="secondary"
          onClick={() => {
            clearCurrentError()
            loadCurrentVideos(currentPage, 12)
          }}
          sx={{ mt: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry Loading
        </MotionButton>
      </Box>
    )
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ width: '100%' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          component={motion.h2}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <VideoLibrary color="secondary" />
          {mode === 'user' ? (
            <PersonOutline fontSize="small" />
          ) : (
            <Public fontSize="small" />
          )}
          {currentLoading ? (
            <Box
              component="span"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CircularProgress size={16} sx={{ mr: 1 }} /> Loading...
            </Box>
          ) : (
            `${filteredVideos.length} ${filteredVideos.length === 1 ? 'video' : 'videos'} found`
          )}
        </Typography>

        {isMobile && (
          <Tooltip title={filterOpen ? 'Hide filters' : 'Show filters'}>
            <Badge color="secondary" badgeContent={filterCount} max={9}>
              <IconButton
                onClick={toggleFilterView}
                color="secondary"
                component={motion.button}
                whileHover={{ rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <FilterAlt />
              </IconButton>
            </Badge>
          </Tooltip>
        )}
      </Box>

      {(!isMobile || filterOpen) && renderFilterBar()}

      <AnimatePresence mode="wait">
        {currentLoading ? (
          <MotionBox
            key="loading"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            sx={{ width: '100%' }}
          >
            <Grid container spacing={getGridGap()}>
              {skeletonArray.map((item) => (
                <Grid {...getGridItemSize()} key={item}>
                  <MotionBox
                    variants={fadeIn}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      height: layout === 'list' ? 120 : 290,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={layout === 'list' ? 120 : 180}
                      animation="wave"
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.secondary.main,
                          0.1
                        ),
                      }}
                    />
                    {layout !== 'list' && (
                      <>
                        <Box sx={{ p: 2 }}>
                          <Skeleton variant="text" width="60%" height={24} />
                          <Skeleton variant="text" width="40%" height={20} />
                          <Skeleton variant="text" width="80%" height={16} />
                        </Box>
                      </>
                    )}
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        ) : (
          <MotionBox
            key="content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            sx={{ width: '100%' }}
          >
            <Grid container spacing={getGridGap()}>
              {sortedVideos.map((video, index) => (
                <Grid {...getGridItemSize()} key={video.id}>
                  <motion.div variants={fadeIn} style={{ height: '100%' }}>
                    <VideoCard
                      video={video}
                      onDelete={mode === 'user' ? handleDelete : undefined}
                      layout={layout}
                      index={index}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        )}
      </AnimatePresence>

      {sortedVideos.length === 0 && !currentLoading && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            mt: 4,
          }}
        >
          <Movie sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No videos found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? 'Try adjusting your search or filters'
              : mode === 'user'
                ? 'Create your first video to get started'
                : 'No videos are available yet'}
          </Typography>
          {searchTerm && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => setSearchTerm('')}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Search
            </Button>
          )}
        </MotionBox>
      )}

      {currentTotalPages > 1 && !currentLoading && sortedVideos.length > 0 && (
        <MotionBox
          display="flex"
          justifyContent="center"
          mt={4}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Pagination
            count={currentTotalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
            size={isMobile ? 'small' : 'medium'}
            siblingCount={isMobile ? 0 : 1}
            sx={{
              '& .MuiPaginationItem-root': {
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.secondary.contrastText,
                },
              },
            }}
          />
        </MotionBox>
      )}

      {scrolled && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 10,
          }}
        >
          <IconButton
            color="secondary"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
            onClick={scrollToTop}
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUpward />
          </IconButton>
        </MotionBox>
      )}
    </MotionBox>
  )
}

export default VideoGallery
