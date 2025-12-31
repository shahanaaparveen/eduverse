import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const StudyTimer = () => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [sessions, setSessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('');
  const [studyStats, setStudyStats] = useState([]);
  const intervalRef = useRef(null);

  const modes = {
    work: { duration: 25 * 60, label: 'Focus Time', color: 'bg-classroom-600' },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'bg-success-600' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'bg-warning-600' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === 'work') {
      setSessions(prev => prev + 1);
      setTotalStudyTime(prev => prev + 25);
      
      // Add to study stats
      if (currentSubject) {
        const today = new Date().toDateString();
        setStudyStats(prev => {
          const existing = prev.find(stat => stat.date === today && stat.subject === currentSubject);
          if (existing) {
            return prev.map(stat => 
              stat.date === today && stat.subject === currentSubject
                ? { ...stat, minutes: stat.minutes + 25 }
                : stat
            );
          } else {
            return [...prev, { date: today, subject: currentSubject, minutes: 25 }];
          }
        });
      }
      
      // Auto-switch to break
      if (sessions % 4 === 3) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('work');
    }
    
    // Play notification sound (browser notification)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${modes[mode].label} completed!`, {
        body: mode === 'work' ? 'Time for a break!' : 'Ready to focus again?',
        icon: '/favicon.ico'
      });
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="header-classroom">
          <h1 className="text-3xl font-bold mb-2">Study Timer</h1>
          <p className="text-classroom-100">Stay focused with the Pomodoro Technique</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              {/* Mode Selector */}
              <div className="flex justify-center space-x-2 mb-8">
                {Object.entries(modes).map(([key, modeData]) => (
                  <button
                    key={key}
                    onClick={() => switchMode(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      mode === key
                        ? `${modeData.color} text-white`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {modeData.label}
                  </button>
                ))}
              </div>

              {/* Timer Display */}
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                      className={`transition-all duration-1000 ${
                        mode === 'work' ? 'text-classroom-600' :
                        mode === 'shortBreak' ? 'text-success-600' :
                        'text-warning-600'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {modes[mode].label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Input */}
              {mode === 'work' && (
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="What are you studying?"
                    value={currentSubject}
                    onChange={(e) => setCurrentSubject(e.target.value)}
                    className="input-classroom max-w-xs mx-auto"
                  />
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleTimer}
                  className={`px-8 py-3 rounded-lg font-medium text-white ${
                    isActive ? 'bg-danger-600 hover:bg-danger-700' : 'bg-classroom-600 hover:bg-classroom-700'
                  }`}
                >
                  {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-8 py-3 rounded-lg font-medium bg-gray-600 text-white hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Session Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sessions Completed</span>
                  <span className="text-2xl font-bold text-classroom-600">{sessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Study Time</span>
                  <span className="text-2xl font-bold text-success-600">{totalStudyTime}m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Break</span>
                  <span className="text-sm text-gray-500">
                    {sessions % 4 === 3 ? 'Long break' : `${3 - (sessions % 4)} sessions`}
                  </span>
                </div>
              </div>
            </div>

            {/* Study Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Breakdown</h3>
              <div className="space-y-3">
                {studyStats
                  .filter(stat => stat.date === new Date().toDateString())
                  .map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{stat.subject}</span>
                      <span className="text-sm font-medium text-classroom-600">{stat.minutes}m</span>
                    </div>
                  ))}
                {studyStats.filter(stat => stat.date === new Date().toDateString()).length === 0 && (
                  <p className="text-gray-500 text-sm">No study sessions yet today</p>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pomodoro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Focus on one task during work sessions</li>
                <li>• Take breaks away from your screen</li>
                <li>• Stay hydrated and stretch</li>
                <li>• Turn off notifications during focus time</li>
                <li>• Review your progress regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;