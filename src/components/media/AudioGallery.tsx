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

// Define the gallery layout types
type LayoutType = 'grid' | 'list' | 'compact'

const AudioGallery: React.FC = () => {
  const { audios, loading, error, page, totalPages, loadAudios, clearError } =
    useAudios()
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

  const skeletonArray = Array.from({ length: 6 }, (_, i) => i)

  useEffect(() => {
    // Only fetch audios if there is no error to prevent auto-retry spam
    if (!error) {
      loadAudios(page, 12)
    }
  }, [loadAudios, page, error])

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
    setTimeout(() => loadAudios(value, 12), 300)
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

  const handleDelete = (id: string) => {
    // Implementation for delete functionality
    console.log('Delete audio with id:', id)
  }

  const filteredAudios = audios.filter(
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

  // Get grid columns based on layout and screen size
  const getGridColumns = () => {
    if (layout === 'compact') {
      return {
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }
    }
    if (layout === 'list') {
      return {
        xs: '1fr',
        sm: '1fr',
        md: '1fr',
        lg: '1fr',
      }
    }
    return {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(3, 1fr)',
    }
  }

  const getGridItemSize = () => {
    if (layout === 'list') {
      return { xs: 12, sm: 12, md: 12 }
    }
    if (layout === 'compact') {
      return { xs: 12, sm: 6, md: 4, lg: 3 }
    }
    return { xs: 12, sm: 6, md: 4 }
  }

  const getGridGap = () => {
    if (layout === 'compact') return 1
    return 2
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
            '&:hover': {
              boxShadow: '0 0 0 2px rgba(0,0,0,0.05)',
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
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
            <MenuItem value="duration">Duration</MenuItem>
            <MenuItem value="name">Provider name</MenuItem>
          </Select>
        </FormControl>

        {filterCount > 0 && (
          <Tooltip title="Clear all filters">
            <IconButton
              onClick={handleClearFilters}
              color="primary"
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
            {(['grid', 'compact', 'list'] as LayoutType[]).map((layoutType) => (
              <Tooltip
                key={layoutType}
                title={`${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)} view`}
              >
                <IconButton
                  size="small"
                  onClick={() => handleLayoutChange(layoutType)}
                  color={layout === layoutType ? 'primary' : 'default'}
                  sx={{
                    bgcolor:
                      layout === layoutType ? 'action.selected' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {getLayoutIcon(layoutType)}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Fade>
      </Box>
    </MotionPaper>
  )

  if (error) {
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
          Oops! Failed to load audio files. {error}
        </Alert>
        <MotionButton
          variant="contained"
          color="primary"
          onClick={() => {
            clearError()
            loadAudios(page, 12)
          }}
          sx={{ mt: 2 }}
          component={motion.button}
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
          <Audiotrack color="primary" />
          {loading ? (
            <Box
              component="span"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CircularProgress size={16} sx={{ mr: 1 }} /> Loading...
            </Box>
          ) : (
            `${filteredAudios.length} ${filteredAudios.length === 1 ? 'audio' : 'audios'} found`
          )}
        </Typography>

        {isMobile && (
          <Tooltip title={filterOpen ? 'Hide filters' : 'Show filters'}>
            <Badge color="primary" badgeContent={filterCount} max={9}>
              <IconButton
                onClick={toggleFilterView}
                color="primary"
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
        {loading ? (
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
                    component={Paper}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      height: layout === 'list' ? 100 : 250,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={layout === 'list' ? 100 : 140}
                      animation="wave"
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
              {sortedAudios.map((audio, index) => (
                <Grid {...getGridItemSize()} key={audio.id}>
                  <motion.div variants={fadeIn} style={{ height: '100%' }}>
                    <AudioCard
                      audio={audio}
                      index={index}
                      onDelete={handleDelete}
                      compact={layout === 'compact'}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </MotionBox>
        )}
      </AnimatePresence>

      {sortedAudios.length === 0 && !loading && (
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
          <Audiotrack sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No audio files found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
          {searchTerm && (
            <Button
              variant="outlined"
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

      {totalPages > 1 && !loading && sortedAudios.length > 0 && (
        <MotionBox
          display="flex"
          justifyContent="center"
          mt={4}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            siblingCount={isMobile ? 0 : 1}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
              '& .MuiPaginationItem-root': {
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
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
          <IconButton
            color="primary"
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

export default AudioGallery
