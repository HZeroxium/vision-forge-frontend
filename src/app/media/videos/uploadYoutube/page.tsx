// /src/media/videos/uploadYoutube/page.tsx

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  ButtonGroup,
  Button,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  YouTube,
  Visibility,
  ThumbUp,
  Comment,
  Share,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  Timeline,
  Info,
  CalendarToday,
  Refresh,
  Download,
  FilterList,
  Person,
  Public,
  PlayCircle,
  Movie,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useVideos } from '@hooks/useVideos'
import { useYouTube } from '@hooks/useYouTube'
import { Video } from '@services/videoService'
import * as youtubeService from '@services/youtubeService'
import type {
  YouTubeVideoStatistics,
  BaseAnalyticsResponse,
  TopVideosAnalyticsResponse,
  DemographicsAnalyticsResponse,
} from '@services/types/youtubeTypes'
import { format, subDays, isAfter, parseISO } from 'date-fns'

// Import chart components
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

// Motion components
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)
const MotionCard = motion(Card)

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

// Helper function for a11y
function a11yProps(index: number) {
  return {
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  }
}

// Number formatting helpers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

type DateRangeOption = '7d' | '30d' | '90d' | 'custom'

export default function YouTubeAnalyticsPage() {
  const theme = useTheme()
  const { userVideos, userLoading, loadUserVideos } = useVideos()
  const [tabValue, setTabValue] = useState(0)

  // Date range state
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d')
  const [startDate, setStartDate] = useState<Date | null>(
    subDays(new Date(), 30)
  )
  const [endDate, setEndDate] = useState<Date | null>(new Date())

  // Filter state
  const [selectedVideo, setSelectedVideo] = useState<string>('all')

  // Analytics data state
  const [channelLoading, setChannelLoading] = useState(false)
  const [videoAnalyticsLoading, setVideoAnalyticsLoading] = useState(false)
  const [demographicsLoading, setDemographicsLoading] = useState(false)
  const [topVideosLoading, setTopVideosLoading] = useState(false)

  const [channelAnalytics, setChannelAnalytics] =
    useState<BaseAnalyticsResponse | null>(null)
  const [videoAnalytics, setVideoAnalytics] =
    useState<BaseAnalyticsResponse | null>(null)
  const [demographicsAnalytics, setDemographicsAnalytics] =
    useState<DemographicsAnalyticsResponse | null>(null)
  const [topVideosAnalytics, setTopVideosAnalytics] =
    useState<TopVideosAnalyticsResponse | null>(null)

  const [loadingError, setLoadingError] = useState<string | null>(null)

  // Published videos with YouTube data
  const [publishedVideos, setPublishedVideos] = useState<
    Array<Video & { youtubeData?: YouTubeVideoStatistics }>
  >([])
  const [loadingPublishedVideos, setLoadingPublishedVideos] = useState(false)

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Handle date range change
  const handleDateRangeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as DateRangeOption
    setDateRange(value)

    if (value === '7d') {
      setStartDate(subDays(new Date(), 7))
      setEndDate(new Date())
    } else if (value === '30d') {
      setStartDate(subDays(new Date(), 30))
      setEndDate(new Date())
    } else if (value === '90d') {
      setStartDate(subDays(new Date(), 90))
      setEndDate(new Date())
    }
    // For 'custom', keep existing dates
  }

  // Load user videos with YouTube data
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoadingPublishedVideos(true)
        await loadUserVideos(1, 50) // Load up to 50 videos
      } catch (error) {
        console.error('Error loading videos:', error)
        setLoadingError('Failed to load videos')
      } finally {
        setLoadingPublishedVideos(false)
      }
    }

    loadVideos()
  }, [loadUserVideos])

  // Load YouTube statistics for published videos
  useEffect(() => {
    const fetchYouTubeData = async () => {
      if (!userVideos.length) return

      const publishedWithYouTubeData = []

      for (const video of userVideos) {
        if (video.publishingHistoryId) {
          try {
            const youtubeData = await youtubeService.getVideoStatistics(
              video.publishingHistoryId
            )
            publishedWithYouTubeData.push({ ...video, youtubeData })
          } catch (error) {
            console.error(
              `Failed to fetch YouTube data for video ${video.id}:`,
              error
            )
            publishedWithYouTubeData.push(video)
          }
        }
      }

      setPublishedVideos(publishedWithYouTubeData)
    }

    if (userVideos.length > 0 && !loadingPublishedVideos) {
      fetchYouTubeData()
    }
  }, [userVideos, loadingPublishedVideos])

  // Fetch channel analytics when date range changes
  useEffect(() => {
    const fetchChannelAnalytics = async () => {
      if (!startDate || !endDate) return

      try {
        setChannelLoading(true)
        setLoadingError(null)

        const formattedStartDate = format(startDate, 'yyyy-MM-dd')
        const formattedEndDate = format(endDate, 'yyyy-MM-dd')

        const metrics =
          'views,likes,comments,shares,estimatedMinutesWatched,averageViewDuration'
        const dimensions = 'day'

        const data = await youtubeService.getChannelAnalytics(
          metrics,
          formattedStartDate,
          formattedEndDate,
          dimensions
        )

        setChannelAnalytics(data)
      } catch (error: any) {
        console.error('Error fetching channel analytics:', error)
        setLoadingError(error.message || 'Failed to load channel analytics')
      } finally {
        setChannelLoading(false)
      }
    }

    fetchChannelAnalytics()
  }, [startDate, endDate])

  // Fetch video analytics when video selection or date range changes
  useEffect(() => {
    const fetchVideoAnalytics = async () => {
      if (!startDate || !endDate) return

      // Skip if no video is selected or "all" is selected
      if (!selectedVideo || selectedVideo === 'all') {
        setVideoAnalytics(null)
        return
      }

      try {
        setVideoAnalyticsLoading(true)
        setLoadingError(null)

        const formattedStartDate = format(startDate, 'yyyy-MM-dd')
        const formattedEndDate = format(endDate, 'yyyy-MM-dd')

        const metrics =
          'views,likes,comments,shares,estimatedMinutesWatched,averageViewDuration'
        const dimensions = 'day'

        const selectedYouTubeVideo = publishedVideos.find(
          (v) => v.id === selectedVideo && v.youtubeData?.youtubeVideoId
        )

        if (!selectedYouTubeVideo?.youtubeData?.youtubeVideoId) {
          setVideoAnalyticsLoading(false)
          return
        }

        const data = await youtubeService.getVideoAnalytics(
          selectedYouTubeVideo.youtubeData.youtubeVideoId,
          metrics,
          formattedStartDate,
          formattedEndDate,
          dimensions
        )

        setVideoAnalytics(data)
      } catch (error: any) {
        console.error('Error fetching video analytics:', error)
        setLoadingError(error.message || 'Failed to load video analytics')
      } finally {
        setVideoAnalyticsLoading(false)
      }
    }

    fetchVideoAnalytics()
  }, [selectedVideo, startDate, endDate, publishedVideos])

  // Fetch demographics analytics
  useEffect(() => {
    const fetchDemographics = async () => {
      if (!startDate || !endDate) return

      try {
        setDemographicsLoading(true)
        setLoadingError(null)

        const formattedStartDate = format(startDate, 'yyyy-MM-dd')
        const formattedEndDate = format(endDate, 'yyyy-MM-dd')

        const data = await youtubeService.getDemographicsAnalytics(
          formattedStartDate,
          formattedEndDate
        )

        setDemographicsAnalytics(data)
      } catch (error: any) {
        console.error('Error fetching demographics analytics:', error)
        // Don't set error - demographics might be unavailable for small channels
        setDemographicsAnalytics(null)
      } finally {
        setDemographicsLoading(false)
      }
    }

    // Only load demographics on demographics tab to reduce API calls
    if (tabValue === 2) {
      fetchDemographics()
    }
  }, [tabValue, startDate, endDate])

  // Fetch top videos analytics
  useEffect(() => {
    const fetchTopVideos = async () => {
      if (!startDate || !endDate) return

      try {
        setTopVideosLoading(true)
        setLoadingError(null)

        const formattedStartDate = format(startDate, 'yyyy-MM-dd')
        const formattedEndDate = format(endDate, 'yyyy-MM-dd')

        const metrics = 'views,likes,comments,shares,estimatedMinutesWatched'

        const data = await youtubeService.getTopVideosAnalytics(
          10, // Limit to top 10
          metrics,
          formattedStartDate,
          formattedEndDate
        )

        setTopVideosAnalytics(data)
      } catch (error: any) {
        console.error('Error fetching top videos analytics:', error)
        setLoadingError(error.message || 'Failed to load top videos analytics')
      } finally {
        setTopVideosLoading(false)
      }
    }

    // Only load top videos on performance tab
    if (tabValue === 1) {
      fetchTopVideos()
    }
  }, [tabValue, startDate, endDate])

  // Refresh all data
  const handleRefresh = () => {
    // Reset loading states
    setChannelLoading(true)
    setVideoAnalyticsLoading(true)
    setDemographicsLoading(true)
    setTopVideosLoading(true)

    // Refetch user videos
    loadUserVideos(1, 50)

    // Force re-run of all effects by changing date slightly
    setEndDate(new Date())
  }

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (
      !channelAnalytics ||
      !channelAnalytics.rows ||
      channelAnalytics.rows.length === 0
    ) {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalWatchTime: 0,
        avgViewDuration: 0,
      }
    }

    return channelAnalytics.rows.reduce(
      (acc, row) => {
        // Find indices for each metric in the columnHeaders
        const viewsIndex = channelAnalytics.columnHeaders.findIndex(
          (h) => h.name === 'views'
        )
        const likesIndex = channelAnalytics.columnHeaders.findIndex(
          (h) => h.name === 'likes'
        )
        const commentsIndex = channelAnalytics.columnHeaders.findIndex(
          (h) => h.name === 'comments'
        )
        const sharesIndex = channelAnalytics.columnHeaders.findIndex(
          (h) => h.name === 'shares'
        )
        const watchTimeIndex = channelAnalytics.columnHeaders.findIndex(
          (h) => h.name === 'estimatedMinutesWatched'
        )
        const avgDurationIndex = channelAnalytics.columnHeaders.findIndex(
          (h) => h.name === 'averageViewDuration'
        )

        return {
          totalViews: acc.totalViews + Number(row[viewsIndex] || 0),
          totalLikes: acc.totalLikes + Number(row[likesIndex] || 0),
          totalComments: acc.totalComments + Number(row[commentsIndex] || 0),
          totalShares: acc.totalShares + Number(row[sharesIndex] || 0),
          totalWatchTime: acc.totalWatchTime + Number(row[watchTimeIndex] || 0),
          // Average view duration is in seconds
          avgViewDuration:
            acc.avgViewDuration +
            Number(row[avgDurationIndex] || 0) / channelAnalytics.rows.length,
        }
      },
      {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalWatchTime: 0,
        avgViewDuration: 0,
      }
    )
  }, [channelAnalytics])

  // Format time (seconds) to minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Create chart data for view trends
  const viewTrendsData = useMemo(() => {
    if (!channelAnalytics || !channelAnalytics.rows) return []

    const viewsIndex = channelAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'views'
    )
    const dayIndex = channelAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'day'
    )

    return channelAnalytics.rows.map((row) => ({
      date: row[dayIndex],
      views: Number(row[viewsIndex] || 0),
    }))
  }, [channelAnalytics])

  // Create chart data for engagement trends
  const engagementTrendsData = useMemo(() => {
    if (!channelAnalytics || !channelAnalytics.rows) return []

    const likesIndex = channelAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'likes'
    )
    const commentsIndex = channelAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'comments'
    )
    const sharesIndex = channelAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'shares'
    )
    const dayIndex = channelAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'day'
    )

    return channelAnalytics.rows.map((row) => ({
      date: row[dayIndex],
      likes: Number(row[likesIndex] || 0),
      comments: Number(row[commentsIndex] || 0),
      shares: Number(row[sharesIndex] || 0),
    }))
  }, [channelAnalytics])

  // Create chart data for demographics
  const demographicsData = useMemo(() => {
    if (!demographicsAnalytics || !demographicsAnalytics.rows) {
      return { ageData: [], genderData: [] }
    }

    const ageGroups: Record<string, number> = {}
    const genders: Record<string, number> = {}

    demographicsAnalytics.rows.forEach((row) => {
      const ageGroupIndex = demographicsAnalytics.columnHeaders.findIndex(
        (h) => h.name === 'ageGroup'
      )
      const genderIndex = demographicsAnalytics.columnHeaders.findIndex(
        (h) => h.name === 'gender'
      )
      const viewsPercentageIndex =
        demographicsAnalytics.columnHeaders.findIndex(
          (h) => h.name === 'viewerPercentage'
        )

      const ageGroup = row[ageGroupIndex] as string
      const gender = row[genderIndex] as string
      const viewsPercentage = Number(row[viewsPercentageIndex] || 0)

      if (ageGroup) {
        ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + viewsPercentage
      }

      if (gender) {
        genders[gender] = (genders[gender] || 0) + viewsPercentage
      }
    })

    const ageData = Object.entries(ageGroups).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1)),
    }))

    const genderData = Object.entries(genders).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1)),
    }))

    return { ageData, genderData }
  }, [demographicsAnalytics])

  // Top videos data for table
  const topVideosTableData = useMemo(() => {
    if (!topVideosAnalytics || !topVideosAnalytics.rows) return []

    const titleIndex = topVideosAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'video'
    )
    const videoIdIndex = topVideosAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'videoId'
    )
    const viewsIndex = topVideosAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'views'
    )
    const likesIndex = topVideosAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'likes'
    )
    const commentsIndex = topVideosAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'comments'
    )
    const sharesIndex = topVideosAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'shares'
    )
    const watchTimeIndex = topVideosAnalytics.columnHeaders.findIndex(
      (h) => h.name === 'estimatedMinutesWatched'
    )

    return topVideosAnalytics.rows.map((row, index) => ({
      id: index,
      videoId: row[videoIdIndex],
      title: row[titleIndex],
      views: Number(row[viewsIndex] || 0),
      likes: Number(row[likesIndex] || 0),
      comments: Number(row[commentsIndex] || 0),
      shares: Number(row[sharesIndex] || 0),
      watchTime: Number(row[watchTimeIndex] || 0).toFixed(1),
    }))
  }, [topVideosAnalytics])

  // Column definitions for top videos table
  const topVideosColumns: GridColDef[] = [
    { field: 'title', headerName: 'Video Title', flex: 2, minWidth: 200 },
    {
      field: 'views',
      headerName: 'Views',
      width: 100,
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Visibility fontSize="small" color="action" />
          {formatNumber(params.value as number)}
        </Box>
      ),
    },
    {
      field: 'likes',
      headerName: 'Likes',
      width: 100,
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThumbUp fontSize="small" color="action" />
          {formatNumber(params.value as number)}
        </Box>
      ),
    },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Comment fontSize="small" color="action" />
          {formatNumber(params.value as number)}
        </Box>
      ),
    },
    {
      field: 'watchTime',
      headerName: 'Watch Time (min)',
      width: 150,
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline fontSize="small" color="action" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          href={`https://www.youtube.com/watch?v=${params.row.videoId}`}
          target="_blank"
          startIcon={<YouTube />}
        >
          View
        </Button>
      ),
    },
  ]

  // Get video select options
  const videoOptions = useMemo(() => {
    const options = publishedVideos
      .filter((video) => video.youtubeData?.youtubeUrl)
      .map((video) => ({
        id: video.id,
        title: video.title || video.id,
        youtubeVideoId: video.youtubeData?.youtubeVideoId,
      }))

    return options
  }, [publishedVideos])

  // COLORS for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
  ]

  // Render loading state
  if (userLoading && loadingPublishedVideos) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <CircularProgress color="secondary" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading YouTube Analytics...
          </Typography>
        </Box>
      </Container>
    )
  }

  // Render error state
  if (loadingError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadingError}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Container>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          sx={{ mb: 4 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <YouTube color="error" sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              YouTube Analytics
            </Typography>
          </Box>

          <Typography variant="subtitle1" color="text.secondary">
            Track performance and engagement for your YouTube videos
          </Typography>
        </MotionBox>

        {/* Controls */}
        <MotionPaper
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          elevation={1}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            display: 'flex',
            flexWrap: 'wrap',
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
                onChange={(e) => handleDateRangeChange(e as any)}
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { width: 150 },
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
                      sx: { width: 150 },
                    },
                  }}
                />
              </Box>
            )}

            {/* Video selector */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by video</InputLabel>
              <Select
                value={selectedVideo}
                label="Filter by video"
                onChange={(e) => setSelectedVideo(e.target.value as string)}
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
          <Box>
            <ButtonGroup variant="outlined" size="medium">
              <Button startIcon={<Refresh />} onClick={handleRefresh}>
                Refresh
              </Button>
              <Tooltip title="Export data as CSV">
                <Button startIcon={<Download />}>Export</Button>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </MotionPaper>

        {publishedVideos.length === 0 && (
          <Alert
            severity="info"
            sx={{ mb: 4 }}
            action={
              <Button color="inherit" size="small" href="/media/videos">
                Go to Videos
              </Button>
            }
          >
            You don't have any videos published to YouTube yet. Publish videos
            to see analytics.
          </Alert>
        )}

        {/* Summary Cards */}
        {publishedVideos.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MotionCard
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{ borderRadius: 2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Visibility />}
                      label="Views"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="medium">
                    {channelLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      formatNumber(summaryMetrics.totalViews)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MotionCard
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.25 }}
                sx={{ borderRadius: 2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<ThumbUp />}
                      label="Likes"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="medium">
                    {channelLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      formatNumber(summaryMetrics.totalLikes)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Likes
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MotionCard
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ borderRadius: 2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Comment />}
                      label="Comments"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="medium">
                    {channelLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      formatNumber(summaryMetrics.totalComments)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Comments
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MotionCard
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.35 }}
                sx={{ borderRadius: 2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Share />}
                      label="Shares"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="medium">
                    {channelLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      formatNumber(summaryMetrics.totalShares)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Shares
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MotionCard
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.4 }}
                sx={{ borderRadius: 2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<Timeline />}
                      label="Watch Time"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="medium">
                    {channelLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      `${Math.floor(summaryMetrics.totalWatchTime)}m`
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Minutes Watched
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MotionCard
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.45 }}
                sx={{ borderRadius: 2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={<PlayCircle />}
                      label="Avg Duration"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="medium">
                    {channelLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      formatTime(summaryMetrics.avgViewDuration)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average View Duration
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        {publishedVideos.length > 0 && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="analytics tabs"
                >
                  <Tab
                    icon={<Timeline />}
                    iconPosition="start"
                    label="Overview"
                    {...a11yProps(0)}
                  />
                  <Tab
                    icon={<BarChart />}
                    iconPosition="start"
                    label="Performance"
                    {...a11yProps(1)}
                  />
                  <Tab
                    icon={<PieChart />}
                    iconPosition="start"
                    label="Demographics"
                    {...a11yProps(2)}
                  />
                  <Tab
                    icon={<Public />}
                    iconPosition="start"
                    label="Published Videos"
                    {...a11yProps(3)}
                  />
                </Tabs>
              </Box>

              {/* Overview Tab */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  {/* View trends chart */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <CardHeader
                        title="View Trends"
                        subheader={`Daily views from ${startDate ? format(startDate, 'MMM d, yyyy') : ''} to ${endDate ? format(endDate, 'MMM d, yyyy') : ''}`}
                        sx={{ pb: 0 }}
                      />
                      <CardContent>
                        {channelLoading ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <CircularProgress />
                          </Box>
                        ) : viewTrendsData.length > 0 ? (
                          <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <AreaChart
                                data={viewTrendsData}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorViews"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor={theme.palette.primary.main}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor={theme.palette.primary.main}
                                      stopOpacity={0.1}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  opacity={0.2}
                                />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => {
                                    try {
                                      return format(new Date(value), 'MMM d')
                                    } catch (e) {
                                      return value
                                    }
                                  }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <RechartsTooltip
                                  formatter={(value: number) => [
                                    `${value} views`,
                                    'Views',
                                  ]}
                                  labelFormatter={(label) => {
                                    try {
                                      return format(
                                        new Date(label),
                                        'MMM d, yyyy'
                                      )
                                    } catch (e) {
                                      return label
                                    }
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="views"
                                  stroke={theme.palette.primary.main}
                                  fillOpacity={1}
                                  fill="url(#colorViews)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <Typography color="text.secondary">
                              No view data available for this period
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Engagement metrics */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <CardHeader
                        title="Engagement Metrics"
                        subheader="Likes, comments and shares over time"
                        sx={{ pb: 0 }}
                      />
                      <CardContent>
                        {channelLoading ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <CircularProgress />
                          </Box>
                        ) : engagementTrendsData.length > 0 ? (
                          <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <LineChart
                                data={engagementTrendsData}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  opacity={0.2}
                                />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => {
                                    try {
                                      return format(new Date(value), 'MMM d')
                                    } catch (e) {
                                      return value
                                    }
                                  }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <RechartsTooltip
                                  formatter={(value: number, name: string) => [
                                    `${value}`,
                                    name,
                                  ]}
                                  labelFormatter={(label) => {
                                    try {
                                      return format(
                                        new Date(label),
                                        'MMM d, yyyy'
                                      )
                                    } catch (e) {
                                      return label
                                    }
                                  }}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="likes"
                                  stroke={theme.palette.secondary.main}
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="comments"
                                  stroke={theme.palette.success.main}
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="shares"
                                  stroke={theme.palette.info.main}
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <Typography color="text.secondary">
                              No engagement data available for this period
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Performance Tab */}
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  {/* Top Videos Table */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <CardHeader
                        title="Top Performing Videos"
                        subheader={`Based on views from ${startDate ? format(startDate, 'MMM d, yyyy') : ''} to ${endDate ? format(endDate, 'MMM d, yyyy') : ''}`}
                      />
                      <CardContent>
                        {topVideosLoading ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="400px"
                          >
                            <CircularProgress />
                          </Box>
                        ) : topVideosTableData.length > 0 ? (
                          <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                              rows={topVideosTableData}
                              columns={topVideosColumns}
                              initialState={{
                                pagination: {
                                  paginationModel: { page: 0, pageSize: 5 },
                                },
                                sorting: {
                                  sortModel: [{ field: 'views', sort: 'desc' }],
                                },
                              }}
                              pageSizeOptions={[5, 10]}
                              disableRowSelectionOnClick
                              sx={{
                                '& .MuiDataGrid-cell:hover': {
                                  color: theme.palette.secondary.main,
                                },
                              }}
                            />
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="400px"
                          >
                            <Typography color="text.secondary">
                              No video performance data available for this
                              period
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Video comparison chart */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <CardHeader
                        title="Video Performance Comparison"
                        subheader="Views comparison across top videos"
                      />
                      <CardContent>
                        {topVideosLoading ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <CircularProgress />
                          </Box>
                        ) : topVideosTableData.length > 0 ? (
                          <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <RechartsBarChart
                                data={topVideosTableData.slice(0, 5)} // Take top 5
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 70,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  opacity={0.2}
                                />
                                <XAxis
                                  dataKey="title"
                                  tick={{ fontSize: 12 }}
                                  angle={-45}
                                  textAnchor="end"
                                  height={70}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <RechartsTooltip
                                  formatter={(value: number, name: string) => [
                                    `${value}`,
                                    name === 'views' ? 'Views' : name,
                                  ]}
                                />
                                <Legend />
                                <Bar
                                  dataKey="views"
                                  fill={theme.palette.primary.main}
                                  name="Views"
                                />
                              </RechartsBarChart>
                            </ResponsiveContainer>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <Typography color="text.secondary">
                              No video comparison data available
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Demographics Tab */}
              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                  {/* Message for small channels */}
                  {!demographicsAnalytics?.rows?.length &&
                    !demographicsLoading && (
                      <Grid item xs={12}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">
                            Demographics data is not available
                          </Typography>
                          <Typography variant="body2">
                            YouTube doesn't provide demographics data until your
                            channel reaches a certain threshold of views.
                          </Typography>
                        </Alert>
                      </Grid>
                    )}

                  {/* Age distribution chart */}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        height: '100%',
                      }}
                    >
                      <CardHeader
                        title="Age Distribution"
                        subheader="Viewer age groups percentage"
                      />
                      <CardContent>
                        {demographicsLoading ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <CircularProgress />
                          </Box>
                        ) : demographicsData.ageData.length > 0 ? (
                          <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={demographicsData.ageData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(1)}%`
                                  }
                                >
                                  {demographicsData.ageData.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                      />
                                    )
                                  )}
                                </Pie>
                                <RechartsTooltip
                                  formatter={(value: number) => [
                                    `${value.toFixed(1)}%`,
                                    'Percentage',
                                  ]}
                                />
                                <Legend
                                  formatter={(value) => (
                                    <span
                                      style={{
                                        color: theme.palette.text.primary,
                                      }}
                                    >
                                      {value}
                                    </span>
                                  )}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <Typography color="text.secondary">
                              No age data available
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Gender distribution chart */}
                  <Grid item xs={12} md={6}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        height: '100%',
                      }}
                    >
                      <CardHeader
                        title="Gender Distribution"
                        subheader="Viewer gender percentage"
                      />
                      <CardContent>
                        {demographicsLoading ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <CircularProgress />
                          </Box>
                        ) : demographicsData.genderData.length > 0 ? (
                          <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={demographicsData.genderData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(1)}%`
                                  }
                                >
                                  {demographicsData.genderData.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                      />
                                    )
                                  )}
                                </Pie>
                                <RechartsTooltip
                                  formatter={(value: number) => [
                                    `${value.toFixed(1)}%`,
                                    'Percentage',
                                  ]}
                                />
                                <Legend
                                  formatter={(value) => (
                                    <span
                                      style={{
                                        color: theme.palette.text.primary,
                                      }}
                                    >
                                      {value}
                                    </span>
                                  )}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="300px"
                          >
                            <Typography color="text.secondary">
                              No gender data available
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Published Videos Tab */}
              <TabPanel value={tabValue} index={3}>
                <Grid container spacing={3}>
                  {publishedVideos.map(
                    (video) =>
                      video.youtubeData?.youtubeUrl && (
                        <Grid item xs={12} md={6} lg={4} key={video.id}>
                          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Box
                              sx={{
                                position: 'relative',
                                paddingTop: '56.25%',
                                bgcolor: 'black',
                              }}
                            >
                              {video.thumbnailUrl ? (
                                <Box
                                  component="img"
                                  src={video.thumbnailUrl}
                                  alt={video.title || 'Video thumbnail'}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'grey.900',
                                  }}
                                >
                                  <Movie
                                    sx={{ fontSize: 60, color: 'grey.500' }}
                                  />
                                </Box>
                              )}

                              {/* YouTube badge */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  p: 0.5,
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <YouTube fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="caption" fontWeight="bold">
                                  PUBLISHED
                                </Typography>
                              </Box>
                            </Box>

                            <CardContent>
                              <Typography variant="h6" gutterBottom noWrap>
                                {video.title || `Video ${video.id}`}
                              </Typography>

                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={4}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Visibility color="action" />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 0.5 }}
                                    >
                                      Views
                                    </Typography>
                                    <Typography variant="h6">
                                      {video.youtubeData?.statistics?.viewCount
                                        ? formatNumber(
                                            Number(
                                              video.youtubeData.statistics
                                                .viewCount
                                            )
                                          )
                                        : '0'}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={4}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <ThumbUp color="action" />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 0.5 }}
                                    >
                                      Likes
                                    </Typography>
                                    <Typography variant="h6">
                                      {video.youtubeData?.statistics?.likeCount
                                        ? formatNumber(
                                            Number(
                                              video.youtubeData.statistics
                                                .likeCount
                                            )
                                          )
                                        : '0'}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={4}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Comment color="action" />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 0.5 }}
                                    >
                                      Comments
                                    </Typography>
                                    <Typography variant="h6">
                                      {video.youtubeData?.statistics
                                        ?.commentCount
                                        ? formatNumber(
                                            Number(
                                              video.youtubeData.statistics
                                                .commentCount
                                            )
                                          )
                                        : '0'}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<YouTube />}
                                sx={{ mt: 2, width: '100%' }}
                                href={video.youtubeData?.youtubeUrl || '#'}
                                target="_blank"
                              >
                                View on YouTube
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                  )}
                </Grid>
              </TabPanel>
            </Paper>
          </MotionBox>
        )}
      </Container>
    </LocalizationProvider>
  )
}
