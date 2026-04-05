import React from 'react';
import { Globe, Users, DollarSign, Calendar as CalendarIcon, Sparkles, ClipboardList, CheckCircle2, ArrowRight, Bell } from 'lucide-react';
import CoachLayout from '@/components/layouts/CoachLayout';

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

const CoachDashboard: React.FC = () => {
  const profileProgress = 60;
  const missingItems = ['Add Profile Photo', 'Connect Payment', 'Set Weekly Availability', 'Publish Public Profile'];
  const videoUsage = { used: 45, limit: 60 };
  const revenue = { month: 1250, fees: 37.5, net: 1212.5 };

  const todaysSchedule: ScheduleItem[] = [
    { id: 1, time: '09:00 AM', client: 'John D.', service: 'Career Clarity', status: 'today' },
    { id: 2, time: '11:30 AM', client: 'Sarah M.', service: 'Interview Prep', status: 'today' },
    { id: 3, time: '03:00 PM', client: 'Emily R.', service: 'Leadership Session', status: 'upcoming' },
  ];

  const recentActivity: ActivityItem[] = [
    { id: 1, title: 'New booking', detail: 'John D. booked a 60-minute session.', time: '10 minutes ago' },
    { id: 2, title: 'Payment received', detail: '$295 successfully paid by Sarah M.', time: '45 minutes ago' },
    { id: 3, title: 'Profile published', detail: 'Your public coach page is now live.', time: '2 hours ago' },
  ];

  const quickActions = [
    'Create Service',
    'Set Availability',
    'Copy Public Profile Link',
    'View Earnings',
  ];

  const profileUrl = 'koachez.com/jane_doe';

  const handleLogout = async () => {
    console.log('Logout requested');
  };

  return (
    <CoachLayout onLogout={handleLogout}>
      <div className="space-y-8">
        <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Coach Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Good morning, Coach</h1>
              <p className="mt-2 text-sm text-slate-500">Here’s what to work on today to keep your coaching business moving.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Public profile</p>
                <p className="font-semibold text-slate-950">{profileUrl}</p>
              </div>
              <button className="ml-auto rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <section className="grid gap-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Profile Completion</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">{profileProgress}% Complete</h2>
                </div>
                <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">Finish setup to accept bookings</div>
              </div>
              <div className="mt-6 rounded-full bg-slate-100 h-3 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-600 to-cyan-500" style={{ width: `${profileProgress}%` }} />
              </div>
              <div className="mt-6 grid gap-3">
                {missingItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <CheckCircle2 className="h-5 w-5 text-slate-400" />
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
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${(videoUsage.used / videoUsage.limit) * 100}%` }} />
                </div>
                <p className="mt-4 text-sm text-slate-500">Upgrade to Pro for unlimited video minutes and priority scheduling.</p>
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
                    <span className="text-slate-900">-${revenue.fees.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Net earnings</span>
                    <span className="text-slate-900">${revenue.net.toFixed(2)}</span>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
                  View detailed earnings
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Public link</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{profileUrl}</p>
                </div>
              </div>
              <button className="mt-6 w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
                Copy profile link
              </button>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pro reminder</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">Unlimited video & AI tools</h3>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">Upgrade for unlimited session recording, marketing assets, and priority booking.</p>
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
                    <button className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
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
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">Platform updates</h3>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Bell className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
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
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">Launch faster</h3>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
              <div className="grid gap-3">
                {quickActions.map((action) => (
                  <button key={action} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-colors">
                    <span>{action}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
};

export default CoachDashboard;
