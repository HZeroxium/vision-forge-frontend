'use client'
import React from 'react'
import {
  Typography,
  Container,
  Box,
  useMediaQuery,
  useTheme,
  alpha,
  Divider,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import { MotionBox } from '@/components/motion/MotionComponents'
import { fadeIn } from '@/utils/animations'

interface Step {
  title: string
  description: string
  icon: React.ReactNode
  delay: number
}

interface WorkflowSectionProps {
  steps: Step[]
}

const WorkflowSection: React.FC<WorkflowSectionProps> = ({ steps }) => {
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${theme.palette.background.default} 100%)`
            : `linear-gradient(180deg, #f8f9fa 0%, white 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          sx={{ textAlign: 'center', mb: 10 }}
        >
          <Typography
            variant="overline"
            component="p"
            sx={{
              color: theme.palette.secondary.main,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
            }}
          >
            SIMPLE PROCESS
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.7rem' },
              background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            How It Works
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
            From concept to completion in four simple steps
          </Typography>
        </MotionBox>

        <Grid
          container
          spacing={isTablet ? 6 : 3}
          sx={{ position: 'relative' }}
        >
          {/* Connecting line for desktop view */}
          {!isTablet && (
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              whileInView={{ width: '80%' }}
              transition={{ delay: 0.3, duration: 1.5 }}
              viewport={{ once: true }}
              sx={{
                position: 'absolute',
                top: '100px',
                left: '10%',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
                zIndex: 0,
                opacity: 0.5,
              }}
            />
          )}

          {steps.map((step, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, delay: step.delay },
                  },
                }}
                sx={{
                  textAlign: 'center',
                  height: '100%',
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Step icon with glass effect */}
                <MotionBox
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  sx={{
                    width: 110,
                    height: 110,
                    borderRadius: '30%',
                    mb: 3,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: theme.shadows[8],
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.85)})`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative elements inside icon box */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      width: 60,
                      height: 60,
                      background: alpha(theme.palette.common.white, 0.1),
                      borderRadius: '40%',
                      transform: 'rotate(30deg)',
                    }}
                  />

                  <Box
                    component={motion.div}
                    animate={{
                      rotate: [0, 360],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 8,
                      ease: 'linear',
                    }}
                    sx={{
                      position: 'absolute',
                      inset: 10,
                      borderRadius: '30%',
                      border: `2px dashed ${alpha(theme.palette.common.white, 0.2)}`,
                    }}
                  />

                  {React.cloneElement(step.icon as React.ReactElement, {
                    sx: {
                      fontSize: 42,
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      position: 'relative',
                      zIndex: 2,
                    },
                  })}

                  {/* Step number indicator */}
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: theme.palette.secondary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      boxShadow: theme.shadows[4],
                      border: `2px solid ${theme.palette.common.white}`,
                      color: 'white',
                      fontSize: '1.1rem',
                      zIndex: 2,
                    }}
                  >
                    {index + 1}
                  </Box>
                </MotionBox>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    mb: 1.5,
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: isMobile ? '100%' : 250,
                    mx: 'auto',
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </Typography>

                {/* Vertical divider for mobile/tablet */}
                {isTablet && index < steps.length - 1 && (
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      height: 40,
                      width: 2,
                      mt: 3,
                      mx: 'auto',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    }}
                  />
                )}
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default WorkflowSection
