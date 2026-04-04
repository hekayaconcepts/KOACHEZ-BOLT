import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, oauthLogin } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const COACHING_NICHES = [
  'Executive Leadership',
  'Life Coaching',
  'Health & Wellness',
  'Business Strategy',
  'Career Transition',
  'Relationship Coaching',
  'Financial Coaching',
  'Personal Development',
  'Sports Performance',
  'Creative Coaching',
  'Other'
]

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!email || !password || !confirmPassword || !niche) {
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
      const { data, error: signUpError } = await register(email, password, '')
      
      if (signUpError) {
        setError(signUpError.message || 'Sign-up failed')
        setLoading(false)
        return
      }

      if (data.user) {
        setSuccess(true)
        // Store the niche for the next step
        localStorage.setItem('coachNiche', niche)
        localStorage.setItem('coachEmail', email)
        
        // Redirect to onboarding after a short delay
        setTimeout(() => {
          navigate('/onboarding')
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign-up')
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)
    try {
      const { error: oauthError } = await oauthLogin('google')
      if (oauthError) {
        setError(oauthError.message || 'Google sign-up failed')
      }
      // OAuth will redirect automatically
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f7ff' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#0a2240' }}>Welcome to Koachez!</h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Check your email to confirm your account, then we'll get your page live.</p>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>Redirecting to onboarding...</p>
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

            <div>
              <Label htmlFor="niche" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}>Your Coaching Niche</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}>
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent>
                  {COACHING_NICHES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: 12 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          <Button
            onClick={handleGoogleSignUp}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#fff',
              color: '#374151',
              border: '1px solid #dbeafe',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <span>🔵</span> Sign up with Google
          </Button>

          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 24, textAlign: 'center' }}>
            Already have an account? <a href="/login" style={{ color: '#185fa5', textDecoration: 'none', fontWeight: 600 }}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
