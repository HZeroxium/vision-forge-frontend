'use client'
import React, { useState } from 'react'
import {
  Typography,
  Container,
  Box,
  CardContent,
  CardMedia,
  alpha,
  useTheme,
  IconButton,
  Dialog,
  DialogContent,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { PlayArrow, Close, ArrowForward } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MotionBox,
  MotionCard,
  MotionTypography,
} from '@/components/motion/MotionComponents'
import { fadeIn } from '@/utils/animations'

interface ShowcaseItem {
  id: number
  title: string
  description: string
  image: string
  videoUrl?: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    title: 'Marketing Explainer',
    description: 'Created in just 10 minutes with AI scripting and visuals.',
    image: '/images/banner.webp',
    videoUrl: '#',
  },
  {
    id: 2,
    title: 'Product Showcase',
    description: 'High-quality product demonstration with custom branding.',
    image: '/images/banner.webp',
    videoUrl: '#',
  },
  {
    id: 3,
    title: 'Training Video',
    description: 'Complex concepts made simple through visual storytelling.',
    image: '/images/banner.webp',
    videoUrl: '#',
  },
]

const MotionIconButton = motion(IconButton)

const ShowcaseSection: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeVideo, setActiveVideo] = useState<ShowcaseItem | null>(null)

  const handleOpenVideo = (item: ShowcaseItem) => {
    setActiveVideo(item)
  }

  const handleCloseVideo = () => {
    setActiveVideo(null)
  }

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        background: `linear-gradient(180deg, 
          ${alpha(theme.palette.primary.dark, 0.06)} 0%, 
          ${alpha(theme.palette.background.default, 0.8)} 50%, 
          ${alpha(theme.palette.secondary.dark, 0.06)} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: 0.02,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H0V0h5z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography
            variant="overline"
            component="p"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
            }}
          >
            SHOWCASE
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.7rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            See It In Action
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.6,
            }}
          >
            Check out these incredible videos created with Vision Forge
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          {showcaseItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <MotionCard
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: item.id * 0.2 },
                  },
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 4,
                  boxShadow: theme.shadows[8],
                  backdropFilter: 'blur(10px)',
                  background:
                    theme.palette.mode === 'dark'
                      ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.8)})`
                      : `linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  height: '100%',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {/* Gradient overlay on the image */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to bottom, transparent 60%, ${alpha(theme.palette.common.black, 0.7)} 100%)`,
                      zIndex: 1,
                    }}
                  />

                  <CardMedia
                    component="img"
                    height="220"
                    image={item.image}
                    alt={`Example video ${item.id}`}
                    sx={{ objectFit: 'cover' }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <MotionBox
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenVideo(item)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.common.black, 0.5),
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: `2px solid rgba(255,255,255,0.2)`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    >
                      <PlayArrow
                        sx={{
                          color: 'white',
                          fontSize: 36,
                          filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))',
                        }}
                      />
                    </MotionBox>
                  </Box>
                </Box>

                <CardContent sx={{ pt: 3, pb: 4 }}>
                  <MotionTypography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontSize: '1.25rem',
                    }}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {item.title}
                  </MotionTypography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {item.description}
                  </Typography>

                  <MotionBox
                    whileHover={{ x: 5 }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 2,
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleOpenVideo(item)}
                  >
                    Watch Demo <ArrowForward sx={{ fontSize: 16, ml: 0.5 }} />
                  </MotionBox>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          sx={{
            mt: 8,
            p: 3,
            borderRadius: 4,
            background: alpha(theme.palette.primary.light, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Want to see more examples? Check out our full gallery of
            AI-generated videos.
          </Typography>
        </MotionBox>
      </Container>

      {/* Video Dialog */}
      <Dialog
        open={!!activeVideo}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
        fullScreen={isMobile}
      >
        <AnimatePresence>
          {activeVideo && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogContent
                sx={{ p: 0, position: 'relative', overflow: 'hidden' }}
              >
                <MotionIconButton
                  onClick={handleCloseVideo}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: alpha(theme.palette.common.black, 0.5),
                    backdropFilter: 'blur(5px)',
                    color: 'white',
                    zIndex: 10,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.black, 0.7),
                    },
                  }}
                >
                  <Close />
                </MotionIconButton>

                <Box
                  sx={{
                    width: '100%',
                    height: isMobile ? '50vh' : '70vh',
                    position: 'relative',
                    bgcolor: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', textAlign: 'center' }}
                  >
                    Video player would be here
                  </Typography>
                </Box>
              </DialogContent>
            </MotionBox>
          )}
        </AnimatePresence>
      </Dialog>
    </Box>
  )
}

export default ShowcaseSection
