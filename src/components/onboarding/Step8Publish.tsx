import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { OnboardingData } from '@/pages/Onboarding'

interface Step8Props {
  data: OnboardingData
  user: any
  onPrev: () => void
}

interface IntakeQuestion {
  id: string
  question: string
  type: 'text' | 'multiple-choice' | 'rating' | 'file-upload' | 'date'
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
}

export default function Step8Publish({ data, user, onPrev }: Step8Props) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    setError('')

    try {
      // ========== STEP A: Get userId from current session ==========
      const {
        data: { user: currentUser },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !currentUser) {
        throw new Error('Failed to get current user')
      }

      const userId = currentUser.id
      const userEmail = currentUser.email || user.email

      // ========== STEP B: Update/Create profiles table entry ==========
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          [
            {
              id: userId,
              email: userEmail,
              full_name: data.name,
              bio: data.bio,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              updated_at: new Date().toISOString()
            }
          ],
          { onConflict: 'id' }
        )

      if (profileError) {
        throw new Error(`Failed to update profile: ${profileError.message}`)
      }

      // ========== STEP C: Upsert coaches table ==========
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .upsert(
          [
            {
              auth_user_id: userId,
              name: data.name,
              email: userEmail,
              bio: data.bio,
              tagline: data.tagline,
              niche: localStorage.getItem('coachNiche') || '',
              brand_color: data.brandColor,
              brand_font: data.brandFont,
              logo_url: data.logoUrl,
              subdomain: data.subdomain,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ],
          { onConflict: 'subdomain' }
        )
        .select()

      if (coachError) {
        throw new Error(`Failed to upsert coach: ${coachError.message}`)
      }

      if (!coachData || coachData.length === 0) {
        throw new Error('Coach record not found after upsert')
      }

      const coachId = coachData[0].id

      // ========== STEP D: Upsert coach_profiles table ==========
      const { error: coachProfileError } = await supabase
        .from('coach_profiles')
        .upsert(
          [
            {
              coach_id: coachId,
              niche: localStorage.getItem('coachNiche') || '',
              location: localStorage.getItem('coachLocation') || '',
              hourly_rate: data.services.length > 0 ? data.services[0].price : 0,
              availability: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                services: data.services.map((s: Service) => ({
                  name: s.name,
                  duration: s.duration,
                  price: s.price
                }))
              },
              updated_at: new Date().toISOString()
            }
          ],
          { onConflict: 'coach_id' }
        )

      if (coachProfileError) {
        throw new Error(`Failed to upsert coach profile: ${coachProfileError.message}`)
      }

      // ========== STEP E: Delete existing services & insert new ones ==========
      // First, delete all existing services for this coach
      const { error: deleteServicesError } = await supabase
        .from('services')
        .delete()
        .eq('coach_id', coachId)

      if (deleteServicesError) {
        throw new Error(`Failed to delete old services: ${deleteServicesError.message}`)
      }

      // Insert new services
      if (data.services && data.services.length > 0) {
        const servicesToInsert = data.services.map((service: Service) => ({
          coach_id: coachId,
          name: service.name,
          description: service.description,
          price: service.price,
          duration_minutes: parseInt(service.duration.split(' ')[0]) || 60,
          features: service.features,
          created_at: new Date().toISOString()
        }))

        const { error: insertServicesError } = await supabase
          .from('services')
          .insert(servicesToInsert)

        if (insertServicesError) {
          throw new Error(`Failed to insert services: ${insertServicesError.message}`)
        }
      }

      // ========== STEP F: Delete existing intake forms & insert new ones ==========
      const { error: deleteIntakeError } = await supabase
        .from('intake_forms')
        .delete()
        .eq('coach_id', coachId)

      if (deleteIntakeError) {
        throw new Error(`Failed to delete old intake forms: ${deleteIntakeError.message}`)
      }

      if (data.intakeFormQuestions && data.intakeFormQuestions.length > 0) {
        const { error: insertIntakeError } = await supabase
          .from('intake_forms')
          .insert([
            {
              coach_id: coachId,
              questions: data.intakeFormQuestions,
              created_at: new Date().toISOString()
            }
          ])

        if (insertIntakeError) {
          throw new Error(`Failed to insert intake form: ${insertIntakeError.message}`)
        }
      }

      // ========== STEP G: Delete existing contracts & insert new ones ==========
      const { error: deleteContractError } = await supabase
        .from('contracts')
        .delete()
        .eq('coach_id', coachId)

      if (deleteContractError) {
        throw new Error(`Failed to delete old contracts: ${deleteContractError.message}`)
      }

      if (data.contractTemplate && data.contractTemplate.trim()) {
        const { error: insertContractError } = await supabase
          .from('contracts')
          .insert([
            {
              coach_id: coachId,
              template: data.contractTemplate,
              created_at: new Date().toISOString()
            }
          ])

        if (insertContractError) {
          throw new Error(`Failed to insert contract: ${insertContractError.message}`)
        }
      }

      // ========== STEP H: Ensure coach_subscriptions exists (plan_type='free') ==========
      const { data: existingSubscription, error: checkSubError } = await supabase
        .from('coach_subscriptions')
        .select('id')
        .eq('coach_id', coachId)
        .single()

      if (checkSubError && checkSubError.code !== 'PGRST116') {
        throw new Error(`Failed to check subscription: ${checkSubError.message}`)
      }

      if (!existingSubscription) {
        const { error: insertSubError } = await supabase
          .from('coach_subscriptions')
          .insert([
            {
              coach_id: coachId,
              plan_type: 'free',
              created_at: new Date().toISOString()
            }
          ])

        if (insertSubError) {
          throw new Error(`Failed to create subscription: ${insertSubError.message}`)
        }
      }

      // ========== STEP I: Ensure usage_tracking exists (video_minutes limit=60) ==========
      const { data: existingUsage, error: checkUsageError } = await supabase
        .from('usage_tracking')
        .select('id')
        .eq('coach_id', coachId)
        .single()

      if (checkUsageError && checkUsageError.code !== 'PGRST116') {
        throw new Error(`Failed to check usage tracking: ${checkUsageError.message}`)
      }

      if (!existingUsage) {
        const { error: insertUsageError } = await supabase
          .from('usage_tracking')
          .insert([
            {
              coach_id: coachId,
              video_minutes_used: 0,
              video_minutes_limit: 60,
              created_at: new Date().toISOString()
            }
          ])

        if (insertUsageError) {
          throw new Error(`Failed to create usage tracking: ${insertUsageError.message}`)
        }
      }

      // ========== SUCCESS: All data persisted ==========
      setSuccess(true)
      toast({
        title: 'Success!',
        description: `Your coaching profile "${data.name}" is now live at ${data.subdomain}.koachez.com`,
        variant: 'default'
      })

      // Redirect after celebration
      setTimeout(() => {
        navigate('/dashboard/coach')
      }, 2500)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to publish your profile'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      setPublishing(false)
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div style={{ fontSize: 64, marginBottom: 24, animation: 'bounce 1s infinite' }}>🎉</div>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0a2240', marginBottom: 8 }}>You're live!</h2>
        <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 24 }}>
          Your coaching page is now live at <strong>{data.subdomain}.koachez.com</strong>
        </p>
        <p style={{ fontSize: 14, color: '#9ca3af' }}>Redirecting to your dashboard...</p>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0a2240' }}>Ready to go live?</h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Your page will be published immediately and visible to the world.</p>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 24, color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#f0f7ff', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0a2240', marginBottom: 16 }}>Your page will be live at:</h3>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#185fa5', margin: 0, wordBreak: 'break-all' }}>
          {data.subdomain}.koachez.com
        </p>
      </div>

      <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0a2240', marginBottom: 12 }}>What's included:</h3>
        <ul style={{ fontSize: 13, color: '#6b7280', margin: 0, paddingLeft: 16 }}>
          <li style={{ marginBottom: 8 }}>Your branded coaching profile</li>
          <li style={{ marginBottom: 8 }}>{data.services.length} coaching package{data.services.length !== 1 ? 's' : ''}</li>
          <li style={{ marginBottom: 8 }}>Booking system (clients can book directly)</li>
          <li style={{ marginBottom: 8 }}>Built-in video calls via Daily.co</li>
          <li style={{ marginBottom: 8 }}>Free ICF hours tracking</li>
          <li>Your page is SEO-optimized and discoverable</li>
        </ul>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Button
          onClick={onPrev}
          disabled={publishing}
          style={{
            padding: '10px 24px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #dbeafe',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: publishing ? 'not-allowed' : 'pointer',
            opacity: publishing ? 0.6 : 1
          }}
        >
          ← Back
        </Button>
        <Button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            padding: '12px 32px',
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: publishing ? 'not-allowed' : 'pointer',
            opacity: publishing ? 0.6 : 1
          }}
        >
          {publishing ? 'Publishing...' : '🚀 Publish & Go Live'}
        </Button>
      </div>
    </div>
  )
}
