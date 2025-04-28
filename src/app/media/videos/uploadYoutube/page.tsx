// components/YouTubeIntegrationView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { YouTube, BarChart } from '@mui/icons-material';
import { useYouTube } from '@/hooks/useUploadYoutube'; // Giả định bạn có hook này để xử lý upload video
import { SelectChangeEvent } from '@mui/material'

interface YouTubeIntegrationViewProps {
  videoId: string; // ID của video cần upload
}

const MotionButton = motion(Button);
const MotionIconButton = motion(IconButton);

export const YouTubeIntegrationView: React.FC<YouTubeIntegrationViewProps> = ({ videoId }) => {
  const {
    isAuthenticated,
    isLoading,
    error,
    videoStatistics,
    connectToYouTube,
    uploadToYouTube,
    fetchVideoStatistics,
  } = useYouTube();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    privacyStatus: 'public' as 'public' | 'private' | 'unlisted',
  });
  const [tagInput, setTagInput] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [publishingHistoryId, setPublishingHistoryId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Khởi tạo giá trị mặc định cho form
  useEffect(() => {
    if (videoId) {
      setUploadForm({
        title: `AI-Generated Video ${videoId}`,
        description: 'This video was generated and uploaded automatically by Vision Forge.',
        tags: ['ai-generated', 'vision-forge'],
        privacyStatus: 'public',
      });
    }
  }, [videoId]);

  // Xử lý dialog
  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      connectToYouTube();
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = (e: SelectChangeEvent<'private' | 'public' | 'unlisted'>) => {
    setUploadForm((prev) => ({ ...prev, privacyStatus: e.target.value as 'public' | 'private' | 'unlisted' }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setUploadForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setUploadForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  // Upload video
  const handleUpload = async () => {
    if (!videoId) {
      setUploadError('Video ID is missing');
      return;
    }

    if (!uploadForm.title || !uploadForm.description) {
      setUploadError('Title and description are required');
      return;
    }

    try {
      const data = {
        videoId,
        title: uploadForm.title,
        description: uploadForm.description,
        tags: uploadForm.tags,
        privacyStatus: uploadForm.privacyStatus,
      };
      const response = await uploadToYouTube(data);
      setYoutubeUrl(response.youtubeUrl);
      setPublishingHistoryId(response.publishingHistoryId); // Giả định API trả về publishingHistoryId
      setOpenDialog(false);
      setUploadError(null);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload video to YouTube');
    }
  };

  // Lấy thống kê video
  const handleFetchStatistics = async () => {
    if (!publishingHistoryId) {
      setUploadError('No video has been uploaded yet');
      return;
    }
    await fetchVideoStatistics(publishingHistoryId);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Hiển thị trạng thái loading */}
      {isLoading && (
        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
          <CircularProgress size={24} color="secondary" />
        </Box>
      )}

      {/* Nút kết nối hoặc upload */}
      {!isAuthenticated ? (
        <MotionButton
          variant="contained"
          color="secondary"
          startIcon={<YouTube />}
          onClick={connectToYouTube}
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Connect to YouTube
        </MotionButton>
      ) : (
        <MotionIconButton
          color="secondary"
          onClick={handleOpenDialog}
          disabled={isLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          sx={{ bgcolor: 'action.hover' }}
        >
          <YouTube />
        </MotionIconButton>
      )}

      {/* Dialog để nhập thông tin video */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Upload to YouTube</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={uploadForm.title}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={uploadForm.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
              required
            />
            <Box>
              <TextField
                label="Tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                fullWidth
                helperText="Press Enter to add a tag"
              />
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {uploadForm.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Privacy Status</InputLabel>
              <Select
                value={uploadForm.privacyStatus}
                onChange={handlePrivacyChange}
                label="Privacy Status"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="unlisted">Unlisted</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hiển thị kết quả upload */}
      {uploadError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadError}
        </Alert>
      )}

      {youtubeUrl && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Uploaded to YouTube!{' '}
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </Alert>
      )}

      {/* Hiển thị thống kê video */}
      {youtubeUrl && (
        <Box sx={{ mt: 3 }}>
          <MotionButton
            variant="outlined"
            startIcon={<BarChart />}
            onClick={handleFetchStatistics}
            disabled={isLoading || !publishingHistoryId}
            sx={{ borderRadius: 2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View Statistics
          </MotionButton>

          {videoStatistics && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6">Video Statistics</Typography>
              <Typography variant="body2">Views: {videoStatistics.viewCount}</Typography>
              <Typography variant="body2">Likes: {videoStatistics.likeCount}</Typography>
              <Typography variant="body2">Comments: {videoStatistics.commentCount}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};