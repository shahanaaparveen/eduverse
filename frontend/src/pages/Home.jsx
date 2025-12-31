import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their dashboard
  if (isAuthenticated) {
    const dashboardPath = user?.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
    navigate(dashboardPath);
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80")'
        }}
      ></div>
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(29, 78, 216, 0.8) 50%, rgba(37, 99, 235, 0.8) 100%)'
        }}
      ></div>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Books */}
        <div className="absolute top-20 right-20 w-32 h-24 bg-green-400 rounded-lg transform rotate-12 opacity-80 shadow-lg"></div>
        <div className="absolute top-32 right-32 w-28 h-20 bg-white rounded-lg transform rotate-6 opacity-90 shadow-lg"></div>
        <div className="absolute top-40 right-16 w-24 h-18 bg-orange-400 rounded-lg transform -rotate-3 opacity-75 shadow-lg"></div>
        
        {/* Pencils */}
        <div className="absolute top-60 left-20 w-2 h-32 bg-orange-500 rounded-full transform rotate-45 opacity-70"></div>
        <div className="absolute top-80 left-32 w-2 h-28 bg-green-500 rounded-full transform rotate-30 opacity-60"></div>
        
        {/* Floating shapes */}
        <div className="absolute bottom-40 left-40 w-16 h-16 bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-60 right-60 w-12 h-12 bg-orange-300 rounded-full opacity-30"></div>
        <div className="absolute top-80 left-60 w-8 h-8 bg-green-300 rounded-full opacity-25"></div>
      </div>
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="text-white">EduVerse Classroom</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            The unified AI-powered learning platform that combines classroom management, 
            live classes, AI tutoring, and educational videos in one distraction-free environment.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-lg px-8 py-3"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Everything You Need for Modern Learning
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="card-classroom text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏠</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Classroom Management</h3>
            <p className="text-gray-600 text-sm">
              Create and manage classrooms with Google Classroom-like interface for seamless learning.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-classroom text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Gemini AI Integration</h3>
            <p className="text-gray-600 text-sm">
              Direct access to Google's Gemini AI for instant homework help and tutoring.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-classroom text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📺</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">YouTube Learning</h3>
            <p className="text-gray-600 text-sm">
              Curated educational YouTube content with direct links to learning videos.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card-classroom text-center">
            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Google Meet Integration</h3>
            <p className="text-gray-600 text-sm">
              Seamless integration with Google Meet for virtual classes and meetings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;