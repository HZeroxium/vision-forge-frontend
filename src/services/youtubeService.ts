// src/services/youtubeService.ts
import api from './api' // Sử dụng instance axios đã cấu hình sẵn (có Bearer token)

export interface UploadVideoDto {
  videoId: string
  title: string
  description: string
  tags: string[]
  privacyStatus?: 'private' | 'public' | 'unlisted'
}

export interface VideoStatistics {
  viewCount: number
  likeCount: number
  commentCount: number
}

/**
 * Gọi API lấy URL để thực hiện OAuth2 đăng nhập YouTube.
 * Trả về 1 URL, dùng để redirect người dùng đến trang xác thực Google.
 */
export const getAuthUrl = async (): Promise<{ url: string }> => {
  const response = await api.get('/youtube/auth-url')
  return response.data
}

/**
 * Xử lý callback từ Google OAuth sau khi người dùng xác thực thành công.
 * Dùng cho trường hợp người dùng chưa đăng nhập hệ thống (Public callback).
 * @param params - Bao gồm code (authorization code), state (user ID đã mã hóa), và optional error
 */
export const handlePublicCallback = async (params: {
  code: string
  state: string
  error?: string
}): Promise<any> => {
  const response = await api.get('/youtube/public-callback', { params })
  return response.data
}

/**
 * Xử lý callback OAuth khi người dùng đã đăng nhập hệ thống.
 * Gửi authorization code để backend lấy access token từ Google.
 * @param params - Bao gồm code và optional error
 */
export const handleProtectedCallback = async (params: {
  code: string
  error?: string
}): Promise<any> => {
  const response = await api.get('/youtube/callback', { params })
  return response.data
}

/**
 * Upload hoặc cập nhật thông tin một video YouTube.
 * @param data - Thông tin video bao gồm ID, tiêu đề, mô tả, tags, và trạng thái riêng tư
 */
export const uploadVideo = async (data: UploadVideoDto): Promise<any> => {
  const response = await api.post('/youtube/upload', data)
  return response.data
}

/**
 * Lấy thống kê của một video đã được xuất bản.
 * Trả về số lượt xem, lượt thích và lượt bình luận.
 * @param publishingHistoryId - ID của bản ghi lịch sử đăng video
 */
export const getVideoStatistics = async (
  publishingHistoryId: string
): Promise<VideoStatistics> => {
  const response = await api.get(`/youtube/statistics/${publishingHistoryId}`)
  return response.data
}
