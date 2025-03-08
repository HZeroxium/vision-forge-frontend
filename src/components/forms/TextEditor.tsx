import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="my-4">
      <ReactQuill value={value} onChange={onChange} theme="snow" />
    </div>
  )
}

export default TextEditor
