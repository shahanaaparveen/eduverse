import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock grades data
    setTimeout(() => {
      setGrades([
        {
          id: 1,
          subject: 'Mathematics',
          assignment: 'Algebra Quiz',
          grade: 'A',
          points: '95/100',
          date: '2024-01-15',
          teacher: 'Dr. Smith'
        },
        {
          id: 2,
          subject: 'Science',
          assignment: 'Lab Report',
          grade: 'B+',
          points: '87/100',
          date: '2024-01-12',
          teacher: 'Prof. Johnson'
        },
        {
          id: 3,
          subject: 'English',
          assignment: 'Essay Writing',
          grade: 'A-',
          points: '92/100',
          date: '2024-01-10',
          teacher: 'Ms. Davis'
        },
        {
          id: 4,
          subject: 'History',
          assignment: 'Research Project',
          grade: 'B',
          points: '84/100',
          date: '2024-01-08',
          teacher: 'Mr. Wilson'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-success-600 bg-success-100';
    if (grade.startsWith('B')) return 'text-classroom-600 bg-classroom-100';
    if (grade.startsWith('C')) return 'text-warning-600 bg-warning-100';
    return 'text-danger-600 bg-danger-100';
  };

  const calculateGPA = () => {
    const gradePoints = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
    };
    
    const total = grades.reduce((sum, grade) => sum + (gradePoints[grade.grade] || 0), 0);
    return grades.length > 0 ? (total / grades.length).toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 lg:ml-64">
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
              <h1 className="text-3xl font-bold mb-2">My Grades</h1>
              <p className="text-classroom-100">Track your academic performance</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm text-classroom-100">Current GPA</p>
              <p className="text-2xl font-bold">{calculateGPA()}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Assignments</h3>
            <p className="text-3xl font-bold text-classroom-600">{grades.length}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Grade</h3>
            <p className="text-3xl font-bold text-success-600">B+</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">A Grades</h3>
            <p className="text-3xl font-bold text-success-600">
              {grades.filter(g => g.grade.startsWith('A')).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current GPA</h3>
            <p className="text-3xl font-bold text-classroom-600">{calculateGPA()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Grade History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{grade.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grade.assignment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(grade.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.teacher}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;