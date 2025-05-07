'use client'
import React from 'react'
import {
  Typography,
  Container,
  Box,
  CardContent,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import { MotionBox, MotionCard } from '@/components/motion/MotionComponents'
import { fadeIn } from '@/utils/animations'

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  delay: number
}

interface FeaturesSectionProps {
  features: Feature[]
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '40%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.07)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          right: '-5%',
          width: '350px',
          height: '350px',
          borderRadius: '40%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.07)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          sx={{ textAlign: 'center', mb: 8 }}
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
            POWERFUL FEATURES
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.7rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Why Choose Vision Forge
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
            Our AI-powered platform makes video creation easier than ever before
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <MotionCard
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, delay: feature.delay },
                  },
                }}
                whileHover={{
                  y: -10,
                  boxShadow: theme.shadows[10],
                  transition: { duration: 0.3 },
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[4],
                  backdropFilter: 'blur(10px)',
                  background:
                    theme.palette.mode === 'dark'
                      ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.9)})`
                      : `linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {/* Feature icon with glowing background */}
                  <Box
                    sx={{
                      mb: 3,
                      position: 'relative',
                      p: 2,
                    }}
                  >
                    <Box
                      component={motion.div}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: 'easeInOut',
                      }}
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(10px)',
                        top: 0,
                        left: 0,
                      }}
                    />
                    {React.cloneElement(feature.icon as React.ReactElement, {
                      fontSize: 'large',
                      color: 'primary',
                      sx: { fontSize: 42, position: 'relative', zIndex: 2 },
                    })}
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default FeaturesSection
