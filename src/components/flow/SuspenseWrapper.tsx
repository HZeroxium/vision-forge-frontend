import React, { Suspense } from 'react'
import { Box, Typography } from '@mui/material'
import LoadingIndicator from '../common/LoadingIndicator'

interface SuspenseWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
  loadingMessage?: string
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

const DefaultErrorFallback = () => (
  <Box textAlign="center" p={3}>
    <Typography color="error">
      Something went wrong. Please try again.
    </Typography>
  </Box>
)

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  loadingMessage = 'Loading...',
}) => {
  const loadingFallback = fallback || (
    <LoadingIndicator isLoading={true} message={loadingMessage} />
  )

  const errorComponent = errorFallback || <DefaultErrorFallback />

  return (
    <ErrorBoundary fallback={errorComponent}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default SuspenseWrapper
