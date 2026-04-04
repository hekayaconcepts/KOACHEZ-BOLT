import { supabase } from './supabase'
import type { User as SupabaseUser, Session, AuthError, Provider } from '@supabase/supabase-js'

export type User = {
  id: string
  email: string | undefined
  name?: string
  role?: 'client' | 'coach'
}

export type AuthResponse = {
  success: boolean
  user?: User | null
  error?: string
  message?: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error || !data.user) {
    return { success: false, error: error?.message || 'Login failed' }
  }
  
  const user: User = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name,
    role: data.user.user_metadata?.role || 'client'
  }
  
  return { success: true, user }
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
  
  if (error || !data.user) {
    return { success: false, error: error?.message || 'Registration failed' }
  }
  
  const user: User = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name || name,
    role: data.user.user_metadata?.role || 'client'
  }
  
  return { success: true, user, message: 'Account created successfully!' }
}

export async function forgotPassword(email: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  
  if (error) {
    return { success: false, error: error.message || 'Failed to send reset link' }
  }
  
  return { success: true, message: 'Password reset link sent!' }
}

export async function oauthLogin(provider: 'google' | 'apple' | 'linkedin', mockData?: any): Promise<AuthResponse> {
  // For now, simulate OAuth with mock data since we don't have providers configured
  if (mockData) {
    const user: User = {
      id: mockData.provider_id,
      email: mockData.email,
      name: mockData.name,
      role: 'client'
    }
    return { success: true, user }
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: provider as Provider })
  
  if (error) {
    return { success: false, error: error.message || 'OAuth login failed' }
  }
  
  return { success: true, message: 'OAuth initiated' }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function verifySession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}