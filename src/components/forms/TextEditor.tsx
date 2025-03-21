// src/components/forms/TextEditor.tsx
import React from 'react'
import { RichTextEditor } from '@mantine/rte'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="my-4">
      <RichTextEditor value={value} onChange={onChange} />
    </div>
  )
}

export default TextEditor
