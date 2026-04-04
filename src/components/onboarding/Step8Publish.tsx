import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step8Props {
  data: OnboardingData
  user: any
  onPrev: () => void
}

export default function Step8Publish({ data, user, onPrev }: Step8Props) {
  const navigate = useNavigate()
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    setError('')

    try {
      // Create coach record in Supabase
      const { error: insertError } = await supabase
        .from('coaches')
        .insert([
          {
            auth_user_id: user.id,
            name: data.name,
            email: user.email,
            bio: data.bio,
            tagline: data.tagline,
            niche: localStorage.getItem('coachNiche') || '',
            brand_color: data.brandColor,
            brand_font: data.brandFont,
            logo_url: data.logoUrl,
            subdomain: data.subdomain,
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) {
        setError(`Failed to publish: ${insertError.message}`)
        setPublishing(false)
        return
      }

      setSuccess(true)

      // Redirect after celebration
      setTimeout(() => {
        navigate(`/coach/${data.subdomain}`)
      }, 2500)
    } catch (err: any) {
      setError(err.message || 'Failed to publish')
      setPublishing(false)
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div style={{ fontSize: 64, marginBottom: 24, animation: 'bounce 1s infinite' }}>🎉</div>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0a2240', marginBottom: 8 }}>You're live!</h2>
        <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 24 }}>
          Your coaching page is now live at <strong>{data.subdomain}.koachez.com</strong>
        </p>
        <p style={{ fontSize: 14, color: '#9ca3af' }}>Redirecting to your page...</p>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Ready to go live?</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Your page will be published immediately and visible to the world.</p>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 24, color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#f0f7ff', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0a2240', marginBottom: 16 }}>Your page will be live at:</h3>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#185fa5', margin: 0, wordBreak: 'break-all' }}>
          {data.subdomain}.koachez.com
        </p>
      </div>

      <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', marginBottom: 12 }}>What's included:</h3>
        <ul style={{ fontSize: 13, color: '#6b7280', margin: 0, paddingLeft: 16 }}>
          <li style={{ marginBottom: 8 }}>Your branded coaching profile</li>
          <li style={{ marginBottom: 8 }}>{data.services.length} coaching package{data.services.length !== 1 ? 's' : ''}</li>
          <li style={{ marginBottom: 8 }}>Booking system (clients can book directly)</li>
          <li style={{ marginBottom: 8 }}>Built-in video calls via Daily.co</li>
          <li style={{ marginBottom: 8 }}>Free ICF hours tracking</li>
          <li>Your page is SEO-optimized and discoverable</li>
        </ul>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Button
          onClick={onPrev}
          disabled={publishing}
          style={{
            padding: '10px 24px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #dbeafe',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: publishing ? 'not-allowed' : 'pointer',
            opacity: publishing ? 0.6 : 1
          }}
        >
          ← Back
        </Button>
        <Button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            padding: '12px 32px',
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: publishing ? 'not-allowed' : 'pointer',
            opacity: publishing ? 0.6 : 1
          }}
        >
          {publishing ? 'Publishing...' : '🚀 Publish & Go Live'}
        </Button>
      </div>
    </div>
  )
}
