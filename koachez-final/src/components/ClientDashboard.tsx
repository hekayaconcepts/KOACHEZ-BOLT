import React, { useState } from 'react';
import { courses, coachProfile } from '../data/coachData';
import { 
  Calendar, Clock, BookOpen, Play, ChevronRight, 
  Video, CheckCircle, User, Settings, Bell, TrendingUp 
} from 'lucide-react';

interface ClientDashboardProps {
  onViewCourse: (courseId: number) => void;
  onNavigate: (view: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onViewCourse, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for client
  const clientData = {
    name: 'John Doe',
    email: 'john@example.com',
    enrolledCourses: [1, 3, 5],
    courseProgress: { 1: 65, 3: 30, 5: 0 },
    upcomingSessions: [
      {
        id: 1,
        date: '2026-01-20',
        time: '10:00 AM',
        type: 'Coaching Session',
        duration: '60 min',
      },
      {
        id: 2,
        date: '2026-01-27',
        time: '2:00 PM',
        type: 'Strategy Review',
        duration: '90 min',
      },
    ],
    pastSessions: [
      {
        id: 3,
        date: '2026-01-13',
        time: '11:00 AM',
        type: 'Coaching Session',
        duration: '60 min',
        notes: 'Discussed leadership challenges and created action plan.',
      },
      {
        id: 4,
        date: '2026-01-06',
        time: '3:00 PM',
        type: 'Initial Assessment',
        duration: '90 min',
        notes: 'Completed 360° assessment and identified key development areas.',
      },
    ],
  };

  const enrolledCourseData = courses.filter(c => clientData.enrolledCourses.includes(c.id));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {clientData.name.split(' ')[0]}!</h1>
              <p className="text-sky-100 mt-1">Track your progress and upcoming sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate('account')}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Enrolled Courses', value: clientData.enrolledCourses.length, icon: BookOpen },
              { label: 'Upcoming Sessions', value: clientData.upcomingSessions.length, icon: Calendar },
              { label: 'Completed Sessions', value: clientData.pastSessions.length, icon: CheckCircle },
              { label: 'Avg. Progress', value: '32%', icon: TrendingUp },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4">
                <stat.icon className="w-5 h-5 text-sky-200 mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sky-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sessions', label: 'My Sessions' },
            { id: 'courses', label: 'My Courses' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upcoming Sessions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-sky-900">Upcoming Sessions</h2>
                  <button 
                    onClick={() => setActiveTab('sessions')}
                    className="text-sky-600 text-sm font-medium hover:text-sky-700"
                  >
                    View all
                  </button>
                </div>

                {clientData.upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {clientData.upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl"
                      >
                        <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-sky-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sky-900">{session.type}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(session.date)}
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4 mr-1" />
                            {session.time}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors">
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No upcoming sessions</p>
                    <button 
                      onClick={() => onNavigate('booking')}
                      className="mt-3 text-sky-600 font-medium hover:text-sky-700"
                    >
                      Book a session
                    </button>
                  </div>
                )}
              </div>

              {/* Continue Learning */}
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-sky-900">Continue Learning</h2>
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className="text-sky-600 text-sm font-medium hover:text-sky-700"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  {enrolledCourseData.slice(0, 2).map((course) => {
                    const progress = clientData.courseProgress[course.id] || 0;
                    return (
                      <div
                        key={course.id}
                        onClick={() => onViewCourse(course.id)}
                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-sky-200 cursor-pointer transition-colors"
                      >
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-20 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sky-900 truncate">{course.title}</h3>
                          <div className="flex items-center mt-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-sky-500 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="ml-3 text-sm text-gray-500">{progress}%</span>
                          </div>
                        </div>
                        <Play className="w-5 h-5 text-sky-500" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Coach Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-sky-900 mb-4">Your Coach</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={coachProfile.image}
                    alt={coachProfile.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-sky-900">{coachProfile.name}</h4>
                    <p className="text-sm text-gray-500">{coachProfile.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('booking')}
                  className="w-full mt-4 py-2 border border-sky-200 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition-colors"
                >
                  Schedule Session
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-sky-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Browse Articles', view: 'articles' },
                    { label: 'Listen to Podcast', view: 'podcast' },
                    { label: 'View All Courses', view: 'courses' },
                    { label: 'Account Settings', view: 'account' },
                  ].map((link) => (
                    <button
                      key={link.view}
                      onClick={() => onNavigate(link.view)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-gray-700">{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-8">
            {/* Upcoming */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-sky-900 mb-6">Upcoming Sessions</h2>
              {clientData.upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl mb-4 last:mb-0"
                >
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sky-900">{session.type}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(session.date)}
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      {session.time}
                      <span className="mx-2">•</span>
                      {session.duration}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors">
                    Join Session
                  </button>
                </div>
              ))}
            </div>

            {/* Past */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-sky-900 mb-6">Past Sessions</h2>
              {clientData.pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border border-gray-100 rounded-xl mb-4 last:mb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sky-900">{session.type}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(session.date)}
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        {session.time}
                      </div>
                    </div>
                  </div>
                  {session.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <strong>Notes:</strong> {session.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourseData.map((course) => {
              const progress = clientData.courseProgress[course.id] || 0;
              return (
                <div
                  key={course.id}
                  onClick={() => onViewCourse(course.id)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-sky-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <div 
                        className="h-full bg-sky-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sky-900 mb-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{course.lessons} lessons</span>
                      <span className="font-medium text-sky-600">{progress}% complete</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
