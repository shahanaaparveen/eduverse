import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    // Mock notes data
    setNotes([
      {
        id: 1,
        title: 'Algebra Formulas',
        content: 'Quadratic Formula: x = (-b ± √(b²-4ac)) / 2a\n\nSlope Formula: m = (y₂-y₁)/(x₂-x₁)',
        subject: 'Mathematics',
        createdAt: '2024-01-20T10:00:00',
        updatedAt: '2024-01-21T15:30:00',
        tags: ['formulas', 'algebra', 'equations']
      },
      {
        id: 2,
        title: 'Photosynthesis Notes',
        content: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nLight-dependent reactions occur in thylakoids\nLight-independent reactions (Calvin cycle) occur in stroma',
        subject: 'Science',
        createdAt: '2024-01-19T14:20:00',
        updatedAt: '2024-01-19T14:20:00',
        tags: ['biology', 'plants', 'energy']
      }
    ]);
  }, []);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      subject: 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const saveNote = (noteData) => {
    setNotes(prev => prev.map(note => 
      note.id === noteData.id 
        ? { ...noteData, updatedAt: new Date().toISOString() }
        : note
    ));
    setIsEditing(false);
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['all', ...new Set(notes.map(note => note.subject))];

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="header-classroom">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Notes</h1>
              <p className="text-classroom-100">Organize your study notes</p>
            </div>
            <button onClick={createNewNote} className="btn-primary">
              + New Note
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-classroom mb-4"
              />
              
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-classroom"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'border-classroom-500 bg-classroom-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                >
                  <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{note.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={saveNote}
                onDelete={deleteNote}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Note Selected</h2>
                <p className="text-gray-600 mb-6">Select a note from the sidebar or create a new one</p>
                <button onClick={createNewNote} className="btn-primary">
                  Create New Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoteEditor = ({ note, isEditing, onEdit, onSave, onDelete, onCancel }) => {
  const [editedNote, setEditedNote] = useState(note);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = () => {
    onSave(editedNote);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
            className="text-2xl font-bold bg-transparent border-none outline-none flex-1 mr-4"
            placeholder="Note title..."
          />
          <div className="flex space-x-2">
            <button onClick={handleSave} className="btn-success text-sm">
              Save
            </button>
            <button onClick={onCancel} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            value={editedNote.subject}
            onChange={(e) => setEditedNote(prev => ({ ...prev, subject: e.target.value }))}
            className="input-classroom"
          >
            <option value="General">General</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
          </select>
          
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={editedNote.tags.join(', ')}
            onChange={(e) => setEditedNote(prev => ({ 
              ...prev, 
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            }))}
            className="input-classroom"
          />
        </div>

        <textarea
          value={editedNote.content}
          onChange={(e) => setEditedNote(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Start writing your notes..."
          className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-classroom-500"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>{note.subject}</span>
            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="btn-secondary text-sm">
            Edit
          </button>
          <button 
            onClick={() => onDelete(note.id)} 
            className="text-danger-600 hover:text-danger-700 text-sm px-3 py-1"
          >
            Delete
          </button>
        </div>
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
          {note.content || 'This note is empty. Click Edit to add content.'}
        </pre>
      </div>
    </div>
  );
};

export default Notes;