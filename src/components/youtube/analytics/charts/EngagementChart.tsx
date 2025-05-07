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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface EngagementChartProps {
  data: Array<{ date: string; likes: number; comments: number; shares: number }>
  isLoading: boolean
  height?: number
}

const EngagementChart: React.FC<EngagementChartProps> = ({
  data,
  isLoading,
  height = 300,
}) => {
  const theme = useTheme()

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
      <CardHeader
        title="Engagement Metrics"
        subheader="Likes, comments and shares over time"
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
              <LineChart
                data={data}
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
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                  labelFormatter={(label) => {
                    try {
                      return format(new Date(label), 'MMM d, yyyy')
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
            height={height}
          >
            <Typography color="text.secondary">
              No engagement data available for this period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default EngagementChart
