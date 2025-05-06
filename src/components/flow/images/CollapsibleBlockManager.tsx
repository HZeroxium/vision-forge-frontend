'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Collapse,
  Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import AddIcon from '@mui/icons-material/Add'
import { Block } from '../types/BlockTypes'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableBlock from './SortableBlock'

interface CollapsibleBlockManagerProps {
  blocks: Block[]
  currentIndex: number
  isRegeneratingImages: boolean
  onSelectBlock: (index: number) => void
  onReplaceImage: () => void
  onDeleteBlock: (index: number) => void
  onOpenAddBlockDialog: () => void
  onReorderBlocks: (newBlocks: Block[]) => void
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
}

const CollapsibleBlockManager: React.FC<CollapsibleBlockManagerProps> = ({
  blocks,
  currentIndex,
  isRegeneratingImages,
  onSelectBlock,
  onReplaceImage,
  onDeleteBlock,
  onOpenAddBlockDialog,
  onReorderBlocks,
  onDragStart,
  onDragEnd,
}) => {
  const [expanded, setExpanded] = useState(false)

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    if (onDragStart) {
      onDragStart(event.active.id as string)
    }
  }

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over.id)

      // Calculate new blocks order by swapping items
      const newBlocks = [...blocks]
      const movedItem = newBlocks.splice(oldIndex, 1)[0]
      newBlocks.splice(newIndex, 0, movedItem)

      // Update parent state with new blocks order
      onReorderBlocks(newBlocks)

      // Select the moved block
      onSelectBlock(newIndex)
    }

    if (onDragEnd) {
      onDragEnd()
    }
  }

  return (
    <Paper
      elevation={1}
      sx={{
        mt: 3,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Button
        onClick={() => setExpanded(!expanded)}
        fullWidth
        sx={{
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: expanded ? '8px 8px 0 0' : 8,
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'action.hover' },
          boxShadow: 0,
        }}
      >
        <Box display="flex" alignItems="center">
          <SwapVertIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">
            Image Blocks Manager
          </Typography>
        </Box>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Button>

      <Collapse in={expanded}>
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Drag and drop blocks to reorder them. Click on a block to select it
            for editing.
          </Typography>

          <Box
            sx={{
              maxHeight: '300px',
              overflowY: 'auto',
              p: 1,
              mb: 2,
              borderRadius: 1,
            }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <SortableContext
                items={blocks.map((block) => block.id)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block, index) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    currentIndex={currentIndex}
                    onSelect={() => onSelectBlock(index)}
                    onReplace={onReplaceImage}
                    onDelete={
                      blocks.length > 1 ? () => onDeleteBlock(index) : undefined
                    }
                    isRegeneratingImages={isRegeneratingImages}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onOpenAddBlockDialog}
            fullWidth
            disabled={isRegeneratingImages}
          >
            Add New Block
          </Button>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default CollapsibleBlockManager
