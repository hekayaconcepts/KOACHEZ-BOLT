import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface Coach {
  id: string
  name: string
  email: string
  bio: string
  tagline: string
  niche: string
  brand_color: string
  brand_font: string
  logo_url: string | null
  profile_photo_url: string | null
  subdomain: string
  created_at: string
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
}

export default function CoachProfile() {
  const { subdomain } = useParams<{ subdomain: string }>()
  const navigate = useNavigate()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [services, setServices] = useState<Service[]>([])
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
        // Fetch coach data
        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('*')
          .eq('subdomain', subdomain)
          .single()

        if (coachError || !coachData) {
          setError('Coach not found')
          setLoading(false)
          return
        }

        setCoach(coachData as Coach)

        // TODO: Fetch services from courses table
        // For now, we'll use placeholder services
        setServices([])
      } catch (err: any) {
        setError(err.message || 'Failed to load coach profile')
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
          <p style={{ color: '#6b7280' }}>Loading coach profile...</p>
        </div>
      </div>
    )
  }

  if (error || !coach) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0a2240', marginBottom: 8 }}>Coach Not Found</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
            {error || 'This coach profile does not exist.'}
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
      {/* Header with Coach Brand */}
      <div
        style={{
          background: coach.brand_color,
          color: '#fff',
          padding: '60px 40px',
          textAlign: 'center'
        }}
      >
        {coach.logo_url && (
          <img
            src={coach.logo_url}
            alt="Logo"
            style={{
              maxWidth: 100,
              maxHeight: 100,
              marginBottom: 24,
              borderRadius: 8
            }}
          />
        )}
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            margin: '0 0 8px',
            fontFamily: coach.brand_font
          }}
        >
          {coach.name}
        </h1>
        <p
          style={{
            fontSize: 20,
            margin: '0 0 24px',
            opacity: 0.9,
            fontFamily: coach.brand_font
          }}
        >
          {coach.tagline}
        </p>
        <Button
          onClick={() => navigate(`/booking/${coach.subdomain}`)}
          style={{
            padding: '12px 32px',
            background: '#fff',
            color: coach.brand_color,
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📅 Book a Session
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 40px' }}>
        {/* About Section */}
        <section style={{ marginBottom: 60 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#0a2240',
              marginBottom: 16,
              fontFamily: coach.brand_font
            }}
          >
            About
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: '#6b7280',
              fontFamily: coach.brand_font
            }}
          >
            {coach.bio}
          </p>
          <p
            style={{
              fontSize: 13,
              color: '#9ca3af',
              marginTop: 16,
              fontStyle: 'italic'
            }}
          >
            Niche: <strong>{coach.niche}</strong>
          </p>
        </section>

        {/* Services Section */}
        {services.length > 0 && (
          <section style={{ marginBottom: 60 }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#0a2240',
                marginBottom: 24,
                fontFamily: coach.brand_font
              }}
            >
              Coaching Packages
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 24
              }}
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: `2px solid ${coach.brand_color}`,
                    padding: 24,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: coach.brand_color,
                      margin: '0 0 8px',
                      fontFamily: coach.brand_font
                    }}
                  >
                    {service.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: '#6b7280',
                      margin: '0 0 12px'
                    }}
                  >
                    {service.duration}
                  </p>
                  <p
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: coach.brand_color,
                      margin: '0 0 16px'
                    }}
                  >
                    ${service.price}
                  </p>
                  {service.description && (
                    <p
                      style={{
                        fontSize: 13,
                        color: '#6b7280',
                        margin: '0 0 12px',
                        fontFamily: coach.brand_font
                      }}
                    >
                      {service.description}
                    </p>
                  )}
                  {service.features.length > 0 && (
                    <ul
                      style={{
                        fontSize: 13,
                        color: '#6b7280',
                        margin: '12px 0 16px',
                        paddingLeft: 16
                      }}
                    >
                      {service.features.map((feature, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>
                          ✓ {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    onClick={() => navigate(`/booking/${coach.subdomain}?service=${service.id}`)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: coach.brand_color,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Book This Package
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section
          style={{
            background: coach.brand_color,
            color: '#fff',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', fontFamily: coach.brand_font }}>
            Ready to transform your life?
          </h2>
          <p style={{ fontSize: 14, margin: '0 0 24px', opacity: 0.9, fontFamily: coach.brand_font }}>
            Book your first session today and start your coaching journey.
          </p>
          <Button
            onClick={() => navigate(`/booking/${coach.subdomain}`)}
            style={{
              padding: '12px 32px',
              background: '#fff',
              color: coach.brand_color,
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📅 Schedule Now
          </Button>
        </section>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: '#0a2240',
          color: '#fff',
          padding: '40px',
          textAlign: 'center',
          marginTop: 60,
          borderTop: `3px solid ${coach.brand_color}`
        }}
      >
        <p style={{ fontSize: 12, margin: 0, opacity: 0.7 }}>
          © {new Date().getFullYear()} {coach.name}. Powered by Koachez.
        </p>
      </footer>
    </div>
  )
}
