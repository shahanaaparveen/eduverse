import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AssignmentManager = ({ classrooms, onAssignmentUpdate }) => {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    classroomId: '',
    deadline: '',
    file: null
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const assignment = {
      _id: Date.now().toString(),
      title: newAssignment.title,
      description: newAssignment.description,
      classroomId: newAssignment.classroomId,
      deadline: newAssignment.deadline,
      file: newAssignment.file?.name || null,
      createdAt: new Date().toISOString(),
      submissions: []
    };
    
    // Save to localStorage
    const storageKey = `assignments_${newAssignment.classroomId}`;
    const existingAssignments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingAssignments.push(assignment);
    localStorage.setItem(storageKey, JSON.stringify(existingAssignments));
    
    setAssignments([...assignments, assignment]);
    setNewAssignment({ title: '', description: '', classroomId: '', deadline: '', file: null });
    setShowCreateForm(false);
    
    // Notify parent component about assignment update
    if (onAssignmentUpdate) {
      onAssignmentUpdate();
    }
    
    alert('Assignment posted successfully!');
  };

  const fetchAssignments = () => {
    // Load all assignments from localStorage
    const allAssignments = [];
    classrooms.forEach(classroom => {
      const storageKey = `assignments_${classroom._id}`;
      const classroomAssignments = JSON.parse(localStorage.getItem(storageKey) || '[]');
      allAssignments.push(...classroomAssignments);
    });
    setAssignments(allAssignments);
  };

  useEffect(() => {
    fetchAssignments();
  }, [classrooms]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post Assignment
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Create New Assignment</h3>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Assignment Title</label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                className="w-full p-2 border rounded-lg h-32"
                placeholder="Write your assignment question here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Classroom</label>
              <select
                value={newAssignment.classroomId}
                onChange={(e) => setNewAssignment({...newAssignment, classroomId: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="datetime-local"
                value={newAssignment.deadline}
                onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Attach File (Optional)</label>
              <input
                type="file"
                onChange={(e) => setNewAssignment({...newAssignment, file: e.target.files[0]})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Post Assignment
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <p className="text-gray-600 mt-1">{assignment.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted: {new Date(assignment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-red-600">
                  Deadline: {new Date(assignment.deadline).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Submissions</p>
                <p className="text-2xl font-bold text-green-600">{assignment.submissions?.length || 0}</p>
              </div>
            </div>
            
            {assignment.submissions && assignment.submissions.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-2">Student Submissions:</h4>
                <div className="space-y-2">
                  {assignment.submissions.map((submission) => (
                    <div key={submission._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{submission.studentName}</span>
                      <div className="flex gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                        {submission.file && (
                          <button
                            onClick={() => window.open(submission.file, '_blank')}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View File
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentManager;