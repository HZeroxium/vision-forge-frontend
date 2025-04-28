'use client';

interface Props {
  params: { id: string };
}

export default function UploadYoutubePage({ params }: Props) {
  const { id } = params;

  const handleUpload = () => {
    alert(`Uploading video ID: ${id} to YouTube...`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Video to YouTube</h1>

      <div className="mb-6">
        <video src={`/videos/${id}.mp4`} controls className="w-full" />
      </div>

      <button
        onClick={handleUpload}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Upload Video
      </button>
    </div>
  );
}
