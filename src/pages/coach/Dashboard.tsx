import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, MoreVertical, ChevronLeft, ChevronRight, Calendar, 
  Download, Plus, Filter, Search
} from 'lucide-react';
import CoachLayout from '@/components/layouts/CoachLayout';
import { logout, verifySession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Mock data - replace with real Supabase queries later
const bookingHistory = [
  { id: 'BK-0015', date: 'Apr 9, 2026 15:39', client: 'John D.', service: 'Career Coaching', amount: 150.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0014', date: 'Apr 9, 2026 15:38', client: 'Sarah M.', service: 'Interview Prep', amount: 95.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0013', date: 'Apr 8, 2026 20:59', client: 'Mike R.', service: 'Leadership Course', amount: 299.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0012', date: 'Apr 8, 2026 17:07', client: 'Emily W.', service: 'Strategy Session', amount: 200.00, status: 'pending', cashier: 'Admin' },
  { id: 'BK-0011', date: 'Apr 6, 2026 21:53', client: 'David L.', service: 'Group Coaching', amount: 75.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0010', date: 'Apr 6, 2026 21:52', client: 'Lisa K.', service: 'Resume Review', amount: 85.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0009', date: 'Apr 6, 2026 15:35', client: 'James T.', service: 'Career Clarity Call', amount: 120.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0008', date: 'Apr 6, 2026 15:34', client: 'Rachel P.', service: 'Negotiation Coaching', amount: 150.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0007', date: 'Apr 6, 2026 15:33', client: 'Mark S.', service: 'Interview Prep', amount: 95.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0006', date: 'Apr 3, 2026 16:22', client: 'Anna B.', service: 'Leadership Coaching', amount: 180.00, status: 'completed', cashier: 'Admin' },
  { id: 'BK-0005', date: 'Apr 3, 2026 16:21', client: 'Chris M.', service: 'Career Transition', amount: 250.00, status: 'completed', cashier: 'Admin' },
];

interface Booking {
  id: string;
  date: string;
  client: string;
  service: string;
  amount: number;
  status: 'completed' | 'pending';
  cashier: string;
}

const DashboardHome: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredBookings = bookingHistory.filter(booking =>
    booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Booking History</h2>
        <p className="text-sm text-slate-500 mt-1">View all past bookings and transactions</p>
      </div>

      {/* Date Range & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <input 
              type="date" 
              defaultValue="2026-03-10"
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0F3A6B]"
            />
            <span className="text-slate-400">to</span>
            <input 
              type="date" 
              defaultValue="2026-04-09"
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0F3A6B]"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search by booking ID, client name, or service..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A6B]"
        />
      </div>

      {/* Bookings Section Header */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Bookings</h3>
          <p className="text-xs text-slate-500 mt-1">Click View to see the full receipt</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">BOOKING ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">DATE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">CLIENT</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">SERVICE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">AMOUNT</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">CASHIER</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{booking.client}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.service}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">${booking.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.cashier}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No bookings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{startIndex + 1}</span>-<span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredBookings.length)}</span> of <span className="font-medium">{filteredBookings.length}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#0F3A6B] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <CoachLayout 
      onLogout={handleLogout} 
      activeItem={activeSection} 
      onNavItemChange={setActiveSection}
      coachName={firstName}
    >
      <div className="space-y-6">
        {/* Content */}
        {activeSection === 'dashboard' && <DashboardHome />}
        
        {/* Placeholder for other sections */}
        {activeSection !== 'dashboard' && (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{SectionTitles[activeSection]}</h2>
            <p className="mt-2 text-slate-500">This section is under development. Check back soon!</p>
          </div>
        )}
      </div>
    </CoachLayout>
  );
};

export default CoachDashboard;
