import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get the recovery token from URL hash
        const hash = window.location.hash;
        if (!hash || !hash.includes('access_token')) {
          setError('Invalid or expired reset link');
          return;
        }

        // Exchange the token for a session
        const { error } = await supabase.auth.verifyOtp({
          token_hash: hash.substring(1),
          type: 'recovery',
        });

        if (error) {
          setError(error.message || 'Your reset link has expired. Please request a new one.');
          return;
        }

        setTokenValid(true);
      } catch (err: any) {
        setError(err.message || 'Failed to verify reset link');
      }
    };

    verifyToken();
  }, []);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && !error) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: 15 }}>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Create a new password</h1>
          <p style={{ color: '#475569', fontSize: 15 }}>Enter your new password below.</p>
        </div>

        {success ? (
          <div style={{ borderRadius: 14, background: '#ecfdf5', color: '#065f46', padding: '14px 16px', border: '1px solid #a7f3d0', marginBottom: 20 }}>
            Password reset successfully! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label htmlFor="new-password" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>New password</label>
              <input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ borderRadius: 14, background: '#fef2f2', color: '#991b1b', padding: '14px 16px', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', borderRadius: 14, background: '#2563eb', color: '#fff', border: 'none', padding: '14px 16px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
