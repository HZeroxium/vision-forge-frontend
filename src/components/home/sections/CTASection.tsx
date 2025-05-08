'use client'
import React, { useState, useEffect } from 'react'
import {
  Typography,
  Container,
  Box,
  useTheme,
  alpha,
  Button,
  Divider,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  MovieCreation,
  AutoAwesome,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material'
import Link from 'next/link'
import {
  MotionBox,
  MotionTypography,
  MotionButton,
} from '@/components/motion/MotionComponents'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/utils/animations'

const CTASection: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const benefits = [
    'No credit card required',
    'Free tier available',
    'Cancel anytime',
    '24/7 support',
  ]

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient background */}
      {mounted && (
        <Box
          component={motion.div}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 30%),
              radial-gradient(circle at 80% 70%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 30%)
            `,
            backgroundSize: '120% 120%',
            zIndex: 0,
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
                color: 'white',
                boxShadow: theme.shadows[10],
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: alpha(theme.palette.common.white, 0.05),
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: alpha(theme.palette.common.white, 0.05),
                  zIndex: 0,
                }}
              />

              {/* Content */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 2,
                    py: 0.75,
                    borderRadius: 5,
                    mb: 3,
                    background: alpha(theme.palette.common.white, 0.1),
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <AutoAwesome sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={600}>
                    LIMITED TIME OFFER
                  </Typography>
                </MotionBox>

                <MotionTypography
                  variant="h2"
                  fontWeight="bold"
                  variants={fadeIn}
                  sx={{
                    mb: 2,
                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                    lineHeight: 1.2,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  Ready to Create <br />
                  <Box
                    component="span"
                    sx={{
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '100%',
                        height: 4,
                        borderRadius: 4,
                        bgcolor: theme.palette.secondary.main,
                      },
                    }}
                  >
                    Amazing Videos?
                  </Box>
                </MotionTypography>

                <MotionTypography
                  variant="h6"
                  variants={fadeIn}
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    maxWidth: 600,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontSize: { xs: '1rem', md: '1.15rem' },
                  }}
                >
                  Start your creative journey today with Vision Forge's
                  AI-powered video creation tools
                </MotionTypography>

                <Divider
                  sx={{
                    mb: 4,
                    borderColor: alpha(theme.palette.common.white, 0.2),
                  }}
                />

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {benefits.map((benefit, index) => (
                    <Grid size={{ xs: 6, sm: 6 }} key={index}>
                      <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        viewport={{ once: true }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <CheckCircle
                          sx={{
                            mr: 1,
                            fontSize: 20,
                            color: theme.palette.success.light,
                          }}
                        />
                        <Typography variant="body2">{benefit}</Typography>
                      </MotionBox>
                    </Grid>
                  ))}
                </Grid>

                <MotionButton
                  href="/flow/generate-video"
                  variant="contained"
                  size="large"
                  startIcon={<MovieCreation />}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.8,
                    px: 4,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                    boxShadow: `0 8px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                      boxShadow: `0 10px 25px ${alpha(theme.palette.success.main, 0.5)}`,
                    },
                  }}
                  variants={fadeIn}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Creating For Free
                </MotionButton>
              </Box>
            </MotionBox>
          </Grid>

          {/* Right side stats/features */}
          <Grid size={{ xs: 12, md: 5 }}>
            {!isMobile && (
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                sx={{
                  pl: { md: 4 },
                }}
              >
                <Box sx={{ mb: 5 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                  >
                    Trusted by creators worldwide
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Join thousands of content creators who are already using
                    Vision Forge to transform their ideas into compelling
                    videos.
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {[
                    { number: '1000+', label: 'Active Users' },
                    { number: '5000+', label: 'Videos Created' },
                    { number: '98%', label: 'Satisfaction Rate' },
                    { number: '10x', label: 'Faster Creation' },
                  ].map((stat, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <MotionBox
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        sx={{ mb: 3 }}
                      >
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          sx={{
                            mb: 0.5,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          {stat.label}
                        </Typography>
                      </MotionBox>
                    </Grid>
                  ))}
                </Grid>
              </MotionBox>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default CTASection
