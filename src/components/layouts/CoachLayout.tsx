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
  GlobeAlt
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface CoachLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'availability', label: 'Availability', icon: Clock },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const CoachLayout: React.FC<CoachLayoutProps> = ({ children, onLogout }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F3A6B] text-white">
      {/* Logo/Header */}
      <div className="p-4 border-b border-blue-800">
        <h1 className="text-xl font-bold text-white">Koachez Admin</h1>
        <p className="text-xs text-blue-300 mt-1">Coach Dashboard</p>
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
                  ? 'bg-[#10B981] text-white' 
                  : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
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
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 fixed inset-y-0 left-0 z-40">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Hamburger Trigger */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-[#0F3A6B]" />
        </Button>
      )}

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 ${
          !isMobile ? 'ml-64' : ''
        }`}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CoachLayout;
