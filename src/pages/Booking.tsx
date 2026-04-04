import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface Coach {
  id: string
  name: string
  brand_color: string
  brand_font: string
  subdomain: string
}

export default function Booking() {
  const { subdomain } = useParams<{ subdomain: string }>()
  const navigate = useNavigate()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCoachData = async () => {
      if (!subdomain) {
        setError('No coach subdomain provided')
        setLoading(false)
        return
      }

      try {
        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('id, name, brand_color, brand_font, subdomain')
          .eq('subdomain', subdomain)
          .single()

        if (coachError || !coachData) {
          setError('Coach not found')
          setLoading(false)
          return
        }

        setCoach(coachData as Coach)
      } catch (err: any) {
        setError(err.message || 'Failed to load booking page')
      } finally {
        setLoading(false)
      }
    }

    fetchCoachData()
  }, [subdomain])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading booking page...</p>
        </div>
      </div>
    )
  }

  if (error || !coach) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0a2240', marginBottom: 8 }}>Booking Not Available</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
            {error || 'This booking page does not exist.'}
          </p>
          <Button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px',
              background: '#185fa5',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div
        style={{
          background: coach.brand_color,
          color: '#fff',
          padding: '40px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, fontFamily: coach.brand_font }}>
          Book with {coach.name}
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>📅</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0a2240', marginBottom: 16 }}>
            Booking System Coming Soon
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>
            The booking system with calendar integration and video call setup is being built. Check back soon!
          </p>
          <Button
            onClick={() => navigate(`/coach/${coach.subdomain}`)}
            style={{
              padding: '10px 24px',
              background: coach.brand_color,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← Back to Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
