// src/utils/sse.ts
/**
 * Utility for handling Server-Sent Events (SSE) connections
 */

export interface JobProgress {
  jobId: string
  state: 'waiting' | 'active' | 'completed' | 'failed'
  progress: number
  currentStep?: string
  error?: string
}

/**
 * Creates an EventSource connection to listen for server-sent events with progress updates
 * @param jobId The ID of the job to monitor
 * @param onProgress Callback function that receives progress updates
 * @param onError Callback function that handles errors
 * @returns A function to close the connection
 */
export const subscribeToJobProgress = (
  jobId: string,
  onProgress: (progress: JobProgress) => void,
  onError?: (error: any) => void
): (() => void) => {
  // Check if EventSource is available (browser-only)
  if (typeof EventSource === 'undefined') {
    if (onError) onError(new Error('EventSource not supported in this browser'))
    return () => {}
  }

  console.log(`Opening SSE connection for job ${jobId}`)

  // Track if we've already processed a completion event
  let completionProcessed = false

  // Create EventSource connection to the backend
  const eventSource = new EventSource(
    `http://localhost:5000/api/flow/job/${jobId}/stream`
  )

  // Handle incoming messages
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as JobProgress

      // Skip duplicate completion events (this is crucial)
      if (
        (data.state === 'completed' || data.state === 'failed') &&
        completionProcessed
      ) {
        console.log(`Ignoring duplicate ${data.state} event for job ${jobId}`)
        return
      }

      // Mark completion as processed if this is a completion event
      if (data.state === 'completed' || data.state === 'failed') {
        completionProcessed = true

        // When job completes, close the connection immediately to prevent duplicate events
        console.log(
          `Job ${data.jobId} ${data.state} with progress ${data.progress}%, closing SSE connection`
        )
        setTimeout(() => {
          eventSource.close()
          console.log(`SSE connection closed for job ${jobId}`)
        }, 100) // Reduce timeout to close connection more quickly
      }

      onProgress(data)
    } catch (error) {
      console.error('Error parsing SSE data:', error)
      if (onError) onError(error)
    }
  }

  // Handle connection errors
  eventSource.onerror = (error) => {
    console.error(`SSE connection error for job ${jobId}:`, error)
    if (onError) onError(error)
    eventSource.close()
    console.log(`SSE connection closed for job ${jobId} due to error`)
  }

  // Return a function to close the connection
  return () => {
    console.log(`Manually closing SSE connection for job ${jobId}`)
    eventSource.close()
    console.log(`SSE connection closed for job ${jobId}`)
  }
}

/**
 * Creates a polling mechanism as a fallback for environments without SSE support
 * @param jobId The ID of the job to monitor
 * @param onProgress Callback function that receives progress updates
 * @param onError Callback function that handles errors
 * @param intervalMs Polling interval in milliseconds
 * @returns A function to stop polling
 */
export const pollJobProgress = (
  jobId: string,
  onProgress: (progress: JobProgress) => void,
  onError?: (error: any) => void,
  intervalMs = 2000
): (() => void) => {
  let isActive = true

  const poll = async () => {
    if (!isActive) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/flow/job/${jobId}/status`
      )
      if (!response.ok) throw new Error('Failed to fetch job status')

      const data = await response.json()
      onProgress(data)

      // Continue polling if job is still in progress
      if (data.state !== 'completed' && data.state !== 'failed') {
        setTimeout(poll, intervalMs)
      }
    } catch (error) {
      console.error('Job polling error:', error)
      if (onError) onError(error)
    }
  }

  // Start polling
  poll()

  // Return function to stop polling
  return () => {
    isActive = false
  }
}
