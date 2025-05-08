import React from 'react'
import { Tabs, Tab, Paper, useTheme } from '@mui/material'
import { Person, Lock } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/animations'

const MotionPaper = motion(Paper)

interface TabNavigationProps {
  tabValue: number
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void
  isMobile: boolean
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  }
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabValue,
  handleTabChange,
  isMobile,
}) => {
  const theme = useTheme()

  return (
    <MotionPaper
      variants={fadeIn}
      sx={{
        borderRadius: 2,
        mb: 3,
        overflow: 'hidden',
        boxShadow: theme.shadows[1],
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant={isMobile ? 'fullWidth' : 'standard'}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: 56,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            transition: 'all 0.2s ease',
          },
          '& .Mui-selected': {
            color: theme.palette.primary.main,
            fontWeight: 'bold',
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        <Tab
          icon={<Person />}
          label="Profile"
          iconPosition="start"
          {...a11yProps(0)}
        />
        <Tab
          icon={<Lock />}
          label="Security"
          iconPosition="start"
          {...a11yProps(1)}
        />
      </Tabs>
    </MotionPaper>
  )
}

export default TabNavigation
