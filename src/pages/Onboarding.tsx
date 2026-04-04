import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import OnboardingStep1Profile from '@/components/onboarding/Step1Profile'
import OnboardingStep2Brand from '@/components/onboarding/Step2Brand'
import OnboardingStep3Services from '@/components/onboarding/Step3Services'
import OnboardingStep4Subdomain from '@/components/onboarding/Step4Subdomain'
import OnboardingStep5Intake from '@/components/onboarding/Step5Intake'
import OnboardingStep6Contract from '@/components/onboarding/Step6Contract'
import OnboardingStep7Preview from '@/components/onboarding/Step7Preview'
import OnboardingStep8Publish from '@/components/onboarding/Step8Publish'

export interface OnboardingData {
  // Step 1: Profile
  name: string
  tagline: string
  bio: string
  profilePhotoUrl: string | null

  // Step 2: Brand
  brandColor: string
  brandFont: string
  logoUrl: string | null

  // Step 3: Services
  services: Array<{
    id: string
    name: string
    description: string
    price: number
    duration: string
    features: string[]
  }>

  // Step 4: Subdomain
  subdomain: string

  // Step 5: Intake Form
  intakeFormQuestions: Array<{
    id: string
    question: string
    type: 'text' | 'multiple-choice' | 'rating' | 'file-upload' | 'date'
  }>

  // Step 6: Contract
  contractTemplate: string

  // Step 7: Preview
  // (no additional data, just preview)

  // Step 8: Publish
  // (no additional data, just publish)
}

const STEPS = [
  { number: 1, title: 'Profile', description: 'Your name, bio, and photo' },
  { number: 2, title: 'Brand', description: 'Colors, fonts, and logo' },
  { number: 3, title: 'Services', description: 'Your coaching packages' },
  { number: 4, title: 'Subdomain', description: 'Your unique URL' },
  { number: 5, title: 'Intake Form', description: 'Pre-session questions' },
  { number: 6, title: 'Contract', description: 'Coaching agreement' },
  { number: 7, title: 'Preview', description: 'See your page' },
  { number: 8, title: 'Publish', description: 'Go live!' }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    tagline: '',
    bio: '',
    profilePhotoUrl: null,
    brandColor: '#185fa5',
    brandFont: 'DM Sans',
    logoUrl: null,
    services: [],
    subdomain: '',
    intakeFormQuestions: [],
    contractTemplate: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/signup')
        return
      }
      setUser(session.user)
      setLoading(false)
    }
    checkAuth()
  }, [navigate])

  const updateData = (updates: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...updates }))
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 8) {
      setCurrentStep(step)
      window.scrollTo(0, 0)
    }
  }

  const nextStep = () => {
    if (currentStep < 8) {
      goToStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading your onboarding...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0a2240', fontFamily: "'Fraunces', serif", margin: 0 }}>Koachez</h1>
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>Step {currentStep} of 8</div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar - Progress */}
        <div style={{ width: 280, background: '#fff', borderRight: '1px solid #e5e7eb', padding: '40px 20px', position: 'sticky', top: 0, height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 20, letterSpacing: '0.5px' }}>Progress</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STEPS.map((step) => (
              <button
                key={step.number}
                onClick={() => goToStep(step.number)}
                style={{
                  textAlign: 'left',
                  background: currentStep === step.number ? '#f0f7ff' : 'transparent',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderLeft: currentStep === step.number ? '3px solid #185fa5' : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: currentStep === step.number ? '#185fa5' : currentStep > step.number ? '#22c55e' : '#e5e7eb',
                      color: currentStep === step.number || currentStep > step.number ? '#fff' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: currentStep === step.number ? '#0a2240' : '#6b7280' }}>{step.title}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{step.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px 60px', maxWidth: 900 }}>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 24, color: '#991b1b' }}>
              {error}
            </div>
          )}

          {currentStep === 1 && <OnboardingStep1Profile data={onboardingData} updateData={updateData} onNext={nextStep} />}
          {currentStep === 2 && <OnboardingStep2Brand data={onboardingData} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 3 && <OnboardingStep3Services data={onboardingData} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 4 && <OnboardingStep4Subdomain data={onboardingData} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 5 && <OnboardingStep5Intake data={onboardingData} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 6 && <OnboardingStep6Contract data={onboardingData} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 7 && <OnboardingStep7Preview data={onboardingData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 8 && <OnboardingStep8Publish data={onboardingData} user={user} onPrev={prevStep} />}
        </div>
      </div>
    </div>
  )
}
