// src/components/media/AudioGallery.tsx
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
  Tabs,
  Tab,
  Tooltip,
  Fade,
  Badge,
  Alert,
  alpha,
} from '@mui/material'
import {
  Search,
  FilterAlt,
  ViewList,
  GridView,
  SortRounded,
  Close,
  ClearAll,
  ViewModule,
  ArrowUpward,
  Audiotrack,
  MusicNote,
  QueueMusic,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Grid from '@mui/material/Grid2'
import { useAudios } from '@hooks/useAudios'
import AudioCard from './AudioCard'
import { staggerContainer, staggerFast, fadeIn } from '@/utils/animations'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionButton = motion(Button)
const MotionTypography = motion(Typography)
const MotionIconButton = motion(IconButton)

// Define the gallery layout types
type LayoutType = 'grid' | 'list' | 'compact'

// Define props for AudioGallery component
interface AudioGalleryProps {
  mode?: 'all' | 'user'
}

const AudioGallery: React.FC<AudioGalleryProps> = ({ mode = 'all' }) => {
  const {
    // All audios state
    audios,
    loading,
    error,
    page,
    totalPages,
    loadAudios,
    clearError,

    // User audios state
    userAudios,
    userLoading,
    userError,
    userPage,
    userTotalPages,
    loadUserAudios,
    clearUserError,

    // Actions
    deleteAudio,
  } = useAudios()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('grid')
  const [filterCount, setFilterCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Increase skeleton array size for a better loading experience
  const skeletonArray = Array.from({ length: 12 }, (_, i) => i)

  // Determine which data, loading state, and error to use based on mode
  const currentAudios = mode === 'all' ? audios : userAudios
  const currentLoading = mode === 'all' ? loading : userLoading
  const currentError = mode === 'all' ? error : userError
  const currentPage = mode === 'all' ? page : userPage
  const currentTotalPages = mode === 'all' ? totalPages : userTotalPages

  // Choose the appropriate load function based on mode
  const loadCurrentAudios = mode === 'all' ? loadAudios : loadUserAudios
  const clearCurrentError = mode === 'all' ? clearError : clearUserError

  useEffect(() => {
    // Only fetch audios if there is no error (avoid auto-retry spam)
    if (!currentError) {
      loadCurrentAudios(currentPage, 12)
    }
  }, [loadCurrentAudios, currentPage, currentError])

  useEffect(() => {
    // Calculate filter count - this helps visually indicate when filters are active
    let count = 0
    if (searchTerm) count++
    if (sortBy !== 'newest') count++
    setFilterCount(count)
  }, [searchTerm, sortBy])

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
    setTimeout(() => loadCurrentAudios(value, 12), 300)
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

  const handleDelete = async (id: string) => {
    if (mode !== 'user') return

    if (confirm('Are you sure you want to delete this audio?')) {
      try {
        await deleteAudio(id)
      } catch (error) {
        console.error('Failed to delete audio:', error)
      }
    }
  }

  const filteredAudios = currentAudios.filter(
    (audio) =>
      (audio.provider &&
        audio.provider.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audio.script &&
        audio.script.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const sortedAudios = [...filteredAudios].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy === 'duration') {
      return b.durationSeconds - a.durationSeconds
    } else if (sortBy === 'name') {
      return (a.provider || '').localeCompare(b.provider || '')
    }
    return 0
  })

  // Get grid columns based on layout and screen size - fixed for even distribution
  const getGridItemSize = () => {
    if (layout === 'list') {
      return { xs: 12 }
    }
    if (layout === 'compact') {
      // Ensure we have even rows with 2, 3, 4, or 6 items per row depending on screen size
      return { xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }
    }
    // For standard grid, ensure we have 1, 2, 3, or 4 items per row
    return { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }
  }

  const getGridGap = () => {
    if (layout === 'compact') return 1.5
    return 3
  }

  const getLayoutIcon = (layoutType: LayoutType) => {
    switch (layoutType) {
      case 'grid':
        return <GridView />
      case 'compact':
        return <ViewModule />
      case 'list':
        return <ViewList />
    }
  }

  const renderFilterBar = () => (
    <MotionPaper
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        backdropFilter: 'blur(10px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search audios..."
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        fullWidth
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            backgroundColor: alpha(theme.palette.background.default, 0.6),
            '&:hover': {
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search
                color="action"
                sx={{
                  opacity: 0.8,
                  color: theme.palette.primary.main,
                }}
              />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchTerm('')}
                edge="end"
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
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
          gap: 1.5,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          alignItems: 'center',
        }}
      >
        <FormControl
          size="small"
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backdropFilter: 'blur(8px)',
              backgroundColor: alpha(theme.palette.background.default, 0.6),
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
          }}
        >
          <InputLabel id="sort-by-label" sx={{ borderRadius: 2 }}>
            Sort by
          </InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            label="Sort by"
            onChange={handleSortChange}
            startAdornment={
              <SortRounded
                fontSize="small"
                sx={{
                  mr: 0.5,
                  color: theme.palette.primary.main,
                  opacity: 0.8,
                }}
              />
            }
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
            <MenuItem value="duration">Duration</MenuItem>
            <MenuItem value="name">Provider name</MenuItem>
          </Select>
        </FormControl>

        {filterCount > 0 && (
          <Tooltip title="Clear all filters">
            <MotionIconButton
              onClick={handleClearFilters}
              color="primary"
              sx={{
                backdropFilter: 'blur(8px)',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
              whileHover={{ rotate: 180, transition: { duration: 0.5 } }}
              whileTap={{ scale: 0.9 }}
            >
              <ClearAll />
            </MotionIconButton>
          </Tooltip>
        )}

        <Fade in={true}>
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              p: 0.5,
              border: 1,
              borderColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: 2,
              ml: { xs: 0, sm: 1 },
              backdropFilter: 'blur(8px)',
              backgroundColor: alpha(theme.palette.background.default, 0.4),
            }}
          >
            {(['grid', 'compact', 'list'] as LayoutType[]).map((layoutType) => (
              <Tooltip
                key={layoutType}
                title={`${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)} view`}
              >
                <MotionIconButton
                  size="small"
                  onClick={() => handleLayoutChange(layoutType)}
                  color={layout === layoutType ? 'primary' : 'default'}
                  sx={{
                    bgcolor:
                      layout === layoutType
                        ? alpha(theme.palette.primary.main, 0.2)
                        : 'transparent',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {getLayoutIcon(layoutType)}
                </MotionIconButton>
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
            mb: 3,
            width: '100%',
            maxWidth: 550,
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          }}
        >
          Oops! Failed to load audio files. {currentError}
        </Alert>
        <MotionButton
          variant="contained"
          color="primary"
          onClick={() => {
            clearCurrentError()
            loadCurrentAudios(currentPage, 12)
          }}
          sx={{
            mt: 2,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 6px 15px rgba(0,0,0,0.2)' }}
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
          mb: 3,
        }}
      >
        <MotionTypography
          variant="h6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <QueueMusic sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          {currentLoading ? (
            <Box
              component="span"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CircularProgress
                size={18}
                sx={{ mr: 1.5, color: theme.palette.primary.main }}
              />
              Loading...
            </Box>
          ) : (
            `${filteredAudios.length} ${filteredAudios.length === 1 ? 'audio' : 'audios'} found`
          )}
        </MotionTypography>

        {isMobile && (
          <Tooltip title={filterOpen ? 'Hide filters' : 'Show filters'}>
            <Badge
              color="primary"
              badgeContent={filterCount}
              max={9}
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 'bold',
                },
              }}
            >
              <MotionIconButton
                onClick={toggleFilterView}
                sx={{
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FilterAlt />
              </MotionIconButton>
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
                      borderRadius: layout === 'list' ? 2 : 3,
                      overflow: 'hidden',
                      height:
                        layout === 'list'
                          ? 100
                          : layout === 'compact'
                            ? 200
                            : 260,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={
                        layout === 'list'
                          ? 100
                          : layout === 'compact'
                            ? 100
                            : 140
                      }
                      animation="wave"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        opacity: 0.7,
                      }}
                    />
                    {layout !== 'list' && (
                      <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Skeleton
                          variant="text"
                          width="60%"
                          height={24}
                          animation="wave"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        />
                        <Skeleton
                          variant="text"
                          width="80%"
                          height={16}
                          animation="wave"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          }}
                        />
                        {layout !== 'compact' && (
                          <>
                            <Skeleton
                              variant="text"
                              width="100%"
                              height={12}
                              animation="wave"
                              sx={{
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.03
                                ),
                                mt: 1,
                              }}
                            />
                            <Skeleton
                              variant="text"
                              width="90%"
                              height={12}
                              animation="wave"
                              sx={{
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.03
                                ),
                              }}
                            />
                          </>
                        )}
                      </Box>
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
              {sortedAudios.map((audio, index) => (
                <Grid {...getGridItemSize()} key={audio.id}>
                  <motion.div
                    variants={fadeIn}
                    style={{ height: '100%' }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <AudioCard
                      audio={audio}
                      index={index}
                      onDelete={mode === 'user' ? handleDelete : undefined}
                      compact={layout === 'compact'}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        )}
      </AnimatePresence>

      {sortedAudios.length === 0 && !currentLoading && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mt: 4,
          }}
        >
          <MusicNote
            sx={{
              fontSize: 80,
              color: alpha(theme.palette.primary.main, 0.2),
              mb: 3,
            }}
          />
          <MotionTypography
            variant="h5"
            color="text.primary"
            gutterBottom
            fontWeight="medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No audio files found
          </MotionTypography>
          <MotionTypography
            variant="body1"
            color="text.secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {searchTerm
              ? 'Try adjusting your search or filters'
              : mode === 'user'
                ? 'Create your first audio to get started'
                : 'No audio files are available yet'}
          </MotionTypography>
          {searchTerm ? (
            <MotionButton
              variant="outlined"
              sx={{
                mt: 3,
                borderRadius: 2,
                px: 3,
                py: 1,
                borderColor: alpha(theme.palette.primary.main, 0.5),
              }}
              onClick={() => setSearchTerm('')}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Search
            </MotionButton>
          ) : (
            mode === 'user' && (
              <MotionButton
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
                onClick={() => router.push('/flow/generate-audio')}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                Create Audio
              </MotionButton>
            )
          )}
        </MotionBox>
      )}

      {currentTotalPages > 1 && !currentLoading && sortedAudios.length > 0 && (
        <MotionBox
          display="flex"
          justifyContent="center"
          mt={5}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Pagination
            count={currentTotalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            siblingCount={isMobile ? 0 : 1}
            sx={{
              '& .MuiPaginationItem-root': {
                transition: 'all 0.3s ease',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  color: theme.palette.primary.main,
                },
                '&.Mui-selected': {
                  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              },
            }}
          />
        </MotionBox>
      )}

      {scrolled && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 10,
          }}
        >
          <MotionIconButton
            color="primary"
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
              },
            }}
            onClick={scrollToTop}
            whileHover={{
              scale: 1.1,
              rotate: 0,
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUpward />
          </MotionIconButton>
        </MotionBox>
      )}
    </MotionBox>
  )
}

export default AudioGallery
