// /src/app/dev/tools/page.tsx

'use client'
import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
} from '@mui/material'
import { motion } from 'framer-motion'
import PineconeTools from '@/components/dev/PineconeTools'
import StorageTools from '@/components/dev/StorageTools'
import { Code, Storage, Dataset, ArrowBack } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const MotionContainer = motion(Container)

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dev-tabpanel-${index}`}
      aria-labelledby={`dev-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

export default function DeveloperTools() {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Tooltip title="Back to Dashboard">
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => router.push('/')}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Code /> Vision Forge Developer Tools
          </Typography>
        </Toolbar>
      </AppBar>

      <MotionContainer
        maxWidth="xl"
        sx={{ py: 4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Tools for interacting with backend APIs during development
        </Typography>

        <Paper sx={{ mt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Storage />} label="Storage API" />
            <Tab icon={<Dataset />} label="Pinecone Vector DB" />
          </Tabs>
          <Divider />

          <Box sx={{ p: 3 }}>
            <TabPanel value={activeTab} index={0}>
              <StorageTools />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <PineconeTools />
            </TabPanel>
          </Box>
        </Paper>
      </MotionContainer>
    </>
  )
}
