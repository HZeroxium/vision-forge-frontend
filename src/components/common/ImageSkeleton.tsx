import React from 'react'
import { Box, Skeleton, SxProps, Theme } from '@mui/material'

// Thêm kiểu ResponsiveValue để hỗ trợ giá trị responsive
type ResponsiveValue =
  | string
  | number
  | {
      xs?: string | number
      sm?: string | number
      md?: string | number
      lg?: string | number
      xl?: string | number
    }

interface ImageSkeletonProps {
  width?: ResponsiveValue
  height?: ResponsiveValue
  variant?: 'rectangular' | 'rounded' | 'circular'
  animation?: 'pulse' | 'wave' | false
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  width = '100%',
  height = 350,
  variant = 'rounded',
  animation = 'pulse',
}) => {
  // Tạo mới các thuộc tính sx để sử dụng cho Box
  const boxSx: SxProps<Theme> = {
    position: 'relative',
    width,
    height,
  }

  return (
    <Box sx={boxSx}>
      <Skeleton
        variant={variant}
        width="100%"
        height="100%"
        animation={animation}
        sx={{
          backgroundColor: (theme) => theme.palette.grey[200],
          '&::after': {
            background:
              'linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)',
          },
        }}
      />
    </Box>
  )
}

export default ImageSkeleton
