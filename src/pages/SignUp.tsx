import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'coach' | 'client'>('coach')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (signUpError) {
        setError(signUpError.message || 'Sign-up failed')
        setLoading(false)
        return
      }

      if (authData.user) {
        // Step 2: Insert profile record with role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email,
              role: role,
              created_at: new Date().toISOString(),
            }
          ])

        if (profileError) {
          setError(`Profile creation failed: ${profileError.message}`)
          setLoading(false)
          return
        }

        setSuccess(true)
        
        // Redirect based on role after a short delay
        setTimeout(() => {
          if (role === 'coach') {
            navigate('/onboarding')
          } else {
            navigate('/coaches')
          }
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign-up')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f7ff' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#0a2240' }}>Welcome to Koachez!</h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Check your email to confirm your account.</p>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0f7ff' }}>
      {/* Left side - Brand */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 40px', background: 'linear-gradient(135deg, #185fa5 0%, #0a2240 100%)', color: '#fff' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16, fontFamily: "'Fraunces', serif" }}>Koachez</h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, opacity: 0.9 }}>Your coaching practice, fully online. Free forever for core features.</p>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 20 }}>✓</div>
              <span>Branded coaching page live in 5 minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 20 }}>✓</div>
              <span>Booking system + video calls built-in</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 20 }}>✓</div>
              <span>No credit card needed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 20 }}>✓</div>
              <span>Free ICF hours tracking (key differentiator)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Create your account</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Join thousands of coaches building their practice on Koachez</p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 12, marginBottom: 24, color: '#991b1b', fontSize: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Label htmlFor="email" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
              />
            </div>

            <div>
              <Label htmlFor="password" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
              />
            </div>

            {/* Role Selector */}
            <div>
              <Label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 500, color: '#374151' }}>I am a...</Label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '12px 16px', borderRadius: 8, border: role === 'coach' ? '2px solid #185fa5' : '1px solid #dbeafe', background: role === 'coach' ? '#f0f7ff' : '#fff', flex: 1 }}>
                  <input
                    type="radio"
                    name="role"
                    value="coach"
                    checked={role === 'coach'}
                    onChange={() => setRole('coach')}
                    style={{ accentColor: '#185fa5' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0a2240' }}>Coach</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Build your practice</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '12px 16px', borderRadius: 8, border: role === 'client' ? '2px solid #185fa5' : '1px solid #dbeafe', background: role === 'client' ? '#f0f7ff' : '#fff', flex: 1 }}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === 'client'}
                    onChange={() => setRole('client')}
                    style={{ accentColor: '#185fa5' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0a2240' }}>Client</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Find a coach</div>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#185fa5',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginTop: 8
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 24, textAlign: 'center' }}>
            Already have an account? <a href="/login" style={{ color: '#185fa5', textDecoration: 'none', fontWeight: 600 }}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
