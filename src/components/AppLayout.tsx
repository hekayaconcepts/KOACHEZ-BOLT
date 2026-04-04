import React, { useState, useEffect } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import ArticlesSection from './ArticlesSection';
import PodcastSection from './PodcastSection';
import CoursesSection from './CoursesSection';
import TestimonialsSection from './TestimonialsSection';
import BookingSection from './BookingSection';
import Footer from './Footer';
import LoginModal from './LoginModal';
import ClientDashboard from './ClientDashboard';
import CoachAdmin from './CoachAdmin';
import AccountSettings from './AccountSettings';
import SocialFeed from './SocialFeed';
import { verifySession, logout as authLogout } from '../lib/auth';
import type { User } from '../lib/auth';

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'public' | 'client' | 'coach'>('public');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<number, number>>({});
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await verifySession();
        if (session && session.user) {
          setIsLoggedIn(true);
          // Assuming user metadata contains the role, or default to client
          const role = (session.user.user_metadata?.role as 'client' | 'coach') || 'client';
          setUserRole(role);
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            role: role
          });
          
          // Enrollments logic seems to be missing from the current auth.ts session return
          // For now, we'll keep it empty or fetch it separately if needed
          setEnrolledCourses([]);
          setCourseProgress({});
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (role: 'client' | 'coach', user?: User) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (user) {
      setCurrentUser(user);
    }
    if (role === 'coach') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setIsLoggedIn(false);
    setUserRole('public');
    setCurrentUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    setCurrentView('home');
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentView('booking');
  };

  const handleViewCourse = (courseId: number) => {
    console.log('View course:', courseId);
  };

  const handleReadArticle = (articleId: number) => {
    console.log('Read article:', articleId);
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sky-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Render coach admin panel
  if (userRole === 'coach' && currentView.startsWith('admin')) {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <CoachAdmin 
          activeSection={currentView} 
          onNavigate={setCurrentView} 
        />
      </>
    );
  }

  // Render account settings
  if (currentView === 'account') {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <AccountSettings onBack={() => setCurrentView(userRole === 'client' ? 'dashboard' : 'home')} />
        <Footer onNavigate={setCurrentView} />
      </>
    );
  }

  // Render client dashboard
  if (userRole === 'client' && (currentView === 'dashboard' || currentView === 'my-sessions' || currentView === 'my-courses')) {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <ClientDashboard 
          onViewCourse={handleViewCourse} 
          onNavigate={setCurrentView} 
        />
        <Footer onNavigate={setCurrentView} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  // Render booking page
  if (currentView === 'booking') {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <BookingSection 
          selectedServiceId={selectedServiceId}
          onBack={() => setCurrentView('home')}
        />
        <Footer onNavigate={setCurrentView} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  // Render full page views
  if (currentView === 'articles') {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <ArticlesSection 
          onReadArticle={handleReadArticle}
          onViewAll={() => {}}
          fullPage
        />
        <Footer onNavigate={setCurrentView} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  if (currentView === 'podcast') {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <PodcastSection 
          onViewAll={() => {}}
          fullPage
        />
        <Footer onNavigate={setCurrentView} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  if (currentView === 'courses') {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <CoursesSection 
          onViewCourse={handleViewCourse}
          onViewAll={() => {}}
          fullPage
          isLoggedIn={isLoggedIn}
          enrolledCourses={enrolledCourses}
        />
        <Footer onNavigate={setCurrentView} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  if (currentView === 'services') {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <ServicesSection 
          onSelectService={handleSelectService}
          fullPage
        />
        <TestimonialsSection />
        <Footer onNavigate={setCurrentView} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  if (currentView === 'testimonials') {
    return (
      <>
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <TestimonialsSection fullPage />
        <Footer onNavigate={setCurrentView} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  // Default home page
  return (
    <div className="min-h-screen bg-white">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      <main>
        <HeroSection 
          onBookSession={() => setCurrentView('booking')}
          onWatchIntro={() => setShowVideoModal(true)}
        />

        <ServicesSection onSelectService={handleSelectService} />

        <ArticlesSection 
          onReadArticle={handleReadArticle}
          onViewAll={() => setCurrentView('articles')}
        />

        <PodcastSection onViewAll={() => setCurrentView('podcast')} />

        <SocialFeed />

        <CoursesSection 
          onViewCourse={handleViewCourse}
          onViewAll={() => setCurrentView('courses')}
          isLoggedIn={isLoggedIn}
          enrolledCourses={enrolledCourses}
        />

        <TestimonialsSection />

        <section className="py-20 bg-gradient-to-r from-sky-600 to-sky-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Leadership?
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards becoming the leader you've always wanted to be. 
              Book a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentView('booking')}
                className="px-8 py-4 bg-white text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition-colors shadow-lg"
              >
                Book Free Consultation
              </button>
              <button
                onClick={() => setCurrentView('services')}
                className="px-8 py-4 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-400 transition-colors border-2 border-sky-400"
              >
                View Packages
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={setCurrentView} />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowVideoModal(false)}
          />
          <div className="relative bg-black rounded-2xl overflow-hidden w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-lg">Introduction Video</p>
                <p className="text-gray-400 text-sm mt-2">Video player would be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
