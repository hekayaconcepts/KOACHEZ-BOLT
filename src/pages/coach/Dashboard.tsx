import React from 'react';
import { Users, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import CoachLayout from '@/components/layouts/CoachLayout';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className="text-gray-500 text-sm mt-1">{title}</div>
    {subtitle && <div className="text-xs text-green-600 mt-2 font-medium">{subtitle}</div>}
  </div>
);

interface ActivityItem {
  id: number;
  type: 'booking' | 'payment' | 'new_client';
  title: string;
  description: string;
  time: string;
}

const CoachDashboard: React.FC = () => {
  // Placeholder data - will be replaced with real data from backend
  const stats = {
    upcomingSessions: 8,
    totalEarnings: 4575,
    activeClients: 12,
  };

  const recentActivity: ActivityItem[] = [
    { 
      id: 1, 
      type: 'booking', 
      title: 'New Session Booked', 
      description: 'John Doe booked a Growth Coaching session', 
      time: '2 hours ago' 
    },
    { 
      id: 2, 
      type: 'payment', 
      title: 'Payment Received', 
      description: '$450 from Sarah Smith - Premium Package', 
      time: '5 hours ago' 
    },
    { 
      id: 3, 
      type: 'new_client', 
      title: 'New Client Registered', 
      description: 'Mike Johnson signed up for Starter Package', 
      time: '1 day ago' 
    },
    { 
      id: 4, 
      type: 'booking', 
      title: 'Session Reminder', 
      description: 'Upcoming session with Emily Brown tomorrow at 3:00 PM', 
      time: '1 day ago' 
    },
    { 
      id: 5, 
      type: 'payment', 
      title: 'Subscription Renewed', 
      description: 'David Wilson renewed monthly subscription', 
      time: '2 days ago' 
    },
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking':
        return CalendarIcon;
      case 'payment':
        return DollarSign;
      case 'new_client':
        return Users;
      default:
        return CalendarIcon;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-500';
      case 'payment':
        return 'bg-green-500';
      case 'new_client':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleLogout = async () => {
    // TODO: Implement actual logout logic
    console.log('Logout requested');
  };

  return (
    <CoachLayout onLogout={handleLogout}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your coaching business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Upcoming Sessions"
          value={stats.upcomingSessions}
          subtitle="This week"
          icon={CalendarIcon}
          color="bg-[#0F3A6B]"
        />
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          subtitle="+12% from last month"
          icon={DollarSign}
          color="bg-[#10B981]"
        />
        <StatCard
          title="Active Clients"
          value={stats.activeClients}
          subtitle="Currently enrolled"
          icon={Users}
          color="bg-purple-600"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            return (
              <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{activity.description}</p>
                </div>
                <span className="text-gray-400 text-sm whitespace-nowrap">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[#0F3A6B] text-white font-medium rounded-lg hover:bg-[#0a2a4f] transition-colors">
            Add New Service
          </button>
          <button className="px-4 py-2 bg-[#10B981] text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
            Create Article
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            View Calendar
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Manage Clients
          </button>
        </div>
      </div>
    </CoachLayout>
  );
};

export default CoachDashboard;
