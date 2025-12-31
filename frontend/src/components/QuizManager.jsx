import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const QuizManager = ({ classrooms, onQuizUpdate }) => {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    classroomId: '',
    timeLimit: 30,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    const quiz = {
      _id: Date.now().toString(),
      title: newQuiz.title,
      description: newQuiz.description,
      classroomId: newQuiz.classroomId,
      timeLimit: newQuiz.timeLimit,
      questions: newQuiz.questions,
      createdAt: new Date().toISOString(),
      submissions: []
    };
    
    const storageKey = `quizzes_${newQuiz.classroomId}`;
    const existingQuizzes = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingQuizzes.push(quiz);
    localStorage.setItem(storageKey, JSON.stringify(existingQuizzes));
    
    setQuizzes([...quizzes, quiz]);
    setNewQuiz({
      title: '',
      description: '',
      classroomId: '',
      timeLimit: 30,
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
    setShowCreateForm(false);
    
    if (onQuizUpdate) {
      onQuizUpdate();
    }
    
    alert('Quiz created successfully!');
  };

  const fetchQuizzes = () => {
    const allQuizzes = [];
    classrooms.forEach(classroom => {
      const storageKey = `quizzes_${classroom._id}`;
      const classroomQuizzes = JSON.parse(localStorage.getItem(storageKey) || '[]');
      allQuizzes.push(...classroomQuizzes);
    });
    setQuizzes(allQuizzes);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [classrooms]);

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quizzes</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Quiz
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Create New Quiz</h3>
          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quiz Title</label>
              <input
                type="text"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newQuiz.description}
                onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                className="w-full p-2 border rounded-lg h-20"
                placeholder="Quiz instructions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Classroom</label>
              <select
                value={newQuiz.classroomId}
                onChange={(e) => setNewQuiz({...newQuiz, classroomId: e.target.value})}
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
              <label className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
              <input
                type="number"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({...newQuiz, timeLimit: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Questions</label>
              {newQuiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="border p-4 rounded-lg mb-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Question {qIndex + 1}</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter your question"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="flex-1 p-2 border rounded-lg"
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Question
              </button>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Create Quiz
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
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-600">
                  {quiz.questions.length} questions • {quiz.timeLimit} minutes
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Submissions</p>
                <p className="text-2xl font-bold text-green-600">{quiz.submissions?.length || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizManager;