'use client'
import React from 'react'
import DashboardLayout from '@layouts/DashboardLayout'
import {
  Create,
  Speed,
  AutoAwesome,
  Devices,
  VideoLibrary,
  CloudUpload,
} from '@mui/icons-material'

// Import the section components
import HeroSection from '@/components/home/sections/HeroSection'
import FeaturesSection from '@/components/home/sections/FeaturesSection'
import WorkflowSection from '@/components/home/sections/WorkflowSection'
import ShowcaseSection from '@/components/home/sections/ShowcaseSection'
import CTASection from '@/components/home/sections/CTASection'

export default function HomePage() {
  // Define the features data
  const features = [
    {
      title: 'AI-Powered Script Creation',
      description:
        'Create compelling video scripts in seconds with our advanced AI technology.',
      icon: <Create fontSize="large" color="primary" />,
      delay: 0.2,
    },
    {
      title: 'Professional Visuals',
      description:
        'Generate beautiful, on-brand visuals that perfectly match your content.',
      icon: <AutoAwesome fontSize="large" color="primary" />,
      delay: 0.4,
    },
    {
      title: 'Fast Rendering',
      description:
        'Our optimized rendering pipeline produces high-quality videos in record time.',
      icon: <Speed fontSize="large" color="primary" />,
      delay: 0.6,
    },
    {
      title: 'Multi-Platform Support',
      description:
        'Create videos optimized for any platform - social media, websites, presentations.',
      icon: <Devices fontSize="large" color="primary" />,
      delay: 0.8,
    },
  ]

  // Define the workflow steps
  const steps = [
    {
      title: 'Write Your Script',
      description:
        'Start with a concept or let our AI help you craft the perfect script.',
      icon: <Create fontSize="large" />,
      delay: 0.3,
    },
    {
      title: 'Generate Visuals',
      description:
        'Our AI transforms your script into stunning visuals that match your brand.',
      icon: <AutoAwesome fontSize="large" />,
      delay: 0.5,
    },
    {
      title: 'Add Audio',
      description:
        'Choose from our library of music or upload your own voice recordings.',
      icon: <CloudUpload fontSize="large" />,
      delay: 0.7,
    },
    {
      title: 'Publish Your Video',
      description:
        'Export your finished video in multiple formats ready for sharing.',
      icon: <VideoLibrary fontSize="large" />,
      delay: 0.9,
    },
  ]

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <DashboardLayout>
      <HeroSection onScrollToFeatures={scrollToFeatures} />
      <FeaturesSection features={features} />
      <WorkflowSection steps={steps} />
      <ShowcaseSection />
      <CTASection />
    </DashboardLayout>
  )
}
