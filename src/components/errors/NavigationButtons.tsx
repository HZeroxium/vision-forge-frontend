import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Box, Button, SxProps, Theme } from '@mui/material'

// Create motion components
const MotionBox = motion(Box)
const MotionButton = motion(Button)

export interface NavigationButtonProps {
  label: string
  href?: string
  icon?: React.ReactNode
  variant?: 'text' | 'outlined' | 'contained'
  onClick?: () => void
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
}

interface NavigationButtonsProps {
  buttons: NavigationButtonProps[]
  direction?: 'row' | 'column'
  spacing?: number
  sx?: SxProps<Theme>
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  buttons,
  direction = 'row',
  spacing = 2,
  sx = {},
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: direction },
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing,
        mb: 8,
        ...sx,
      }}
    >
      {buttons.map((button, index) => {
        const ButtonComponent = (
          <MotionButton
            component={button.href ? Link : 'button'}
            {...(button.href ? { href: button.href } : {})}
            onClick={button.onClick}
            variant={button.variant || 'contained'}
            color={button.color || 'primary'}
            size="large"
            startIcon={button.icon}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              ...(button.variant === 'contained' && {
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }),
            }}
            key={index}
          >
            {button.label}
          </MotionButton>
        )
        
        return ButtonComponent
      })}
    </MotionBox>
  )
}

export default NavigationButtons
