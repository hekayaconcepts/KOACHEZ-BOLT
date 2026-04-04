import { Button } from '@/components/ui/button'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step6Props {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step6Contract({ data, updateData, onNext, onPrev }: Step6Props) {
  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Coaching Agreement (Optional)</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Set the terms for your coaching relationship.</p>

      <div style={{ background: '#f0f7ff', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Contract builder coming soon. You can skip this for now.</p>
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
          Next: Preview →
        </Button>
      </div>
    </div>
  )
}
