// /src/services/storageService.ts

import axios, { AxiosRequestConfig } from 'axios'
import env from '@/config/env'

// Create a dedicated client for the FastAPI server
const fastApiClient = axios.create({
  baseURL: env.FASTAPI_URL || 'http://localhost:8000',
  timeout: 30000,
})

// Define API endpoints
const STORAGE_API = {
  UPLOAD: '/storage/upload',
  LIST: '/storage/list',
  INFO: '/storage/info',
  DELETE: '/storage/delete',
  DELETE_MULTIPLE: '/storage/delete-multiple',
  CREATE_DIRECTORY: '/storage/create-directory',
  COPY: '/storage/copy',
  GET_URL: '/storage/get-url',
}

// File type enum to match backend
export enum FileType {
  IMAGE = 'images',
  AUDIO = 'audio',
  VIDEO = 'videos',
  DOCUMENT = 'documents',
  OTHER = 'files',
}

// Response types
export interface FileUploadResponse {
  url: string
  key: string
  size: number
  content_type: string
}

export interface FileInfo {
  key: string
  size: number
  last_modified: string
  etag: string
  content_type?: string
  url: string
  is_directory: boolean
  metadata?: Record<string, string>
}

export interface ListFilesRequest {
  prefix?: string
  max_keys?: number
  delimiter?: string
}

export interface ListFilesResponse {
  files: FileInfo[]
  directories: string[]
  prefix: string
  is_truncated: boolean
  next_marker?: string
}

export interface DeleteFileResponse {
  success: boolean
  key: string
}

export interface DeleteMultipleFilesRequest {
  keys: string[]
}

export interface DeleteMultipleFilesResponse {
  success: boolean
  deleted: string[]
  failed: Record<string, string>
}

export interface CreateDirectoryRequest {
  path: string
}

export interface CreateDirectoryResponse {
  success: boolean
  path: string
}

export interface CopyFileRequest {
  source_key: string
  destination_key: string
}

export interface CopyFileResponse {
  success: boolean
  source: string
  destination: string
  url: string
}

export interface GetFileURLRequest {
  key: string
  expiry?: number
}

export interface GetFileURLResponse {
  url: string
  expires_at: string
}

/**
 * Upload a file to the storage
 * @param file - The file to upload
 * @param fileType - Optional file type category
 * @param customFilename - Optional custom filename
 * @param folder - Optional subfolder within file type
 * @returns Upload response with URL and metadata
 */
export const uploadFile = async (
  file: File,
  fileType?: FileType,
  customFilename?: string,
  folder?: string
): Promise<FileUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  if (fileType) {
    formData.append('file_type', fileType)
  }

  if (customFilename) {
    formData.append('custom_filename', customFilename)
  }

  if (folder) {
    formData.append('folder', folder)
  }

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  const response = await fastApiClient.post(
    STORAGE_API.UPLOAD,
    formData,
    config
  )
  return response.data
}

/**
 * List files and directories in storage
 * @param request - Listing parameters (prefix, max_keys, delimiter)
 * @returns List of files and directories
 */
export const listFiles = async (
  request: ListFilesRequest = {}
): Promise<ListFilesResponse> => {
  // Convert request object to URL parameters for GET request

  const response = await fastApiClient.post(STORAGE_API.LIST, request)
  return response.data
}

/**
 * Get detailed information about a file
 * @param key - The object key/path
 * @returns File information
 */
export const getFileInfo = async (key: string): Promise<FileInfo> => {
  const response = await fastApiClient.get(`${STORAGE_API.INFO}/${key}`)
  return response.data
}

/**
 * Delete a single file
 * @param key - The object key to delete
 * @returns Deletion response
 */
export const deleteFile = async (key: string): Promise<DeleteFileResponse> => {
  const response = await fastApiClient.delete(`${STORAGE_API.DELETE}/${key}`)
  return response.data
}

/**
 * Delete multiple files in a single request
 * @param keys - Array of object keys to delete
 * @returns Response with success and failures
 */
export const deleteMultipleFiles = async (
  keys: string[]
): Promise<DeleteMultipleFilesResponse> => {
  const response = await fastApiClient.post(STORAGE_API.DELETE_MULTIPLE, {
    keys,
  })
  return response.data
}

/**
 * Create a directory in storage
 * @param path - Directory path to create
 * @returns Creation response
 */
export const createDirectory = async (
  path: string
): Promise<CreateDirectoryResponse> => {
  const response = await fastApiClient.post(STORAGE_API.CREATE_DIRECTORY, {
    path,
  })
  return response.data
}

/**
 * Copy a file within storage
 * @param sourceKey - Source object key
 * @param destinationKey - Destination object key
 * @returns Copy response
 */
export const copyFile = async (
  sourceKey: string,
  destinationKey: string
): Promise<CopyFileResponse> => {
  const request: CopyFileRequest = {
    source_key: sourceKey,
    destination_key: destinationKey,
  }
  const response = await fastApiClient.post(STORAGE_API.COPY, request)
  return response.data
}

/**
 * Get a pre-signed URL for temporary access
 * @param key - Object key
 * @param expiry - URL expiry time in seconds (default: 3600)
 * @returns URL response with expiry time
 */
export const getFileURL = async (
  key: string,
  expiry: number = 3600
): Promise<GetFileURLResponse> => {
  const request: GetFileURLRequest = { key, expiry }
  const response = await fastApiClient.post(STORAGE_API.GET_URL, request)
  return response.data
}
