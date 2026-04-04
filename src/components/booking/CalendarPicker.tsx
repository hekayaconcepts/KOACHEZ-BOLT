import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getAvailableDates, formatDate, isPastDate } from '@/lib/booking'
import type { Availability } from '@/lib/booking'

interface CalendarPickerProps {
  availability: Availability[]
  onDateSelect: (date: Date) => void
  selectedDate?: Date
}

export default function CalendarPicker({ availability, onDateSelect, selectedDate }: CalendarPickerProps) {
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const dates = getAvailableDates(availability, 60)
    setAvailableDates(dates)
  }, [availability])

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      d =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    )
  }

  const isDateSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const days = []
  const totalDays = daysInMonth(currentMonth)
  const firstDay = firstDayOfMonth(currentMonth)

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(i)
  }

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a2240', marginBottom: 24 }}>
        Select a Date
      </h3>

      {/* Month Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Button
          onClick={handlePrevMonth}
          style={{
            padding: '8px 12px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #dbeafe',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ← Prev
        </Button>
        <h4 style={{ fontSize: 16, fontWeight: 600, color: '#0a2240', margin: 0 }}>
          {monthYear}
        </h4>
        <Button
          onClick={handleNextMonth}
          style={{
            padding: '8px 12px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #dbeafe',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Next →
        </Button>
      </div>

      {/* Day Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 12 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: '#6b7280',
              padding: '8px 0'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />
          }

          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
          const available = isDateAvailable(date)
          const selected = isDateSelected(date)
          const past = isPastDate(date)

          return (
            <button
              key={day}
              onClick={() => available && !past && onDateSelect(date)}
              disabled={!available || past}
              style={{
                padding: '12px 8px',
                borderRadius: 6,
                border: selected ? '2px solid #185fa5' : '1px solid #e5e7eb',
                background: selected ? '#f0f7ff' : available && !past ? '#fff' : '#f9fafb',
                color: selected ? '#185fa5' : available && !past ? '#0a2240' : '#d1d5db',
                fontSize: 13,
                fontWeight: selected ? 700 : 500,
                cursor: available && !past ? 'pointer' : 'not-allowed',
                opacity: available && !past ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
            >
              {day}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div style={{ marginTop: 24, padding: 12, background: '#f0f7ff', borderRadius: 6, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>Selected Date</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#185fa5', margin: 0 }}>
            {formatDate(selectedDate)}
          </p>
        </div>
      )}
    </div>
  )
}
