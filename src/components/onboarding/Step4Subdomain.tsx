import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step4Props {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step4Subdomain({ data, updateData, onNext, onPrev }: Step4Props) {
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [suggestion, setSuggestion] = useState('')

  const checkAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setAvailable(null)
      return
    }

    setChecking(true)
    try {
      const { data: existing } = await supabase
        .from('coaches')
        .select('subdomain')
        .eq('subdomain', subdomain)
        .single()

      setAvailable(!existing)
    } catch (err) {
      setAvailable(true) // If error, assume available
    } finally {
      setChecking(false)
    }
  }

  const generateSuggestion = () => {
    const base = data.name.toLowerCase().replace(/\s+/g, '')
    setSuggestion(base)
    updateData({ subdomain: base })
    checkAvailability(base)
  }

  useEffect(() => {
    if (data.subdomain) {
      checkAvailability(data.subdomain)
    }
  }, [])

  const isComplete = data.subdomain && available

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Your unique URL</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Clients will visit you at yourname.koachez.com</p>

      <div style={{ marginBottom: 32 }}>
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24 }}>
          <Label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Your Subdomain *</Label>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Input
                  type="text"
                  placeholder="yourname"
                  value={data.subdomain}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    updateData({ subdomain: value })
                    checkAvailability(value)
                  }}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 14 }}
                />
                <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>.koachez.com</span>
              </div>

              {checking && (
                <p style={{ fontSize: 12, color: '#9ca3af' }}>Checking availability...</p>
              )}
              {available === true && (
                <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>✓ Available!</p>
              )}
              {available === false && (
                <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>✗ Already taken. Try another.</p>
              )}
            </div>
          </div>

          <Button
            onClick={generateSuggestion}
            style={{
              padding: '10px 16px',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #dbeafe',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Suggest from my name
          </Button>

          <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#0a2240', margin: '0 0 8px' }}>Your public page:</h4>
            <p style={{ fontSize: 14, color: '#185fa5', margin: 0, wordBreak: 'break-all' }}>
              {data.subdomain ? `https://${data.subdomain}.koachez.com` : 'https://yourname.koachez.com'}
            </p>
          </div>
        </div>
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
          disabled={!isComplete}
          style={{
            padding: '10px 24px',
            background: isComplete ? '#185fa5' : '#e5e7eb',
            color: isComplete ? '#fff' : '#9ca3af',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: isComplete ? 'pointer' : 'not-allowed'
          }}
        >
          Next: Intake Form →
        </Button>
      </div>
    </div>
  )
}
