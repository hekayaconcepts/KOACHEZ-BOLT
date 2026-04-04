/**
 * Booking Utilities
 * Helper functions for calendar, time slots, and availability management
 */

export interface TimeSlot {
  start: Date
  end: Date
  available: boolean
}

export interface Availability {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:mm
  endTime: string // HH:mm
  isActive: boolean
}

/**
 * Generate time slots for a given date based on availability
 */
export function generateTimeSlots(
  date: Date,
  availability: Availability[],
  slotDurationMins: number = 60,
  bookedTimes: { start: Date; end: Date }[] = []
): TimeSlot[] {
  const dayOfWeek = date.getDay()
  const dayAvailability = availability.find(a => a.dayOfWeek === dayOfWeek && a.isActive)

  if (!dayAvailability) {
    return []
  }

  const slots: TimeSlot[] = []
  const [startHour, startMin] = dayAvailability.startTime.split(':').map(Number)
  const [endHour, endMin] = dayAvailability.endTime.split(':').map(Number)

  let currentTime = new Date(date)
  currentTime.setHours(startHour, startMin, 0, 0)

  const endTime = new Date(date)
  endTime.setHours(endHour, endMin, 0, 0)

  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime)
    slotEnd.setMinutes(slotEnd.getMinutes() + slotDurationMins)

    // Check if slot overlaps with booked times
    const isBooked = bookedTimes.some(
      booked => currentTime < booked.end && slotEnd > booked.start
    )

    slots.push({
      start: new Date(currentTime),
      end: new Date(slotEnd),
      available: !isBooked
    })

    currentTime.setMinutes(currentTime.getMinutes() + slotDurationMins)
  }

  return slots
}

/**
 * Get available dates for the next N days
 */
export function getAvailableDates(
  availability: Availability[],
  daysAhead: number = 30
): Date[] {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    const dayOfWeek = date.getDay()
    const hasAvailability = availability.some(
      a => a.dayOfWeek === dayOfWeek && a.isActive
    )

    if (hasAvailability) {
      dates.push(date)
    }
  }

  return dates
}

/**
 * Format time as HH:mm
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/**
 * Format date as readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}
