'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Chip,
  Card,
  CardContent,
  Button,
  Tooltip,
} from '@mui/material'
import {
  ExpandMore,
  OpenInNew,
  Article,
  Public,
  Book,
  Info,
} from '@mui/icons-material'
import { Source } from '@services/scriptsService'
import { motion } from 'framer-motion'

interface SourcesListProps {
  sources?: Source[]
}

const MotionAccordion = motion(Accordion)

const SourcesList: React.FC<SourcesListProps> = ({ sources = [] }) => {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  if (!sources || sources.length === 0) {
    return null
  }

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType?.toLowerCase()) {
      case 'article':
        return <Article fontSize="small" />
      case 'website':
        return <Public fontSize="small" />
      case 'book':
        return <Book fontSize="small" />
      default:
        return <Info fontSize="small" />
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Information Sources
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        The following sources were used to validate and enhance the generated
        content:
      </Typography>

      <Box sx={{ mb: 2 }}>
        {sources.map((source, index) => (
          <MotionAccordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Box sx={{ mr: 1 }}>{getSourceIcon(source.source_type)}</Box>
                <Typography sx={{ flexGrow: 1 }}>
                  {source.title || 'Source ' + (index + 1)}
                </Typography>
                <Chip
                  label={source.source_type || 'Reference'}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      mb: 2,
                    }}
                  >
                    {source.content || 'No content preview available.'}
                  </Typography>
                </CardContent>
              </Card>

              {source.url && (
                <Tooltip title="Open source in a new tab">
                  <Button
                    component={Link}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                    size="small"
                    variant="outlined"
                  >
                    View Source
                  </Button>
                </Tooltip>
              )}
            </AccordionDetails>
          </MotionAccordion>
        ))}
      </Box>
    </Box>
  )
}

export default SourcesList
