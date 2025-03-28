// src/components/flow/ScriptStep.tsx
'use client'
import React from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

interface ScriptStepProps {
  title: string
  setTitle: (value: string) => void
  selectedContentStyle: string
  setSelectedContentStyle: (value: string) => void
  selectedLanguage: string
  setSelectedLanguage: (value: string) => void
  localContent: string
  setLocalContent: (value: string) => void
  scriptExists: boolean
  onCreateScript: () => Promise<void>
  onUpdateScript: () => Promise<void>
  onProceedToImages: () => Promise<void>
  contentStyleOptions: string[]
  languageOptions: { value: string; label: string }[]
}

const ScriptStep: React.FC<ScriptStepProps> = ({
  title,
  setTitle,
  selectedContentStyle,
  setSelectedContentStyle,
  selectedLanguage,
  setSelectedLanguage,
  localContent,
  setLocalContent,
  scriptExists,
  onCreateScript,
  onUpdateScript,
  onProceedToImages,
  contentStyleOptions,
  languageOptions,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel id="content-style-label">Content Style</InputLabel>
        <Select
          labelId="content-style-label"
          label="Content Style"
          value={selectedContentStyle}
          onChange={(e) => setSelectedContentStyle(e.target.value)}
        >
          {contentStyleOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="language-label">Language</InputLabel>
        <Select
          labelId="language-label"
          label="Language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languageOptions.map((lang) => (
            <MenuItem key={lang.value} value={lang.value}>
              {lang.label.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={onCreateScript}>
        Generate Script
      </Button>
      {scriptExists && (
        <>
          <Typography variant="subtitle1">
            Script Content (Editable):
          </Typography>
          <TextField
            label="Script Content"
            variant="outlined"
            fullWidth
            multiline
            minRows={6}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
          />
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={onUpdateScript}>
              Update Script
            </Button>
            <Button variant="contained" onClick={onProceedToImages}>
              Proceed to Image Generation
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default ScriptStep
