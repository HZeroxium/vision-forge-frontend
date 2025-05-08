import React from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Paper,
  Tooltip,
} from '@mui/material'
import {
  CalendarToday,
  FilterList,
  Refresh,
  Download,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { motion } from 'framer-motion'

type DateRangeOption = '7d' | '30d' | '90d' | 'custom'

interface VideoOption {
  id: string
  title: string
  youtubeVideoId?: string
}

interface ControlsPanelProps {
  dateRange: DateRangeOption
  onDateRangeChange: (value: DateRangeOption) => void
  startDate: Date | null
  setStartDate: (date: Date | null) => void
  endDate: Date | null
  setEndDate: (date: Date | null) => void
  selectedVideo: string
  onVideoChange: (videoId: string) => void
  videoOptions: VideoOption[]
  onRefresh: () => void
  onExport?: () => void
}

const MotionPaper = motion(Paper)

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  dateRange,
  onDateRangeChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedVideo,
  onVideoChange,
  videoOptions,
  onRefresh,
  onExport,
}) => {
  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      elevation={1}
      sx={{
        p: 2,
        mb: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          flexGrow: 1,
        }}
      >
        {/* Date range selector */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            label="Date Range"
            onChange={(e) =>
              onDateRangeChange(e.target.value as DateRangeOption)
            }
            startAdornment={
              <CalendarToday sx={{ mr: 1, opacity: 0.6, fontSize: 18 }} />
            }
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="custom">Custom range</MenuItem>
          </Select>
        </FormControl>

        {dateRange === 'custom' && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: { xs: '100%', sm: 150 } },
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              minDate={startDate || undefined}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: { xs: '100%', sm: 150 } },
                },
              }}
            />
          </Box>
        )}

        {/* Video selector */}
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>Filter by video</InputLabel>
          <Select
            value={selectedVideo}
            label="Filter by video"
            onChange={(e) => onVideoChange(e.target.value as string)}
            startAdornment={
              <FilterList sx={{ mr: 1, opacity: 0.6, fontSize: 18 }} />
            }
          >
            <MenuItem value="all">All videos</MenuItem>
            {videoOptions.map((video) => (
              <MenuItem key={video.id} value={video.id}>
                {video.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
        }}
      >
        <ButtonGroup variant="outlined" size="medium">
          <Button
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Refresh
          </Button>
          {onExport && (
            <Tooltip title="Export data as CSV">
              <Button
                startIcon={<Download />}
                onClick={onExport}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Export
              </Button>
            </Tooltip>
          )}
        </ButtonGroup>
      </Box>
    </MotionPaper>
  )
}

export default ControlsPanel
