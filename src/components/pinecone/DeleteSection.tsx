import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { ExpandMore, Delete, FilterAlt } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { DeleteSectionProps } from './types'

const MotionAccordion = motion(Accordion)
const MotionButton = motion(Button)

const DeleteSection: React.FC<DeleteSectionProps> = ({
  vectorIdToDelete,
  setVectorIdToDelete,
  filterKeyToDelete,
  setFilterKeyToDelete,
  filterValueToDelete,
  setFilterValueToDelete,
  handleDelete,
  handleDeleteByFilter,
  isDeleting,
  type,
}) => {
  return (
    <Box mb={4}>
      <Typography
        variant="h6"
        fontWeight="500"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'error.main',
          '&::before': {
            content: '""',
            display: 'block',
            width: '4px',
            height: '24px',
            backgroundColor: 'error.main',
            marginRight: '8px',
            borderRadius: '2px',
          },
        }}
      >
        Delete {type}
      </Typography>

      <MotionAccordion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          mb: 2,
          borderRadius: 2,
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            backgroundColor: 'rgba(211, 47, 47, 0.04)',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
            },
          }}
        >
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Delete color="error" fontSize="small" /> Delete by Vector ID
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Vector ID"
                value={vectorIdToDelete}
                onChange={(e) => setVectorIdToDelete(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter the vector ID to delete"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MotionButton
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={isDeleting || !vectorIdToDelete}
                startIcon={
                  isDeleting ? <CircularProgress size={20} /> : <Delete />
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(211, 47, 47, 0.2)',
                  },
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </MotionButton>
            </Grid>
          </Grid>
        </AccordionDetails>
      </MotionAccordion>

      <MotionAccordion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            backgroundColor: 'rgba(211, 47, 47, 0.04)',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
            },
          }}
        >
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAlt color="error" fontSize="small" /> Delete by Filter
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Filter Key"
                value={filterKeyToDelete}
                onChange={(e) => setFilterKeyToDelete(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="e.g. userId"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Filter Value"
                value={filterValueToDelete}
                onChange={(e) => setFilterValueToDelete(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="e.g. user123"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MotionButton
                variant="contained"
                color="error"
                onClick={handleDeleteByFilter}
                disabled={
                  isDeleting || !filterKeyToDelete || !filterValueToDelete
                }
                startIcon={
                  isDeleting ? <CircularProgress size={20} /> : <FilterAlt />
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(211, 47, 47, 0.2)',
                  },
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete by Filter'}
              </MotionButton>
            </Grid>
          </Grid>
        </AccordionDetails>
      </MotionAccordion>
    </Box>
  )
}

export default DeleteSection
