// src/components/media/ImageCard.tsx
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material'
import { motion } from 'framer-motion'
import { ZoomIn, Favorite, FavoriteBorder, Delete } from '@mui/icons-material'
import type { Image } from '@services/imagesService'
import { fadeIn, cardHover } from '@/utils/animations'

interface ImageCardProps {
  image: Image
  index: number
  onCardClick?: (id: string) => void
  onDeleteClick?: (id: string) => void
  compact?: boolean
}

const MotionCard = motion(Card)

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  onCardClick,
  onDeleteClick,
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!onDeleteClick) return

    setIsDeleting(true)
    try {
      await onDeleteClick(image.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(image.id)
    }
  }

  return (
    <>
      <Link
        href={`/media/images/${image.id}`}
        className="no-underline"
        onClick={(e) => onCardClick && e.preventDefault()}
        style={{ height: '100%', display: 'block' }}
      >
        <MotionCard
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          {...cardHover}
          sx={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: compact ? 2 : 3,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCardClick}
          className="bg-base-100"
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              height: compact ? '160px' : '220px',
            }}
          >
            <CardMedia
              component="img"
              height="100%"
              image={image.url}
              alt={image.prompt}
              sx={{
                transition: 'transform 0.5s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: compact ? 1 : 2,
                color: 'white',
              }}
            >
              {!compact && (
                <Typography
                  variant={compact ? 'body2' : 'subtitle1'}
                  fontWeight="bold"
                  component={motion.h3}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: isHovered ? 0 : 20,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {image.prompt.length > (compact ? 30 : 50)
                    ? `${image.prompt.substring(0, compact ? 30 : 50)}...`
                    : image.prompt}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                display: 'flex',
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={handleFavoriteClick}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFavorite ? (
                  <Favorite fontSize="small" color="error" />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
              </IconButton>

              {onDeleteClick && (
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
              )}
            </Box>
          </Box>

          <CardContent
            sx={{
              pb: '16px !important',
              height: compact ? 'auto' : undefined,
              p: compact ? 1 : 2,
            }}
          >
            {compact ? (
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                component="div"
              >
                {image.prompt.length > 20
                  ? `${image.prompt.substring(0, 20)}...`
                  : image.prompt}
              </Typography>
            ) : (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Chip
                  label={image.style || 'Standard'}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component={motion.span}
                  whileHover={{ scale: 1.05 }}
                >
                  {new Date(image.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </CardContent>
        </MotionCard>
      </Link>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this image? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ImageCard
