import React from 'react'
import { Typography, Container, Box, useTheme } from '@mui/material'
import { MovieCreation } from '@mui/icons-material'
import Link from 'next/link'
import {
  MotionBox,
  MotionTypography,
  MotionButton,
} from '@/components/motion/MotionComponents'
import { fadeIn, staggerContainer } from '@/utils/animations'

const CTASection: React.FC = () => {
  const theme = useTheme()

  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="md">
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          sx={{
            textAlign: 'center',
            p: 6,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            color: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          <MotionTypography
            variant="h3"
            component="h2"
            fontWeight="bold"
            variants={fadeIn}
            sx={{ mb: 2 }}
          >
            Ready to Create Amazing Videos?
          </MotionTypography>
          <MotionTypography
            variant="h6"
            variants={fadeIn}
            sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
          >
            Start your creative journey today with Vision Forge's AI-powered
            video creation tools
          </MotionTypography>
          <MotionButton
            component={Link}
            href="/flow/generate-video"
            variant="contained"
            size="large"
            startIcon={<MovieCreation />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem',
              background: theme.palette.success.main,
              '&:hover': {
                background: theme.palette.success.dark,
              },
            }}
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Creating For Free
          </MotionButton>
        </MotionBox>
      </Container>
    </Box>
  )
}

export default CTASection
