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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface ViewsTrendChartProps {
  data: Array<{ date: string; views: number }>
  isLoading: boolean
  startDate: Date | null
  endDate: Date | null
  height?: number
}

const ViewsTrendChart: React.FC<ViewsTrendChartProps> = ({
  data,
  isLoading,
  startDate,
  endDate,
  height = 300,
}) => {
  const theme = useTheme()

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return format(date, 'MMM d, yyyy')
  }

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
      <CardHeader
        title="View Trends"
        subheader={`Daily views from ${formatDate(startDate)} to ${formatDate(endDate)}`}
        sx={{ pb: 0 }}
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
        ) : data.length > 0 ? (
          <Box sx={{ width: '100%', height: height }}>
            <ResponsiveContainer>
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value: number) => [`${value} views`, 'Views']}
                  labelFormatter={(label) => {
                    try {
                      return format(new Date(label), 'MMM d, yyyy')
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
            height={height}
          >
            <Typography color="text.secondary">
              No view data available for this period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ViewsTrendChart
