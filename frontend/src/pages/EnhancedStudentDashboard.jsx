import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import YouTubeModal from '../components/YouTubeModal';

const EnhancedStudentDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/classrooms', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setClassrooms(data);
        
        // Load real assignments from enrolled classrooms
        const studentAssignments = [];
        data.forEach(classroom => {
          const storageKey = `assignments_${classroom._id}`;
          const classroomAssignments = JSON.parse(localStorage.getItem(storageKey) || '[]');
          classroomAssignments.forEach(assignment => {
            studentAssignments.push({
              id: assignment._id,
              title: assignment.title,
              dueDate: assignment.deadline,
              subject: classroom.name,
              status: 'pending'
            });
          });
        });
        
        setAssignments(studentAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
      }
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/classrooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ classCode: joinCode }),
      });
      if (response.ok) {
        setJoinCode('');
        setShowJoinForm(false);
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-classroom-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="header-classroom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-classroom-100">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm text-classroom-100">Today's Date</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-classroom flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">+</span>
              </div>
              <h3 className="text-lg font-semibold ml-3">Join Class</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Enter your teacher's class code to join
            </p>
            <div className="mt-auto">
              {!showJoinForm ? (
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="btn-success w-full"
                >
                  Enter Class Code
                </button>
              ) : (
                <form onSubmit={handleJoinClassroom} className="space-y-3">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Class code"
                    className="input-classroom"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-success flex-1 text-sm py-2">
                      Join
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowJoinForm(false); setJoinCode(''); }}
                      className="btn-secondary flex-1 text-sm py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="card-classroom flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📹</span>
              </div>
              <h3 className="text-lg font-semibold ml-3">Learn with Videos</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Watch educational content on YouTube
            </p>
            <button
              onClick={() => setShowYouTubeModal(true)}
              className="btn-primary w-full mt-auto"
            >
              Browse Videos
            </button>
          </div>

          <div className="card-classroom flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold ml-3">AI Tutor</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get instant help with Gemini AI
            </p>
            <button
              onClick={() => window.location.href = 'https://gemini.google.com/'}
              className="btn-warning w-full mt-auto"
            >
              Ask Gemini
            </button>
          </div>

          <div className="card-classroom flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-classroom-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-semibold ml-3">Join Meeting</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Start or join a Google Meet
            </p>
            <button
              onClick={() => window.location.href = 'https://meet.google.com/'}
              className="btn-primary w-full mt-auto"
            >
              Open Meet
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
              <span className="text-sm text-gray-500">{classrooms.length} enrolled</span>
            </div>
            
            {classrooms.length === 0 ? (
              <div className="card-classroom text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Classes Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Join your first classroom using a class code from your teacher.
                </p>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="btn-primary"
                >
                  Join Your First Class
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom._id}
                    className="card-classroom hover:shadow-xl"
                    onClick={() => navigate(`/classroom/${classroom._id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-classroom-500 to-classroom-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                            {classroom.name?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {classroom.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {classroom.teacher?.name}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {classroom.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {classroom.students?.length || 0} students
                          </span>
                          <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-xs">
                            {classroom.classCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Assignments</h3>
              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No pending assignments</p>
                  </div>
                ) : (
                  assignments.filter(assignment => assignment.status === 'pending').map((assignment) => (
                    <div key={assignment.id} className="card-assignment">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {assignment.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {assignment.subject}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-warning-100 text-warning-700">
                          pending
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <YouTubeModal 
        isOpen={showYouTubeModal} 
        onClose={() => setShowYouTubeModal(false)} 
      />
    </div>
  );
};

export default EnhancedStudentDashboard;