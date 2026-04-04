import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifySession } from '@/lib/auth';
import type { User } from '@/lib/auth';

interface ProtectedCoachRouteProps {
  children: React.ReactNode;
}

export const ProtectedCoachRoute: React.FC<ProtectedCoachRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await verifySession();
        
        if (!session || !session.user) {
          // Not logged in, redirect to home
          navigate('/');
          return;
        }

        const userRole = (session.user.user_metadata?.role as 'client' | 'coach') || 'client';
        
        if (userRole !== 'coach') {
          // Logged in but not a coach, redirect to home
          navigate('/');
          return;
        }

        // Authorized coach
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading while checking auth
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0F3A6B]/20 border-t-[#0F3A6B] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authorized, we've already redirected
  return <>{children}</>;
};

export default ProtectedCoachRoute;
