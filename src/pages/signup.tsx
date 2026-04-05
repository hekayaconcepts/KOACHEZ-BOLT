import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Role = 'coach' | 'client';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('coach');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          data: {
            role,
          },
        }
      );

      if (authError) throw authError;
      if (!data.user) throw new Error('No user created');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            role: role,
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;

      if (role === 'coach') {
        navigate('/onboarding');
      } else {
        navigate('/coaches');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: '#0a2240' }}>
            Join Koachez
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 8 }}>
            Launch or grow your coaching business
          </p>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#185fa5', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 10px 20px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <form style={{ display: 'grid', gap: 24 }} onSubmit={handleSignup}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #dbeafe', borderRadius: 12, fontSize: 14, boxSizing: 'border-box', transition: 'all 0.2s' }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #dbeafe', borderRadius: 12, fontSize: 14, boxSizing: 'border-box', transition: 'all 0.2s' }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #dbeafe', borderRadius: 12, fontSize: 14, boxSizing: 'border-box', transition: 'all 0.2s' }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>
                I am a...
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value="coach"
                    checked={role === 'coach'}
                    onChange={() => setRole('coach')}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      border: role === 'coach' ? '2px solid #185fa5' : '2px solid #e5e7eb',
                      borderRadius: 14,
                      padding: 16,
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      background: role === 'coach' ? '#f0f7ff' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👨‍🏫</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: role === 'coach' ? '#185fa5' : '#0f172a', marginBottom: 4 }}>Coach</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Offer services</div>
                  </div>
                </label>

                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === 'client'}
                    onChange={() => setRole('client')}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      border: role === 'client' ? '2px solid #185fa5' : '2px solid #e5e7eb',
                      borderRadius: 14,
                      padding: 16,
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      background: role === 'client' ? '#f0f7ff' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🙋</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: role === 'client' ? '#185fa5' : '#0f172a', marginBottom: 4 }}>Client</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Book sessions</div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div style={{ borderRadius: 12, background: '#fef2f2', padding: 16, border: '1px solid #fecaca' }}>
                <p style={{ margin: 0, fontSize: 14, color: '#991b1b' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                background: loading ? '#9ca3af' : '#185fa5',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', margin: 0 }}>
              By creating an account, you agree to our{' '}
              <a href="#" style={{ color: '#185fa5', textDecoration: 'none' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#185fa5', textDecoration: 'none' }}>Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
