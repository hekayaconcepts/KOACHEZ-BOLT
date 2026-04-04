import { useNavigate } from 'react-router-dom'

export default function Coaches() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f7ff', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#0a2240', fontFamily: "'Fraunces', serif", marginBottom: 16 }}>Find Your Coach</h1>
        <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.6, marginBottom: 32 }}>
          Browse our community of professional coaches and find the perfect match for your goals.
        </p>
        <div style={{ display: 'inline-block', background: '#e6f1fb', color: '#185fa5', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
          🚧 Coming Soon - Coach Directory
        </div>
        <div style={{ marginTop: 32 }}>
          <button 
            onClick={() => navigate('/')}
            style={{ background: '#185fa5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginRight: 12 }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
