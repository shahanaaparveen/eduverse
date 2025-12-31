import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Assignments = () => {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadStudentAssignments();
    
    const interval = setInterval(() => {
      loadStudentAssignments();
    }, 5000);
    
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
        setClassrooms(studentClassrooms);
        
        // Load submissions from localStorage
        const submissions = JSON.parse(localStorage.getItem(`submissions_${user._id}`) || '{}');
        
        const studentAssignments = [];
        studentClassrooms.forEach(classroom => {
          const storageKey = `assignments_${classroom._id}`;
          const classroomAssignments = JSON.parse(localStorage.getItem(storageKey) || '[]');
          classroomAssignments.forEach(assignment => {
            const submissionKey = `${classroom._id}_${assignment._id}`;
            const submission = submissions[submissionKey];
            
            studentAssignments.push({
              ...assignment,
              classroomName: classroom.name,
              classroomId: classroom._id,
              id: assignment._id,
              dueDate: assignment.deadline,
              subject: classroom.name,
              status: submission ? 'submitted' : 'pending',
              submitted: !!submission,
              submittedAt: submission?.submittedAt,
              submissionText: submission?.text,
              submissionFile: submission?.file
            });
          });
        });
        
        studentAssignments.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setAssignments(studentAssignments);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const handleFileUpload = (assignmentId) => {
    if (selectedFile || submissionText) {
      const assignment = assignments.find(a => a.id === assignmentId);
      const submissionKey = `${assignment.classroomId}_${assignmentId}`;
      
      // Save submission to localStorage
      const submissions = JSON.parse(localStorage.getItem(`submissions_${user._id}`) || '{}');
      submissions[submissionKey] = {
        text: submissionText,
        file: selectedFile?.name,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem(`submissions_${user._id}`, JSON.stringify(submissions));
      
      // Update state
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { 
              ...assignment, 
              status: 'submitted', 
              submitted: true, 
              submittedAt: new Date().toISOString(),
              submissionText,
              submissionFile: selectedFile?.name
            }
          : assignment
      ));
      setSelectedFile(null);
      setSubmissionText('');
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'pending') return !assignment.submitted;
    if (activeTab === 'submitted') return assignment.submitted;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="header-classroom">
          <h1 className="text-3xl font-bold mb-2">My Assignments</h1>
          <p className="text-classroom-100">Submit and track your assignments</p>
        </div>

        <div className="flex space-x-1 mb-6">
          {['pending', 'submitted', 'all'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                activeTab === tab 
                  ? 'bg-classroom-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab} ({tab === 'all' ? assignments.length : 
                tab === 'pending' ? assignments.filter(a => !a.submitted).length :
                assignments.filter(a => a.submitted).length})
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredAssignments.map(assignment => (
            <div key={assignment.id} className="card-classroom">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.subject} • {assignment.points} points</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  assignment.status === 'submitted' 
                    ? 'bg-success-100 text-success-700'
                    : 'bg-warning-100 text-warning-700'
                }`}>
                  {assignment.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{assignment.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                {assignment.submitted && (
                  <span>Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}</span>
                )}
                {assignment.grade && (
                  <span className="font-semibold text-success-600">Grade: {assignment.grade}%</span>
                )}
              </div>

              {!assignment.submitted && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Submit Assignment</h4>
                  <div className="space-y-3">
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Enter your answer or notes..."
                      className="input-classroom h-24 resize-none"
                    />
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="text-sm"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                      />
                      <button
                        onClick={() => handleFileUpload(assignment.id)}
                        disabled={!selectedFile && !submissionText}
                        className="btn-primary disabled:opacity-50"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {assignment.submitted && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 text-success-600">✓ Assignment Submitted</h4>
                  <div className="bg-success-50 p-3 rounded-lg">
                    {assignment.submissionText && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                        <p className="text-sm text-gray-600">{assignment.submissionText}</p>
                      </div>
                    )}
                    {assignment.submissionFile && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Attached File:</p>
                        <p className="text-sm text-gray-600">{assignment.submissionFile}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignments;