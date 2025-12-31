import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Quiz = () => {
  const { user, token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentQuizzes();
  }, []);

  const fetchStudentQuizzes = async () => {
    try {
      // Fetch enrolled classrooms
      const response = await fetch('http://localhost:5000/api/classrooms', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const enrolledClassrooms = await response.json();
        setClassrooms(enrolledClassrooms);
        
        // Load quizzes from enrolled classrooms only
        const studentQuizzes = [];
        enrolledClassrooms.forEach(classroom => {
          const storageKey = `quizzes_${classroom._id}`;
          const classroomQuizzes = JSON.parse(localStorage.getItem(storageKey) || '[]');
          classroomQuizzes.forEach(quiz => {
            studentQuizzes.push({
              ...quiz,
              classroomName: classroom.name,
              classroomId: classroom._id
            });
          });
        });
        
        setQuizzes(studentQuizzes);
      }
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setTimeLeft(quiz.timeLimit * 60);
    setAnswers({});
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    setQuizCompleted(true);
    setTimeLeft(null);
    
    // Update quiz with results
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === activeQuiz.id 
        ? { ...quiz, attempts: quiz.attempts + 1, completed: true, score }
        : quiz
    ));
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuiz.questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / activeQuiz.questions.length) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeQuiz && !quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{activeQuiz.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeLeft > 300 ? 'bg-success-100 text-success-700' :
                  timeLeft > 60 ? 'bg-warning-100 text-warning-700' :
                  'bg-danger-100 text-danger-700'
                }`}>
                  Time: {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-gray-500">
                  {Object.keys(answers).length}/{activeQuiz.questions.length} answered
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {activeQuiz.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          answers[question.id] === optionIndex
                            ? 'border-classroom-500 bg-classroom-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionIndex}
                          checked={answers[question.id] === optionIndex}
                          onChange={() => handleAnswerSelect(question.id, optionIndex)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          answers[question.id] === optionIndex
                            ? 'border-classroom-500 bg-classroom-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[question.id] === optionIndex && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setActiveQuiz(null)}
                className="btn-secondary"
              >
                Exit Quiz
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== activeQuiz.questions.length}
                className="btn-primary disabled:opacity-50"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
            <p className="text-xl text-gray-600 mb-6">Your Score: {score}%</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-success-600">
                  {activeQuiz.questions.filter((q, i) => answers[q.id] === q.correct).length}
                </p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-danger-600">
                  {activeQuiz.questions.length - activeQuiz.questions.filter((q, i) => answers[q.id] === q.correct).length}
                </p>
                <p className="text-sm text-gray-500">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-classroom-600">{activeQuiz.questions.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveQuiz(null);
                setQuizCompleted(false);
              }}
              className="btn-primary"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
          <p className="text-classroom-100">Test your knowledge with interactive quizzes</p>
        </div>

        {quizzes.length === 0 ? (
          <div className="card-classroom text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Quizzes Available
            </h3>
            <p className="text-gray-600">
              Your teachers haven't assigned any quizzes yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="card-classroom">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                  {quiz.completed && (
                    <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
                      {quiz.score}%
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-2">{quiz.classroomName}</p>
                <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{quiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attempts:</span>
                    <span>{quiz.attempts || 0}/{quiz.maxAttempts || 1}</span>
                  </div>
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  disabled={(quiz.attempts || 0) >= (quiz.maxAttempts || 1)}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;