import React, { useState } from 'react'
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material'
import { ContentCopy, Check, Visibility } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { ResultsTableProps } from './types'

const MotionPaper = motion(Paper)
const MotionTableRow = motion(TableRow)

const ResultsTable: React.FC<ResultsTableProps> = ({
  matches,
  showNotification,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    showNotification('ID copied to clipboard', 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (matches.length === 0) {
    return null
  }

  // Function to format keys in metadata for readability
  const formatMetadataKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Get a summary of metadata for preview
  const getMetadataSummary = (metadata: any) => {
    if (!metadata) return []

    return Object.entries(metadata)
      .filter(([_, value]) => value !== undefined && value !== null)
      .slice(0, 3) // Just show first 3 properties
      .map(([key, value]) => ({
        key: formatMetadataKey(key),
        value:
          typeof value === 'string' && value.length > 20
            ? `${value.substring(0, 20)}...`
            : String(value),
      }))
  }

  return (
    <MotionPaper
      variant="outlined"
      sx={{
        mt: 2,
        p: 0,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          py: 1.5,
          px: 2,
          bgcolor: 'rgba(0, 0, 0, 0.02)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          fontWeight: 500,
        }}
      >
        Search Results ({matches.length})
      </Typography>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Metadata</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match, index) => (
              <MotionTableRow
                key={match.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                hover
              >
                <TableCell>
                  <Tooltip title={match.id} arrow placement="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.8rem',
                        maxWidth: { xs: '80px', sm: '100px', md: '120px' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'default',
                      }}
                    >
                      {match.id}
                    </Typography>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Chip
                    label={match.score.toFixed(4)}
                    size="small"
                    color={
                      match.score > 0.8
                        ? 'success'
                        : match.score > 0.5
                          ? 'primary'
                          : 'default'
                    }
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
                  >
                    {getMetadataSummary(match.metadata).map((item, i) => (
                      <Tooltip
                        key={i}
                        title={`${item.key}: ${item.value}`}
                        arrow
                      >
                        <Chip
                          label={`${item.key}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      </Tooltip>
                    ))}

                    {Object.keys(match.metadata || {}).length > 3 && (
                      <Chip
                        label="..."
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    )}
                  </div>

                  <Tooltip title="View full metadata">
                    <Button
                      size="small"
                      variant="text"
                      onClick={() =>
                        alert(JSON.stringify(match.metadata, null, 2))
                      }
                      startIcon={<Visibility fontSize="small" />}
                      sx={{ mt: 0.5, py: 0, minWidth: 0 }}
                    >
                      View
                    </Button>
                  </Tooltip>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Copy ID">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(match.id)}
                      color="primary"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        },
                      }}
                    >
                      {copiedId === match.id ? (
                        <Check fontSize="small" color="success" />
                      ) : (
                        <ContentCopy fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </MotionTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MotionPaper>
  )
}

export default ResultsTable
