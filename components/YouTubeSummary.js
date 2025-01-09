import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Helper function to ensure proper video ID extraction
const getVideoId = (videoId) => {
  if (!videoId) return null;
  // Handle both full URLs and video IDs
  if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
    const match = videoId.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/)|\?v=|youtu\.be\/)([^\"&?\/ ]{11})/);
    return match ? match[1] : null;
  }
  return videoId;
};

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      setSummary({
        title: data.title || 'No title available',
        summary: data.summary || 'No summary available',
        description: data.description || 'No description available',
        videoId: getVideoId(data.id),
      });
      
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to generate summary: ${err.message}`);
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
            className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
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
          
          {summary.videoId && (
            <div className="mb-6">
              <div className="aspect-video w-full mb-4 bg-gray-100">
                <iframe
                  src={`https://www.youtube.com/embed/${summary.videoId}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={summary.title}
                />
              </div>
            </div>
          )}

          <div className="prose prose-blue max-w-none">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <div className="markdown-body overflow-x-auto"> 
              <ReactMarkdown
                remarkPlugins={[remarkGfm]} 
                components={{
                  // Style heading levels
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                  // Style lists
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  // Style links
                  a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                  // Style code blocks
                  code: ({node, ...props}) => <code className="bg-gray-100 rounded px-1" {...props} />,
                  // Style blockquotes
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-200 pl-4 italic" {...props} />,
                  // Style tables
                  table: ({node, ...props}) => (
                    <div className="w-full overflow-x-auto my-4">
                      <table className="min-w-full table-auto border-collapse border border-gray-300" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
                  tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
                  tr: ({node, ...props}) => <tr className="hover:bg-gray-50 transition-colors" {...props} />,
                  th: ({node, ...props}) => (
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300"
                      {...props}
                    />
                  ),
                  td: ({node, ...props}) => (
                    <td 
                      className="px-6 py-4 whitespace-normal border border-gray-300"
                      {...props}
                    />  
                  ),
                }}
              >
                {summary.summary}
              </ReactMarkdown>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Video Description</h3>
            <div className="text-gray-600 whitespace-pre-wrap">
              {summary.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSummary;