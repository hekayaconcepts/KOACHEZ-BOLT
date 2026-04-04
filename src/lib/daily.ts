/**
 * Daily.co Integration Utilities
 * Handles video room creation and management
 */

// Note: In production, you'll need to set up a backend endpoint to generate Daily.co tokens
// This is a placeholder implementation

export interface DailyRoom {
  roomName: string
  roomUrl: string
  token?: string
}

/**
 * Generate a unique room name for a booking
 */
export function generateRoomName(coachId: string, bookingId: string): string {
  return `koachez-${coachId}-${bookingId}`.toLowerCase().replace(/[^a-z0-9-]/g, '')
}

/**
 * Create a Daily.co room URL
 * In production, this should be called from your backend to securely generate tokens
 */
export async function createDailyRoom(
  coachId: string,
  bookingId: string,
  clientName: string
): Promise<DailyRoom> {
  const roomName = generateRoomName(coachId, bookingId)

  // In production, call your backend endpoint:
  // const response = await fetch('/api/daily/create-room', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ roomName, clientName })
  // })
  // const data = await response.json()
  // return data

  // For now, return a placeholder
  return {
    roomName,
    roomUrl: `https://koachez.daily.co/${roomName}`,
    token: 'placeholder-token'
  }
}

/**
 * Get Daily.co room URL
 */
export function getDailyRoomUrl(roomName: string): string {
  return `https://koachez.daily.co/${roomName}`
}

/**
 * Format Daily.co room URL with parameters
 */
export function formatDailyRoomUrl(
  roomName: string,
  clientName?: string,
  options?: {
    userName?: string
    userEmail?: string
  }
): string {
  let url = getDailyRoomUrl(roomName)

  const params = new URLSearchParams()
  if (clientName) params.append('userName', clientName)
  if (options?.userEmail) params.append('userEmail', options.userEmail)

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  return url
}
