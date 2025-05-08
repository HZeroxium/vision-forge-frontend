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
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DemographicsChartProps {
  data: Array<{ name: string; value: number }>
  title: string
  subheader: string
  isLoading: boolean
  height?: number
}

const DemographicsChart: React.FC<DemographicsChartProps> = ({
  data,
  title,
  subheader,
  isLoading,
  height = 300,
}) => {
  const theme = useTheme()

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

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
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
              <PieChart>
                <Pie
                  data={data}
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
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number) => [
                    `${value.toFixed(1)}%`,
                    'Percentage',
                  ]}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: theme.palette.text.primary }}>
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
            height={height}
          >
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default DemographicsChart
