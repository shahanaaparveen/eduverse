import { useState, useEffect } from 'react';

const YouTubeModal = ({ isOpen, onClose }) => {
  const [selectedContent, setSelectedContent] = useState('');
  const [customSearch, setCustomSearch] = useState('');
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const educationalTopics = [
    { label: 'Mathematics', search: 'mathematics+tutorial+lesson' },
    { label: 'Science', search: 'science+education+tutorial' },
    { label: 'Physics', search: 'physics+tutorial+lesson' },
    { label: 'Chemistry', search: 'chemistry+education+tutorial' },
    { label: 'Biology', search: 'biology+tutorial+lesson' },
    { label: 'History', search: 'history+education+documentary' },
    { label: 'English Literature', search: 'english+literature+tutorial' },
    { label: 'Programming', search: 'programming+tutorial+coding' },
    { label: 'Geography', search: 'geography+education+tutorial' },
    { label: 'Economics', search: 'economics+tutorial+lesson' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchWatchHistory();
    }
  }, [isOpen]);

  const fetchWatchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching watch history, token:', token ? 'exists' : 'missing');
      
      const response = await fetch('/api/youtube/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const history = await response.json();
        console.log('Watch history received:', history);
        setWatchHistory(history.slice(0, 5)); // Show last 5 videos
      } else {
        console.error('Failed to fetch history:', response.statusText);
        // Set sample data for testing
        setWatchHistory([
          { _id: '1', videoTitle: 'Algebra Basics', watchDuration: 450, totalDuration: 500, completed: false },
          { _id: '2', videoTitle: 'Physics Motion', watchDuration: 600, totalDuration: 600, completed: true }
        ]);
      }
    } catch (error) {
      console.error('Error fetching watch history:', error);
      // Set sample data for testing
      setWatchHistory([
        { _id: '1', videoTitle: 'Algebra Basics', watchDuration: 450, totalDuration: 500, completed: false },
        { _id: '2', videoTitle: 'Physics Motion', watchDuration: 600, totalDuration: 600, completed: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = () => {
    let searchQuery = '';
    
    if (selectedContent) {
      const topic = educationalTopics.find(t => t.label === selectedContent);
      searchQuery = topic.search;
    } else if (customSearch) {
      searchQuery = customSearch.replace(/\s+/g, '+') + '+tutorial+education';
    }
    
    if (searchQuery) {
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Choose Learning Content</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedContent}
              onChange={(e) => {
                setSelectedContent(e.target.value);
                setCustomSearch('');
              }}
              className="input-classroom"
            >
              <option value="">Choose a subject...</option>
              {educationalTopics.map((topic) => (
                <option key={topic.label} value={topic.label}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center text-gray-500 text-sm">OR</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Topic
            </label>
            <input
              type="text"
              value={customSearch}
              onChange={(e) => {
                setCustomSearch(e.target.value);
                setSelectedContent('');
              }}
              placeholder="Enter what you want to learn..."
              className="input-classroom"
            />
          </div>

          {watchHistory.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recently Watched</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {watchHistory.map((video) => (
                  <div key={video._id} className="flex-shrink-0 w-32 p-2 bg-gray-50 rounded text-xs text-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mx-auto mb-1"></div>
                    <div className="truncate mb-1" title={video.videoTitle}>{video.videoTitle}</div>
                    <div className="text-gray-500">
                      {video.completed ? '✓' : `${Math.round((video.watchDuration / video.totalDuration) * 100)}%`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleWatch}
              disabled={!selectedContent && !customSearch}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Watch Videos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeModal;