import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, DollarSign, Sparkles, ClipboardList, CheckCircle2, ArrowRight, Bell, BarChart3 } from 'lucide-react';
import CoachLayout from '@/components/layouts/CoachLayout';
import { logout, verifySession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface ScheduleItem {
  id: number;
  time: string;
  client: string;
  service: string;
  status: 'upcoming' | 'today' | 'completed';
}

interface ActivityItem {
  id: number;
  title: string;
  detail: string;
  time: string;
}

const profileProgress = 72;
const missingItems = ['Add Photo', 'Connect Stripe', 'Set Availability', 'Publish Public Profile'];
const videoUsage = { used: 45, limit: 60 };
const revenue = { month: 1250, fees: 37.5, net: 1212.5, lastMonth: 980 };
const profileUrl = 'koachez.com/jane_doe';

const todaysSchedule: ScheduleItem[] = [
  { id: 1, time: '09:00 AM', client: 'John D.', service: 'Career Clarity Call', status: 'today' },
  { id: 2, time: '11:30 AM', client: 'Sarah M.', service: 'Interview Prep', status: 'today' },
  { id: 3, time: '03:00 PM', client: 'Emily R.', service: 'Leadership Coaching', status: 'upcoming' },
];

const recentActivity: ActivityItem[] = [
  { id: 1, title: 'John D. booked a session', detail: 'New booking for Career Clarity', time: '10 minutes ago' },
  { id: 2, title: 'Sarah M. paid for Package', detail: '$295 received after checkout', time: '45 minutes ago' },
  { id: 3, title: 'Profile published', detail: 'Your public coach page is now live', time: '2 hours ago' },
];

const renderHomeSection = (firstName: string = 'Coach') => (
  <div className="space-y-8">
    <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Coach Dashboard</p>
          <h1 className="mt-3 text-3xl text-slate-950">Good morning, {firstName}</h1>
          <p className="mt-2 text-sm text-slate-500">What you need to focus on today to accept new clients and stay booked.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F3A6B] text-white">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Public profile</p>
            <p className="font-semibold text-slate-950">{profileUrl}</p>
          </div>
          <button className="ml-auto rounded-full bg-[#0F3A6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2C52] transition-colors">
            Copy Link
          </button>
        </div>
      </div>
    </header>

    <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
      <section className="grid gap-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Profile completion</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{profileProgress}% Complete</h2>
            </div>
            <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">Complete setup to accept bookings</div>
          </div>
          <div className="mt-6 rounded-full bg-slate-100 h-3 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#0F3A6B] to-[#22C55E]" style={{ width: `${profileProgress}%` }} />
          </div>
          <div className="mt-6 grid gap-3">
            {missingItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="h-5 w-5 text-[#0F3A6B]" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Video usage</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{videoUsage.used}/{videoUsage.limit} min used</h3>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 rounded-full bg-slate-100 h-3 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#0F3A6B] to-[#10B981]" style={{ width: `${(videoUsage.used / videoUsage.limit) * 100}%` }} />
            </div>
            <p className="mt-4 text-sm text-slate-500">Free tier limit reminder. Upgrade to Pro for unlimited video minutes.</p>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Revenue snapshot</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">${revenue.month.toLocaleString()}</h3>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Koachez fees</span>
                <span className="text-slate-950">-${revenue.fees.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Net earnings</span>
                <span className="text-slate-950">${revenue.net.toFixed(2)}</span>
              </div>
            </div>
            <button className="mt-6 w-full rounded-3xl bg-[#0F3A6B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0A2C52] transition-colors">
              View detailed earnings
            </button>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F3A6B] text-white">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Public link</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{profileUrl}</p>
            </div>
          </div>
          <button className="mt-6 w-full rounded-3xl bg-[#0F3A6B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0A2C52] transition-colors">
            Copy profile link
          </button>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Upgrade banner</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">Pro membership benefits</h3>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Upgrade for unlimited video, marketing assets, and higher booking visibility.</p>
        </div>
      </aside>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Today's schedule</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Upcoming calls</h2>
          </div>
          <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors">
            View calendar
          </button>
        </div>
        <div className="space-y-4">
          {todaysSchedule.map((session) => (
            <div key={session.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">{session.time}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{session.client}</p>
                  <p className="text-sm text-slate-500">{session.service}</p>
                </div>
                <button className="rounded-3xl bg-[#0F3A6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0A2C52] transition-colors">
                  Join call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recent activity</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">Recent activity</h3>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Bell className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                <p className="mt-2 text-xs text-slate-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quick actions</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">Quick actions</h3>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="grid gap-3">
            {['Create Service', 'Set Availability', 'Copy Public Link', 'View Earnings'].map((item) => (
              <button key={item} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-colors">
                <span>{item}</span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EarningsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Earnings dashboard</p>
            <h1 className="mt-3 text-3xl text-slate-950">Earnings overview</h1>
            <p className="mt-2 text-sm text-slate-500">Track payout history, fees, and campaign performance in one place.</p>
          </div>
          <div className="rounded-3xl bg-[#0F3A6B] px-5 py-4 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Total expense</p>
            <p className="mt-3 text-2xl font-semibold">$6078.76</p>
            <p className="mt-1 text-sm text-slate-300">Profit is 34% more than last month</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Balance</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">$52,422</h2>
              </div>
              <div className="text-sm text-slate-500">Monthly</div>
            </div>
            <div className="rounded-3xl bg-slate-100 p-5">
              <div className="mb-5 flex items-center justify-between text-sm text-slate-600">
                <span>Saves</span>
                <span className="text-emerald-600">43.50% +2.45%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full w-3/5 rounded-full bg-[#0F3A6B]" />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Spent this month</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">$682.50</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">New clients</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">321</p>
              </div>
              <div className="rounded-3xl bg-[#0F3A6B] p-4 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Activity</p>
                <p className="mt-3 text-xl font-semibold">$540.50</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Available credit</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">Credit card in wallet</p>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-sm text-slate-600">A smart card option to manage client payments with confidence.</p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Earnings</p>
              <span className="text-xs text-slate-500">Total</span>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-lg font-semibold text-slate-950">$6078.76</p>
              <p className="mt-2 text-sm text-slate-500">Payout this month</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your profile</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">Carlic Bolomboy</h3>
                <p className="text-sm text-slate-500">carlic@gmail.com</p>
              </div>
              <div className="h-12 w-12 rounded-3xl bg-[#0F3A6B] text-white flex items-center justify-center">CB</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4 text-center">
                <div className="text-sm text-slate-500">Projects</div>
                <div className="mt-2 text-xl font-semibold text-slate-950">26</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-center">
                <div className="text-sm text-slate-500">Followers</div>
                <div className="mt-2 text-xl font-semibold text-slate-950">356</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-center">
                <div className="text-sm text-slate-500">Following</div>
                <div className="mt-2 text-xl font-semibold text-slate-950">68</div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Keep you safe</p>
              <Bell className="h-5 w-5 text-slate-500" />
            </div>
            <p className="text-sm text-slate-500">Update your security settings to protect payments and bookings.</p>
            <button className="mt-6 w-full rounded-3xl bg-[#0F3A6B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0A2C52] transition-colors">
              Update Your Security
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
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

const sectionContent = {
  bookings: (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Bookings</h1>
      <p className="mt-4 text-sm text-slate-600">Full calendar view, upcoming sessions, and booking history will appear here.</p>
    </div>
  ),
  clients: (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Clients</h1>
      <p className="mt-4 text-sm text-slate-600">A client list with contact info, notes, and engagement history.</p>
    </div>
  ),
  services: (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Services</h1>
      <p className="mt-4 text-sm text-slate-600">Create and edit prices, durations, and package details.</p>
    </div>
  ),
  availability: (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Availability</h1>
      <p className="mt-4 text-sm text-slate-600">Set your weekly schedule, holidays, and time blocks.</p>
    </div>
  ),
  analytics: (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Analytics</h1>
      <p className="mt-4 text-sm text-slate-600">Views, conversion metrics, and revenue trends for your coaching business.</p>
    </div>
  ),
  marketing: (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Marketing</h1>
      <p className="mt-4 text-sm text-slate-600">Share your public page, download promo assets, and launch campaigns.</p>
    </div>
  ),
  settings: (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Settings</h1>
      <p className="mt-4 text-sm text-slate-600">Manage profile, password, subscription, and account preferences.</p>
    </div>
  ),
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

  return (
    <CoachLayout onLogout={handleLogout} activeItem={activeSection} onNavItemChange={setActiveSection}>
      {(activeItem) => (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{SectionTitles[activeItem]}</p>
              <h1 className="mt-3 text-3xl text-slate-950">{SectionTitles[activeItem]}</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-3xl border border-[#0F3A6B] bg-[#0F3A6B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A2C52] transition-colors">Create Service</button>
              <button className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition-colors">Set Availability</button>
            </div>
          </div>

          {activeItem === 'dashboard' && renderHomeSection(firstName)}
          {activeItem === 'earnings' && <EarningsSection />}
          {activeItem !== 'dashboard' && activeItem !== 'earnings' && sectionContent[activeItem as keyof typeof sectionContent]}
        </div>
      )}
    </CoachLayout>
  );
};

export default CoachDashboard;
