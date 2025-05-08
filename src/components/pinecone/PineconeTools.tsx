'use client'
import React, { useState } from 'react'
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material'
import { motion } from 'framer-motion'
import { usePinecone } from '@/hooks/usePinecone'
import {
  ImageEmbeddingsTab,
  AudioEmbeddingsTab,
  ScriptEmbeddingsTab,
  ImagePromptsTab,
  NotificationBar,
} from './index'
import TabPanel from './TabPanel'
import { NotificationState } from './types'

// Styled components using motion
const MotionBox = motion(Box)

export default function PineconeTools() {
  // Tab state
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  // Common state for query
  const [queryText, setQueryText] = useState('')
  const [topK, setTopK] = useState(5)
  const [threshold, setThreshold] = useState(0.7)

  // Delete state
  const [vectorIdToDelete, setVectorIdToDelete] = useState('')
  const [filterKeyToDelete, setFilterKeyToDelete] = useState('')
  const [filterValueToDelete, setFilterValueToDelete] = useState('')

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  })

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue)
  }

  // Common functions
  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          Pinecone Vector Database Tools
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage vector embeddings in Pinecone database. Search for similar
          content, add new embeddings, and delete existing ones.
        </Typography>
      </Box>

      <Paper sx={{ mt: 2, mb: 4 }}>
        <Tabs
          value={activeTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              px: 3,
              minWidth: 120,
            },
          }}
        >
          <Tab label="Image Embeddings" />
          <Tab label="Audio Embeddings" />
          <Tab label="Script Embeddings" />
          <Tab label="Image Prompts" />
        </Tabs>
      </Paper>

      {/* IMAGE EMBEDDINGS TAB */}
      <TabPanel value={activeTabIndex} index={0}>
        <ImageEmbeddingsTab
          showNotification={showNotification}
          queryText={queryText}
          setQueryText={setQueryText}
          topK={topK}
          setTopK={setTopK}
          threshold={threshold}
          setThreshold={setThreshold}
          vectorIdToDelete={vectorIdToDelete}
          setVectorIdToDelete={setVectorIdToDelete}
          filterKeyToDelete={filterKeyToDelete}
          setFilterKeyToDelete={setFilterKeyToDelete}
          filterValueToDelete={filterValueToDelete}
          setFilterValueToDelete={setFilterValueToDelete}
        />
      </TabPanel>

      {/* AUDIO EMBEDDINGS TAB */}
      <TabPanel value={activeTabIndex} index={1}>
        <AudioEmbeddingsTab
          showNotification={showNotification}
          queryText={queryText}
          setQueryText={setQueryText}
          topK={topK}
          setTopK={setTopK}
          threshold={threshold}
          setThreshold={setThreshold}
          vectorIdToDelete={vectorIdToDelete}
          setVectorIdToDelete={setVectorIdToDelete}
          filterKeyToDelete={filterKeyToDelete}
          setFilterKeyToDelete={setFilterKeyToDelete}
          filterValueToDelete={filterValueToDelete}
          setFilterValueToDelete={setFilterValueToDelete}
        />
      </TabPanel>

      {/* SCRIPT EMBEDDINGS TAB */}
      <TabPanel value={activeTabIndex} index={2}>
        <ScriptEmbeddingsTab
          showNotification={showNotification}
          queryText={queryText}
          setQueryText={setQueryText}
          topK={topK}
          setTopK={setTopK}
          threshold={threshold}
          setThreshold={setThreshold}
          vectorIdToDelete={vectorIdToDelete}
          setVectorIdToDelete={setVectorIdToDelete}
          filterKeyToDelete={filterKeyToDelete}
          setFilterKeyToDelete={setFilterKeyToDelete}
          filterValueToDelete={filterValueToDelete}
          setFilterValueToDelete={setFilterValueToDelete}
        />
      </TabPanel>

      {/* IMAGE PROMPTS TAB */}
      <TabPanel value={activeTabIndex} index={3}>
        <ImagePromptsTab
          showNotification={showNotification}
          queryText={queryText}
          setQueryText={setQueryText}
          topK={topK}
          setTopK={setTopK}
          threshold={threshold}
          setThreshold={setThreshold}
          vectorIdToDelete={vectorIdToDelete}
          setVectorIdToDelete={setVectorIdToDelete}
          filterKeyToDelete={filterKeyToDelete}
          setFilterKeyToDelete={setFilterKeyToDelete}
          filterValueToDelete={filterValueToDelete}
          setFilterValueToDelete={setFilterValueToDelete}
        />
      </TabPanel>

      {/* Notification Bar */}
      <NotificationBar
        notification={notification}
        handleCloseNotification={handleCloseNotification}
      />
    </MotionBox>
  )
}
