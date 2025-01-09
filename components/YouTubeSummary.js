import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const YouTubeSummary = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const response = await fetch('/api/webhook/youtube-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">YouTube Video Summarizer</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-blue-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Processing
              </span>
            ) : (
              'Summarize'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      {summary && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{summary.title}</h2>
          
          <div className="mb-6">
            <div className="aspect-video w-full mb-4">
              <iframe
                src={`https://www.youtube.com/embed/${summary.videoId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <div className="whitespace-pre-wrap">{summary.summary}</div>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Description</h3>
            <div className="whitespace-pre-wrap text-gray-600">
              {summary.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSummary;