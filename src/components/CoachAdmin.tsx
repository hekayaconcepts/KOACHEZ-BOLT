import React, { useState } from 'react';
import { coachProfile, articles, podcasts, courses, testimonials } from '../data/coachData';
import { 
  LayoutDashboard, FileText, Mic, Video, Calendar, Users, 
  Star, BarChart3, Settings, Plus, Edit, Trash2, Eye,
  TrendingUp, DollarSign, Clock, ChevronRight, Search
} from 'lucide-react';

interface CoachAdminProps {
  activeSection?: string;
  onNavigate: (view: string) => void;
}

const CoachAdmin: React.FC<CoachAdminProps> = ({ activeSection = 'admin-dashboard', onNavigate }) => {
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock analytics data
  const analytics = {
    totalClients: 47,
    activeClients: 32,
    totalRevenue: 45750,
    sessionsThisMonth: 28,
    courseEnrollments: 156,
    articleViews: 2340,
    podcastPlays: 1890,
    avgSessionRating: 4.9,
  };

  const recentBookings = [
    { id: 1, client: 'John Doe', date: '2026-01-20', time: '10:00 AM', package: 'Growth', status: 'confirmed' },
    { id: 2, client: 'Sarah Smith', date: '2026-01-20', time: '2:00 PM', package: 'Premium', status: 'confirmed' },
    { id: 3, client: 'Mike Johnson', date: '2026-01-21', time: '11:00 AM', package: 'Starter', status: 'pending' },
    { id: 4, client: 'Emily Brown', date: '2026-01-22', time: '3:00 PM', package: 'Growth', status: 'confirmed' },
  ];

  const sidebarItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-content', label: 'Content', icon: FileText },
    { id: 'admin-bookings', label: 'Bookings', icon: Calendar },
    { id: 'admin-clients', label: 'Clients', icon: Users },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: analytics.totalClients, icon: Users, change: '+5 this month', color: 'bg-sky-500' },
          { label: 'Monthly Revenue', value: `$${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12%', color: 'bg-green-500' },
          { label: 'Sessions This Month', value: analytics.sessionsThisMonth, icon: Calendar, change: '4 upcoming', color: 'bg-purple-500' },
          { label: 'Course Enrollments', value: analytics.courseEnrollments, icon: Video, change: '+23 this week', color: 'bg-orange-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <button 
              onClick={() => setCurrentSection('admin-bookings')}
              className="text-sky-600 text-sm font-medium hover:text-sky-700"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Package</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td className="py-4 font-medium text-gray-900">{booking.client}</td>
                    <td className="py-4 text-gray-600">{formatDate(booking.date)} at {booking.time}</td>
                    <td className="py-4 text-gray-600">{booking.package}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Create Article', icon: FileText, action: 'admin-content' },
              { label: 'Upload Podcast', icon: Mic, action: 'admin-content' },
              { label: 'Add Course', icon: Video, action: 'admin-content' },
              { label: 'Manage Testimonials', icon: Star, action: 'admin-content' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(item.action)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-sky-200 hover:bg-sky-50 transition-colors"
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 text-sky-600 mr-3" />
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Content Performance</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Article Views</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analytics.articleViews.toLocaleString()}</div>
            <div className="text-sm text-green-600">+18% from last month</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Podcast Plays</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analytics.podcastPlays.toLocaleString()}</div>
            <div className="text-sm text-green-600">+24% from last month</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Avg. Session Rating</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{analytics.avgSessionRating}/5.0</div>
            <div className="text-sm text-gray-500">Based on 47 reviews</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-8">
      {/* Content Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-4">
        {['Articles', 'Podcast', 'Courses', 'Testimonials'].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 text-gray-600 hover:text-sky-600 font-medium transition-colors"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Articles</h2>
            <button className="px-4 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {articles.map((article) => (
            <div key={article.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
              <img
                src={article.image}
                alt={article.title}
                className="w-20 h-14 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{article.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>{article.category}</span>
                  <span className="mx-2">•</span>
                  <span>{article.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Bookings</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 bg-gray-50">
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Date & Time</th>
              <th className="px-6 py-3 font-medium">Package</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{booking.client}</td>
                <td className="px-6 py-4 text-gray-600">{formatDate(booking.date)} at {booking.time}</td>
                <td className="px-6 py-4 text-gray-600">{booking.package}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sky-600 hover:text-sky-700 font-medium text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Client Management</h2>
          <button className="px-4 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Brown', 'David Wilson', 'Lisa Anderson'].map((name, index) => (
            <div key={index} className="p-4 border border-gray-100 rounded-xl hover:border-sky-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                  <span className="text-sky-600 font-medium">{name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-500">Growth Package</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">8 sessions</span>
                <button className="text-sky-600 hover:text-sky-700 font-medium">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">App Branding</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coach Name</label>
            <input
              type="text"
              defaultValue={coachProfile.name}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              defaultValue={coachProfile.title}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              defaultValue={coachProfile.tagline}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" defaultValue="#0EA5E9" className="w-10 h-10 rounded cursor-pointer" />
              <span className="text-gray-600">#0EA5E9 (Sky Blue)</span>
            </div>
          </div>
        </div>
        <button className="mt-6 px-6 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {coachProfile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Admin Panel</h3>
              <p className="text-xs text-gray-500">{coachProfile.name}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentSection === item.id
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Public Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Mobile nav */}
          <div className="lg:hidden mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    currentSection === item.id
                      ? 'bg-sky-500 text-white'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {sidebarItems.find(i => i.id === currentSection)?.label || 'Dashboard'}
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your coaching business
            </p>
          </div>

          {/* Content */}
          {currentSection === 'admin-dashboard' && renderDashboard()}
          {currentSection === 'admin-content' && renderContent()}
          {currentSection === 'admin-bookings' && renderBookings()}
          {currentSection === 'admin-clients' && renderClients()}
          {currentSection === 'admin-analytics' && renderDashboard()}
          {currentSection === 'admin-settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default CoachAdmin;
