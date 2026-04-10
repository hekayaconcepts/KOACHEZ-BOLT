import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Calendar, 
  Settings, 
  Menu,
  LogOut,
  Users,
  DollarSign,
  Clock,
  BarChart3,
  Megaphone,
  Globe,
  Bell,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface CoachLayoutProps {
  children: React.ReactNode | ((activeItem: string) => React.ReactNode);
  onLogout?: () => void;
  activeItem?: string;
  onNavItemChange?: (itemId: string) => void;
  coachName?: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'availability', label: 'Availability', icon: Clock },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const CoachLayout: React.FC<CoachLayoutProps> = ({ 
  children, 
  onLogout, 
  activeItem: activeItemProp, 
  onNavItemChange,
  coachName = 'Coach'
}) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalActiveItem, setInternalActiveItem] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const activeItem = activeItemProp ?? internalActiveItem;

  const handleNavClick = (itemId: string) => {
    if (!activeItemProp) {
      setInternalActiveItem(itemId);
    }
    if (onNavItemChange) {
      onNavItemChange(itemId);
    }
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-900 border-r border-slate-200">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F3A6B] to-[#0A2C52] flex items-center justify-center text-white font-bold">
            K
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Koachez</h1>
            <p className="text-xs text-slate-500">Coach Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#0F3A6B] text-white' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      {onLogout && (
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 fixed inset-y-0 left-0 z-40 bg-white">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Hamburger Trigger */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white shadow-md border border-slate-200"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-[#0F3A6B]" />
        </Button>
      )}

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 ${
          !isMobile ? 'ml-64' : ''
        }`}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-48"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F3A6B] to-[#0A2C52] flex items-center justify-center text-white font-semibold text-sm">
                    {coachName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-900 hidden sm:inline">{coachName}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-50">
                    <div className="p-3 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900">{coachName}</p>
                      <p className="text-xs text-slate-500">Coach Account</p>
                    </div>
                    <button 
                      onClick={() => {
                        handleNavClick('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Settings
                    </button>
                    {onLogout && (
                      <button 
                        onClick={() => {
                          onLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-200"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {typeof children === 'function' ? children(activeItem) : children}
        </div>
      </main>
    </div>
  );
};

export default CoachLayout;