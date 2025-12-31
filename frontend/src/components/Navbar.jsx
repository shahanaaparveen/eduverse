import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <nav className="nav-classroom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Menu and Logo */}
            <div className="flex items-center">
              {isAuthenticated && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="w-8 h-8 bg-classroom-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  EduVerse
                </h1>
              </div>
            </div>

            {/* Right side - Actions and User Menu */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>


                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    
                    <div className="w-8 h-8 bg-classroom-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-700 hover:text-classroom-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Get started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Sidebar */}
      {isAuthenticated && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}
    </>
  );
};

export default Navbar;