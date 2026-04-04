import { Button } from '@/components/ui/button'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step7Props {
  data: OnboardingData
  onNext: () => void
  onPrev: () => void
}

export default function Step7Preview({ data, onNext, onPrev }: Step7Props) {
  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Preview your page</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>This is how your page will look to potential clients.</p>

      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', background: '#fff', marginBottom: 32 }}>
        {/* Header */}
        <div
          style={{
            background: data.brandColor,
            padding: '40px 32px',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          {data.logoUrl && (
            <img src={data.logoUrl} alt="Logo" style={{ maxWidth: 80, maxHeight: 80, marginBottom: 16 }} />
          )}
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', fontFamily: data.brandFont }}>
            {data.name}
          </h1>
          <p style={{ fontSize: 18, margin: '0 0 16px', opacity: 0.9, fontFamily: data.brandFont }}>
            {data.tagline}
          </p>
          <button
            style={{
              padding: '12px 28px',
              background: '#fff',
              color: data.brandColor,
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Book a Session
          </button>
        </div>

        {/* Bio */}
        <div style={{ padding: '32px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0a2240', marginBottom: 12, fontFamily: data.brandFont }}>About</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6b7280', margin: 0, fontFamily: data.brandFont }}>
            {data.bio}
          </p>
        </div>

        {/* Services */}
        {data.services.length > 0 && (
          <div style={{ padding: '32px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0a2240', marginBottom: 16, fontFamily: data.brandFont }}>Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {data.services.map((service) => (
                <div key={service.id} style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', margin: '0 0 4px', fontFamily: data.brandFont }}>
                    {service.name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px' }}>
                    ${service.price} • {service.duration}
                  </p>
                  {service.description && (
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px', fontFamily: data.brandFont }}>
                      {service.description}
                    </p>
                  )}
                  {service.features.length > 0 && (
                    <ul style={{ fontSize: 12, color: '#6b7280', margin: 0, paddingLeft: 16 }}>
                      {service.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Button
          onClick={onPrev}
          style={{
            padding: '10px 24px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #dbeafe',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ← Back
        </Button>
        <Button
          onClick={onNext}
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
          Next: Publish →
        </Button>
      </div>
    </div>
  )
}
