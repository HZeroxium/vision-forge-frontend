'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme, useMediaQuery } from '@mui/material'
import DashboardLayout from '@/layouts/DashboardLayout'
import HomeIcon from '@mui/icons-material/Home'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MovieCreationIcon from '@mui/icons-material/MovieCreation'
import ConstructionIcon from '@mui/icons-material/Construction'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

// Import our extracted components
import ParticlesBackground from '@/components/errors/ParticlesBackground'
import AnimatedIcon from '@/components/errors/AnimatedIcon'
import ErrorTitle from '@/components/errors/ErrorTitle'
import ErrorMessage from '@/components/errors/ErrorMessage'
import NavigationButtons from '@/components/errors/NavigationButtons'
import SuggestionGrid from '@/components/errors/SuggestionGrid'
import ErrorContainer from '@/components/errors/ErrorContainer'

export default function NotFound() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pathname = usePathname()
  const [currentPath, setCurrentPath] = useState<string>('')

  // Extract the feature name from the path
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean)
      const featureName =
        pathSegments.length > 0
          ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ')
          : 'this feature'

      setCurrentPath(featureName)
    }
  }, [pathname])

  // Define the navigation buttons
  const navigationButtons = [
    {
      label: 'Return Home',
      href: '/',
      icon: <HomeIcon />,
      variant: 'contained',
    },
    {
      label: 'Go Back',
      onClick: () => window.history.back(),
      icon: <ArrowBackIcon />,
      variant: 'outlined',
    },
  ]

  // Define the suggestion cards
  const suggestions = [
    {
      title: 'Video Generation',
      path: '/flow/generate-video',
      icon: <MovieCreationIcon fontSize="medium" />,
      description: 'Create AI-powered videos from text in just a few clicks.',
    },
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <LightbulbIcon fontSize="medium" />,
      description: 'Check your recent projects and overall usage statistics.',
    },
    {
      title: 'Home',
      path: '/',
      icon: <HomeIcon fontSize="medium" />,
      description: 'Return to the homepage to explore available features.',
    },
  ]

  return (
    <DashboardLayout>
      <ErrorContainer>
        {/* Background */}
        <ParticlesBackground />

        {/* Icon */}
        <AnimatedIcon
          icon={<ConstructionIcon sx={{ fontSize: 60 }} />}
          size={120}
          bgColor="primary.light"
        />

        {/* Title and Message */}
        <ErrorTitle title="404" />
        <ErrorMessage
          title="Feature Under Construction"
          description={`The ${currentPath} feature is currently being built and will be available soon.`}
          highlightedText={currentPath}
          highlightColor={theme.palette.primary.main}
        />

        {/* Navigation Buttons */}
        <NavigationButtons
          buttons={navigationButtons}
          direction={isMobile ? 'column' : 'row'}
        />

        {/* Suggestions */}
        <SuggestionGrid
          title="Try These Available Features"
          suggestions={suggestions}
        />
      </ErrorContainer>
    </DashboardLayout>
  )
}
