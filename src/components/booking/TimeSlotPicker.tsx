import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { generateTimeSlots, formatTime } from '@/lib/booking'
import type { Availability, TimeSlot } from '@/lib/booking'

interface TimeSlotPickerProps {
  date: Date
  availability: Availability[]
  onTimeSelect: (startTime: Date, endTime: Date) => void
  selectedSlot?: { start: Date; end: Date }
}

export default function TimeSlotPicker({
  date,
  availability,
  onTimeSelect,
  selectedSlot
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    const slots = generateTimeSlots(date, availability, 60, [])
    setTimeSlots(slots)
  }, [date, availability])

  if (timeSlots.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          No available time slots for this date.
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a2240', marginBottom: 24 }}>
        Select a Time
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
        {timeSlots.map((slot, index) => {
          const isSelected =
            selectedSlot &&
            slot.start.getTime() === selectedSlot.start.getTime() &&
            slot.end.getTime() === selectedSlot.end.getTime()

          return (
            <button
              key={index}
              onClick={() => slot.available && onTimeSelect(slot.start, slot.end)}
              disabled={!slot.available}
              style={{
                padding: '12px 16px',
                borderRadius: 6,
                border: isSelected ? '2px solid #185fa5' : '1px solid #e5e7eb',
                background: isSelected ? '#f0f7ff' : slot.available ? '#fff' : '#f9fafb',
                color: isSelected ? '#185fa5' : slot.available ? '#0a2240' : '#d1d5db',
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                cursor: slot.available ? 'pointer' : 'not-allowed',
                opacity: slot.available ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
            >
              {formatTime(slot.start)}
            </button>
          )
        })}
      </div>

      {selectedSlot && (
        <div style={{ padding: 12, background: '#f0f7ff', borderRadius: 6 }}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>Selected Time</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#185fa5', margin: 0 }}>
            {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
          </p>
        </div>
      )}
    </div>
  )
}
