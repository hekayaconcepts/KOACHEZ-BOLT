import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Calendar, Users, DollarSign, 
  Package, Clock, MoreHorizontal, Search, Filter,
  Download, Plus, Edit2, Trash2, Eye, MessageSquare
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import CoachLayout from '@/components/layouts/CoachLayout';
import { logout, verifySession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Mock data - replace with real Supabase queries later
const revenueData = [
  { month: 'Jan', revenue: 1250, clients: 12 },
  { month: 'Feb', revenue: 2100, clients: 18 },
  { month: 'Mar', revenue: 1800, clients: 15 },
  { month: 'Apr', revenue: 2800, clients: 24 },
  { month: 'May', revenue: 3200, clients: 28 },
  { month: 'Jun', revenue: 2900, clients: 25 },
];

const salesByCategory = [
  { name: 'Coaching', value: 4500, color: '#0F3A6B' },
  { name: 'Courses', value: 2800, color: '#22C55E' },
  { name: 'Digital Products', value: 1200, color: '#F59E0B' },
  { name: 'Podcast', value: 800, color: '#EC4899' },
];

const recentTransactions = [
  { id: 'TXN-0015', date: 'Apr 9, 2026', client: 'John D.', service: 'Career Coaching', amount: 150.00, status: 'completed' },
  { id: 'TXN-0014', date: 'Apr 9, 2026', client: 'Sarah M.', service: 'Interview Prep', amount: 95.00, status: 'completed' },
  { id: 'TXN-0013', date: 'Apr 8, 2026', client: 'Mike R.', service: 'Leadership Course', amount: 299.00, status: 'completed' },
  { id: 'TXN-0012', date: 'Apr 8, 2026', client: 'Emily W.', service: 'Strategy Session', amount: 200.00, status: 'pending' },
  { id: 'TXN-0011', date: 'Apr 7, 2026', client: 'David L.', service: 'Group Coaching', amount: 75.00, status: 'completed' },
];

const upcomingSessions = [
  { id: 1, time: '09:00 AM', client: 'John D.', service: 'Career Clarity Call', type: 'video' },
  { id: 2, time: '11:30 AM', client: 'Sarah M.', service: 'Interview Prep', type: 'video' },
  { id: 3, time: '03:00 PM', client: 'Emily R.', service: 'Leadership Coaching', type: 'in-person' },
];

const statsCards = [
  { 
    title: 'Total Revenue', 
    value: '$12,450', 
    change: '+12.5%', 
    trend: 'up',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    title: 'Active Clients', 
    value: '48', 
    change: '+8.2%', 
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    title: 'Total Sessions', 
    value: '156', 
    change: '+15.3%', 
    trend: 'up',
    icon: Calendar,
    color: 'from-violet-500 to-purple-600'
  },
  { 
    title: 'Avg. Rating', 
    value: '4.9', 
    change: '+0.3', 
    trend: 'up',
    icon: TrendingUp,
    color: 'from-orange-500 to-amber-600'
  },
];

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                <div className="mt-2 flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-400">vs last month</span>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
              <p className="text-sm text-slate-500">Monthly revenue performance</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <MoreHorizontal className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F3A6B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0F3A6B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0F3A6B" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Sales by Category</h3>
              <p className="text-sm text-slate-500">Revenue distribution</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <MoreHorizontal className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions & Upcoming Sessions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
                <p className="text-sm text-slate-500">Latest payment activity</p>
              </div>
              <button className="text-sm font-medium text-[#0F3A6B] hover:text-[#0A2C52]">
                View all
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{txn.client}</p>
                      <p className="text-xs text-slate-500">{txn.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${txn.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      txn.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
                <p className="text-sm text-slate-500">{upcomingSessions.length} sessions scheduled</p>
              </div>
              <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium hover:bg-slate-100">
                View Calendar
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0F3A6B]/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#0F3A6B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{session.client}</p>
                      <p className="text-xs text-slate-500">{session.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{session.time}</span>
                    <button className="rounded-lg bg-[#0F3A6B] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0A2C52]">
                      {session.type === 'video' ? 'Join Call' : 'Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ... [Other sections: Bookings, Clients, Services, etc. - I'll provide these in the next message to avoid character limit]

const CoachDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [firstName, setFirstName] = useState('Coach');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const session = await verifySession();
        if (!session?.user?.id) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.full_name) {
          const name = profile.full_name.split(' ')[0];
          setFirstName(name);
        }
      } catch (error) {
        console.error('Failed to fetch coach data:', error);
      }
    };

    fetchCoachData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SectionTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    clients: 'Clients',
    services: 'Services',
    availability: 'Availability',
    earnings: 'Earnings',
    analytics: 'Analytics',
    marketing: 'Marketing',
    settings: 'Settings',
  };

  return (
    <CoachLayout onLogout={handleLogout} activeItem={activeSection} onNavItemChange={setActiveSection}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{SectionTitles[activeSection]}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{SectionTitles[activeSection]}</h1>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="inline h-4 w-4 mr-2" />
              Export
            </button>
            <button className="rounded-lg bg-[#0F3A6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A2C52]">
              <Plus className="inline h-4 w-4 mr-2" />
              Create New
            </button>
          </div>
        </div>

        {/* Content */}
        {activeSection === 'dashboard' && <DashboardHome />}
        
        {/* Placeholder for other sections */}
        {activeSection !== 'dashboard' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{SectionTitles[activeSection]}</h2>
            <p className="mt-2 text-slate-500">This section is under development. Check back soon!</p>
          </div>
        )}
      </div>
    </CoachLayout>
  );
};

export default CoachDashboard;
