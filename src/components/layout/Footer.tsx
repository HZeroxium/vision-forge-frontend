'use client'
import React from 'react'
import Link from 'next/link'
import {
  Box,
  Typography,
  Container,
  Divider,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { motion } from 'framer-motion'
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
  KeyboardArrowUp,
} from '@mui/icons-material'

// Create motion components
const MotionBox = motion(Box)
const MotionIconButton = motion(IconButton)
const MotionTypography = motion(Typography)

// Footer link sections
const footerLinks = [
  {
    title: 'Product',
    links: [
      { text: 'Features', href: '/features' },
      { text: 'Pricing', href: '/pricing' },
      { text: 'Use Cases', href: '/use-cases' },
      { text: 'Showcase', href: '/showcase' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'Documentation', href: '/docs' },
      { text: 'Tutorials', href: '/tutorials' },
      { text: 'Blog', href: '/blog' },
      { text: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'About Us', href: '/about' },
      { text: 'Careers', href: '/careers' },
      { text: 'Contact', href: '/contact' },
      { text: 'Partners', href: '/partners' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { text: 'Privacy Policy', href: '/privacy' },
      { text: 'Terms of Service', href: '/terms' },
      { text: 'Cookie Policy', href: '/cookies' },
    ],
  },
]

// Social media links
const socialLinks = [
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: LinkedIn, href: 'https://linkedin.com', label: 'LinkedIn' },
  { Icon: GitHub, href: 'https://github.com', label: 'GitHub' },
]

const Footer: React.FC = () => {
  const theme = useTheme()

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 6 },
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(to top, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.95)})`
            : `linear-gradient(to top, ${alpha(theme.palette.grey[100], 0.9)}, ${alpha(theme.palette.background.default, 0.95)})`,
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      {/* Background decorative elements */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.05,
          transition: { duration: 1, delay: 0.2 },
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          backgroundImage:
            theme.palette.mode === 'dark'
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 5L5 20M20 35L35 20'/%3E%3C/g%3E%3C/svg%3E\")"
              : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M20 5L5 20M20 35L35 20'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Scroll to top button */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        sx={{
          position: 'absolute',
          right: { xs: 20, md: 40 },
          bottom: { xs: 20, md: 40 },
          zIndex: 2,
        }}
      >
        <MotionIconButton
          onClick={scrollToTop}
          aria-label="Scroll to top"
          whileHover={{ y: -5, boxShadow: theme.shadows[8] }}
          whileTap={{ scale: 0.9 }}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
            backdropFilter: 'blur(4px)',
            color: 'white',
            boxShadow: theme.shadows[4],
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <KeyboardArrowUp />
        </MotionIconButton>
      </MotionBox>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main footer content */}
        <Grid container spacing={4} sx={{ mb: { xs: 4, md: 6 } }}>
          {/* Brand and info column */}
          <Grid size={{ xs: 12, md: 5 }}>
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <MotionBox
                  src="/images/logo.webp"
                  alt="Vision Forge"
                  whileHover={{ rotate: 10 }}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 1,
                    borderRadius: '8px',
                    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Vision Forge
                </Typography>
              </Box>

              {/* Company description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 400 }}
              >
                Creating stunning AI-powered videos has never been easier.
                Vision Forge helps you transform your ideas into professional
                videos in minutes.
              </Typography>

              {/* Social media links */}
              <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                {socialLinks.map((social, index) => (
                  <MotionIconButton
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    size="small"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    }}
                    sx={{
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.4
                      ),
                    }}
                  >
                    <social.Icon fontSize="small" />
                  </MotionIconButton>
                ))}
              </Box>
            </MotionBox>
          </Grid>

          {/* Links columns */}
          {footerLinks.map((section, sectionIndex) => (
            <Grid size={{ xs: 6, sm: 3, md: 7 / 4 }} key={section.title}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + sectionIndex * 0.1, duration: 0.5 }}
              >
                <MotionTypography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                  whileHover={{ x: 3 }}
                >
                  {section.title}
                </MotionTypography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyleType: 'none' }}>
                  {section.links.map((link, linkIndex) => (
                    <Box component="li" key={link.text} sx={{ mb: 1 }}>
                      <MotionTypography
                        component={Link}
                        href={link.href}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textDecoration: 'none',
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                        whileHover={{ x: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {link.text}
                      </MotionTypography>
                    </Box>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        <Divider
          sx={{
            my: 3,
            opacity: 0.6,
            background: `linear-gradient(to right, transparent, ${alpha(theme.palette.divider, 0.3)}, transparent)`,
          }}
        />

        {/* Copyright and legal section */}
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid size={{ xs: 12, sm: 6 }}>
            <MotionTypography
              variant="caption"
              color="text.secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              &copy; {new Date().getFullYear()} Vision Forge Project. All rights
              reserved.
            </MotionTypography>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              gap: 3,
              mt: { xs: 2, sm: 0 },
            }}
          >
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(
              (item, index) => (
                <MotionTypography
                  key={item}
                  variant="caption"
                  component={Link}
                  href="#"
                  color="text.secondary"
                  sx={{ textDecoration: 'none' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  whileHover={{ color: theme.palette.primary.main }}
                >
                  {item}
                </MotionTypography>
              )
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
