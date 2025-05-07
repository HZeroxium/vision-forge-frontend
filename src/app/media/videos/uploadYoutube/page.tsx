// /src/media/videos/uploadYoutube/page.tsx

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Container,
  Alert,
  Button,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Refresh,
  Timeline,
  BarChart,
  PieChart,
  Public,
} from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, subDays } from 'date-fns'
import { useVideos } from '@hooks/useVideos'
import * as youtubeService from '@services/youtubeService'
import { motion } from 'framer-motion'
import {
  BaseAnalyticsResponse,
  DemographicsAnalyticsResponse,
  TopVideosAnalyticsResponse,
  YouTubeVideoStatistics,
} from '@services/types/youtubeTypes'

// Import formatters
import { formatNumber, formatTime } from '@/utils/formatters'

// Import components
import Header from '@/components/youtube/analytics/Header'
import ControlsPanel from '@/components/youtube/analytics/ControlsPanel'
import SummaryCards from '@/components/youtube/analytics/SummaryCards'
import TabPanel from '@/components/youtube/analytics/TabPanel'
import OverviewTab from '@/components/youtube/analytics/tabs/OverviewTab'
import PerformanceTab from '@/components/youtube/analytics/tabs/PerformanceTab'
import DemographicsTab from '@/components/youtube/analytics/tabs/DemographicsTab'
import PublishedVideosTab from '@/components/youtube/analytics/tabs/PublishedVideosTab'

// Define types
type DateRangeOption = '7d' | '30d' | '90d' | 'custom'

interface VideoOption {
  id: string
  title: string
  youtubeVideoId?: string
}

interface SummaryMetrics {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  totalWatchTime: number
  avgViewDuration: number
}

interface AnalyticsRow {
  [key: string]: any
}

interface AnalyticsColumn {
  name: string
  type: string
  dataType: string
}

// Modified to better align with API responses
interface AnalyticsData {
  rows: AnalyticsRow[]
  columnHeaders: AnalyticsColumn[]
  labels?: string[]
  datasets?: any[]
  timeUnit?: string
}

interface ChartDataPoint {
  date: string
  views: number
}

interface EngagementDataPoint {
  date: string
  likes: number
  comments: number
  shares: number
}

interface DemographicsDataPoint {
  name: string
  value: number
}

interface TopVideoData {
  id: number
  videoId: string
  title: string
  views: number
  likes: number
  comments: number
  shares: number
  watchTime: string
}

// Fixed to match YouTubeVideoStatistics
interface PublishedVideo {
  id: string
  title?: string
  thumbnailUrl?: string
  publishingHistoryId?: string
  youtubeData?: {
    youtubeUrl?: string
    youtubeVideoId?: string
    statistics?: {
      viewCount?: number
      likeCount?: number
      commentCount?: number
      favoriteCount?: number
      lastUpdated?: string
    }
  }
}

const MotionBox = motion(Box)

// Helper functions to adapt API responses to component interfaces
const adaptBaseAnalytics = (data: BaseAnalyticsResponse): AnalyticsData => {
  return {
    rows: data.rows || [],
    columnHeaders: data.columnHeaders || [],
    labels: data.labels,
    datasets: data.datasets,
    timeUnit: data.timeUnit,
  }
}

const adaptDemographicsAnalytics = (
  data: DemographicsAnalyticsResponse
): AnalyticsData => {
  // Create a compatible structure for our components
  const rows = []
  const columnHeaders = [
    { name: 'ageGroup', type: 'string', dataType: 'string' },
    { name: 'gender', type: 'string', dataType: 'string' },
    { name: 'viewerPercentage', type: 'number', dataType: 'number' },
  ]

  // Process age groups
  if (data.ageGroups) {
    Object.entries(data.ageGroups).forEach(([ageGroup, genderData]) => {
      if (genderData.male) {
        rows.push([ageGroup, 'male', genderData.male])
      }
      if (genderData.female) {
        rows.push([ageGroup, 'female', genderData.female])
      }
      if (genderData.other) {
        rows.push([ageGroup, 'other', genderData.other])
      }
    })
  }

  // Process gender distribution
  if (data.genderDistribution) {
    const { male, female, other } = data.genderDistribution
    if (male) rows.push(['all', 'male', male])
    if (female) rows.push(['all', 'female', female])
    if (other) rows.push(['all', 'other', other])
  }

  return { rows, columnHeaders }
}

