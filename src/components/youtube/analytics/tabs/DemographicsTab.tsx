import React from 'react'
import Grid from '@mui/material/Grid2'
import { Alert, Typography } from '@mui/material'
import DemographicsChart from '../charts/DemographicsChart'

interface DemographicsTabProps {
  ageData: Array<{ name: string; value: number }>
  genderData: Array<{ name: string; value: number }>
  isLoading: boolean
}

const DemographicsTab: React.FC<DemographicsTabProps> = ({
  ageData,
  genderData,
  isLoading,
}) => {
  const noData = ageData.length === 0 && genderData.length === 0 && !isLoading

  return (
    <Grid container spacing={3}>
      {/* Message for small channels */}
      {noData && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">
              Demographics data is not available
            </Typography>
            <Typography variant="body2">
              YouTube doesn't provide demographics data until your channel
              reaches a certain threshold of views.
            </Typography>
          </Alert>
        </Grid>
      )}

      {/* Age distribution chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <DemographicsChart
          title="Age Distribution"
          subheader="Viewer age groups percentage"
          data={ageData}
          isLoading={isLoading}
        />
      </Grid>

      {/* Gender distribution chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <DemographicsChart
          title="Gender Distribution"
          subheader="Viewer gender percentage"
          data={genderData}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  )
}

export default DemographicsTab
