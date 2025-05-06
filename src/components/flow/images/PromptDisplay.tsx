'use client'
import React from 'react'
import { Box, Typography, Paper, Collapse } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

interface PromptDisplayProps {
  prompt: string
  showPrompt: boolean
  onTogglePrompt: () => void
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({
  prompt,
  showPrompt,
  onTogglePrompt,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 2,
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        borderColor: showPrompt ? 'primary.main' : 'divider',
        borderStyle: showPrompt ? 'solid' : 'dashed',
      }}
      onClick={onTogglePrompt}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <AutoAwesomeIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2">Image Generation Prompt</Typography>
        </Box>
        {showPrompt ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      <Collapse in={showPrompt}>
        <Box
          sx={{
            p: 1,
            mt: 1,
            bgcolor: 'background.default',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {prompt || 'No prompt information available'}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default PromptDisplay
