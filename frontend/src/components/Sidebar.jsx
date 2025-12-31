import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = user?.role === 'student' ? [
    { icon: '🏠', label: 'Dashboard', path: '/student-dashboard' },
    { icon: '📝', label: 'Assignments', path: '/assignments' },
    { icon: '📋', label: 'Quizzes', path: '/quiz' },
    { icon: '💬', label: 'Discussions', path: '/discussions' },
    { icon: '📓', label: 'Notes', path: '/notes' },
    { icon: '⏰', label: 'Study Timer', path: '/study-timer' },
    { icon: '🎥', label: 'Educational Videos', path: '/videos', external: true },
    { icon: '🤖', label: 'AI Tutor', path: '/ai-tutor', external: true },
    { icon: '📊', label: 'Grades', path: '/grades' },
    { icon: '📅', label: 'Calendar', path: '/calendar' },
  ] : [
    { icon: '🏠', label: 'Dashboard', path: '/teacher-dashboard?tab=overview' },
    { icon: '🏫', label: 'My Classrooms', path: '/teacher-dashboard?tab=classrooms' },
    { icon: '📝', label: 'Assignments', path: '/teacher-dashboard?tab=assignments' },
    { icon: '📋', label: 'Quizzes', path: '/teacher-dashboard?tab=quizzes' },
    { icon: '👥', label: 'Students', path: '/teacher-dashboard?tab=students' },
    { icon: '📊', label: 'Analytics', path: '/analytics' },
    { icon: '📅', label: 'Schedule', path: '/schedule' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (item) => {
    if (item.external) {
      if (item.path === '/videos') {
        window.open('https://www.youtube.com/results?search_query=educational+content+learning', '_blank');
      } else if (item.path === '/ai-tutor') {
        window.open('https://gemini.google.com/', '_blank');
      }
    } else {
      navigate(item.path);
    }
    onClose?.();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar-classroom transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-classroom-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <nav className="space-y-2 max-h-96 overflow-y-auto overflow-x-hidden pr-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  (location.pathname === '/teacher-dashboard' && location.search.includes(item.path.split('?')[1])) ||
                  location.pathname === item.path
                    ? 'bg-classroom-100 text-classroom-700 border-r-4 border-classroom-600'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${item.external ? 'border-l-2 border-success-500' : ''}`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.external && (
                  <span className="ml-auto text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">
                    External
                  </span>
                )}
              </button>
            ))}}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;