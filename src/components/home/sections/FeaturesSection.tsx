import React from 'react'
import { Typography, Container, Grid, Box, CardContent } from '@mui/material'
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
  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        background: '#f8f9fa',
      }}
    >
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
            Why Choose Vision Forge
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Our AI-powered platform makes video creation easier than ever before
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: feature.delay },
                  },
                }}
                whileHover={{
                  y: -10,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  transition: { duration: 0.3 },
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
