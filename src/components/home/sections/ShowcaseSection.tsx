import React from 'react'
import {
  Typography,
  Container,
  Grid,
  Box,
  CardContent,
  CardMedia,
} from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import { MotionBox, MotionCard } from '@/components/motion/MotionComponents'
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
  },
  {
    id: 2,
    title: 'Product Showcase',
    description: 'High-quality product demonstration with custom branding.',
    image: '/images/banner.webp',
  },
  {
    id: 3,
    title: 'Training Video',
    description: 'Complex concepts made simple through visual storytelling.',
    image: '/images/banner.webp',
  },
]

const ShowcaseSection: React.FC = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9f0f6 100%)',
      }}
    >
      <Container>
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            See It In Action
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Check out these incredible videos created with Vision Forge
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          {showcaseItems.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <MotionCard
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: item.id * 0.2 },
                  },
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={`Example video ${item.id}`}
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
                    }}
                  >
                    <MotionBox
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <PlayArrow sx={{ color: 'white', fontSize: 30 }} />
                    </MotionBox>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
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

export default ShowcaseSection
