// hooks/useYouTube.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getAuthUrl,
  handleProtectedCallback,
  uploadVideo,
  getVideoStatistics,
  UploadVideoDto,
  VideoStatistics,
} from '@/services/youtubeService';

interface YouTubeHook {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    authUrl: string | null;
    videoStatistics: VideoStatistics | null;
    connectToYouTube: () => Promise<void>;
    uploadToYouTube: (data: UploadVideoDto) => Promise<{
      publishingHistoryId: string; // Sửa từ hàm thành string
      youtubeUrl: string;
    }>;
    fetchVideoStatistics: (publishingHistoryId: string) => Promise<void>;
}

export const useYouTube = (): YouTubeHook => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [videoStatistics, setVideoStatistics] = useState<VideoStatistics | null>(null);

  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const response = await getAuthUrl();
        setAuthUrl(response.url);
        // Nếu đã xác thực, gọi API để kiểm tra (giả định backend trả về trạng thái xác thực)
        const token = localStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true); // Giả định đã xác thực nếu có token
        }
      } catch (err: any) {
        setError(err.message || 'Failed to check YouTube authentication status');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Xử lý OAuth2 callback khi user quay lại từ Google
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (code) {
        setIsLoading(true);
        try {
          await handleProtectedCallback({ code, error: error || undefined });
          setIsAuthenticated(true);
          setError(null);
          // Xóa query params khỏi URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err: any) {
          setError(err.message || 'Failed to authenticate with YouTube');
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      } else if (error) {
        setError('YouTube authentication failed: ' + error);
        setIsAuthenticated(false);
      }
    };

    handleCallback();
  }, []);

  // Kết nối với YouTube (chuyển hướng đến auth URL)
  const connectToYouTube = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAuthUrl();
      window.location.href = response.url; // Chuyển hướng user đến Google OAuth
    } catch (err: any) {
      setError(err.message || 'Failed to initiate YouTube authentication');
      setIsLoading(false);
    }
  }, []);

  // Upload video lên YouTube
const uploadToYouTube = useCallback(async (data: UploadVideoDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await uploadVideo(data);
      setIsAuthenticated(true);
      return {
        youtubeUrl: response.youtubeUrl as string, // Đảm bảo kiểu string
        publishingHistoryId: response.publishingHistoryId as string, // Trả về publishingHistoryId
      };
    } catch (err: any) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        throw new Error('YouTube authentication required');
      }
      throw new Error(err.message || 'Failed to upload video to YouTube');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lấy thống kê video
  const fetchVideoStatistics = useCallback(async (publishingHistoryId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await getVideoStatistics(publishingHistoryId);
      setVideoStatistics(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch video statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    authUrl,
    videoStatistics,
    connectToYouTube,
    uploadToYouTube,
    fetchVideoStatistics,
  };
};