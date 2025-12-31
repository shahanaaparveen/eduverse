import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EnhancedStudentDashboard from './pages/EnhancedStudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassroomDetail from './pages/ClassroomDetail';
import AITutor from './pages/AITutor';
import Grades from './pages/Grades';
import Calendar from './pages/Calendar';
import Assignments from './pages/Assignments';
import Quiz from './pages/Quiz';
import Discussions from './pages/Discussions';
import Notes from './pages/Notes';
import StudyTimer from './pages/StudyTimer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Students */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute requiredRole="student">
                  <EnhancedStudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-tutor" 
              element={
                <ProtectedRoute requiredRole="student">
                  <AITutor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/grades" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Grades />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Assignments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/discussions" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Discussions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notes" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Notes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/study-timer" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudyTimer />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - Teachers */}
            <Route 
              path="/teacher-dashboard" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Classroom Detail - Both roles */}
            <Route 
              path="/classroom/:id" 
              element={
                <ProtectedRoute>
                  <ClassroomDetail />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;