// /src/app/media/images/[id]/page.tsx

'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Paper,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowBack,
  ContentCopy,
  Download,
  Share,
  Favorite,
  FavoriteBorder,
  ZoomIn,
  Close,
  Settings,
  Check,
  ZoomOut,
} from '@mui/icons-material'
import { fetchImage } from '@/services/imagesService'
import type { Image } from '@/services/imagesService'
import { slideInFromRight, fadeIn } from '@/utils/animations'

const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionTypography = motion(Typography)
const MotionButton = motion(Button)
const MotionIconButton = motion(IconButton)

export default function ImageDetailPage() {
  const { id } = useParams() // Retrieve image id from URL
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [image, setImage] = useState<Image | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [zoomOpen, setZoomOpen] = useState<boolean>(false)
  const [scale, setScale] = useState<number>(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const constraintsRef = useRef(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Fetch image details using the provided id
    fetchImage(Array.isArray(id) ? id[0] : id)
      .then((data) => {
        setImage(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch image detail')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // Navigate back to the gallery page
  const handleBack = () => {
    router.push('/media/images')
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Here you'd typically save this to a database or localStorage
  }

  const handleCopyPrompt = () => {
    if (image?.prompt) {
      navigator.clipboard.writeText(image.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (image?.url) {
      const link = document.createElement('a')
      link.href = image.url
      link.download = `vision-forge-${image.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = () => {
    if (navigator.share && image) {
      navigator
        .share({
          title: `AI Image: ${image.prompt}`,
          text: `Check out this AI-generated image: ${image.prompt}`,
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing:', err))
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyPrompt()
    }
  }

  const handleZoomToggle = () => {
    setZoomOpen(!zoomOpen)
    // Reset zoom when closing
    if (zoomOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <MotionBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="50vh"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CircularProgress color="primary" />
        <MotionTypography
          variant="body1"
          sx={{ mt: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading image...
        </MotionTypography>
      </MotionBox>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={2}
            sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <MotionButton
              variant="contained"
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Gallery
            </MotionButton>
          </Paper>
        </MotionBox>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <MotionBox
          variants={fadeIn}
          sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
        >
          <MotionButton
            variant="contained"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              mr: 2,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Gallery
          </MotionButton>

          <MotionTypography
            variant="h5"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
            }}
            variants={slideInFromRight}
          >
            Image Detail
          </MotionTypography>
        </MotionBox>

        {image && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <MotionPaper
                variants={fadeIn}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  mb: { xs: 2, md: 0 },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    cursor: 'zoom-in',
                    '&:hover::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      zIndex: 1,
                    },
                  }}
                  onClick={handleZoomToggle}
                >
                  <motion.img
                    src={image.url}
                    alt={image.prompt}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      zIndex: 2,
                    }}
                  >
                    <MotionIconButton
                      color="primary"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                      }}
                      onClick={handleZoomToggle}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ZoomIn />
                    </MotionIconButton>
                  </Box>
                </Box>
              </MotionPaper>
            </Grid>

            <Grid item xs={12} md={4}>
              <MotionPaper
                variants={fadeIn}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Details
                  </Typography>

                  <MotionIconButton
                    color={isFavorite ? 'error' : 'default'}
                    onClick={handleToggleFavorite}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </MotionIconButton>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Prompt
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {image.prompt}
                  </Typography>
                  <MotionButton
                    variant="outlined"
                    size="small"
                    startIcon={copied ? <Check /> : <ContentCopy />}
                    onClick={handleCopyPrompt}
                    sx={{ mb: 2, borderRadius: 2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? 'Copied!' : 'Copy Prompt'}
                  </MotionButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Style
                  </Typography>
                  <Chip
                    label={image.style || 'Standard'}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(image.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <MotionButton
                    variant="contained"
                    color="primary"
                    startIcon={<Download />}
                    fullWidth
                    onClick={handleDownload}
                    sx={{ borderRadius: 2 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Download
                  </MotionButton>

                  <MotionIconButton
                    color="primary"
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    sx={{ bgcolor: 'action.hover' }}
                  >
                    <Share />
                  </MotionIconButton>
                </Box>
              </MotionPaper>
            </Grid>
          </Grid>
        )}
      </MotionBox>

      {/* Image Zoom Dialog */}
      <Dialog
        open={zoomOpen}
        onClose={handleZoomToggle}
        maxWidth="xl"
        fullScreen={isMobile}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            boxShadow: 'none',
            margin: isMobile ? 0 : 16,
            borderRadius: isMobile ? 0 : 8,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
          ref={constraintsRef}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              display: 'flex',
              gap: 1,
            }}
          >
            <MotionIconButton
              onClick={() => setScale((prev) => Math.min(prev + 0.5, 4))}
              sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ZoomIn />
            </MotionIconButton>

            <MotionIconButton
              onClick={() => setScale((prev) => Math.max(prev - 0.5, 0.5))}
              sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ZoomOut />
            </MotionIconButton>

            <MotionIconButton
              onClick={handleZoomToggle}
              sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Close />
            </MotionIconButton>
          </Box>

          <motion.div
            drag
            dragConstraints={constraintsRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.img
              src={image?.url}
              alt={image?.prompt || 'Image'}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
              animate={{
                scale: scale,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag
              dragConstraints={constraintsRef}
            />
          </motion.div>
        </Box>
      </Dialog>
    </Container>
  )
}
