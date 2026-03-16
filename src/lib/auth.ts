import { supabase } from './supabase'

export type User = {
  id: string
  email: string
  name?: string
  role?: 'client' | 'coach'
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function register(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
  return { data, error }
}

export async function forgotPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  return { data, error }
}

export async function oauthLogin(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider })
  return { data, error }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function verifySession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}