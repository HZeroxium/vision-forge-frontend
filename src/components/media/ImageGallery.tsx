// src/components/media/ImageGallery.tsx
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
} from '@mui/material'
import {
  Search,
  FilterList,
  ViewModule,
  ViewQuilt,
  GridView,
  ViewCompact,
  SortRounded,
  Close,
  FilterAlt,
  ClearAll,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useImages } from '@hooks/useImages'
import ImageCard from './ImageCard'
import type { Image } from '@/services/imagesService'
import { staggerContainer, staggerFast, fadeIn } from '@/utils/animations'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

// Define the gallery layout types
type LayoutType = 'grid' | 'compact' | 'cascade' | 'pinterest'

const ImageGallery: React.FC = () => {
  const { images, loading, error, page, totalPages, loadImages } = useImages()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutType>('cascade')
  const [filterCount, setFilterCount] = useState(0)
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

  const skeletonArray = Array.from({ length: 9 }, (_, i) => i)

  useEffect(() => {
    // Only fetch images if there is no error (avoid auto-retry spam)
    if (!error) {
      loadImages(page, 12)
    }
    // page and loadImages are dependencies, error stops auto retry on error state
  }, [loadImages, page, error])

  useEffect(() => {
    // Calculate filter count - this helps visually indicate when filters are active
    let count = 0
    if (searchTerm) count++
    if (sortBy !== 'newest') count++
    setFilterCount(count)
  }, [searchTerm, sortBy])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => loadImages(value, 12), 300)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value)
  }

  const handleCardClick = (id: string) => {
    router.push(`/media/images/${id}`)
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

  const filteredImages = images.filter(
    (img) =>
      img.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (img.style && img.style.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy === 'name') {
      return a.prompt.localeCompare(b.prompt)
    }
    return 0
  })

  // Get grid columns based on layout and screen size
  const getGridColumns = () => {
    if (layout === 'compact') {
      return {
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
        lg: 'repeat(5, 1fr)',
      }
    }
    if (layout === 'cascade' || layout === 'pinterest') {
      return {
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }
    }
    return {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
    }
  }

  // Get grid item height based on layout
  const getItemHeight = (index: number) => {
    if (layout === 'grid' || layout === 'compact') return 'auto'

    // For cascade and pinterest layouts, create varying heights
    if (layout === 'cascade') {
      const heights = ['280px', '320px', '240px', '300px']
      return heights[index % heights.length]
    }

    // Pinterest style with more variation
    const baseHeight = 200
    const variation = index % 3 === 0 ? 80 : index % 3 === 1 ? 40 : 0
    return `${baseHeight + variation}px`
  }

  const getGridGap = () => {
    if (layout === 'compact') return 1
    return 2
  }

  const getLayoutIcon = (layoutType: LayoutType) => {
    switch (layoutType) {
      case 'grid':
        return <ViewModule />
      case 'compact':
        return <ViewCompact />
      case 'cascade':
        return <ViewQuilt />
      case 'pinterest':
        return <GridView />
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
        placeholder="Search images..."
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
            <MenuItem value="name">By name</MenuItem>
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
            {(['grid', 'compact', 'cascade', 'pinterest'] as LayoutType[]).map(
              (layoutType) => (
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
                        layout === layoutType
                          ? 'action.selected'
                          : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {getLayoutIcon(layoutType)}
                  </IconButton>
                </Tooltip>
              )
            )}
          </Box>
        </Fade>
      </Box>
    </MotionPaper>
  )

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h6" color="error">
          Oops! Failed to load images.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => loadImages(page, 12)}
          sx={{ mt: 2 }}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </Button>
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
        >
          {loading ? (
            <Box
              component="span"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CircularProgress size={16} sx={{ mr: 1 }} /> Loading...
            </Box>
          ) : (
            `${filteredImages.length} ${filteredImages.length === 1 ? 'image' : 'images'} found`
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: getGridColumns(),
                gap: getGridGap(),
              }}
            >
              {skeletonArray.map((item) => (
                <MotionBox
                  key={item}
                  variants={fadeIn}
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: getItemHeight(item),
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                  />
                </MotionBox>
              ))}
            </Box>
          </MotionBox>
        ) : (
          <MotionBox
            key="content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            sx={{ width: '100%' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: getGridColumns(),
                gap: getGridGap(),
                alignItems: layout === 'grid' ? 'stretch' : 'start',
              }}
            >
              {sortedImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={fadeIn}
                  style={{
                    height:
                      layout === 'pinterest' || layout === 'cascade'
                        ? getItemHeight(index)
                        : 'auto',
                  }}
                >
                  <ImageCard
                    image={image}
                    index={index}
                    onCardClick={handleCardClick}
                    compact={layout === 'compact'}
                  />
                </motion.div>
              ))}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {sortedImages.length === 0 && !loading && (
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
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No images found
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

      {totalPages > 1 && !loading && sortedImages.length > 0 && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            siblingCount={isMobile ? 0 : 1}
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
        </motion.div>
      )}
    </MotionBox>
  )
}

export default ImageGallery
