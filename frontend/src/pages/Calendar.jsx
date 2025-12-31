import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Mock calendar events
    setEvents([
      {
        id: 1,
        title: 'Math Quiz',
        date: '2024-01-20',
        time: '10:00 AM',
        type: 'assignment',
        subject: 'Mathematics'
      },
      {
        id: 2,
        title: 'Science Lab',
        date: '2024-01-22',
        time: '2:00 PM',
        type: 'class',
        subject: 'Science'
      },
      {
        id: 3,
        title: 'English Essay Due',
        date: '2024-01-25',
        time: '11:59 PM',
        type: 'assignment',
        subject: 'English'
      },
      {
        id: 4,
        title: 'History Presentation',
        date: '2024-01-28',
        time: '9:00 AM',
        type: 'presentation',
        subject: 'History'
      }
    ]);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'assignment': return 'bg-danger-100 text-danger-700';
      case 'class': return 'bg-classroom-100 text-classroom-700';
      case 'presentation': return 'bg-warning-100 text-warning-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="header-classroom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Academic Calendar</h1>
              <p className="text-classroom-100">Keep track of your assignments and classes</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm text-classroom-100">Upcoming Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="text-lg">←</span>
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-2 border border-gray-100 ${
                        day ? 'hover:bg-gray-50 cursor-pointer' : ''
                      }`}
                      onClick={() => day && setSelectedDate(day)}
                    >
                      {day && (
                        <>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      event.type === 'assignment' ? 'bg-danger-500' :
                      event.type === 'class' ? 'bg-classroom-500' :
                      'bg-warning-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => window.open('https://calendar.google.com/', '_blank')}
                  className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className="text-lg mr-3">📅</span>
                  <span className="text-sm font-medium">Open Google Calendar</span>
                </button>
                

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;