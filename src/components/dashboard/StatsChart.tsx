import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface StatsChartProps {
  labels: string[]
  data: number[]
}

const StatsChart: React.FC<StatsChartProps> = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Views',
        data,
        fill: false,
        borderColor: '#1976d2',
        tension: 0.1,
      },
    ],
  }

  return <Line data={chartData} />
}

export default StatsChart
