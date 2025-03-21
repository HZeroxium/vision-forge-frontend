// src/components/video/Timeline.tsx
import React, { useState } from 'react'
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface TimelineItem {
  id: string
  label: string
}

interface DraggableItemProps {
  item: TimelineItem
  index: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  moveItem,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: 'TIMELINE_ITEM',
    hover: (draggedItem: { index: number }) => {
      if (!ref.current) {
        return
      }
      const dragIndex = draggedItem.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      moveItem(dragIndex, hoverIndex)
      draggedItem.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'TIMELINE_ITEM',
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`p-2 border rounded mb-2 bg-white ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {item.label}
    </div>
  )
}

const Timeline: React.FC = () => {
  const [items, setItems] = useState<TimelineItem[]>([
    { id: '1', label: 'Clip 1' },
    { id: '2', label: 'Clip 2' },
    { id: '3', label: 'Clip 3' },
  ])

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updatedItems = [...items]
    const [removed] = updatedItems.splice(dragIndex, 1)
    updatedItems.splice(hoverIndex, 0, removed)
    setItems(updatedItems)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        {items.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            index={index}
            moveItem={moveItem}
          />
        ))}
      </div>
    </DndProvider>
  )
}

export default Timeline
