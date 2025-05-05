// /src/services/pineconeService.ts

import axios from 'axios'
import env from '@/config/env'

// Create a dedicated client for the FastAPI server
const fastApiClient = axios.create({
  baseURL: env.FASTAPI_URL || 'http://localhost:8000',
  timeout: 30000,
})

// Types for Pinecone API requests and responses
export interface Source {
  title: string
  url: string
  content?: string
}

// Image operations
export interface UpsertImageEmbeddingRequest {
  prompt: string
  image_url: string
  style?: string
}

export interface QueryImageEmbeddingRequest {
  query_text: string
  top_k?: number
  threshold?: number
}

export interface DeleteImagesByFilterRequest {
  filter: Record<string, any>
}

// Audio operations
export interface UpsertAudioEmbeddingRequest {
  script: string
  audio_url: string
  voice: string
  duration: number
}

export interface QueryAudioEmbeddingRequest {
  query_text: string
  voice?: string
  top_k?: number
  threshold?: number
}

export interface DeleteAudiosByFilterRequest {
  filter: Record<string, any>
}

// Script operations
export interface UpsertScriptEmbeddingRequest {
  title: string
  content: string
  style: string
  language: string
  sources?: Source[]
}

export interface QueryScriptEmbeddingRequest {
  query_text: string
  language?: string
  top_k?: number
  threshold?: number
}

export interface DeleteScriptsByFilterRequest {
  filter: Record<string, any>
}

// Image Prompts operations
export interface UpsertImagePromptsEmbeddingRequest {
  content: string
  prompts: { text: string; image_prompt: string }[]
  style: string
}

export interface QueryImagePromptsEmbeddingRequest {
  query_text: string
  style?: string
  top_k?: number
  threshold?: number
}

export interface DeleteImagePromptsByFilterRequest {
  filter: Record<string, any>
}

// Common response types
export interface PineconeMatch {
  id: string
  score: number
  metadata: Record<string, any>
}

export interface PineconeQueryResponse {
  matches: PineconeMatch[]
  count: number
}

export interface PineconeDeleteResponse {
  message: string
  success: boolean
}

export interface PineconeUpsertResponse {
  message: string
  success: boolean
}

// Image operations
export const upsertImageEmbedding = async (
  data: UpsertImageEmbeddingRequest
): Promise<PineconeUpsertResponse> => {
  const response = await fastApiClient.post('/pinecone/image/upsert', data)
  return response.data
}

export const queryImageEmbeddings = async (
  data: QueryImageEmbeddingRequest
): Promise<PineconeQueryResponse> => {
  const response = await fastApiClient.post('/pinecone/image/query', data)
  return response.data
}

export const deleteImageEmbedding = async (
  vectorId: string
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.delete(
    `/pinecone/image/delete/${vectorId}`
  )
  return response.data
}

export const deleteImagesByFilter = async (
  filter: Record<string, any>
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.post(
    '/pinecone/image/delete-by-filter',
    {
      filter,
    }
  )
  return response.data
}

// Audio operations
export const upsertAudioEmbedding = async (
  data: UpsertAudioEmbeddingRequest
): Promise<PineconeUpsertResponse> => {
  const response = await fastApiClient.post('/pinecone/audio/upsert', data)
  return response.data
}

export const queryAudioEmbeddings = async (
  data: QueryAudioEmbeddingRequest
): Promise<PineconeQueryResponse> => {
  const response = await fastApiClient.post('/pinecone/audio/query', data)
  return response.data
}

export const deleteAudioEmbedding = async (
  vectorId: string
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.delete(
    `/pinecone/audio/delete/${vectorId}`
  )
  return response.data
}

export const deleteAudiosByFilter = async (
  filter: Record<string, any>
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.post(
    '/pinecone/audio/delete-by-filter',
    {
      filter,
    }
  )
  return response.data
}

// Script operations
export const upsertScriptEmbedding = async (
  data: UpsertScriptEmbeddingRequest
): Promise<PineconeUpsertResponse> => {
  const response = await fastApiClient.post('/pinecone/script/upsert', data)
  return response.data
}

export const queryScriptEmbeddings = async (
  data: QueryScriptEmbeddingRequest
): Promise<PineconeQueryResponse> => {
  const response = await fastApiClient.post('/pinecone/script/query', data)
  return response.data
}

export const deleteScriptEmbedding = async (
  vectorId: string
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.delete(
    `/pinecone/script/delete/${vectorId}`
  )
  return response.data
}

export const deleteScriptsByFilter = async (
  filter: Record<string, any>
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.post(
    '/pinecone/script/delete-by-filter',
    {
      filter,
    }
  )
  return response.data
}

// Image Prompts operations
export const upsertImagePromptsEmbedding = async (
  data: UpsertImagePromptsEmbeddingRequest
): Promise<PineconeUpsertResponse> => {
  const response = await fastApiClient.post(
    '/pinecone/image-prompts/upsert',
    data
  )
  return response.data
}

export const queryImagePromptsEmbeddings = async (
  data: QueryImagePromptsEmbeddingRequest
): Promise<PineconeQueryResponse> => {
  const response = await fastApiClient.post(
    '/pinecone/image-prompts/query',
    data
  )
  return response.data
}

export const deleteImagePromptsEmbedding = async (
  vectorId: string
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.delete(
    `/pinecone/image-prompts/delete/${vectorId}`
  )
  return response.data
}

export const deleteImagePromptsByFilter = async (
  filter: Record<string, any>
): Promise<PineconeDeleteResponse> => {
  const response = await fastApiClient.post(
    '/pinecone/image-prompts/delete-by-filter',
    {
      filter,
    }
  )
  return response.data
}
