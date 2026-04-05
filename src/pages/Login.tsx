import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../lib/auth'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await login(email, password)
      if (error) throw error
      const user = data?.user
      const roleFromMeta = user?.user_metadata?.role as 'coach' | 'client' | undefined

      let role = roleFromMeta
      if (!role && user?.id) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) throw profileError
        role = profile?.role
      }

      if (!role && user?.id) {
        const { data: coach, error: coachError } = await supabase
          .from('coaches')
          .select('auth_user_id')
          .eq('auth_user_id', user.id)
          .maybeSingle()

        if (coachError) throw coachError
        if (coach?.auth_user_id) {
          role = 'coach'
        }
      }

      if (role === 'coach') {
        navigate('/dashboard/coach')
      } else {
        navigate('/coaches')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: '#475569', fontSize: 15 }}>Log in to access your coach dashboard and manage your bookings.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 20 }}>
          <div>
            <label htmlFor="login-email" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Email address</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Password</label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            style={{ width: '100%', borderRadius: 14, background: '#2563eb', color: '#fff', border: 'none', padding: '14px 16px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: 22, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
          Don’t have an account?{' '}
          <Link to="/signup" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
