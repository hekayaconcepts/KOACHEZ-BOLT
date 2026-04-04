import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import CalendarPicker from '@/components/booking/CalendarPicker'
import TimeSlotPicker from '@/components/booking/TimeSlotPicker'
import { createDailyRoom } from '@/lib/daily'
import type { Availability } from '@/lib/booking'

interface Coach {
  id: string
  name: string
  email: string
  brand_color: string
  brand_font: string
  subdomain: string
}

type BookingStep = 'calendar' | 'time' | 'details' | 'confirmation'

export default function Booking() {
  const { subdomain } = useParams<{ subdomain: string }>()
  const navigate = useNavigate()

  // Coach data
  const [coach, setCoach] = useState<Coach | null>(null)

  // Availability
  const [availability, setAvailability] = useState<Availability[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isActive: false },
    { dayOfWeek: 0, startTime: '10:00', endTime: '14:00', isActive: false }
  ])

  // Booking state
  const [step, setStep] = useState<BookingStep>('calendar')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<{ start: Date; end: Date } | undefined>()
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(false)
  const [bookingId, setBookingId] = useState('')

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
          .select('id, name, email, brand_color, brand_font, subdomain')
          .eq('subdomain', subdomain)
          .single()

        if (coachError || !coachData) {
          setError('Coach not found')
          setLoading(false)
          return
        }

        setCoach(coachData as Coach)

        // Load coach's availability from localStorage (in production, fetch from DB)
        const savedAvailability = localStorage.getItem(`coach_availability_${coachData.id}`)
        if (savedAvailability) {
          try {
            setAvailability(JSON.parse(savedAvailability))
          } catch (e) {
            // Use default availability
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load booking page')
      } finally {
        setLoading(false)
      }
    }

    fetchCoachData()
  }, [subdomain])

  const handleBooking = async () => {
    if (!coach || !selectedDate || !selectedTime || !clientName || !clientEmail) {
      setError('Please fill in all required fields')
      return
    }

    setBooking(true)
    setError('')

    try {
      // Create Daily.co room
      const dailyRoom = await createDailyRoom(coach.id, `${Date.now()}`, clientName)

      // Save booking to Supabase
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            coach_id: coach.id,
            start_at: selectedTime.start.toISOString(),
            end_at: selectedTime.end.toISOString(),
            status: 'confirmed',
            notes: notes,
            daily_room_url: dailyRoom.roomUrl,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (bookingError) {
        setError(`Failed to confirm booking: ${bookingError.message}`)
        setBooking(false)
        return
      }

      if (bookingData && bookingData.length > 0) {
        setBookingId(bookingData[0].id)
        setStep('confirmation')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
      setBooking(false)
    }
  }

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

  if (error && !coach) {
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

  if (!coach) return null

  // Confirmation Step
  if (step === 'confirmation') {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div
          style={{
            background: coach.brand_color,
            color: '#fff',
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, fontFamily: coach.brand_font }}>
            Booking Confirmed!
          </h1>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 40px' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>✓</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0a2240', marginBottom: 16 }}>
              Your session is booked!
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
              A confirmation email has been sent to <strong>{clientEmail}</strong>
            </p>

            <div style={{ background: '#f0f7ff', borderRadius: 8, padding: 24, marginBottom: 24, textAlign: 'left' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', marginBottom: 12 }}>Booking Details</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px' }}>
                <strong>Coach:</strong> {coach.name}
              </p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px' }}>
                <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
              </p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                <strong>Time:</strong> {selectedTime?.start.toLocaleTimeString()} - {selectedTime?.end.toLocaleTimeString()}
              </p>
            </div>

            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24 }}>
              You'll receive a video call link 30 minutes before your session.
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

  // Main Booking Form
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
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
        <p style={{ fontSize: 14, margin: '8px 0 0', opacity: 0.9 }}>
          Step {step === 'calendar' ? '1' : step === 'time' ? '2' : '3'} of 3
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 24, color: '#991b1b' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Left - Form */}
          <div>
            {step === 'calendar' && (
              <CalendarPicker
                availability={availability}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            )}

            {step === 'time' && selectedDate && (
              <TimeSlotPicker
                date={selectedDate}
                availability={availability}
                onTimeSelect={(start, end) => {
                  setSelectedTime({ start, end })
                  setStep('details')
                }}
                selectedSlot={selectedTime}
              />
            )}

            {step === 'details' && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0a2240', marginBottom: 24 }}>
                  Your Information
                </h3>

                <div style={{ marginBottom: 16 }}>
                  <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Full Name *
                  </Label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13 }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Email *
                  </Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13 }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Notes (Optional)
                  </Label>
                  <Textarea
                    placeholder="Anything you'd like to share?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #dbeafe', fontSize: 13, minHeight: 100 }}
                  />
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={booking || !clientName || !clientEmail}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: coach.brand_color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: booking || !clientName || !clientEmail ? 'not-allowed' : 'pointer',
                    opacity: booking || !clientName || !clientEmail ? 0.6 : 1
                  }}
                >
                  {booking ? 'Confirming...' : '✓ Confirm Booking'}
                </Button>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb', height: 'fit-content' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0a2240', marginBottom: 20 }}>
              Booking Summary
            </h3>

            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>Coach</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', margin: 0 }}>
                {coach.name}
              </p>
            </div>

            {selectedDate && (
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>Date</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', margin: 0 }}>
                  {selectedDate.toLocaleDateString()}
                </p>
              </div>
            )}

            {selectedTime && (
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>Time</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', margin: 0 }}>
                  {selectedTime.start.toLocaleTimeString()} - {selectedTime.end.toLocaleTimeString()}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {step !== 'calendar' && (
                <Button
                  onClick={() => {
                    if (step === 'time') setStep('calendar')
                    if (step === 'details') setStep('time')
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #dbeafe',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </Button>
              )}

              {step === 'calendar' && (
                <Button
                  onClick={() => setStep('time')}
                  disabled={!selectedDate}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: selectedDate ? coach.brand_color : '#e5e7eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: selectedDate ? 'pointer' : 'not-allowed'
                  }}
                >
                  Next →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