export default function YouTubeAnalyticsPage() {
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
    useState<AnalyticsData | null>(null)
  const [videoAnalytics, setVideoAnalytics] = useState<AnalyticsData | null>(
    null
  )
  const [demographicsAnalytics, setDemographicsAnalytics] =
    useState<AnalyticsData | null>(null)
  const [topVideosAnalytics, setTopVideosAnalytics] =
    useState<AnalyticsData | null>(null)

  const [loadingError, setLoadingError] = useState<string | null>(null)

  // Published videos with YouTube data
  const [publishedVideos, setPublishedVideos] = useState<PublishedVideo[]>([])
  const [loadingPublishedVideos, setLoadingPublishedVideos] = useState(false)

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Handle date range change
  const handleDateRangeChange = (value: DateRangeOption) => {
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

      const publishedWithYouTubeData: PublishedVideo[] = []

      for (const video of userVideos) {
        if (video.publishingHistoryId) {
          try {
            // Type fixed by modifying PublishedVideo interface to match YouTubeVideoStatistics
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

  // Fetch channel analytics
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

        // Fix: Adapt API response to match expected structure
        setChannelAnalytics(adaptBaseAnalytics(data))
      } catch (error: any) {
        console.error('Error fetching channel analytics:', error)
        setLoadingError(error.message || 'Failed to load channel analytics')
      } finally {
        setChannelLoading(false)
      }
    }

    fetchChannelAnalytics()
  }, [startDate, endDate])

  // Fetch video analytics
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

        // Fix: Adapt API response to match expected structure
        setVideoAnalytics(adaptBaseAnalytics(data))
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
      if (!startDate || !endDate || tabValue !== 2) return

      try {
        setDemographicsLoading(true)
        setLoadingError(null)

        const formattedStartDate = format(startDate, 'yyyy-MM-dd')
        const formattedEndDate = format(endDate, 'yyyy-MM-dd')

        const data = await youtubeService.getDemographicsAnalytics(
          formattedStartDate,
          formattedEndDate
        )

        // Fix: Transform demographics data to match expected structure
        setDemographicsAnalytics(adaptDemographicsAnalytics(data))
      } catch (error: any) {
        console.error('Error fetching demographics analytics:', error)
        // Don't set error - demographics might be unavailable for small channels
        setDemographicsAnalytics(null)
      } finally {
        setDemographicsLoading(false)
      }
    }

    fetchDemographics()
  }, [tabValue, startDate, endDate])

  // Fetch top videos analytics
  useEffect(() => {
    const fetchTopVideos = async () => {
      if (!startDate || !endDate || tabValue !== 1) return

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

        // Create compatible structure for top videos
        const adaptedTopVideos: AnalyticsData = {
          rows: data.rows || [],
          columnHeaders: data.columnHeaders || [],
        }

        setTopVideosAnalytics(adaptedTopVideos)
      } catch (error: any) {
        console.error('Error fetching top videos analytics:', error)
        setLoadingError(error.message || 'Failed to load top videos analytics')
      } finally {
        setTopVideosLoading(false)
      }
    }

    fetchTopVideos()
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

    // Force re-run of effects by changing date slightly
    setEndDate(new Date())
  }

  // Calculate summary metrics
  const summaryMetrics = useMemo((): SummaryMetrics => {
    if (!channelAnalytics?.rows || channelAnalytics.rows.length === 0) {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalWatchTime: 0,
        avgViewDuration: 0,
      }
    }

    // Find indices for each metric in the columnHeaders
    const getColumnIndex = (name: string): number => {
      return channelAnalytics.columnHeaders.findIndex((h) => h.name === name)
    }

    const viewsIndex = getColumnIndex('views')
    const likesIndex = getColumnIndex('likes')
    const commentsIndex = getColumnIndex('comments')
    const sharesIndex = getColumnIndex('shares')
    const watchTimeIndex = getColumnIndex('estimatedMinutesWatched')
    const avgDurationIndex = getColumnIndex('averageViewDuration')

    return channelAnalytics.rows.reduce(
      (acc: SummaryMetrics, row: AnalyticsRow) => ({
        totalViews: acc.totalViews + Number(row[viewsIndex] || 0),
        totalLikes: acc.totalLikes + Number(row[likesIndex] || 0),
        totalComments: acc.totalComments + Number(row[commentsIndex] || 0),
        totalShares: acc.totalShares + Number(row[sharesIndex] || 0),
        totalWatchTime: acc.totalWatchTime + Number(row[watchTimeIndex] || 0),
        // Average view duration is in seconds
        avgViewDuration:
          acc.avgViewDuration +
          Number(row[avgDurationIndex] || 0) / channelAnalytics.rows.length,
      }),
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

  // Process data for charts
  const viewTrendsData = useMemo((): ChartDataPoint[] => {
    if (!channelAnalytics?.rows || channelAnalytics.rows.length === 0) return []

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

  const engagementTrendsData = useMemo((): EngagementDataPoint[] => {
    if (!channelAnalytics?.rows || channelAnalytics.rows.length === 0) return []

    const getColumnIndex = (name: string): number => {
      return channelAnalytics.columnHeaders.findIndex((h) => h.name === name)
    }

    const likesIndex = getColumnIndex('likes')
    const commentsIndex = getColumnIndex('comments')
    const sharesIndex = getColumnIndex('shares')
    const dayIndex = getColumnIndex('day')

    return channelAnalytics.rows.map((row) => ({
      date: row[dayIndex],
      likes: Number(row[likesIndex] || 0),
      comments: Number(row[commentsIndex] || 0),
      shares: Number(row[sharesIndex] || 0),
    }))
  }, [channelAnalytics])

  // Process demographics data
  const demographicsData = useMemo(() => {
    if (!demographicsAnalytics?.rows) {
      return { ageData: [], genderData: [] }
    }

    const ageGroups: Record<string, number> = {}
    const genders: Record<string, number> = {}

    const getColumnIndex = (name: string): number => {
      return demographicsAnalytics.columnHeaders.findIndex(
        (h) => h.name === name
      )
    }

    const ageGroupIndex = getColumnIndex('ageGroup')
    const genderIndex = getColumnIndex('gender')
    const viewsPercentageIndex = getColumnIndex('viewerPercentage')

    demographicsAnalytics.rows.forEach((row) => {
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

    const ageData: DemographicsDataPoint[] = Object.entries(ageGroups).map(
      ([name, value]) => ({
        name,
        value: Number(value.toFixed(1)),
      })
    )

    const genderData: DemographicsDataPoint[] = Object.entries(genders).map(
      ([name, value]) => ({
        name,
        value: Number(value.toFixed(1)),
      })
    )

    return { ageData, genderData }
  }, [demographicsAnalytics])

  // Process top videos data
  const topVideosTableData = useMemo((): TopVideoData[] => {
    if (!topVideosAnalytics?.rows) return []

    const getColumnIndex = (name: string): number => {
      return topVideosAnalytics.columnHeaders.findIndex((h) => h.name === name)
    }

    const titleIndex = getColumnIndex('video')
    const videoIdIndex = getColumnIndex('videoId')
    const viewsIndex = getColumnIndex('views')
    const likesIndex = getColumnIndex('likes')
    const commentsIndex = getColumnIndex('comments')
    const sharesIndex = getColumnIndex('shares')
    const watchTimeIndex = getColumnIndex('estimatedMinutesWatched')

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

  // Get video options for selector
  const videoOptions = useMemo((): VideoOption[] => {
    return publishedVideos
      .filter((video) => video.youtubeData?.youtubeUrl)
      .map((video) => ({
        id: video.id,
        title: video.title || video.id,
        youtubeVideoId: video.youtubeData?.youtubeVideoId,
      }))
  }, [publishedVideos])

  // Handle data export
  const handleExport = () => {
    // Placeholder for future CSV export functionality
    console.log('Export functionality will be implemented in the future')
  }

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

  // Check if any videos are published to YouTube
  const hasPublishedVideos = publishedVideos.some(
    (video) => video.youtubeData?.youtubeUrl
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Component */}
        <Header
          title="YouTube Analytics"
          subtitle="Track performance and engagement for your YouTube videos"
        />

        {/* Controls Panel Component */}
        <ControlsPanel
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedVideo={selectedVideo}
          onVideoChange={setSelectedVideo}
          videoOptions={videoOptions}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* No published videos message */}
        {!hasPublishedVideos && (
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

        {/* Analytics Content (only shown if there are published videos) */}
        {hasPublishedVideos && (
          <>
            {/* Summary Cards Component */}
            <SummaryCards
              metrics={summaryMetrics}
              isLoading={channelLoading}
              formatNumber={formatNumber}
              formatTime={formatTime}
            />

            {/* Tabs Navigation */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="analytics tabs"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab
                    icon={<Timeline />}
                    iconPosition="start"
                    label="Overview"
                    id="analytics-tab-0"
                    aria-controls="analytics-tabpanel-0"
                  />
                  <Tab
                    icon={<BarChart />}
                    iconPosition="start"
                    label="Performance"
                    id="analytics-tab-1"
                    aria-controls="analytics-tabpanel-1"
                  />
                  <Tab
                    icon={<PieChart />}
                    iconPosition="start"
                    label="Demographics"
                    id="analytics-tab-2"
                    aria-controls="analytics-tabpanel-2"
                  />
                  <Tab
                    icon={<Public />}
                    iconPosition="start"
                    label="Published Videos"
                    id="analytics-tab-3"
                    aria-controls="analytics-tabpanel-3"
                  />
                </Tabs>

                {/* Tab Content */}
                <TabPanel value={tabValue} index={0}>
                  <OverviewTab
                    viewTrendsData={viewTrendsData}
                    engagementTrendsData={engagementTrendsData}
                    isLoading={channelLoading}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <PerformanceTab
                    topVideosData={topVideosTableData}
                    isLoading={topVideosLoading}
                    formatNumber={formatNumber}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <DemographicsTab
                    ageData={demographicsData.ageData}
                    genderData={demographicsData.genderData}
                    isLoading={demographicsLoading}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  <PublishedVideosTab
                    videos={publishedVideos}
                    formatNumber={formatNumber}
                    isLoading={loadingPublishedVideos}
                  />
                </TabPanel>
              </Paper>
            </MotionBox>
          </>
        )}
      </Container>
    </LocalizationProvider>
  )
}
