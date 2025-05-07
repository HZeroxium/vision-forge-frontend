import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Search } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { SearchSectionProps } from './types'

const MotionPaper = motion(Paper)
const MotionButton = motion(Button)

const SearchSection: React.FC<SearchSectionProps> = ({
  queryText,
  setQueryText,
  topK,
  setTopK,
  threshold,
  setThreshold,
  handleQuery,
  isLoading,
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
          '&::before': {
            content: '""',
            display: 'block',
            width: '4px',
            height: '24px',
            backgroundColor: 'primary.main',
            marginRight: '8px',
            borderRadius: '2px',
          },
        }}
      >
        Search {type}
      </Typography>

      <MotionPaper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Query Text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter your search query here..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Top K Results"
              type="number"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              fullWidth
              variant="outlined"
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Similarity Threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              fullWidth
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <MotionButton
              variant="contained"
              color="primary"
              onClick={handleQuery}
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <Search />
              }
              fullWidth
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                py: 1.2,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </MotionButton>
          </Grid>
        </Grid>
      </MotionPaper>
    </Box>
  )
}

export default SearchSection
