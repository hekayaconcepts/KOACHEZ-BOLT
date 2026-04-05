import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifySession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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
          navigate('/');
          return;
        }

        let role = (session.user.user_metadata?.role as 'coach' | 'client') || null;

        // Check profiles table if no role in metadata
        if (!role && session.user.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          role = profile?.role || null;
        }

        // Check coaches table if still no role
        if (!role && session.user.id) {
          const { data: coach } = await supabase
            .from('coaches')
            .select('auth_user_id')
            .eq('auth_user_id', session.user.id)
            .maybeSingle();
          if (coach?.auth_user_id) {
            role = 'coach';
          }
        }

        if (role !== 'coach') {
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
