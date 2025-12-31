import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const ClassroomDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [classroom, setClassroom] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newNote, setNewNote] = useState({ name: '', file: null });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchClassroom();
    loadNotes();
  }, [id]);

  const fetchClassroom = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/classrooms/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setClassroom(data);
      }
    } catch (error) {
      console.error('Error fetching classroom:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = () => {
    const storageKey = `notes_${id}`;
    const savedNotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setNotes(savedNotes);
  };

  const handleUploadNote = (e) => {
    e.preventDefault();
    if (!newNote.name || !newNote.file) return;

    const note = {
      id: Date.now().toString(),
      name: newNote.name,
      fileName: newNote.file.name,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.name
    };

    const storageKey = `notes_${id}`;
    const existingNotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingNotes.push(note);
    localStorage.setItem(storageKey, JSON.stringify(existingNotes));

    setNotes(existingNotes);
    setNewNote({ name: '', file: null });
    setShowUploadForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-classroom-600"></div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Classroom not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="header-classroom mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{classroom.name}</h1>
              <p className="text-classroom-100">{classroom.description}</p>
              <p className="text-sm text-classroom-100 mt-1">
                Class Code: {classroom.classCode} • {classroom.students?.length || 0} students
              </p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Class Notes</h2>
              {user.role === 'teacher' && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Upload Notes
                </button>
              )}
            </div>
          </div>

          {/* Upload Form */}
          {showUploadForm && user.role === 'teacher' && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Upload New Notes</h3>
              <form onSubmit={handleUploadNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Note Name</label>
                  <input
                    type="text"
                    value={newNote.name}
                    onChange={(e) => setNewNote({...newNote, name: e.target.value})}
                    placeholder="Enter a name for this note"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select File</label>
                  <input
                    type="file"
                    onChange={(e) => setNewNote({...newNote, file: e.target.files[0]})}
                    className="w-full p-2 border rounded-lg"
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes List */}
          <div className="p-6">
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notes Yet</h3>
                <p className="text-gray-600">
                  {user.role === 'teacher' 
                    ? 'Upload your first note to share with students.' 
                    : 'Your teacher hasn\'t uploaded any notes yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">📄</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{note.name}</h4>
                        <p className="text-sm text-gray-500">
                          {note.fileName} • Uploaded by {note.uploadedBy} on {new Date(note.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:underline text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;