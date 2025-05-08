import React from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface VideoComparisonChartProps {
  data: Array<{
    id: number
    title: string
    views: number
    videoId?: string
  }>
  isLoading: boolean
  height?: number
}

const VideoComparisonChart: React.FC<VideoComparisonChartProps> = ({
  data,
  isLoading,
  height = 300,
}) => {
  const theme = useTheme()

  // Limit to top 5 videos
  const chartData = data.slice(0, 5)

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
      <CardHeader
        title="Video Performance Comparison"
        subheader="Views comparison across top videos"
      />
      <CardContent>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={height}
          >
            <CircularProgress />
          </Box>
        ) : chartData.length > 0 ? (
          <Box sx={{ width: '100%', height: height }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
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
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={height}
          >
            <Typography color="text.secondary">
              No video comparison data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default VideoComparisonChart
