import React from 'react'
import { Box } from '@mui/material'
import { TabPanelProps } from './types'

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pinecone-tabpanel-${index}`}
      aria-labelledby={`pinecone-tab-${index}`}
      {...other}
      style={{ paddingTop: '16px' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default TabPanel
