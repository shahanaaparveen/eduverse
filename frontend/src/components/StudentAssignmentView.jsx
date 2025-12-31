import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentAssignmentView = () => {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    // Load student's classrooms and assignments
    loadStudentAssignments();
    
    // Set up interval to check for new assignments
    const interval = setInterval(() => {
      loadStudentAssignments();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const loadStudentAssignments = async () => {
    if (!user?._id) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/classrooms', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const studentClassrooms = await response.json();
        console.log('Student enrolled classrooms:', studentClassrooms);
        setClassrooms(studentClassrooms);
        
        // Load assignments only for enrolled classrooms
        const studentAssignments = [];
        studentClassrooms.forEach(classroom => {
          const storageKey = `assignments_${classroom._id}`;
          const classroomAssignments = JSON.parse(localStorage.getItem(storageKey) || '[]');
          console.log(`Assignments for ${classroom.name}:`, classroomAssignments);
          classroomAssignments.forEach(assignment => {
            studentAssignments.push({
              ...assignment,
              classroomName: classroom.name,
              classroomId: classroom._id
            });
          });
        });
        
        console.log('All student assignments:', studentAssignments);
        // Sort assignments by deadline
        studentAssignments.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setAssignments(studentAssignments);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Assignments</h2>
      
      {assignments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md border text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
          <p className="text-gray-600">
            {classrooms.length === 0 
              ? "You haven't joined any classrooms yet." 
              : "No assignments have been posted in your enrolled classrooms."}
          </p>
          {classrooms.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Enrolled in:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {classrooms.map(classroom => (
                  <span key={classroom._id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {classroom.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing assignments from {classrooms.length} enrolled classroom{classrooms.length !== 1 ? 's' : ''}:
              <span className="ml-2">
                {classrooms.map(classroom => classroom.name).join(', ')}
              </span>
            </p>
          </div>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={`${assignment.classroomId}_${assignment._id}`} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">📚 {assignment.classroomName}</p>
                    <p className="text-gray-600 mt-2">{assignment.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="text-sm">{new Date(assignment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-red-600">
                        ⏰ Deadline: {new Date(assignment.deadline).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Submit Assignment
                      </button>
                      {assignment.file && (
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                          View Attachment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentView;