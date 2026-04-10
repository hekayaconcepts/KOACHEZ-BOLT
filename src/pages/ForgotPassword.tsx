import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '@/lib/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await forgotPassword(email);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Reset your password</h1>
          <p style={{ color: '#475569', fontSize: 15 }}>Enter your email and we'll send you a link to create a new password.</p>
        </div>

        {success ? (
          <div style={{ borderRadius: 14, background: '#ecfdf5', color: '#065f46', padding: '14px 16px', border: '1px solid #a7f3d0', marginBottom: 20 }}>
            Check your email for a password reset link. You can close this page.
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label htmlFor="reset-email" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Email address</label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="you@example.com"
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
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p style={{ marginTop: 22, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
