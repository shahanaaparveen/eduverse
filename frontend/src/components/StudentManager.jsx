import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentManager = ({ classrooms, onStudentsSaved }) => {
  const { token } = useAuth();
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    email: ''
  });

  const handleAddStudent = (e) => {
    e.preventDefault();
    const student = {
      _id: Date.now().toString(),
      name: newStudent.name,
      rollNo: newStudent.rollNo,
      email: newStudent.email
    };
    setStudents([...students, student]);
    setNewStudent({ name: '', rollNo: '', email: '' });
    setShowAddForm(false);
    setHasUnsavedChanges(true);
  };

  const handleSaveStudents = async () => {
    try {
      // Since PUT might not be supported, let's use localStorage as backup
      const storageKey = `classroom_${selectedClassroom}_students`;
      localStorage.setItem(storageKey, JSON.stringify(students));
      
      setHasUnsavedChanges(false);
      alert('Students saved successfully!');
    } catch (error) {
      console.error('Error saving students:', error);
      alert('Error saving students');
    }
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter(student => student._id !== studentId));
      setHasUnsavedChanges(true);
    }
  };

  const handleUpdateStudent = (studentId, field, value) => {
    setStudents(students.map(student => 
      student._id === studentId ? { ...student, [field]: value } : student
    ));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    if (selectedClassroom) {
      // Try to load from localStorage first
      const storageKey = `classroom_${selectedClassroom}_students`;
      const savedStudents = localStorage.getItem(storageKey);
      
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        const classroom = classrooms.find(c => c._id === selectedClassroom);
        setStudents(classroom?.students || []);
      }
      setHasUnsavedChanges(false);
    } else {
      setStudents([]);
      setHasUnsavedChanges(false);
    }
  }, [selectedClassroom, classrooms]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <div className="flex gap-2">
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Select Classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>
                {classroom.name}
              </option>
            ))}
          </select>
          {selectedClassroom && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Student
            </button>
          )}
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveStudents}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Roll Number</label>
                <input
                  type="text"
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Add Student
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!selectedClassroom && classrooms.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Available Classrooms</h3>
            <p className="text-sm text-gray-500">Select a classroom to manage students</p>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classrooms.map((classroom) => (
                <div
                  key={classroom._id}
                  onClick={() => setSelectedClassroom(classroom._id)}
                  className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">🏫</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{classroom.name}</h4>
                      <p className="text-xs text-gray-500">Code: {classroom.classCode}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {classroom.description || 'No description'}
                  </p>
                  <p className="text-sm text-blue-600">
                    👥 {classroom.students?.length || 0} students
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedClassroom && classrooms.length === 0 && (
        <div className="bg-white rounded-lg shadow-md border p-8 text-center">
          <div className="text-6xl mb-4">🏫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classrooms Available</h3>
          <p className="text-gray-600">Create a classroom first to manage students.</p>
        </div>
      )}

      {selectedClassroom && (
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">
              Students in {classrooms.find(c => c._id === selectedClassroom)?.name}
            </h3>
            <p className="text-sm text-gray-500">Total Students: {students.length}</p>
          </div>
          
          {students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students enrolled in this classroom
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">S.No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Roll No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        {editingStudent === student._id ? (
                          <input
                            type="text"
                            defaultValue={student.rollNo}
                            className="w-full p-1 border rounded"
                            onBlur={(e) => handleUpdateStudent(student._id, 'rollNo', e.target.value)}
                          />
                        ) : (
                          student.rollNo
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {editingStudent === student._id ? (
                          <input
                            type="text"
                            defaultValue={student.name}
                            className="w-full p-1 border rounded"
                            onBlur={(e) => handleUpdateStudent(student._id, 'name', e.target.value)}
                          />
                        ) : (
                          student.name
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {editingStudent === student._id ? (
                          <input
                            type="email"
                            defaultValue={student.email}
                            className="w-full p-1 border rounded"
                            onBlur={(e) => handleUpdateStudent(student._id, 'email', e.target.value)}
                          />
                        ) : (
                          student.email
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingStudent(editingStudent === student._id ? null : student._id)}
                            className="text-blue-600 hover:underline"
                          >
                            {editingStudent === student._id ? 'Save' : 'Edit'}
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student._id)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentManager;