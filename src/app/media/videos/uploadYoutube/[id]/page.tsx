'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadVideo } from '@services/youtubeService';

interface Props {
  params: { id: string };
}

export default function UploadYoutubePage({ params }: Props) {
  const { id } = params;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string>('');
  const [privacyStatus, setPrivacyStatus] = useState<'private' | 'public' | 'unlisted'>('private');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      setLoading(true);
      
      await uploadVideo({
        videoId: id,
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        privacyStatus,
      });

      alert('Upload thành công!');
      router.push('/media/videos'); // Sau khi upload xong quay về danh sách videos

    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi upload!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video to YouTube</h1>

      <div className="mb-4">
        <video src={`/videos/${id}.mp4`} controls className="w-full rounded" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter video title"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter video description"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. tutorial,react,nextjs"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Privacy Status</label>
          <select
            value={privacyStatus}
            onChange={e => setPrivacyStatus(e.target.value as 'private' | 'public' | 'unlisted')}
            className="w-full border rounded px-3 py-2"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50 w-full"
        >
          {loading ? 'Uploading...' : 'Upload to YouTube'}
        </button>
      </div>
    </div>
  );
}