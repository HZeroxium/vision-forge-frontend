'use client'
import React from 'react'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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
  arrayMove,
} from '@dnd-kit/sortable'

import SortableBlock from './SortableBlock'
import { Block } from '../types/BlockTypes'

interface BlockManagerProps {
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

const BlockManager: React.FC<BlockManagerProps> = ({
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

      // Calculate new blocks order
      const newBlocks = arrayMove(blocks, oldIndex, newIndex)

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
    <Box
      sx={{
        width: '30%',
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        overflow: 'auto',
        maxHeight: '500px',
        borderRadius: 1,
        p: 1,
        bgcolor: 'background.default',
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

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={onOpenAddBlockDialog}
        sx={{ mt: 2 }}
        disabled={isRegeneratingImages}
      >
        Add New Block
      </Button>
    </Box>
  )
}

export default BlockManager
