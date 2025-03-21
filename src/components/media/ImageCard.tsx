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
    // Wrap the Card with Next.js Link to navigate to the detail page
    <Link href={`/images/${image.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none' }}>
        <Card sx={{ maxWidth: 345, cursor: 'pointer' }}>
          <CardMedia
            component="img"
            height="200"
            image={image.url}
            alt={image.prompt}
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {image.prompt}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Style: {image.style}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {new Date(image.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </a>
    </Link>
  )
}

export default ImageCard
