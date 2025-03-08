// src/services/uploadService.ts
import api from './api'

export const uploadFile = async (fileData: FormData): Promise<any> => {
  // If using pre-signed URL approach, modify accordingly.
  const response = await api.post('/upload', fileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) // <TODO>: Adjust endpoint
  return response.data
}
