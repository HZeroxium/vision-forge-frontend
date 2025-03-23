// src/components/media/ImageCard.tsx
import React from 'react'
import Link from 'next/link'
import { Card, CardMedia, CardContent, Typography } from '@mui/material'
import type { Image } from '@services/imagesService'

interface ImageCardProps {
  image: Image
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <Link href={`/media/images/${image.id}`} className="no-underline">
      <Card
        sx={{
          maxWidth: 345,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 6, // MUI elevation
          },
        }}
        className="bg-base-100" // DaisyUI background
      >
        {/* CHANGED END */}
        <CardMedia
          component="img"
          height="200"
          image={image.url}
          alt={image.prompt}
        />
        <CardContent>
          {/* <Typography variant="h6" component="div">
            {image.prompt}
          </Typography> */}
          {/* <Typography variant="body2" color="text.secondary">
            Style: {image.style}
          </Typography> */}
          <Typography variant="caption" display="block" color="text.secondary">
            {new Date(image.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ImageCard
