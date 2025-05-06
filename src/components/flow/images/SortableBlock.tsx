'use client'
import React from 'react'
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import UploadIcon from '@mui/icons-material/Upload'
import CloseIcon from '@mui/icons-material/Close'
import { Block } from '../types/BlockTypes'

interface SortableBlockProps {
  block: Block
  index: number
  currentIndex: number
  onSelect: () => void
  onReplace: () => void
  onDelete?: () => void
  isRegeneratingImages: boolean
}

const SortableBlock: React.FC<SortableBlockProps> = ({
  block,
  index,
  currentIndex,
  onSelect,
  onReplace,
  onDelete,
  isRegeneratingImages,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
    position: 'relative' as const,
    zIndex: isDragging ? 1000 : 1,
  }

  const isSelected = currentIndex === index

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isSelected ? 3 : 1}
      sx={{
        mb: 2,
        p: 1,
        display: 'flex',
        borderRadius: 1,
        alignItems: 'center',
        borderLeft: isSelected ? '4px solid' : 'none',
        borderColor: 'primary.main',
        bgcolor: isSelected ? 'background.paper' : 'background.default',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        disabled={isRegeneratingImages}
        sx={{
          cursor: isRegeneratingImages ? 'not-allowed' : 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicatorIcon />
      </IconButton>

      <Box
        sx={{
          width: 60,
          height: 60,
          backgroundImage: `url(${block.imageUrl})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          borderRadius: 1,
          mr: 2,
          border: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
        onClick={onSelect}
      />

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography
          variant="body2"
          noWrap
          fontWeight={isSelected ? 'bold' : 'regular'}
          onClick={onSelect}
          sx={{ cursor: 'pointer' }}
        >
          {block.prompt ? (
            <>
              {block.prompt.length > 50
                ? `${block.prompt.slice(0, 50)}...`
                : block.prompt}
            </>
          ) : (
            'No prompt'
          )}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ display: 'block' }}
        >
          {block.script ? (
            <>
              {block.script.length > 100
                ? `${block.script.slice(0, 100)}...`
                : block.script}
            </>
          ) : (
            'No script content'
          )}
        </Typography>
      </Box>

      <Box sx={{ ml: 1, display: 'flex' }}>
        <Tooltip title="Replace Image">
          <IconButton
            size="small"
            onClick={onReplace}
            disabled={isRegeneratingImages}
          >
            <UploadIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {onDelete && (
          <Tooltip title="Remove Block">
            <IconButton
              size="small"
              onClick={onDelete}
              color="error"
              disabled={isRegeneratingImages}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  )
}

export default SortableBlock
