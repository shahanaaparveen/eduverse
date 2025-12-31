import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Discussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    // Mock discussion data
    setDiscussions([
      {
        id: 1,
        title: 'Help with Algebra Problems',
        author: 'John Doe',
        subject: 'Mathematics',
        createdAt: '2024-01-20',
        replies: 5,
        lastActivity: '2024-01-21',
        content: 'I\'m struggling with quadratic equations. Can someone explain the steps?',
        posts: [
          {
            id: 1,
            author: 'Jane Smith',
            content: 'Sure! First, identify the coefficients a, b, and c in ax² + bx + c = 0',
            createdAt: '2024-01-20T10:30:00',
            isTeacher: true
          },
          {
            id: 2,
            author: 'Mike Johnson',
            content: 'Then use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a',
            createdAt: '2024-01-20T11:15:00',
            isTeacher: false
          }
        ]
      },
      {
        id: 2,
        title: 'Photosynthesis Process Discussion',
        author: 'Sarah Wilson',
        subject: 'Science',
        createdAt: '2024-01-19',
        replies: 3,
        lastActivity: '2024-01-20',
        content: 'Let\'s discuss the different stages of photosynthesis',
        posts: []
      }
    ]);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const post = {
      id: Date.now(),
      title: newPost.split('\n')[0],
      author: user.name,
      subject: 'General',
      createdAt: new Date().toISOString().split('T')[0],
      replies: 0,
      lastActivity: new Date().toISOString().split('T')[0],
      content: newPost,
      posts: []
    };
    
    setDiscussions(prev => [post, ...prev]);
    setNewPost('');
  };

  const handleReply = (discussionId) => {
    if (!newReply.trim()) return;
    
    const reply = {
      id: Date.now(),
      author: user.name,
      content: newReply,
      createdAt: new Date().toISOString(),
      isTeacher: user.role === 'teacher'
    };
    
    setDiscussions(prev => prev.map(discussion => 
      discussion.id === discussionId 
        ? { 
            ...discussion, 
            posts: [...discussion.posts, reply],
            replies: discussion.replies + 1,
            lastActivity: new Date().toISOString().split('T')[0]
          }
        : discussion
    ));
    setNewReply('');
  };

  if (selectedDiscussion) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedDiscussion(null)}
              className="flex items-center text-classroom-600 hover:text-classroom-700 mb-4"
            >
              <span className="mr-2">←</span> Back to Discussions
            </button>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedDiscussion.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    by {selectedDiscussion.author} • {selectedDiscussion.subject} • {new Date(selectedDiscussion.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-classroom-100 text-classroom-700 px-3 py-1 rounded-full text-sm">
                  {selectedDiscussion.replies} replies
                </span>
              </div>
              
              <p className="text-gray-700 mb-6">{selectedDiscussion.content}</p>
              
              <div className="space-y-4">
                {selectedDiscussion.posts.map(post => (
                  <div key={post.id} className="border-l-4 border-gray-200 pl-4 py-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{post.author}</span>
                      {post.isTeacher && (
                        <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs">
                          Teacher
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{post.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Add Reply</h3>
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="input-classroom h-24 resize-none mb-3"
                />
                <button
                  onClick={() => handleReply(selectedDiscussion.id)}
                  disabled={!newReply.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="header-classroom">
          <h1 className="text-3xl font-bold mb-2">Class Discussions</h1>
          <p className="text-classroom-100">Ask questions and help your classmates</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Start New Discussion</h2>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Ask a question or start a discussion..."
                className="input-classroom h-24 resize-none mb-3"
              />
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="btn-primary disabled:opacity-50"
              >
                Create Post
              </button>
            </div>

            <div className="space-y-4">
              {discussions.map(discussion => (
                <div
                  key={discussion.id}
                  className="card-classroom cursor-pointer hover:shadow-lg"
                  onClick={() => setSelectedDiscussion(discussion)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {discussion.subject}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{discussion.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>by {discussion.author}</span>
                    <div className="flex items-center space-x-4">
                      <span>{discussion.replies} replies</span>
                      <span>Last: {new Date(discussion.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Discussion Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be respectful and helpful</li>
                <li>• Stay on topic</li>
                <li>• Search before posting</li>
                <li>• Use clear titles</li>
                <li>• Help others when you can</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h3>
              <div className="space-y-2">
                {['Mathematics', 'Science', 'English', 'History'].map(subject => (
                  <div key={subject} className="flex justify-between text-sm">
                    <span className="text-gray-600">{subject}</span>
                    <span className="text-gray-400">
                      {discussions.filter(d => d.subject === subject).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussions;