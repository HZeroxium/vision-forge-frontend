import React from 'react'
import {
  Typography,
  Container,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
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

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            How It Works
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            From concept to completion in four simple steps
          </Typography>
        </MotionBox>

        <Grid
          container
          spacing={isTablet ? 4 : 2}
          sx={{ position: 'relative' }}
        >
          {!isTablet && (
            <Box
              sx={{
                position: 'absolute',
                top: '100px',
                left: '50px',
                right: '50px',
                height: '4px',
                background: '#e0e0e0',
                zIndex: 0,
              }}
            />
          )}

          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    mx: 'auto',
                    position: 'relative',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}
                >
                  {step.icon}
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mb: 1, fontWeight: 'bold' }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 250, mx: 'auto' }}
                >
                  {step.description}
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default WorkflowSection
