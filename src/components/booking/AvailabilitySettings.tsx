import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Availability } from '@/lib/booking'

interface AvailabilitySettingsProps {
  coachId: string
  onSave?: () => void
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AvailabilitySettings({ coachId, onSave }: AvailabilitySettingsProps) {
  const [availability, setAvailability] = useState<Availability[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isActive: false },
    { dayOfWeek: 0, startTime: '10:00', endTime: '14:00', isActive: false }
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateAvailability = (dayOfWeek: number, field: keyof Availability, value: any) => {
    setAvailability(prev =>
      prev.map(a =>
        a.dayOfWeek === dayOfWeek ? { ...a, [field]: value } : a
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Save to Supabase (store as JSON in a coach_availability table or metadata)
      // For now, we'll store it in localStorage as a proof of concept
      localStorage.setItem(`coach_availability_${coachId}`, JSON.stringify(availability))
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      onSave?.()
    } catch (err: any) {
      setError(err.message || 'Failed to save availability')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a2240', marginBottom: 24 }}>
        Your Availability
      </h3>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 12, marginBottom: 16, color: '#991b1b', fontSize: 13 }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: 12, marginBottom: 16, color: '#166534', fontSize: 13 }}>
          ✓ Availability saved successfully!
        </div>
      )}

      <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        {availability.map((day) => (
          <div key={day.dayOfWeek} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 1fr', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={day.isActive}
                onChange={(e) => updateAvailability(day.dayOfWeek, 'isActive', e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
                {DAYS_OF_WEEK[day.dayOfWeek]}
              </span>
            </label>

            {day.isActive ? (
              <>
                <div>
                  <Label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>From</Label>
                  <Input
                    type="time"
                    value={day.startTime}
                    onChange={(e) => updateAvailability(day.dayOfWeek, 'startTime', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13 }}
                  />
                </div>
                <div>
                  <Label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>To</Label>
                  <Input
                    type="time"
                    value={day.endTime}
                    onChange={(e) => updateAvailability(day.dayOfWeek, 'endTime', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13 }}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>Not available</div>
                <div />
              </>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: '10px 24px',
          background: '#185fa5',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.6 : 1
        }}
      >
        {saving ? 'Saving...' : '✓ Save Availability'}
      </Button>
    </div>
  )
}
