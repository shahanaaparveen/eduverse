import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentAssignmentView from '../components/StudentAssignmentView';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [activeTab, setActiveTab] = useState('classrooms');

  // Fetch student's classrooms
  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/classrooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClassrooms(data);
      } else {
        setError('Failed to fetch classrooms');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Join classroom with code
  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/classrooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ classCode: joinCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setJoinCode('');
        setShowJoinForm(false);
        fetchClassrooms(); // Refresh classrooms list
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here are your enrolled classrooms and quick actions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Join Classroom */}
          <div className="card-google">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏫</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Join Classroom</h3>
            <p className="text-gray-600 text-sm mb-3">
              Enter your teacher's class code to join
            </p>
            {!showJoinForm ? (
              <button
                onClick={() => setShowJoinForm(true)}
                className="btn-primary w-full"
              >
                Enter Class Code
              </button>
            ) : (
              <form onSubmit={handleJoinClassroom} className="space-y-3">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter class code"
                  className="input-google"
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary flex-1">
                    Join
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinForm(false);
                      setJoinCode('');
                      setError('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* AI Tutor */}
          <div className="card-google">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">AI Tutor</h3>
            <p className="text-gray-600 text-sm mb-3">
              Get instant help with your studies
            </p>
            <button
              onClick={() => window.open('https://gemini.google.com/', '_blank')}
              className="btn-primary w-full"
            >
              Ask Gemini AI
            </button>
          </div>

          {/* Educational Videos */}
          <div className="card-google">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📹</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Educational Videos</h3>
            <p className="text-gray-600 text-sm mb-3">
              Watch curated learning content
            </p>
            <button
              onClick={() => window.open('https://www.youtube.com/results?search_query=educational+content+learning', '_blank')}
              className="btn-primary w-full"
            >
              Browse Videos
            </button>
          </div>

          {/* Google Meet */}
          <div className="card-google">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Join Meeting</h3>
            <p className="text-gray-600 text-sm mb-3">
              Join virtual classes and meetings
            </p>
            <button
              onClick={() => window.open('https://meet.google.com/', '_blank')}
              className="btn-primary w-full"
            >
              Open Google Meet
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('classrooms')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'classrooms' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Classrooms
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'assignments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Assignments
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'assignments' && <StudentAssignmentView />}

        {/* Classrooms Section - Only show on classrooms tab */}
        {activeTab === 'classrooms' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Classrooms</h2>
          
          {classrooms.length === 0 ? (
            <div className="card-google text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Classrooms Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Join your first classroom using a class code from your teacher.
              </p>
              <button
                onClick={() => setShowJoinForm(true)}
                className="btn-primary"
              >
                Join Classroom
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom) => (
                <div
                  key={classroom._id}
                  className="card-google cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/classroom/${classroom._id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {classroom.name}
                    </h3>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      {classroom.students?.length || 0} students
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {classroom.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Teacher: {classroom.teacher?.name}</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {classroom.classCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;