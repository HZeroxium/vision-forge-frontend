// src/components/flow/PageTransition.tsx
'use client'
import React, { ReactNode } from 'react'
import { Box } from '@mui/material'
import { animated, useTransition } from '@react-spring/web'

interface PageTransitionProps {
  children: ReactNode
  isVisible: boolean
  direction?: 'right' | 'left'
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isVisible,
  direction = 'right',
}) => {
  const transitions = useTransition(isVisible, {
    from: {
      opacity: 0,
      transform: `translateX(${direction === 'right' ? '50px' : '-50px'})`,
    },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: {
      opacity: 0,
      transform: `translateX(${direction === 'right' ? '-50px' : '50px'})`,
      position: 'absolute',
    },
    config: { tension: 280, friction: 60 },
  })

  return transitions((style, item) =>
    item ? (
      <Box component={animated.div} style={{ ...style, width: '100%' }}>
        {children}
      </Box>
    ) : null
  )
}

export default PageTransition
