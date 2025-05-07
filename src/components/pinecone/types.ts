// Common types used across Pinecone components

export interface NotificationState {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
}

export interface SearchSectionProps {
  queryText: string
  setQueryText: (text: string) => void
  topK: number
  setTopK: (value: number) => void
  threshold: number
  setThreshold: (value: number) => void
  handleQuery: () => Promise<void>
  isLoading: boolean
  type: string
}

export interface DeleteSectionProps {
  vectorIdToDelete: string
  setVectorIdToDelete: (value: string) => void
  filterKeyToDelete: string
  setFilterKeyToDelete: (value: string) => void
  filterValueToDelete: string
  setFilterValueToDelete: (value: string) => void
  handleDelete: () => Promise<void>
  handleDeleteByFilter: () => Promise<void>
  isDeleting: boolean
  type: string
}

export interface ResultsTableProps {
  matches: any[]
  showNotification: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void
}

export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export interface TabProps {
  showNotification: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void
  queryText: string
  setQueryText: (text: string) => void
  topK: number
  setTopK: (value: number) => void
  threshold: number
  setThreshold: (value: number) => void
  vectorIdToDelete: string
  setVectorIdToDelete: (value: string) => void
  filterKeyToDelete: string
  setFilterKeyToDelete: (value: string) => void
  filterValueToDelete: string
  setFilterValueToDelete: (value: string) => void
}

export interface PromptItem {
  text: string
  image_prompt: string
}

export interface NotificationBarProps {
  notification: NotificationState
  handleCloseNotification: () => void
}
