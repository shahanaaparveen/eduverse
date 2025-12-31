import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClassroomView from '../components/ClassroomView';
import AssignmentManager from '../components/AssignmentManager';
import QuizManager from '../components/QuizManager';
import StudentManager from '../components/StudentManager';

const TeacherDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classrooms, setClassrooms] = useState([]);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassroom, setNewClassroom] = useState({ name: '', description: '' });
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (classrooms.length > 0) {
      updateAssignmentsCount();
    }
  }, [classrooms]);

  const updateAssignmentsCount = () => {
    let totalAssignments = 0;
    classrooms.forEach(classroom => {
      const storageKey = `assignments_${classroom._id}`;
      const classroomAssignments = JSON.parse(localStorage.getItem(storageKey) || '[]');
      totalAssignments += classroomAssignments.length;
    });
    setAssignmentsCount(totalAssignments);
  };

  const getClassroomAssignmentCount = (classroomId) => {
    const storageKey = `assignments_${classroomId}`;
    const classroomAssignments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return classroomAssignments.length;
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'classrooms', 'assignments', 'quizzes', 'students'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/classrooms', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setClassrooms(data);
      }
    } catch (error) {
      setError('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/classrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newClassroom),
      });
      if (response.ok) {
        setNewClassroom({ name: '', description: '' });
        setShowCreateForm(false);
        fetchClassrooms();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleDeleteClassroom = async (classroomId) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        console.log('Deleting classroom:', classroomId);
        const response = await fetch(`http://localhost:5000/api/classrooms/${classroomId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Delete response:', response.status);
        if (response.ok) {
          fetchClassrooms();
        } else {
          const errorData = await response.json();
          console.log('Delete error:', errorData);
          setError(errorData.message || 'Failed to delete classroom');
        }
      } catch (error) {
        console.log('Network error:', error);
        setError('Network error. Please try again.');
      }
    }
  };

  const openExternalLink = (url) => {
    window.location.href = url;
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
        {/* Welcome Header */}
        <div className="header-classroom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {user?.name}! 👨‍🏫
              </h1>
              <p className="text-classroom-100">
                Manage your classes and inspire your students
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm text-classroom-100">Active Classes</p>
                <p className="text-2xl font-bold">{classrooms.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Create Classroom */}
          <div className="card-classroom h-64 relative">
            {!showCreateForm ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">➕</span>
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Create Class</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Set up a new classroom for your students
                </p>
                <div className="absolute bottom-6 left-6 right-6">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-success w-full"
                  >
                    New Classroom
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute bottom-6 left-6 right-6">
                <form onSubmit={handleCreateClassroom} className="space-y-2">
                  <input
                    type="text"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
                    placeholder="Class name"
                    className="input-classroom text-sm"
                    required
                  />
                  <textarea
                    value={newClassroom.description}
                    onChange={(e) => setNewClassroom({...newClassroom, description: e.target.value})}
                    placeholder="Description (optional)"
                    className="input-classroom text-sm h-12 resize-none"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-success flex-1 text-sm py-1">
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCreateForm(false); setNewClassroom({ name: '', description: '' }); }}
                      className="btn-secondary flex-1 text-sm py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Teaching Resources */}
          <div className="card-classroom h-64 relative">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold ml-3">Resources</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Find teaching materials and videos
            </p>
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={() => openExternalLink('https://www.youtube.com/results?search_query=teaching+resources+educational+content')}
                className="btn-warning w-full"
              >
                Browse Resources
              </button>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="card-classroom h-64 relative">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-classroom-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold ml-3">AI Assistant</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get help with lesson planning
            </p>
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={() => window.location.href = 'https://gemini.google.com/'}
                className="btn-primary w-full"
              >
                Ask Gemini
              </button>
            </div>
          </div>

          {/* Virtual Meeting */}
          <div className="card-classroom h-64 relative">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📹</span>
              </div>
              <h3 className="text-lg font-semibold ml-3">Start Meeting</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Host a Google Meet session
            </p>
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={() => window.location.href = 'https://meet.google.com/'}
                className="btn-primary w-full"
              >
                Start Meet
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Tab Content */}
        {activeTab === 'classrooms' && <ClassroomView classrooms={classrooms} />}
        {activeTab === 'assignments' && <AssignmentManager classrooms={classrooms} onAssignmentUpdate={updateAssignmentsCount} />}
        {activeTab === 'quizzes' && <QuizManager classrooms={classrooms} />}
        {activeTab === 'students' && <StudentManager classrooms={classrooms} onStudentsSaved={fetchClassrooms} />}

        {/* Error Message */}
        {activeTab === 'overview' && error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Content - Only show on overview tab */}
        {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Classrooms */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Classrooms</h2>
              <span className="text-sm text-gray-500">{classrooms.length} classes</span>
            </div>
            
            {classrooms.length === 0 ? (
              <div className="card-classroom text-center py-12">
                <div className="text-6xl mb-4">🏫</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Classrooms Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first classroom to start teaching and managing students.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Create Your First Classroom
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
                        <div className="flex items-center mb-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-classroom-500 to-classroom-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                            {classroom.name?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {classroom.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Class Code: {classroom.classCode}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {classroom.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <span className="mr-1">👥</span>
                              {classroom.students?.length || 0} students
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">📝</span>
                              {getClassroomAssignmentCount(classroom._id)} assignments
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(classroom.classCode);
                              }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                            >
                              Copy Code
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClassroom(classroom._id);
                              }}
                              className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-full transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Quick Stats & Tools */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Classes</span>
                    <span className="text-2xl font-bold text-success-600">{classrooms.length}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assignments</span>
                    <span className="text-2xl font-bold text-warning-600">{assignmentsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Tools */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Tools</h3>
              <div className="space-y-2">
                <button
                  onClick={() => openExternalLink('https://docs.google.com/')}
                  className="w-full flex items-center p-3 text-left rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg mr-3">📄</span>
                  <span className="text-sm font-medium">Google Docs</span>
                </button>
                
                <button
                  onClick={() => openExternalLink('https://slides.google.com/')}
                  className="w-full flex items-center p-3 text-left rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg mr-3">📊</span>
                  <span className="text-sm font-medium">Google Slides</span>
                </button>
                
                <button
                  onClick={() => openExternalLink('https://forms.google.com/')}
                  className="w-full flex items-center p-3 text-left rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg mr-3">📋</span>
                  <span className="text-sm font-medium">Google Forms</span>
                </button>
                
                <button
                  onClick={() => openExternalLink('https://jamboard.google.com/')}
                  className="w-full flex items-center p-3 text-left rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg mr-3">🖊️</span>
                  <span className="text-sm font-medium">Jamboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;